import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';

export type ST_UsePaginationItem = {
  disabled: boolean;
  page: number | null;
  selected: boolean;
  type:
    | 'end-ellipsis'
    | 'first'
    | 'last'
    | 'next'
    | 'page'
    | 'previous'
    | 'start-ellipsis';
};

export const getPaginationItems = ({
  boundaryCount = 1,
  count = 1,
  disabled = false,
  hideNextButton = false,
  hidePrevButton = false,
  page = 1,
  showFirstButton = false,
  showLastButton = false,
  siblingCount = 1,
}: {
  boundaryCount?: number;
  count?: number;
  disabled?: boolean;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  page?: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  siblingCount?: number;
} = {}): ST_UsePaginationItem[] => {
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
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    count - boundaryCount - 1,
  );

  const itemList: Array<
    Exclude<ST_UsePaginationItem['type'], 'page'> | number
  > = [
    ...(showFirstButton ? (['first'] as const) : []),
    ...(hidePrevButton ? [] : (['previous'] as const)),
    ...startPages,

    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    ...range(siblingsStart, siblingsEnd),

    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : (['next'] as const)),
    ...(showLastButton ? (['last'] as const) : []),
  ];

  const buttonPage = (type: Exclude<ST_UsePaginationItem['type'], 'page'>) => {
    switch (type) {
      case 'first':
        return 1;
      case 'previous':
        return page - 1;
      case 'next':
        return page + 1;
      case 'last':
        return count;
      default:
        return null;
    }
  };

  const items = itemList.map((item): ST_UsePaginationItem => {
    return typeof item === 'number'
      ? {
          type: 'page',
          page: item,
          selected: item === page,
          disabled,
        }
      : {
          type: item,
          page: buttonPage(item),
          selected: false,
          disabled:
            disabled ||
            (!item.includes('ellipsis') &&
              (item === 'next' || item === 'last' ? page >= count : page <= 1)),
        };
  });

  return items;
};

// The rows the body shows for the page, as zero-based first and exclusive last
// positions in the pre-paginated rows, for the `1-5 of 8` label. Under
// `rowPinningDisplayMode: 'select-*'` the rows pinned on other pages show
// beside the page (`keepPinnedRows`), so the range covers them too.
export const getST_ShownRowRange = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  {
    pageIndex,
    pageSize,
    totalRowCount,
  }: { pageIndex: number; pageSize: number; totalRowCount: number },
) => {
  const {
    options: {
      enableRowPinning,
      keepPinnedRows,
      manualPagination,
      rowPinningDisplayMode,
    },
  } = table;
  const rowPinning = table.atoms.rowPinning.get();

  let firstRowIndex = pageIndex * pageSize;
  let lastRowIndex = Math.min(firstRowIndex + pageSize, totalRowCount);

  if (
    enableRowPinning &&
    rowPinningDisplayMode?.startsWith('select') &&
    keepPinnedRows !== false &&
    !manualPagination
  ) {
    // `select-sticky` shows the top pins only.
    const shownPinnedRowIds = new Set([
      ...rowPinning.top,
      ...(rowPinningDisplayMode.includes('sticky') ? [] : rowPinning.bottom),
    ]);
    table.getPrePaginatedRowModel().rows.forEach((row, index) => {
      if (shownPinnedRowIds.has(row.id)) {
        firstRowIndex = Math.min(firstRowIndex, index);
        lastRowIndex = Math.max(lastRowIndex, index + 1);
      }
    });
  }

  return { firstRowIndex, lastRowIndex };
};
