'use client';

import * as React from 'react';
import { HotkeysProvider, useHotkeys } from '@tanstack/react-hotkeys';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import {
  buildThemeCss,
  DEFAULT_CONFIG,
  DESIGN_SYSTEM_ATTRIBUTE,
  normalizeConfig,
  randomColorPreset,
  readStoredConfig,
  shuffleConfig,
  STORAGE_KEY,
  THEME_STYLE_ELEMENT_ID,
  type DesignSystemConfig,
  type StoredDesignSystem,
} from '@/lib/design-system/config';
import {
  emptyHistory,
  record,
  redo as redoHistory,
  undo as undoHistory,
  type History,
} from '@/lib/design-system/history';
import type { Mode, Token } from '@/lib/design-system/tokens';

// Adapted from shadcn-ui apps/v4/app/(app)/(create)/components/design-system-provider.tsx.
// Config lives in localStorage instead of the URL; the pre-paint script in app/layout.tsx
// applies the same class and CSS on hard loads, this module keeps them in sync afterwards.

type StoreState = {
  config: DesignSystemConfig;
  canUndo: boolean;
  canRedo: boolean;
};

const listeners = new Set<() => void>();
let state: StoreState | null = null;
let history: History<DesignSystemConfig> = emptyHistory();

const SERVER_STATE: StoreState = {
  config: DEFAULT_CONFIG,
  canUndo: false,
  canRedo: false,
};

function readStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getState(): StoreState {
  state ??= {
    config: readStoredConfig(readStorage()),
    canUndo: false,
    canRedo: false,
  };
  return state;
}

function current() {
  return getState().config;
}

function publish(config: DesignSystemConfig) {
  state = {
    config,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    const config = readStoredConfig(event.newValue);
    applyToDocument(config);
    publish(config);
  };
  listeners.add(onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function getServerState() {
  return SERVER_STATE;
}

function applyToDocument(config: DesignSystemConfig) {
  const root = document.documentElement;
  for (const name of Array.from(root.classList)) {
    if (name.startsWith('style-')) root.classList.remove(name);
  }
  root.classList.add(`style-${config.style}`);
  // Re-set on every apply, to the same empty value: the mutation record it queues
  // is what wakes the attribute observers (theme-demo matches.tsx, dev-home dune.tsx).
  root.setAttribute(DESIGN_SYSTEM_ATTRIBUTE, '');
  root.setAttribute('data-menu-color', config.menuColor);
  root.setAttribute('data-menu-accent', config.menuAccent);

  let styleElement = document.getElementById(
    THEME_STYLE_ELEMENT_ID,
  ) as HTMLStyleElement | null;
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = THEME_STYLE_ELEMENT_ID;
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = buildThemeCss(config);
}

/** Applies, stores and publishes `config` without touching the history. */
function commit(config: DesignSystemConfig) {
  applyToDocument(config);
  try {
    const stored: StoredDesignSystem = {
      config,
      css: buildThemeCss(config),
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // storage unavailable (private mode): the change still applies to this page
  }
  publish(config);
}

function setDesignSystem(next: Partial<DesignSystemConfig>) {
  const previous = current();
  // Like create, a forced radius (Lyra, Sera) stays after leaving that style.
  const config = normalizeConfig({ ...previous, ...next });
  if (JSON.stringify(config) === JSON.stringify(previous)) return;
  history = record(history, previous);
  commit(config);
}

function undo() {
  const step = undoHistory(history, current());
  if (!step) return;
  history = step.history;
  commit(step.value);
}

function redo() {
  const step = redoHistory(history, current());
  if (!step) return;
  history = step.history;
  commit(step.value);
}

function shuffle() {
  setDesignSystem(shuffleConfig(current()));
}

/** A new color preset only; style, fonts and radius stay. */
function shuffleColorPreset() {
  const config = current();
  let colorPreset = randomColorPreset(config.colorPreset);
  if (colorPreset === 'none') colorPreset = randomColorPreset('none');
  setDesignSystem({ colorPreset });
}

/** `reset` is a normal change, so undo brings the previous look back. */
function reset() {
  setDesignSystem(DEFAULT_CONFIG);
}

function setToken(mode: Mode, token: Token, value: string) {
  const { overrides } = current();
  setDesignSystem({
    overrides: { ...overrides, [mode]: { ...overrides[mode], [token]: value } },
  });
}

/** The theme shortcuts, each also shown as a kbd hint in the panel. */
export const THEME_HOTKEYS = {
  shuffle: 'R',
  reset: 'Shift+R',
  shuffleColorPreset: 'C',
  undo: 'Mod+Z',
  redo: 'Mod+Shift+Z',
} as const;

type DesignSystemContextValue = StoreState & {
  setConfig: (next: Partial<DesignSystemConfig>) => void;
  reset: () => void;
  shuffle: () => void;
  shuffleColorPreset: () => void;
  undo: () => void;
  redo: () => void;
  setToken: (mode: Mode, token: Token, value: string) => void;
};

const DesignSystemContext =
  React.createContext<DesignSystemContextValue | null>(null);

export function useDesignSystem() {
  const value = React.useContext(DesignSystemContext);
  if (!value) {
    throw new Error('useDesignSystem must be used inside DesignSystemProvider');
  }
  return value;
}

/** Registers the shortcuts in the `theme` scope. The library's default
 * `ignoreInputs: 'auto'` skips single keys and Shift combos while typing. */
function ThemeHotkeys() {
  useHotkeys([
    { hotkey: THEME_HOTKEYS.shuffle, callback: shuffle },
    { hotkey: THEME_HOTKEYS.reset, callback: reset },
    { hotkey: THEME_HOTKEYS.shuffleColorPreset, callback: shuffleColorPreset },
    { hotkey: THEME_HOTKEYS.undo, callback: undo },
    { hotkey: THEME_HOTKEYS.redo, callback: redo },
  ]);
  return null;
}

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = React.useSyncExternalStore(subscribe, getState, getServerState);
  const { menuColor } = store.config;
  const { open: searchOpen } = useSearchContext();

  // React resets <html> attributes when it hydrates the root singleton, dropping what the
  // pre-paint script set; re-apply before paint. Reads the client state because the
  // first (hydration) render still holds the server default.
  React.useLayoutEffect(() => {
    applyToDocument(current());
  }, [store]);

  // Menu color inversion and translucency: toggle classes on every `cn-menu-target`
  // popup, including portals mounted later. The observer runs only off the default.
  React.useLayoutEffect(() => {
    const isInverted =
      menuColor === 'inverted' || menuColor === 'inverted-translucent';
    const isTranslucent =
      menuColor === 'default-translucent' ||
      menuColor === 'inverted-translucent';
    let frameId = 0;

    const update = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        '.cn-menu-target, [data-menu-translucent]',
      );
      elements.forEach((element) => {
        if (element.classList.contains('cn-menu-target')) {
          element.classList.toggle('dark', isInverted);
        }
        if (isTranslucent) {
          element.classList.add('cn-menu-translucent');
          element.removeAttribute('data-menu-translucent');
        } else if (element.classList.contains('cn-menu-translucent')) {
          element.classList.remove('cn-menu-translucent');
          element.setAttribute('data-menu-translucent', '');
        }
      });
    };

    update();
    if (menuColor === 'default') return;
    const observer = new MutationObserver(() => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        update();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [menuColor]);

  const value = React.useMemo(
    () => ({
      ...store,
      setConfig: setDesignSystem,
      reset,
      shuffle,
      shuffleColorPreset,
      undo,
      redo,
      setToken,
    }),
    [store],
  );

  return (
    <DesignSystemContext.Provider value={value}>
      <HotkeysProvider scope="theme" enabled={!searchOpen}>
        <ThemeHotkeys />
      </HotkeysProvider>
      {children}
    </DesignSystemContext.Provider>
  );
}
