import type { Preview } from '@storybook/react-vite';
import { Fragment, type ReactNode, useSyncExternalStore } from 'react';
import { addons, useEffect, useState } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import {
  darkTheme,
  BASE_LABELS,
  lightTheme,
  readStoredMode,
  ST_BASE_LABEL,
  ST_OTHER_BASES,
  staticBaseRoot,
} from './themes';
// Resolved inside the tree ST_BASE selects (vite.config.ts).
import '@/index.css';
import './preview.css';

const channel = addons.getChannel();

/** Apply the Tailwind v4 `.dark` variant root class to the preview <html>. */
function applyHtmlClass(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);
}

/**
 * Mirror storybook-dark-mode's state inside the preview. Seeded from
 * localStorage (default dark) so the first render is already correct, then
 * kept in sync with the manager's toolbar toggle through the DARK_MODE event.
 */
function useStorybookDarkMode() {
  const [isDark, setIsDark] = useState(() => readStoredMode() === 'dark');
  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setIsDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setIsDark);
  }, []);
  useEffect(() => applyHtmlClass(isDark), [isDark]);
  return isDark;
}

// Set the class before React mounts so the initial story paint is dark.
applyHtmlClass(readStoredMode() === 'dark');

// A play leaves the story in its end state. On the static site the story
// resets after its play: afterEach bumps this counter and the keyed wrapper
// remounts the story with fresh state, without rerunning the play. Vitest and
// `storybook dev` keep the end state (__ST_STATIC__ is false there, main.ts).
let resetCount = 0;
const resetListeners = new Set<() => void>();
const subscribeReset = (listener: () => void) => {
  resetListeners.add(listener);
  return () => resetListeners.delete(listener);
};

function ResetAfterPlay({ children }: { children: ReactNode }) {
  const key = useSyncExternalStore(subscribeReset, () => resetCount);
  return <Fragment key={key}>{children}</Fragment>;
}

const preview: Preview = {
  afterEach: () => {
    if ((globalThis as { __ST_STATIC__?: boolean }).__ST_STATIC__ !== true)
      return;
    resetCount += 1;
    resetListeners.forEach((listener) => listener());
  },
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      current: 'dark',
      dark: darkTheme,
      light: lightTheme,
      // Put `dark` / `light` on the preview <html> so Tailwind's `.dark`
      // variant fires for the component as well as the manager.
      stylePreview: true,
      classTarget: 'html',
      darkClass: 'dark',
      lightClass: 'light',
    },
    docs: {
      // Built-in "Code" addon panel (replaces addon-storysource, which
      // material-react-table's storybook uses for its Code tab).
      codePanel: true,
      // Source type stays 'auto' (documented default): arrow stories get their
      // file text. Arg-driven stories would get the dynamic snippet, which
      // inlines the mutated column objects (ST adds id, columnDefType, ...),
      // so they print the one-liner by arg name instead.
      source: {
        // Keep the preview harness (placeholder lines) out of snippets.
        excludeDecorators: true,
        transform: (
          code: string,
          ctx: {
            args: Record<string, unknown>;
            parameters: Record<string, unknown>;
          },
        ) =>
          ctx.parameters.__isArgsStory
            ? `() => <ShadcnTable ${Object.keys(ctx.args)
                .map((k) => `${k}={${k}}`)
                .join(' ')} />`
            : code,
      },
    },
  },
  decorators: [
    (Story) => {
      useStorybookDarkMode();
      return (
        <div className="bg-background p-4 text-foreground">
          <p className="pb-2 text-sm text-muted-foreground dark:text-foreground">
            Looking for the main docs site? Click{' '}
            <a
              href="https://shadcn-table.com"
              target="_blank"
              rel="noopener"
              className="underline"
            >
              here.
            </a>
          </p>
          <p className="pb-2 text-sm text-muted-foreground dark:text-foreground">
            These stories render shadcn-table on {ST_BASE_LABEL}. The other
            bases:{' '}
            {ST_OTHER_BASES.map((base, i) => (
              <Fragment key={base}>
                {i > 0 && ', '}
                <a
                  href={staticBaseRoot(base)}
                  target="_top"
                  className="underline"
                >
                  {BASE_LABELS[base]}
                </a>
              </Fragment>
            ))}
            .
          </p>
          <p className="pb-4 text-sm text-muted-foreground dark:text-foreground">
            View Source code for these examples in the code tab below or{' '}
            <a
              href="https://github.com/anindosarker/shadcn-table/tree/main/packages/shadcn-table/stories/features"
              target="_blank"
              rel="noopener"
              className="underline"
            >
              here on GitHub.
            </a>
          </p>
          <ResetAfterPlay>
            <Story />
          </ResetAfterPlay>
        </div>
      );
    },
  ],
};

export default preview;
