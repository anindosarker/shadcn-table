import { cva } from 'class-variance-authority';
import {
  parseFromValuesOrFunc,
  type ButtonProps,
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface SRT_TablePaginationProps<TData extends SRT_RowData>
  extends Partial<
    DivProps & {
      // Note: was Partial<ComponentPropsWithRef<'select'>> (native select).
      // The rows-per-page control is now a shadcn Select; this slot spreads
      // onto SelectTrigger (a button), so the type is ButtonProps.
      SelectProps?: Partial<ButtonProps>;
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

// Note: paginationIconButtonVariants cva deleted — the raw nav <button>s are
// now shadcn <Button variant="ghost" size="icon">, and 'pages' mode uses the
// shadcn Pagination composition. Both carry their own default styling.

export const SRT_TablePagination = <TData extends SRT_RowData>({
  position = 'bottom',
  table,
  ...rest
}: SRT_TablePaginationProps<TData>) => {
  // const theme = useTheme(); const isMobile = useMediaQuery('(max-width: 720px)');
  // Note: useTheme + flipIconStyles(theme) dropped for CSS-only rtl (rtl:rotate-180);
  // the rows-per-page select is a shadcn Select (below), so MRT's mobile
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
  // per-call tooltipProps object is dropped. MRT's `SelectProps.native` mobile
  // branch is dropped too — radix Select is never a native <select>.

  // Custom rows-per-page options: `children` can't inject radix SelectItems via
  // spread, so read it off the slot before spreading the rest onto SelectTrigger
  // and render it inside SelectContent when provided.
  const { children: selectPropsChildren, ...selectTriggerProps } = SelectProps;

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
          <Select
            disabled={disabled}
            onValueChange={(value) => table.setPageSize(+value)}
            value={String(pageSize)}
          >
            <SelectTrigger
              aria-label={localization.rowsPerPage}
              id={`srt-rows-per-page-${id}`}
              size="sm"
              {...selectTriggerProps}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* Note: MRT's SelectProps.native <option> / MenuItem ternary is
                    a dropped construct — radix renders SelectItems. */}
                {selectPropsChildren ??
                  rowsPerPageOptions.map((option) => {
                    const value =
                      typeof option !== 'number' ? option.value : option;
                    const label =
                      typeof option !== 'number' ? option.label : `${option}`;
                    return (
                      <SelectItem key={value} value={String(value)}>
                        {label}
                      </SelectItem>
                    );
                  })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      {paginationDisplayMode === 'pages' ? (
        // shadcn Pagination composition, driven by MRT's inputs. MUI Pagination
        // / PaginationItem are dropped constructs.
        // Note: PaginationPrevious/PaginationNext are NOT used — they hardcode
        // English "Previous"/"Next" text and lucide icons, which breaks the
        // 38-locale library and bypasses the table's icon overrides. All four
        // nav controls are Button (real <button>, so native disabled dimming)
        // with the table's icons + localized aria-labels, kept inside the
        // Pagination composition via PaginationItem. Numbered pages stay
        // PaginationLink (anchor, isActive).
        <Pagination
          {...restPaginationProps}
          className={cn('mx-0 w-auto', restPaginationProps?.className)}
        >
          <PaginationContent>
            {showFirstButton && (
              <PaginationItem>
                <Button
                  aria-label={localization.goToFirstPage}
                  disabled={disableBack}
                  onClick={() => table.firstPage()}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <FirstPageIcon className="rtl:rotate-180" />
                </Button>
              </PaginationItem>
            )}
            <PaginationItem>
              <Button
                aria-label={localization.goToPreviousPage}
                disabled={disableBack}
                onClick={() => table.previousPage()}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronLeftIcon className="rtl:rotate-180" />
              </Button>
            </PaginationItem>
            {getPageItems().map((item, idx) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                // Note: PaginationLink dropped — its href-less <a> is not
                // keyboard-focusable/operable (regression vs MUI's button-based
                // PaginationItem). Button with outline/ghost mirrors
                // PaginationLink's internal buttonVariants (isActive → outline)
                // and is keyboard-accessible.
                <PaginationItem key={item}>
                  <Button
                    aria-current={item === pageIndex + 1 ? 'page' : undefined}
                    aria-label={`Go to page ${item}`}
                    disabled={disabled}
                    onClick={() => table.setPageIndex(item - 1)}
                    size="icon"
                    type="button"
                    variant={item === pageIndex + 1 ? 'outline' : 'ghost'}
                  >
                    {item.toLocaleString(localization.language)}
                  </Button>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <Button
                aria-label={localization.goToNextPage}
                disabled={disableNext}
                onClick={() => table.nextPage()}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronRightIcon className="rtl:rotate-180" />
              </Button>
            </PaginationItem>
            {showLastButton && (
              <PaginationItem>
                <Button
                  aria-label={localization.goToLastPage}
                  disabled={disableNext}
                  onClick={() => table.lastPage()}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <LastPageIcon className="rtl:rotate-180" />
                </Button>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
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
                  <Button
                    aria-label={localization.goToFirstPage}
                    disabled={disableBack}
                    onClick={() => table.firstPage()}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <FirstPageIcon className="rtl:rotate-180" />
                  </Button>
                </span>
              </SRT_Tooltip>
            )}
            <SRT_Tooltip title={localization.goToPreviousPage}>
              <span>
                <Button
                  aria-label={localization.goToPreviousPage}
                  disabled={disableBack}
                  onClick={() => table.previousPage()}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ChevronLeftIcon className="rtl:rotate-180" />
                </Button>
              </span>
            </SRT_Tooltip>
            <SRT_Tooltip title={localization.goToNextPage}>
              <span>
                <Button
                  aria-label={localization.goToNextPage}
                  disabled={disableNext}
                  onClick={() => table.nextPage()}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ChevronRightIcon className="rtl:rotate-180" />
                </Button>
              </span>
            </SRT_Tooltip>
            {showLastButton && (
              <SRT_Tooltip title={localization.goToLastPage}>
                <span>
                  <Button
                    aria-label={localization.goToLastPage}
                    disabled={disableNext}
                    onClick={() => table.lastPage()}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <LastPageIcon className="rtl:rotate-180" />
                  </Button>
                </span>
              </SRT_Tooltip>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
