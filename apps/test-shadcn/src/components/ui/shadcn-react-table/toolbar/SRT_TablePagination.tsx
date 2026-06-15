import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { parseSRT_HtmlProps } from 'shadcn-react-table-core';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface SRT_TablePaginationProps<TData extends SRT_RowData> {
  className?: string;
  disabled?: boolean;
  position?: 'bottom' | 'top';
  rowsPerPageOptions?: { label: string; value: number }[] | number[];
  showFirstButton?: boolean;
  showLastButton?: boolean;
  showRowsPerPage?: boolean;
  table: SRT_TableInstance<TData>;
}

export const SRT_TablePagination = <TData extends SRT_RowData>({
  className,
  disabled = false,
  position = 'bottom',
  rowsPerPageOptions = defaultRowsPerPage,
  showRowsPerPage = true,
  table,
  ...rest
}: SRT_TablePaginationProps<TData>) => {
  const {
    getState,
    options: {
      enableToolbarInternalActions,
      id,
      localization,
      paginationDisplayMode = 'default',
      srtPaginationProps,
    },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = getState();

  const totalRowCount = table.getRowCount();
  const numberOfPages = table.getPageCount();
  const showFirstLastPageButtons = numberOfPages > 2;
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  const {
    showFirstButton = showFirstLastPageButtons,
    showLastButton = showFirstLastPageButtons,
  } = rest;

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  // Numbered page list with ellipses (boundaryCount=1, siblingCount=1),
  // mirroring MUI Pagination's default item set used by MRT.
  const getPageItems = (): Array<number | 'ellipsis'> => {
    const total = numberOfPages;
    const current = pageIndex + 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: Array<number | 'ellipsis'> = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) items.push('ellipsis');
    for (let p = start; p <= end; p++) items.push(p);
    if (end < total - 1) items.push('ellipsis');
    items.push(total);
    return items;
  };

  const paginationProps = parseSRT_HtmlProps(srtPaginationProps, { table });

  return (
    <div
      {...paginationProps}
      className={cn(
        'relative z-[2] flex flex-wrap items-center justify-center gap-2 px-2 py-3 md:justify-between',
        position === 'top' && enableToolbarInternalActions && 'mt-12',
        className,
        paginationProps?.className,
      )}
    >
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <label
            htmlFor={`srt-rows-per-page-${id}`}
            className="text-sm text-muted-foreground"
          >
            {localization.rowsPerPage}
          </label>
          <Select
            disabled={disabled}
            value={`${pageSize}`}
            onValueChange={(value) => table.setPageSize(+value)}
          >
            <SelectTrigger
              id={`srt-rows-per-page-${id}`}
              aria-label={localization.rowsPerPage}
              className="h-8 w-[4.5rem]"
            >
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((option) => {
                const value =
                  typeof option !== 'number' ? option.value : option;
                const label =
                  typeof option !== 'number' ? option.label : `${option}`;
                return (
                  <SelectItem key={value} value={`${value}`}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="min-w-[8ch] text-center text-sm text-muted-foreground">
          {`${
            lastRowIndex === 0
              ? 0
              : (firstRowIndex + 1).toLocaleString(localization.language)
          }-${lastRowIndex.toLocaleString(localization.language)} ${
            localization.of
          } ${totalRowCount.toLocaleString(localization.language)}`}
        </span>
        {paginationDisplayMode === 'custom' ? null : paginationDisplayMode ===
          'pages' ? (
          <div className="flex items-center gap-1">
            <Button
              aria-label={localization.goToPreviousPage}
              className="h-8 w-8"
              disabled={disableBack}
              onClick={() => table.previousPage()}
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageItems().map((item, idx) =>
              item === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  aria-current={item === pageIndex + 1 ? 'page' : undefined}
                  aria-label={`Go to page ${item}`}
                  className="h-8 min-w-8 px-2"
                  disabled={disabled}
                  onClick={() => table.setPageIndex(item - 1)}
                  size="icon"
                  variant={item === pageIndex + 1 ? 'default' : 'outline'}
                >
                  {item.toLocaleString(localization.language)}
                </Button>
              ),
            )}
            <Button
              aria-label={localization.goToNextPage}
              className="h-8 w-8"
              disabled={disableNext}
              onClick={() => table.nextPage()}
              size="icon"
              variant="outline"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {showFirstButton && (
              <Button
                aria-label={localization.goToFirstPage}
                className="h-8 w-8"
                disabled={disableBack}
                onClick={() => table.firstPage()}
                size="icon"
                variant="outline"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              aria-label={localization.goToPreviousPage}
              className="h-8 w-8"
              disabled={disableBack}
              onClick={() => table.previousPage()}
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              aria-label={localization.goToNextPage}
              className="h-8 w-8"
              disabled={disableNext}
              onClick={() => table.nextPage()}
              size="icon"
              variant="outline"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {showLastButton && (
              <Button
                aria-label={localization.goToLastPage}
                className="h-8 w-8"
                disabled={disableNext}
                onClick={() => table.lastPage()}
                size="icon"
                variant="outline"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
