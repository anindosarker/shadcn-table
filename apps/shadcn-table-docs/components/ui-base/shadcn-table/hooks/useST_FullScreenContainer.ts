import { type KeyboardEvent } from 'react';
import { useSelector } from '@tanstack/react-store';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';

const fullScreenClassName =
  'fixed inset-0 z-50 m-0 h-dvh max-h-dvh w-dvw max-w-dvw rounded-none border-0 p-0';

export interface ST_FullScreenContainer {
  readonly isFullScreen: boolean;
  /** Spread on the element that fills the screen: Esc handler, tabIndex while full screen, full-screen classes. */
  readonly containerProps: {
    readonly className: string;
    readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    /** `-1` while full screen, `undefined` otherwise. */
    readonly tabIndex: -1 | undefined;
  };
}

/**
 * The full-screen state of `table` and the props of the element that fills
 * the screen, for layouts that render their own wrapper.
 */
export const useST_FullScreenContainer = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): ST_FullScreenContainer => {
  const isFullScreen = useSelector(table.atoms.isFullScreen);
  return {
    containerProps: {
      className: isFullScreen ? fullScreenClassName : '',
      onKeyDown: (event) => {
        if (event.key === 'Escape') table.setIsFullScreen(false);
      },
      tabIndex: isFullScreen ? -1 : undefined,
    },
    isFullScreen,
  };
};
