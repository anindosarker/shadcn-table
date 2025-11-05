import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/shadcn-react-table/pagination/pagination';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

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

export const SRT_TablePagination = <TData extends SRT_RowData>({
  position = 'bottom',
  table,
  ...rest
}: SRT_TablePaginationProps<TData>) => {
  // Not required as shadcn select component is already good enough for mobile
  // const isMobile = useMedia('(max-width: 720px)');

  const {
    getState,
    options: {
      enableToolbarInternalActions,
      // shadcn usage lucid icons so we don't need to import them
      // icons: { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon },
      id,
      localization,
      srtPaginationProps,
      paginationDisplayMode,
    },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = getState();

  const paginationProps = {
    ...parseFromValuesOrFunc(srtPaginationProps, {
      table,
    }),
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
    showFirstButton = showFirstLastPageButtons,
    showLastButton = showFirstLastPageButtons,
    showRowsPerPage = true,
    ...restPaginationProps
  } = paginationProps ?? {};

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  // TODO: fix later during fixing
  // const tooltipProps = getCommonTooltipProps();

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center md:justify-between gap-4 px-2 py-3 relative z-[2]',
        position === 'top' && enableToolbarInternalActions && 'mt-12',
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
            {...SelectProps}
            disabled={disabled}
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            aria-label={localization.rowsPerPage}
          >
            <SelectTrigger id={`srt-rows-per-page-${id}`} className="h-8 w-20">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((option) => {
                const value =
                  typeof option !== 'number' ? option.value : option;
                const label =
                  typeof option !== 'number' ? option.label : `${option}`;
                return (
                  <SelectItem key={value} value={value.toString()}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {paginationDisplayMode === 'pages' ? (
        <Pagination
          count={numberOfPages}
          disabled={disabled}
          onChange={(_e, newPageIndex) => table.setPageIndex(newPageIndex - 1)}
          page={pageIndex + 1}
          slots={{
            first: ChevronsLeft,
            last: ChevronsRight,
            next: ChevronRight,
            previous: ChevronLeft,
          }}
          showFirstButton={showFirstButton}
          showLastButton={showLastButton}
          className="mx-0 w-auto"
          {...restPaginationProps}
        />
      ) : paginationDisplayMode === 'default' ? (
        <>
          <div className="flex-1 text-sm text-muted-foreground">
            {`${
              lastRowIndex === 0
                ? 0
                : (firstRowIndex + 1).toLocaleString(localization.language)
            }-${lastRowIndex.toLocaleString(localization.language)} ${
              localization.of
            } ${totalRowCount.toLocaleString(localization.language)}`}
          </div>
          <div className="flex items-center gap-1">
            {showFirstButton && (
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
            {showLastButton && (
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
        </>
      ) : null}
    </div>
  );
};

/**
 * Table pagination component - displays pagination controls
 *
 * Implemented:
 * - Basic page navigation (first, prev, next, last)
 * - Current page info (showing X-Y of Z)
 * - Simple button-based navigation
 * - Rows per page selector (needs Select component from shadcn)
 * - Page number display mode
 * - Mobile responsive layout
 * - Disabled state handling
 *
 * TODO (Future enhancements):
 * - Custom pagination component support
 */
