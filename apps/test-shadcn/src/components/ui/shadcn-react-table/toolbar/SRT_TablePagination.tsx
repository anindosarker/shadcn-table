import { cva } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { createElement } from 'react';
import {
  getPaginationItems,
  parseFromValuesOrFunc,
  type ButtonProps,
  type SRT_PaginationItem,
  type SRT_PaginationProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
    SRT_PaginationProps & {
      // Note: spreads onto SelectTrigger (a button), hence ButtonProps.
      SelectProps?: Partial<ButtonProps>;
      rowsPerPageOptions?: { label: string; value: number }[] | number[];
      showRowsPerPage?: boolean;
    }
  > {
  position?: 'bottom' | 'top';
  table: SRT_TableInstance<TData>;
}

const tablePaginationVariants = cva(
  'relative z-[2] flex flex-wrap items-center gap-2 justify-self-end px-2 py-3 justify-center md:justify-between',
);

export const SRT_TablePagination = <TData extends SRT_RowData>({
  position = 'bottom',
  table,
  ...rest
}: SRT_TablePaginationProps<TData>) => {
  // const theme = useTheme(); const isMobile = useMediaQuery('(max-width: 720px)');
  // Note: rtl via `rtl:rotate-180` class; radix Select has no native mode.
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
    boundaryCount = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    rowsPerPageOptions = defaultRowsPerPage,
    showFirstButton = showFirstLastPageButtons,
    showLastButton = showFirstLastPageButtons,
    showRowsPerPage = true,
    siblingCount = 1,
    ...restPaginationProps
  } = paginationProps ?? {};

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  // if (isMobile && SelectProps?.native !== false) SelectProps.native = true;
  // const tooltipProps = getCommonTooltipProps();
  // Note: SRT_Tooltip applies getCommonTooltipProps() itself.

  const { children: selectPropsChildren, ...selectTriggerProps } = SelectProps;

  const navItems: Partial<
    Record<SRT_PaginationItem['type'], { Icon: LucideIcon; label: string }>
  > = {
    first: { Icon: FirstPageIcon, label: localization.goToFirstPage },
    last: { Icon: LastPageIcon, label: localization.goToLastPage },
    next: { Icon: ChevronRightIcon, label: localization.goToNextPage },
    previous: { Icon: ChevronLeftIcon, label: localization.goToPreviousPage },
  };

  return (
    <div
      className={cn(
        tablePaginationVariants(),
        position === 'top' && enableToolbarInternalActions && 'mt-12',
      )}
    >
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <Label htmlFor={`srt-rows-per-page-${id}`}>
            {localization.rowsPerPage}
          </Label>
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
        // Note: MUI Pagination/PaginationItem → shadcn Pagination. PaginationPrevious/
        // Next not used: hardcoded English text + lucide icons (locales, icon overrides).
        <Pagination
          {...restPaginationProps}
          className={cn('mx-0 w-auto', restPaginationProps?.className)}
        >
          <PaginationContent>
            {getPaginationItems({
              boundaryCount,
              count: numberOfPages,
              disabled,
              hideNextButton,
              hidePrevButton,
              page: pageIndex + 1,
              showFirstButton,
              showLastButton,
              siblingCount,
            }).map((item, index) => {
              if (item.page === null) {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              const { page } = item;
              const nav = navItems[item.type];
              return (
                // Note: PaginationLink (href-less <a>, not keyboard-operable) → Button.
                <PaginationItem key={index}>
                  <Button
                    aria-current={item.selected ? 'page' : undefined}
                    aria-label={
                      nav
                        ? nav.label
                        : `${item.selected ? '' : 'Go to '}page ${page}`
                    }
                    disabled={item.disabled}
                    onClick={() => table.setPageIndex(page - 1)}
                    size="icon-sm"
                    type="button"
                    variant={item.selected ? 'outline' : 'ghost'}
                  >
                    {nav
                      ? createElement(nav.Icon, { className: 'rtl:rotate-180' })
                      : page.toLocaleString(localization.language)}
                  </Button>
                </PaginationItem>
              );
            })}
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
          <div>
            {showFirstButton && (
              <SRT_Tooltip title={localization.goToFirstPage}>
                <span>
                  <Button
                    aria-label={localization.goToFirstPage}
                    disabled={disableBack}
                    onClick={() => table.firstPage()}
                    size="icon-sm"
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
                  size="icon-sm"
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
                  size="icon-sm"
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
                    size="icon-sm"
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
