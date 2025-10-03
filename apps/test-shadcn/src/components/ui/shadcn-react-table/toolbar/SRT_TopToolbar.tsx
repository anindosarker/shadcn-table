import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';

export interface SRT_TopToolbarProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_TopToolbar = <TData extends SRT_RowData>({
  table,
}: SRT_TopToolbarProps<TData>) => {
  const {
    getState,
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen } = getState();

  // TODO: srtTopToolbarProps - support passing props to top toolbar similar to MRT's muiTopToolbarProps
  // const toolbarProps = parseFromValuesOrFunc(table?.options?.srtTopToolbarProps as any, { table });

  // TODO: stackAlertBanner and responsive handling (mobile/tablet) without MUI's useMediaQuery
  // const stackAlertBanner = isMobile || !!renderTopToolbarCustomActions || (showGlobalFilter && isTablet);

  return (
    <div
      //TODO: add {...toolbarProps}
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref;
        //TODO: add if ((toolbarProps as any)?.ref) (toolbarProps as any).ref.current = ref;
      }}
      className={cn(
        'relative w-full',
        isFullScreen ? 'sticky top-0 z-40 bg-background' : undefined,
        //TODO: add (toolbarProps as any)?.className,
      )}
    >
      {/* TODO: Add these later      
        {positionToolbarAlertBanner === 'top' && (
          <MRT_ToolbarAlertBanner
            stackAlertBanner={stackAlertBanner}
            table={table}
          />
        )}
        {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
          <MRT_ToolbarDropZone table={table} />
        )} */}

      <div
        className={cn(
          'box-border flex w-full items-start justify-between gap-2 p-2',
          //TODO: use cva for stackAlertBanner ? 'relative' : 'absolute right-0 top-0', // TODO: handle overlay position
        )}
      >
        {/**
         * Handle global filters
         */}
        <h1>Top Toolbar global filters</h1>
      </div>

      {/* TODO: Pagination (top/both) */}
      {/* {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <MRT_TablePagination position="top" table={table} />
        )} */}
      {/* TODO: Linear Progress Bar (isTopToolbar) */}
      <SRT_LinearProgressBar isTopToolbar table={table} />
      <h1 className="text-red-500">Top Toolbar</h1>
    </div>
  );
};
