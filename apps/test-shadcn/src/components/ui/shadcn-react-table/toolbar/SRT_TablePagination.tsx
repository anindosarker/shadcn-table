import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useMedia } from 'react-use';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface SRT_TablePaginationProps<TData extends SRT_RowData>
  extends Partial<{
    SelectProps?: Partial<typeof SelectPrimitive.Root>;
    disabled?: boolean;
    rowsPerPageOptions?: { label: string; value: number }[] | number[];
    showRowsPerPage?: boolean;
  }> {
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
 * - Rows per page selector (needs Select component from shadcn)
 * - Page number display mode
 *
 * TODO (Future enhancements):
 * - Custom pagination component support
 * - Mobile responsive layout
 * - Disabled state handling
 */

export const SRT_TablePagination = <TData extends SRT_RowData>({
  position = 'bottom',
  table,
  ...rest
}: SRT_TablePaginationProps<TData>) => {
  const isMobile = useMedia('(max-width: 720px)');

  const {
    getState,
    options: {
      enableToolbarInternalActions,
      id,
      localization,
      paginationDisplayMode,
    },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = getState();

  const paginationProps = {
    ...rest,
  };

  const totalRowCount = table.getRowCount();
  const numberOfPages = table.getPageCount();
  const showFirstLastPageButtons = numberOfPages > 2;
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  const {
    SelectProps = {},
    disabled = false,
    rowsPerPageOptions = defaultRowsPerPage,
    // showFirstButton = showFirstLastPageButtons,
    // showLastButton = showFirstLastPageButtons,
    showRowsPerPage = true,
    ...restPaginationProps
  } = paginationProps ?? {};

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  // if (isMobile && SelectProps?.native !== false) {
  //   SelectProps.native = true;
  // }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-2 py-4">
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {localization.rowsPerPage}
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {defaultRowsPerPage.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex-1 text-sm text-muted-foreground">
        {lastRowIndex === 0 ? 0 : firstRowIndex + 1}-{lastRowIndex}{' '}
        {localization.of} {totalRowCount}
      </div>

      {paginationDisplayMode === 'pages' ? (
        (() => {
          const numberOfPages = table.getPageCount();
          const showFirstLastPageButtons = numberOfPages > 2;

          const disableBack = pageIndex <= 0;
          const disableNext = pageIndex >= numberOfPages - 1;

          // Build a compact page range with ellipses similar to common pagination UIs.
          const siblingCount = 1; // pages adjacent to current
          const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, two ellipses

          const createRange = (start: number, end: number) => {
            const range = [] as number[];
            for (let i = start; i <= end; i += 1) {
              range.push(i);
            }
            return range;
          };

          let pageItems: (number | '...')[] = [];

          if (numberOfPages <= totalPageNumbers) {
            pageItems = createRange(1, numberOfPages);
          } else {
            const leftSiblingIndex = Math.max(pageIndex + 1 - siblingCount, 1);
            const rightSiblingIndex = Math.min(
              pageIndex + 1 + siblingCount,
              numberOfPages,
            );

            const showLeftEllipsis = leftSiblingIndex > 2;
            const showRightEllipsis = rightSiblingIndex < numberOfPages - 1;

            if (!showLeftEllipsis && showRightEllipsis) {
              const leftItemCount = 3 + 2 * siblingCount;
              const leftRange = createRange(1, leftItemCount);
              pageItems = [...leftRange, '...', numberOfPages];
            } else if (showLeftEllipsis && !showRightEllipsis) {
              const rightItemCount = 3 + 2 * siblingCount;
              const rightRange = createRange(
                numberOfPages - rightItemCount + 1,
                numberOfPages,
              );
              pageItems = [1, '...', ...rightRange];
            } else if (showLeftEllipsis && showRightEllipsis) {
              const middleRange = createRange(
                leftSiblingIndex,
                rightSiblingIndex,
              );
              pageItems = [1, '...', ...middleRange, '...', numberOfPages];
            }
          }

          return (
            <div className="flex items-center gap-1">
              {showFirstLastPageButtons && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.firstPage()}
                  disabled={disableBack}
                  aria-label={localization.goToFirstPage}
                  className="h-8 w-8"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={disableBack}
                aria-label={localization.goToPreviousPage}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageItems.map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-sm">
                    ...
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === pageIndex + 1 ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => table.setPageIndex(item - 1)}
                    aria-current={item === pageIndex + 1 ? 'page' : undefined}
                    className={`h-8 w-8 ${
                      item === pageIndex + 1
                        ? 'bg-muted text-muted-foreground'
                        : ''
                    }`}
                  >
                    <span className="text-sm">{item}</span>
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={disableNext}
                aria-label={localization.goToNextPage}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {showFirstLastPageButtons && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.lastPage()}
                  disabled={disableNext}
                  aria-label={localization.goToLastPage}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })()
      ) : paginationDisplayMode === 'default' ? (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.firstPage()}
            disabled={disableBack}
            aria-label={localization.goToFirstPage}
            className="h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={disableBack}
            aria-label={localization.goToPreviousPage}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={disableNext}
            aria-label={localization.goToNextPage}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.lastPage()}
            disabled={disableNext}
            aria-label={localization.goToLastPage}
            className="h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
