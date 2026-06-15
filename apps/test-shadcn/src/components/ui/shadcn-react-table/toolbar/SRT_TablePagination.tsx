import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
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
    options: { enableToolbarInternalActions, id, localization },
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

  return (
    <div
      className={cn(
        'relative z-[2] flex flex-wrap items-center justify-center gap-2 px-2 py-3 md:justify-between',
        position === 'top' && enableToolbarInternalActions && 'mt-12',
        className,
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
      </div>
    </div>
  );
};
