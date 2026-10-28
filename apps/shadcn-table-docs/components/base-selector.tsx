'use client';

import { useRef, useSyncExternalStore, type ReactNode } from 'react';
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'fumadocs-ui/components/tabs';
import { Tabs } from 'fumadocs-ui/components/ui/tabs';
import { baseLabels, bases, defaultBase, type Base } from '@/lib/install';
import { cn } from '@/lib/cn';
import { trackBaseSwitched, type Surface } from '@/lib/analytics';

/**
 * The site-wide base (Radix UI | Base UI | React Aria) is one fumadocs tab group, `base`,
 * persisted the way fumadocs persists a `groupId` (sessionStorage, then
 * localStorage): every control here is a fumadocs Tabs in that group, so a
 * click on any of them switches the rest through fumadocs' own listeners.
 * The store below mirrors the group's value for everything that is not a
 * tab strip (the commands, the example loader, the code view): the controls
 * are controlled by it and write it from their `onValueChange`.
 */
export const BASE_GROUP_ID = 'base';

/** Tab values, as fumadocs' simple-mode Tabs escape the labels. */
const TAB_VALUES: Record<Base, string> = {
  radix: 'radix',
  base: 'base-ui',
  aria: 'react-aria',
};

const fromTab = (value: string | null): Base | null =>
  bases.find((base) => TAB_VALUES[base] === value) ?? null;

const listeners = new Set<() => void>();

/** Fallback when storage is blocked, so a click still switches the page. */
let sessionBase: Base | null = null;

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const readStored = (): Base => {
  try {
    return (
      fromTab(
        sessionStorage.getItem(BASE_GROUP_ID) ??
          localStorage.getItem(BASE_GROUP_ID),
      ) ?? defaultBase
    );
  } catch {
    return defaultBase;
  }
};

const getSnapshot = () => sessionBase ?? readStored();
const getServerSnapshot = () => defaultBase;

/** The selected base; Radix UI on the server and until the stored pick is read. */
export const useBase = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

/**
 * Set the site-wide base. Called by the controls below (fumadocs already
 * wrote the group's storage then) and by controls outside the group, such as
 * the command bar's base menu (components/agent-bar.tsx).
 */
export const setBase = (next: Base) => {
  try {
    sessionStorage.setItem(BASE_GROUP_ID, TAB_VALUES[next]);
    localStorage.setItem(BASE_GROUP_ID, TAB_VALUES[next]);
    sessionBase = null;
  } catch {
    sessionBase = next;
  }
  for (const listener of listeners) listener();
};

/**
 * Props for a Tabs control in the base group: the controlled value and the
 * change handling. fumadocs fans a change out to every Tabs in the group, so
 * each control's `onValueChange` runs on every switch, wherever it came
 * from, and once more on mount from the persisted value. Only the control
 * the reader used reports `base_switched`: a flag set in the capture phase
 * of the events Base UI activates a tab from (focus for a mouse press, click,
 * a key) and cleared in the bubble phase of the same event, on this root.
 * React runs its capture and bubble passes from two native listeners with a
 * microtask checkpoint between them, so a microtask would clear too early.
 */
const useBaseTabs = (surface: Surface) => {
  const base = useBase();
  const interacted = useRef(false);
  const begin = () => {
    interacted.current = true;
  };
  const end = () => {
    interacted.current = false;
  };
  const onValueChange = (value: string) => {
    const next = fromTab(value);
    if (!next) return;
    if (interacted.current && next !== base) {
      trackBaseSwitched({ from: base, to: next, surface });
    }
    setBase(next);
  };
  return {
    value: TAB_VALUES[base],
    onValueChange,
    onFocusCapture: begin,
    onFocus: end,
    onClickCapture: begin,
    onClick: end,
    onKeyDownCapture: begin,
    onKeyDown: end,
  };
};

/**
 * Compact segmented control for the docs header (next to the theme pill)
 * and anywhere else a page needs the switch without content panels.
 */
export const BaseSwitch = ({ className }: { className?: string }) => {
  const tabs = useBaseTabs('header');
  return (
    <Tabs
      groupId={BASE_GROUP_ID}
      persist
      {...tabs}
      className={cn('inline-flex', className)}
    >
      <TabsList
        aria-label="shadcn base"
        className="inline-flex items-center gap-0.5 rounded-full border p-1 px-1"
      >
        {bases.map((b) => (
          <TabsTrigger
            key={b}
            value={TAB_VALUES[b]}
            className="h-6.5 rounded-full border-0 px-2 py-0 text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground data-active:bg-fd-accent data-active:text-fd-accent-foreground"
          >
            {baseLabels[b]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

/**
 * Radix UI | Base UI | React Aria tabs around content that differs per base (the install
 * commands). Same group as the header switch, so either changes both.
 */
export const BaseTabs = ({
  radix,
  base,
  aria,
  className,
}: Record<Base, ReactNode> & { className?: string }) => {
  const tabs = useBaseTabs('tabs');
  const content: Record<Base, ReactNode> = { radix, base, aria };
  return (
    <Tabs
      groupId={BASE_GROUP_ID}
      persist
      {...tabs}
      className={cn(
        'my-4 flex flex-col overflow-hidden rounded-xl border bg-fd-secondary',
        className,
      )}
    >
      <TabsList>
        {bases.map((b) => (
          <TabsTrigger key={b} value={TAB_VALUES[b]}>
            {baseLabels[b]}
          </TabsTrigger>
        ))}
      </TabsList>
      {bases.map((b) => (
        <TabsContent key={b} value={TAB_VALUES[b]}>
          {content[b]}
        </TabsContent>
      ))}
    </Tabs>
  );
};
