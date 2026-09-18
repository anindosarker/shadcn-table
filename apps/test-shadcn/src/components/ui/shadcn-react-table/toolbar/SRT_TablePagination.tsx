import { cva } from 'class-variance-authority';
import { createElement } from 'react';
import {
  parseFromValuesOrFunc,
  type ButtonProps,
  type DivProps,
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
    DivProps & {
      // Note: spreads onto SelectTrigger (a button), hence ButtonProps.
      SelectProps?: Partial<ButtonProps>;
      disabled?: boolean;
      rowsPerPageOptions?: { label: string; value: number }[] | number[];
      showFirstButton?: boolean;
      showLastButton?: boolean;
      showRowsPerPage?: boolean;
    }
  > {
  position?: 'bottom' | 'top';
  table: SRT_TableInstance<TData>;
}

const tablePaginationVariants = cva(
  'relative z-[2] flex flex-wrap items-center gap-2 justify-self-end px-2 py-3 justify-center md:justify-between',
);

// Note: MUI Pagination derives its items in usePagination; shadcn Pagination is
// markup only, so that algorithm is ported here (boundaryCount = siblingCount = 1).
type SRT_PaginationNavType = 'first' | 'previous' | 'next' | 'last';
type SRT_PaginationEllipsisType = 'start-ellipsis' | 'end-ellipsis';
type SRT_PaginationItem =
  | { type: 'page'; page: number; selected: boolean; disabled: boolean }
  | {
      type: SRT_PaginationNavType;
      page: number;
      selected: false;
      disabled: boolean;
    }
  | {
      type: SRT_PaginationEllipsisType;
      page: null;
      selected: false;
      disabled: boolean;
    };

const getPaginationItems = ({
  count,
  disabled,
  page,
  showFirstButton,
  showLastButton,
}: {
  count: number;
  disabled: boolean;
  page: number;
  showFirstButton: boolean;
  showLastButton: boolean;
}): SRT_PaginationItem[] => {
  const boundaryCount = 1;
  const siblingCount = 1;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    count - boundaryCount - 1,
  );

  // Basic list of items to render
  // for example itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList: Array<
    SRT_PaginationNavType | SRT_PaginationEllipsisType | number
  > = [
    ...(showFirstButton ? (['first'] as const) : []),
    'previous',
    ...startPages,

    // Start ellipsis
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    'next',
    ...(showLastButton ? (['last'] as const) : []),
  ];

  // Map the button type to its page number
  const buttonPage = (type: SRT_PaginationNavType) => {
    switch (type) {
      case 'first':
        return 1;
      case 'previous':
        return page - 1;
      case 'next':
        return page + 1;
      case 'last':
        return count;
    }
  };

  return itemList.map(
    (item): SRT_PaginationItem =>
      typeof item === 'number'
        ? { type: 'page', page: item, selected: item === page, disabled }
        : item === 'start-ellipsis' || item === 'end-ellipsis'
          ? { type: item, page: null, selected: false, disabled }
          : {
              type: item,
              page: buttonPage(item),
              selected: false,
              disabled:
                disabled ||
                (item === 'next' || item === 'last'
                  ? page >= count
                  : page <= 1),
            },
  );
};

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
  // Note: SRT_Tooltip applies getCommonTooltipProps() itself.

  const { children: selectPropsChildren, ...selectTriggerProps } = SelectProps;

  const navItems = {
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
              count: numberOfPages,
              disabled,
              page: pageIndex + 1,
              showFirstButton,
              showLastButton,
            }).map((item, index) => {
              if (item.page === null) {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              const { page } = item;
              return (
                // Note: PaginationLink (href-less <a>, not keyboard-operable) → Button.
                <PaginationItem key={index}>
                  <Button
                    aria-current={item.selected ? 'page' : undefined}
                    aria-label={
                      item.type === 'page'
                        ? `${item.selected ? '' : 'Go to '}page ${page}`
                        : navItems[item.type].label
                    }
                    disabled={item.disabled}
                    onClick={() => table.setPageIndex(page - 1)}
                    size="icon-sm"
                    type="button"
                    variant={item.selected ? 'outline' : 'ghost'}
                  >
                    {item.type === 'page'
                      ? page.toLocaleString(localization.language)
                      : createElement(navItems[item.type].Icon, {
                          className: 'rtl:rotate-180',
                        })}
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
