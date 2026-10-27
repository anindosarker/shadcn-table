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
  // keep default values in sync with @default tags in Pagination.propTypes
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
  // const [page, setPageState] = useControlled({
  //   controlled: pageProp,
  //   default: defaultPage,
  //   name: componentName,
  //   state: 'page',
  // });
  // const handleClick = (event, value) => {
  //   if (!pageProp) {
  //     setPageState(value);
  //   }
  //   if (handleChange) {
  //     handleChange(event, value);
  //   }
  // };

  // https://dev.to/namirsab/comment/2050
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
    Exclude<ST_UsePaginationItem['type'], 'page'> | number
  > = [
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

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map((item): ST_UsePaginationItem => {
    return typeof item === 'number'
      ? {
          // onClick: (event) => {
          //   handleClick(event, item);
          // },
          type: 'page',
          page: item,
          selected: item === page,
          disabled,
          // 'aria-current': item === page ? 'page' : undefined,
        }
      : {
          // onClick: (event) => {
          //   handleClick(event, buttonPage(item));
          // },
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
