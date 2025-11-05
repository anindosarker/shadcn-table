import React from 'react';
import { useMedia } from 'react-use';
import {
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner';
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone';
import { SRT_ToolbarInternalButtons } from './SRT_ToolbarInternalButtons';
import { SRT_GlobalFilterTextField } from '../inputs/SRT_GlobalFilterTextField';
import { SRT_TablePagination } from './SRT_TablePagination';

export interface SRT_TopToolbarProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

// const useMediaQuery = (query: string): boolean => {
//   const [matches, setMatches] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return window.matchMedia(query).matches;
//     }
//     return false;
//   });

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const mediaQuery = window.matchMedia(query);
//     const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

//     // Set initial value
//     setMatches(mediaQuery.matches);

//     // Listen for changes
//     if (mediaQuery.addEventListener) {
//       mediaQuery.addEventListener('change', handler);
//       return () => mediaQuery.removeEventListener('change', handler);
//     } else {
//       // Fallback for older browsers
//       mediaQuery.addListener(handler);
//       return () => mediaQuery.removeListener(handler);
//     }
//   }, [query]);

//   return matches;
// };

export const SRT_TopToolbar = <TData extends SRT_RowData>({
  table,
}: SRT_TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      srtTopToolbarProps,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, showGlobalFilter } = getState();

  const isMobile = useMedia('(max-width:720px)');
  const isTablet = useMedia('(max-width:1024px)');

  const toolbarProps = parseFromValuesOrFunc(srtTopToolbarProps, { table });

  const stackAlertBanner =
    isMobile ||
    !!renderTopToolbarCustomActions ||
    (showGlobalFilter && isTablet);

  const globalFilterProps = {
    // TODO:  use cva for handling mobile and tablet classnames
    //  sx: !isTablet
    //    ? {
    //        zIndex: 2,
    //      }
    //    : undefined,
    table,
  };

  return (
    <div
      {...toolbarProps}
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref;
        if (toolbarProps?.ref) {
          // @ts-expect-error - TODO: add description
          toolbarProps.ref.current = ref;
        }
      }}
      className={cn(
        'relative w-full min-h-14 overflow-hidden transition-all',
        isFullScreen ? 'sticky top-0 z-40 bg-background' : undefined,
        toolbarProps?.className,
      )}
    >
      {positionToolbarAlertBanner === 'top' && (
        <SRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <SRT_ToolbarDropZone table={table} />
      )}
      <div
        className={cn(
          'box-border flex w-full items-start justify-between gap-2 p-2',
          stackAlertBanner ? 'relative' : 'absolute right-0 top-0',
        )}
      >
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <SRT_GlobalFilterTextField {...globalFilterProps} />
        )}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <div className="flex flex-wrap-reverse items-center justify-end gap-2">
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <SRT_GlobalFilterTextField {...globalFilterProps} />
            )}
            <SRT_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <SRT_GlobalFilterTextField {...globalFilterProps} />
          )
        )}
      </div>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <SRT_TablePagination position="top" table={table} />
        )}
      <SRT_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};
