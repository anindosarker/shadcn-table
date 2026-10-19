'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'fumadocs-ui/components/tabs';
import { Tabs } from 'fumadocs-ui/components/ui/tabs';
import { baseLabels, bases, defaultBase, type Base } from '@/lib/install';
import { cn } from '@/lib/cn';

/**
 * The site-wide base (Radix | Base UI) is one fumadocs tab group, `base`,
 * persisted the way fumadocs persists a `groupId` (sessionStorage, then
 * localStorage): every control here is a fumadocs Tabs in that group, so a
 * click on any of them switches the rest through fumadocs' own listeners.
 * The store below mirrors the group's value for everything that is not a
 * tab strip (the commands, the example loader, the code view): the controls
 * are controlled by it and write it from their `onValueChange`.
 */
export const BASE_GROUP_ID = 'base';

/** Tab values, as fumadocs' simple-mode Tabs escape the labels. */
const TAB_VALUES: Record<Base, string> = { radix: 'radix', base: 'base-ui' };

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

/** The selected base; Radix on the server and until the stored pick is read. */
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

const onTabChange = (value: string) => {
  const next = fromTab(value);
  if (next) setBase(next);
};

/**
 * Compact segmented control for the docs header (next to the theme pill)
 * and anywhere else a page needs the switch without content panels.
 */
export const BaseSwitch = ({ className }: { className?: string }) => {
  const base = useBase();
  return (
    <Tabs
      groupId={BASE_GROUP_ID}
      persist
      value={TAB_VALUES[base]}
      onValueChange={onTabChange}
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
 * Radix | Base UI tabs around content that differs per base (the install
 * commands). Same group as the header switch, so either changes both.
 */
export const BaseTabs = ({
  radix,
  base,
  className,
}: Record<Base, ReactNode> & { className?: string }) => {
  const selected = useBase();
  const content: Record<Base, ReactNode> = { radix, base };
  return (
    <Tabs
      groupId={BASE_GROUP_ID}
      persist
      value={TAB_VALUES[selected]}
      onValueChange={onTabChange}
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
