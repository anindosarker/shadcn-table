import {
  parseSRT_HtmlProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_TablePagination } from './SRT_TablePagination';
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner';
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone';
import { SRT_ToolbarInternalButtons } from './SRT_ToolbarInternalButtons';
import { useSRT_MediaQuery } from './useSRT_MediaQuery';
import { SRT_GlobalFilterTextField } from '../inputs/SRT_GlobalFilterTextField';

export interface SRT_TopToolbarProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_TopToolbar = <TData extends SRT_RowData>({
  table,
}: SRT_TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
      srtTopToolbarProps,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, showGlobalFilter } = getState();

  const isMobile = useSRT_MediaQuery('(max-width:720px)');
  const isTablet = useSRT_MediaQuery('(max-width:1024px)');

  const toolbarProps = parseSRT_HtmlProps(srtTopToolbarProps, { table });

  // Mirror MRT: stack the alert banner (push content down) on small screens,
  // when custom actions are rendered, or when the global filter is shown on a
  // tablet — otherwise it overlays absolutely in the top-right corner.
  const stackAlertBanner =
    isMobile ||
    !!renderTopToolbarCustomActions ||
    (showGlobalFilter && isTablet);

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref;
      }}
      {...toolbarProps}
      className={cn(
        'relative w-full',
        isFullScreen ? 'sticky top-0 z-40 bg-background' : undefined,
        toolbarProps?.className,
      )}
    >
      {/* Alert Banner */}
      {positionToolbarAlertBanner === 'top' && (
        <SRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}

      {/* Drop Zone for Column Grouping */}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <SRT_ToolbarDropZone table={table} />
      )}

      <div
        className={cn(
          'box-border flex w-full items-start justify-between gap-2 p-2',
          stackAlertBanner ? 'relative' : 'absolute right-0 top-0',
        )}
      >
        {/* Global Filter - Left Position */}
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <SRT_GlobalFilterTextField table={table} />
        )}

        {/* Custom Actions */}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}

        {/* Internal Buttons */}
        {enableToolbarInternalActions ? (
          <div className="flex flex-wrap-reverse items-center justify-end gap-2">
            {/* Global Filter - Right Position */}
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <SRT_GlobalFilterTextField table={table} />
            )}
            <SRT_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <SRT_GlobalFilterTextField table={table} />
          )
        )}
      </div>

      {/* Pagination (top/both) */}
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <SRT_TablePagination position="top" table={table} />
        )}

      {/* Linear Progress Bar */}
      <SRT_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};
