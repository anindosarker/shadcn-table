import { type Ref, type RefCallback, type RefObject, useCallback } from 'react';

const assignRef = <T>(
  ref: Ref<T> | undefined,
  node: T | null,
): void | (() => void) => {
  if (typeof ref === 'function') return ref(node);
  if (ref) ref.current = node;
};

/**
 * One callback ref that attaches the node to the library's internal ref and
 * to the user's ref. On detach it runs the user's cleanup or nulls the user's
 * ref, then nulls the internal ref.
 */
export const useST_ComposedRef = <T>(
  internalRef: RefObject<T | null>,
  userRef: Ref<T> | undefined,
): RefCallback<T> =>
  useCallback(
    (node: T) => {
      internalRef.current = node;
      const cleanup = assignRef(userRef, node);
      return () => {
        if (typeof cleanup === 'function') cleanup();
        else assignRef(userRef, null);
        internalRef.current = null;
      };
    },
    [internalRef, userRef],
  );
