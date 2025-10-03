import { Button } from '@/components/ui/button';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface SRT_TablePaginationProps<TData extends SRT_RowData> {
  position?: 'bottom' | 'top';
  table: SRT_TableInstance<TData>;
}

/**
 * Table pagination component - displays pagination controls
 *
 * Implemented:
 * - Basic page navigation (first, prev, next, last)
 * - Current page info (showing X-Y of Z)
 * - Simple button-based navigation
 *
 * TODO (Future enhancements):
 * - Rows per page selector (needs Select component from shadcn)
 * - Page number display mode
 * - Custom pagination component support
 * - Mobile responsive layout
 * - Disabled state handling
 */

export const SRT_TablePagination = <TData extends SRT_RowData>({
  table,
}: SRT_TablePaginationProps<TData>) => {
  const {
    getState,
    options: { localization },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = getState();

  const totalRowCount = table.getRowCount();
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  const canGoPrevious = pageIndex > 0;
  const canGoNext = lastRowIndex < totalRowCount;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Row count info */}
      <div className="flex-1 text-sm text-muted-foreground">
        {lastRowIndex === 0 ? 0 : firstRowIndex + 1}-{lastRowIndex}{' '}
        {localization.of} {totalRowCount}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.firstPage()}
          disabled={!canGoPrevious}
          aria-label={localization.goToFirstPage}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!canGoPrevious}
          aria-label={localization.goToPreviousPage}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!canGoNext}
          aria-label={localization.goToNextPage}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.lastPage()}
          disabled={!canGoNext}
          aria-label={localization.goToLastPage}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
