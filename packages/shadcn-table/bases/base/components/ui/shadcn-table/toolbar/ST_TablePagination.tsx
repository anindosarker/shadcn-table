import { cva } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { createElement } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  type ST_PaginationProps,
  type ST_RowData,
  type ST_TableInstance,
  type SelectProps,
} from '@/components/ui/shadcn-table/types';
import {
  getPaginationItems,
  type ST_UsePaginationItem,
} from '@/components/ui/shadcn-table/utils/pagination.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useST_MediaQuery } from '@/components/ui/shadcn-table/toolbar/useST_MediaQuery';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface ST_TablePaginationProps<TData extends ST_RowData>
  extends Partial<
    ST_PaginationProps & {
      SelectProps?: Partial<SelectProps>;
      rowsPerPageOptions?: { label: string; value: number }[] | number[];
      showRowsPerPage?: boolean;
    }
  > {
  position?: 'bottom' | 'top';
  table: ST_TableInstance<TData>;
}

const tablePaginationVariants = cva(
  'relative z-[2] flex flex-wrap items-center gap-2 justify-self-end px-2 py-3 justify-center md:justify-between',
);

export const ST_TablePagination = <TData extends ST_RowData>({
  position = 'bottom',
  table,
  ...rest
}: ST_TablePaginationProps<TData>) => {
  // const theme = useTheme();
  // Note: rtl via `rtl:rotate-180` class.
  const isMobile = useST_MediaQuery('(max-width:720px)');

  const {
    options: {
      enableToolbarInternalActions,
      icons: { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon },
      id,
      localization,
      stPaginationProps,
      paginationDisplayMode,
    },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = table.state;

  const paginationProps = {
    ...parseFromValuesOrFunc(stPaginationProps, {
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
    boundaryCount,
    disabled = false,
    hideNextButton,
    hidePrevButton,
    rowsPerPageOptions = defaultRowsPerPage,
    showFirstButton = showFirstLastPageButtons,
    showLastButton = showFirstLastPageButtons,
    showRowsPerPage = true,
    siblingCount,
    ...restPaginationProps
  } = paginationProps ?? {};

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  if (isMobile && SelectProps?.native !== false) {
    SelectProps.native = true;
  }

  // const tooltipProps = getCommonTooltipProps();
  // Note: ST_Tooltip applies getCommonTooltipProps() itself.

  const {
    children: selectPropsChildren,
    native,
    ...selectTriggerProps
  } = SelectProps;

  const navItems: Partial<
    Record<ST_UsePaginationItem['type'], { Icon: LucideIcon; label: string }>
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
          <Label htmlFor={`st-rows-per-page-${id}`}>
            {localization.rowsPerPage}
          </Label>
          {native ? (
            <NativeSelect
              aria-label={localization.rowsPerPage}
              disabled={disabled}
              id={`st-rows-per-page-${id}`}
              onChange={(event) => table.setPageSize(+event.target.value)}
              value={pageSize}
              {...selectTriggerProps}
            >
              {selectPropsChildren ??
                rowsPerPageOptions.map((option) => {
                  const value =
                    typeof option !== 'number' ? option.value : option;
                  const label =
                    typeof option !== 'number' ? option.label : `${option}`;
                  return (
                    <NativeSelectOption key={value} value={value}>
                      {label}
                    </NativeSelectOption>
                  );
                })}
            </NativeSelect>
          ) : (
            <Select
              disabled={disabled}
              // `items` gives the trigger the option label; Base UI's SelectValue
              // shows the raw value otherwise. Custom children fall back to the value.
              items={
                selectPropsChildren
                  ? undefined
                  : Object.fromEntries(
                      rowsPerPageOptions.map((option) =>
                        typeof option !== 'number'
                          ? [String(option.value), option.label]
                          : [String(option), `${option}`],
                      ),
                    )
              }
              onValueChange={(value: string | null) => {
                // Base UI reports null when a null-valued item is chosen; none here.
                if (value !== null) table.setPageSize(+value);
              }}
              value={String(pageSize)}
            >
              <SelectTrigger
                aria-label={localization.rowsPerPage}
                id={`st-rows-per-page-${id}`}
                size="sm"
                {...selectTriggerProps}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
              </SelectContent>
            </Select>
          )}
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
              <ST_Tooltip title={localization.goToFirstPage}>
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
              </ST_Tooltip>
            )}
            <ST_Tooltip title={localization.goToPreviousPage}>
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
            </ST_Tooltip>
            <ST_Tooltip title={localization.goToNextPage}>
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
            </ST_Tooltip>
            {showLastButton && (
              <ST_Tooltip title={localization.goToLastPage}>
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
              </ST_Tooltip>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
