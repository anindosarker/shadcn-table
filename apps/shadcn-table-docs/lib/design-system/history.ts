/** Undo and redo stacks for the design system config: a change pushes the
 * previous value on `past` and clears `future`; both stacks keep the newest
 * HISTORY_LIMIT entries. */
export const HISTORY_LIMIT = 50;

export type History<T> = { past: T[]; future: T[] };

export function emptyHistory<T>(): History<T> {
  return { past: [], future: [] };
}

/** Records `previous` before a change to a new value. */
export function record<T>(history: History<T>, previous: T): History<T> {
  return {
    past: [...history.past, previous].slice(-HISTORY_LIMIT),
    future: [],
  };
}

/** Steps back from `current`: the value to apply and the new stacks, or null
 * when there is nothing to undo. */
export function undo<T>(
  history: History<T>,
  current: T,
): { value: T; history: History<T> } | null {
  const value = history.past.at(-1);
  if (value === undefined) return null;
  return {
    value,
    history: {
      past: history.past.slice(0, -1),
      future: [current, ...history.future].slice(0, HISTORY_LIMIT),
    },
  };
}

/** Steps forward from `current`, the reverse of undo. */
export function redo<T>(
  history: History<T>,
  current: T,
): { value: T; history: History<T> } | null {
  const [value, ...future] = history.future;
  if (value === undefined) return null;
  return {
    value,
    history: {
      past: [...history.past, current].slice(-HISTORY_LIMIT),
      future,
    },
  };
}
