import { type Ref, type RefCallback, type RefObject, useCallback } from 'react';

type RefCleanup = (() => void) | void;

const assignRef = <T>(ref: Ref<T> | undefined, node: T | null): RefCleanup => {
  if (typeof ref === 'function') return ref(node);
  if (ref) ref.current = node;
};

/**
 * One callback ref for an internal ref and the user's ref. Attaches the node
 * to both; on detach it runs the user's cleanup or nulls the user's ref, then
 * nulls the internal ref. A user ref that changes identity re-attaches.
 */
export const useST_ComposedRef = <T>(
  internalRef: RefObject<T | null>,
  userRef: Ref<T> | undefined,
): RefCallback<T> =>
  useCallback(
    (node: T | null) => {
      internalRef.current = node;
      const userCleanup = assignRef(userRef, node);
      return () => {
        if (typeof userCleanup === 'function') userCleanup();
        else assignRef(userRef, null);
        internalRef.current = null;
      };
    },
    [internalRef, userRef],
  );
