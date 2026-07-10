import { type ComponentPropsWithRef } from 'react';
import { cva } from 'class-variance-authority';
import {
  parseFromValuesOrFunc,
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface SRT_TablePaginationProps<TData extends SRT_RowData>
  extends Partial<
    DivProps & {
      SelectProps?: Partial<ComponentPropsWithRef<'select'>>;
      disabled?: boolean;
      rowsPerPageOptions?: { label: string; value: number }[] | number[];
      showRowsPerPage?: boolean;
    }
  > {
  position?: 'bottom' | 'top';
  table: SRT_TableInstance<TData>;
}

// Root layout mapped from MRT's Box sx (justifyContent { md: space-between, sm:
// center } → justify-center md:justify-between). class hook Mui- → Srt-.
const tablePaginationVariants = cva(
  'relative z-[2] flex flex-wrap items-center gap-2 justify-self-end px-2 py-3 justify-center md:justify-between',
);

// Icon reset per SRT_TableHeadCellColumnActionsButton precedent (MUI IconButton
// defaults folded into classes; size="small" dropped → sizing is h-8/w-8).
const paginationIconButtonVariants = cva(
  'inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
);

export const SRT_TablePagination = <TData extends SRT_RowData>({
  position = 'bottom',
  table,
  ...rest
}: SRT_TablePaginationProps<TData>) => {
  // const theme = useTheme(); const isMobile = useMediaQuery('(max-width: 720px)');
  // Note: useTheme + flipIconStyles(theme) dropped for CSS-only rtl (rtl:rotate-180);
  // the rows-per-page select is always a native <select> (below), so MRT's mobile
  // `SelectProps.native` toggle is moot.
  const {
    getState,
    options: {
      enableToolbarInternalActions,
      icons: { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon },
      id,
      localization,
      paginationDisplayMode,
      srtPaginationProps,
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

  // if (isMobile && SelectProps?.native !== false) SelectProps.native = true;
  // const tooltipProps = getCommonTooltipProps();
  // Note: SRT_Tooltip computes getCommonTooltipProps() internally, so the
  // per-call tooltipProps object is dropped.

  // Preserved June 'pages'-mode numbered-buttons + ellipsis windowing.
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

  return (
    <div
      className={cn(
        'SrtTablePagination-root',
        tablePaginationVariants(),
        position === 'top' && enableToolbarInternalActions && 'mt-12',
      )}
    >
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <label htmlFor={`srt-rows-per-page-${id}`} className="text-sm">
            {localization.rowsPerPage}
          </label>
          <select
            aria-label={localization.rowsPerPage}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            disabled={disabled}
            id={`srt-rows-per-page-${id}`}
            onChange={(event) => table.setPageSize(+event.target.value)}
            value={pageSize}
            {...SelectProps}
          >
            {rowsPerPageOptions.map((option) => {
              const value = typeof option !== 'number' ? option.value : option;
              const label =
                typeof option !== 'number' ? option.label : `${option}`;
              return (
                // Note: MRT's SelectProps.native ternary MenuItem branch is a
                // dropped construct — always the native <option>.
                SelectProps?.children ?? (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              );
            })}
          </select>
        </div>
      )}
      {paginationDisplayMode === 'pages' ? (
        // Preserved June numbered pagination, driven by MRT's inputs. MUI
        // Pagination / PaginationItem are dropped constructs.
        <div
          {...restPaginationProps}
          className={cn(
            'flex items-center gap-1',
            restPaginationProps?.className,
          )}
        >
          {showFirstButton && (
            <Button
              aria-label={localization.goToFirstPage}
              className="h-8 w-8"
              disabled={disableBack}
              onClick={() => table.firstPage()}
              size="icon"
              variant="outline"
            >
              <FirstPageIcon className="h-4 w-4 rtl:rotate-180" />
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
            <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
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
            <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
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
              <LastPageIcon className="h-4 w-4 rtl:rotate-180" />
            </Button>
          )}
        </div>
      ) : paginationDisplayMode === 'default' ? (
        <>
          <span className="mx-1 min-w-[8ch] text-center text-sm">{`${
            lastRowIndex === 0
              ? 0
              : (firstRowIndex + 1).toLocaleString(localization.language)
          }-${lastRowIndex.toLocaleString(localization.language)} ${
            localization.of
          } ${totalRowCount.toLocaleString(localization.language)}`}</span>
          {/* MRT <Box gap="xs"> is odd MUI — mapped to a flex container. Each
              disabled button stays wrapped in <span> so SRT_Tooltip anchors it. */}
          <div className="flex gap-1">
            {showFirstButton && (
              <SRT_Tooltip title={localization.goToFirstPage}>
                <span>
                  <button
                    type="button"
                    aria-label={localization.goToFirstPage}
                    className={paginationIconButtonVariants()}
                    disabled={disableBack}
                    onClick={() => table.firstPage()}
                  >
                    <FirstPageIcon className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </span>
              </SRT_Tooltip>
            )}
            <SRT_Tooltip title={localization.goToPreviousPage}>
              <span>
                <button
                  type="button"
                  aria-label={localization.goToPreviousPage}
                  className={paginationIconButtonVariants()}
                  disabled={disableBack}
                  onClick={() => table.previousPage()}
                >
                  <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
                </button>
              </span>
            </SRT_Tooltip>
            <SRT_Tooltip title={localization.goToNextPage}>
              <span>
                <button
                  type="button"
                  aria-label={localization.goToNextPage}
                  className={paginationIconButtonVariants()}
                  disabled={disableNext}
                  onClick={() => table.nextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
                </button>
              </span>
            </SRT_Tooltip>
            {showLastButton && (
              <SRT_Tooltip title={localization.goToLastPage}>
                <span>
                  <button
                    type="button"
                    aria-label={localization.goToLastPage}
                    className={paginationIconButtonVariants()}
                    disabled={disableNext}
                    onClick={() => table.lastPage()}
                  >
                    <LastPageIcon className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </span>
              </SRT_Tooltip>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
