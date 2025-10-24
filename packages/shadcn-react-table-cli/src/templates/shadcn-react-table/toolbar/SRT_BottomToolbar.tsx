import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_TablePagination } from './SRT_TablePagination';
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner';
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone';
import { cn } from '@/lib/utils';

export interface SRT_BottomToolbarProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Bottom toolbar component - displays pagination and custom actions
 *
 * Implemented:
 * - Pagination (when enabled)
 * - Linear progress bar
 * - Custom actions render slot
 *
 * TODO (Future enhancements):
 * - Alert banner support (bottom position)
 * - Drop zone support (for column grouping)
 * - Fullscreen mode fixed positioning
 * - Mobile responsive layout
 * - Custom toolbar props
 */

export const SRT_BottomToolbar = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_BottomToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enablePagination,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;
  const { isFullScreen } = getState();

  // TODO: stackAlertBanner and responsive handling (mobile/tablet)
  // For now, always stack the alert banner for simplicity
  const stackAlertBanner = true;

  return (
    <div
      ref={(node: HTMLDivElement) => {
        bottomToolbarRef.current = node;
      }}
      className={cn(
        'relative border-t bg-background',
        isFullScreen && 'fixed bottom-0 left-0 right-0 z-40',
        className,
      )}
    >
      <SRT_LinearProgressBar isTopToolbar={false} table={table} />

      {/* Alert Banner */}
      {positionToolbarAlertBanner === 'bottom' && (
        <SRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}

      {/* Drop Zone for Column Grouping */}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <SRT_ToolbarDropZone table={table} />
      )}

      <div className="flex items-center justify-between w-full box-border p-2">
        {/* Custom actions */}
        <div className="flex-1">
          {renderBottomToolbarCustomActions ? (
            renderBottomToolbarCustomActions({ table })
          ) : (
            <span />
          )}
        </div>

        {/* Pagination */}
        <div
          className={cn(
            'flex justify-end',
            stackAlertBanner ? 'relative' : 'absolute right-0 top-0',
          )}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <SRT_TablePagination position="bottom" table={table} />
            )}
        </div>
      </div>
    </div>
  );
};
