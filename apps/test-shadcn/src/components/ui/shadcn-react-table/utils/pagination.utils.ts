// Note: verbatim port of MUI usePagination's item algorithm (shadcn Pagination is markup only).
export type SRT_PaginationItem = {
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
  boundaryCount,
  count,
  disabled,
  hideNextButton,
  hidePrevButton,
  page,
  showFirstButton,
  showLastButton,
  siblingCount,
}: {
  boundaryCount: number;
  count: number;
  disabled: boolean;
  hideNextButton: boolean;
  hidePrevButton: boolean;
  page: number;
  showFirstButton: boolean;
  showLastButton: boolean;
  siblingCount: number;
}): SRT_PaginationItem[] => {
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
  const itemList: Array<Exclude<SRT_PaginationItem['type'], 'page'> | number> =
    [
      ...(showFirstButton ? (['first'] as const) : []),
      ...(hidePrevButton ? [] : (['previous'] as const)),
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
      ...(hideNextButton ? [] : (['next'] as const)),
      ...(showLastButton ? (['last'] as const) : []),
    ];

  // Map the button type to its page number
  const buttonPage = (
    type: Exclude<
      SRT_PaginationItem['type'],
      'end-ellipsis' | 'page' | 'start-ellipsis'
    >,
  ) => {
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
