import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** What `useST_DebouncedCallback` returns. */
export interface ST_DebouncedCallback<Args extends unknown[]> {
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
  run: (...args: Args) => void;
}

/**
 * Debounces `fn` by `wait` milliseconds. `run` restarts the wait with new
 * arguments; when it ends the latest `fn` is called with the last arguments.
 * `flush` calls a pending call now, `cancel` drops it, `isPending` reports
 * one. `wait` is read on each `run`; a `wait` of 0 or less calls `fn` at once.
 * A call still pending on unmount is flushed. The returned object is stable.
 */
export const useST_DebouncedCallback = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): ST_DebouncedCallback<Args> => {
  const fnRef = useRef(fn);
  const waitRef = useRef(wait);
  useLayoutEffect(() => {
    fnRef.current = fn;
    waitRef.current = wait;
  });

  const [debounced] = useState<ST_DebouncedCallback<Args>>(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pendingArgs: Args | undefined;
    const cancel = () => {
      clearTimeout(timer);
      timer = undefined;
      pendingArgs = undefined;
    };
    const flush = () => {
      if (pendingArgs === undefined) return;
      const args = pendingArgs;
      cancel();
      fnRef.current(...args);
    };
    const run = (...args: Args) => {
      clearTimeout(timer);
      pendingArgs = args;
      if (waitRef.current <= 0) {
        flush();
        return;
      }
      timer = setTimeout(flush, waitRef.current);
    };
    return { cancel, flush, isPending: () => pendingArgs !== undefined, run };
  });

  useEffect(() => () => debounced.flush(), [debounced]);

  return debounced;
};
