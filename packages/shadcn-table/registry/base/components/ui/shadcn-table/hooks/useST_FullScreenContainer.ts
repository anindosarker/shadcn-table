import { type KeyboardEvent, useEffect } from 'react';
import { useSelector } from '@tanstack/react-store';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';

// A padded window: the table frame keeps its border and radius inside it.
const fullScreenClassName =
  'fixed inset-0 z-50 m-0 flex h-dvh max-h-dvh w-dvw max-w-dvw flex-col bg-background p-4';

const editableSelector = 'input, textarea, select, [contenteditable]';

export interface ST_FullScreenContainer {
  readonly isFullScreen: boolean;
  /** Spread on the element that fills the screen: Esc handler, tabIndex while full screen, full-screen classes. */
  readonly containerProps: {
    readonly className: string;
    readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    /** `-1` while full screen, `undefined` otherwise. */
    readonly tabIndex: -1 | undefined;
    /** Marks the element whose descendants' Escape leaves full screen. */
    readonly 'data-st-full-screen': '';
  };
}

/**
 * The full-screen state of `table` and the props of the element that fills
 * the screen, for layouts that render their own wrapper.
 *
 * Escape on an element inside the container leaves full screen, except in
 * an editable field. While full screen the hook listens on `document` in the
 * capture phase, because an open tooltip can stop Escape before it reaches the
 * container.
 */
export const useST_FullScreenContainer = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): ST_FullScreenContainer => {
  const isFullScreen = useSelector(table.atoms.isFullScreen);

  useEffect(() => {
    if (!isFullScreen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const { target } = event;
      if (
        event.key === 'Escape' &&
        target instanceof Element &&
        target.closest('[data-st-full-screen]') &&
        !target.closest(editableSelector)
      ) {
        table.setIsFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isFullScreen, table]);

  return {
    containerProps: {
      className: isFullScreen ? fullScreenClassName : '',
      'data-st-full-screen': '',
      onKeyDown: (event) => {
        if (
          event.key === 'Escape' &&
          !(
            event.target instanceof Element &&
            event.target.closest(editableSelector)
          )
        ) {
          table.setIsFullScreen(false);
        }
      },
      tabIndex: isFullScreen ? -1 : undefined,
    },
    isFullScreen,
  };
};
