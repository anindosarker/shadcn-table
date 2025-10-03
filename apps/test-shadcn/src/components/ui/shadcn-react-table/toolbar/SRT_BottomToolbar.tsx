import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_TablePagination } from './SRT_TablePagination';
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
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;
  const { isFullScreen } = getState();

  return (
    <div
      ref={(node: HTMLDivElement) => {
        bottomToolbarRef.current = node;
      }}
      className={cn(
        'relative border-t bg-background',
        isFullScreen && 'fixed bottom-0 left-0 right-0',
        className,
      )}
    >
      <SRT_LinearProgressBar isTopToolbar={false} table={table} />

      {/* TODO: Alert banner (bottom position) */}
      {/* TODO: Drop zone (for column grouping) */}

      <div className="flex items-center justify-between w-full box-border">
        {/* Custom actions */}
        <div className="flex-1">
          {renderBottomToolbarCustomActions?.({ table })}
        </div>

        {/* Pagination */}
        {enablePagination &&
          ['both', 'bottom'].includes(positionPagination ?? '') && (
            <SRT_TablePagination position="bottom" table={table} />
          )}
      </div>
    </div>
  );
};
