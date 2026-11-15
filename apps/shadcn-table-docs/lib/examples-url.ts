import { useSyncExternalStore } from 'react';

/** The continuous examples page; its blocks are `/docs/examples#<slug>`. */
export const EXAMPLES_URL = '/docs/examples';

const listeners = new Set<() => void>();

/**
 * Next skips its router sync when the state carries its own markers
 * (`__NA`, `_N`), treating the call as internal. Drop them and keep the rest,
 * so Next adopts the new URL; otherwise its next history write (a server
 * action response, for one) puts back the URL it knows.
 */
function userHistoryState(): Record<string, unknown> | null {
  const state: unknown = window.history.state;
  if (!state || typeof state !== 'object') return null;
  const { __NA: _na, _N: _n, ...rest } = state as Record<string, unknown>;
  return rest;
}

/**
 * Points the address bar at `/docs/examples` or `/docs/examples#<slug>`
 * without a history entry. `replaceState` fires no `hashchange`, so the
 * listeners of `useLocationHash` are told here.
 */
export function replaceExamplesUrl(url: string) {
  if (url === window.location.pathname + window.location.hash) return;
  window.history.replaceState(userHistoryState(), '', url);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('hashchange', listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('hashchange', listener);
    window.removeEventListener('popstate', listener);
  };
}

/** The address bar's hash (`#basic`, or `''`); `''` on the server and during hydration. */
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => '',
  );
}

/** Scrolls the mounted examples stack to a block; `''` is the top. */
type StackScroller = (slug: string, options?: { smooth?: boolean }) => boolean;

let stackScroller: StackScroller | null = null;

/** Called by the examples stack while it is mounted; returns the cleanup. */
export function registerStackScroller(scroller: StackScroller) {
  stackScroller = scroller;
  return () => {
    if (stackScroller === scroller) stackScroller = null;
  };
}

/**
 * Scrolls the examples stack to the block `slug` (`''` for the top) and
 * points the URL at it. `smooth` applies to the top only. False when no
 * stack is mounted or the slug is not one of its blocks, so the caller can
 * fall back to a plain navigation.
 */
export function scrollStackTo(
  slug: string,
  options?: { smooth?: boolean },
): boolean {
  return stackScroller?.(slug, options) ?? false;
}
