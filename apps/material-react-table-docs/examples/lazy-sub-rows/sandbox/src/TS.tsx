import { lazy, Suspense, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ExpandedState,
} from 'material-react-table';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5

//Your API response shape will probably be different. Knowing a total row count is important though.
type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  managerId: string | null; //row's parent row id
  subordinateIds: string[]; //or some type of boolean that indicates that there are sub-rows
};

const columns: MRT_ColumnDef<User>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  //end
];

const Example = () => {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<MRT_ExpandedState>({}); //Record<string, boolean> | true

  //which rows have sub-rows expanded and need their direct sub-rows to be included in the API call
  const expandedRowIds: string[] | 'all' = useMemo(
    () =>
      expanded === true
        ? 'all'
        : Object.entries(expanded)
            .filter(([_managerId, isExpanded]) => isExpanded)
            .map(([managerId]) => managerId),
    [expanded],
  );

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useFetchUsers({
    pagination,
    sorting,
    expandedRowIds,
  });

  //get data for root rows only (top of the tree data)
  const rootData = useMemo(() => data.filter((r) => !r.managerId), [data]);

  const table = useMaterialReactTable({
    columns,
    data: rootData,
    enableExpanding: true, //enable expanding column
    enableFilters: false,
    //tell MRT which rows have additional sub-rows that can be fetched
    getRowCanExpand: (row) => !!row.original.subordinateIds.length, //just some type of boolean
    //identify rows by the user's id
    getRowId: (row) => row.id,
    //if data is delivered in a flat array, MRT can convert it to a tree structure
    //though it's usually better if the API can construct the nested structure before this point
    getSubRows: (row) => data.filter((r) => r.managerId === row.id), //parse flat array into tree structure
    // paginateExpandedRows: false, //the back-end in this example is acting as if this option is false
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      expanded,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

//react query setup in App.tsx
const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <Suspense fallback={null}>
        <ReactQueryDevtoolsProduction />
      </Suspense>
    </QueryClientProvider>
  );
}

//fetch user hook
const useFetchUsers = ({
  pagination,
  sorting,
  expandedRowIds,
}: {
  pagination: MRT_PaginationState;
  sorting: MRT_SortingState;
  expandedRowIds: string[] | 'all';
}) => {
  return useQuery<UserApiResponse>({
    queryKey: [
      'users', //give a unique key for this query
      {
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
        expandedRowIds,
      },
    ],
    queryFn: async () => {
      const fetchURL = new URL('/api/treedata', location.origin); // nextjs api route

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      fetchURL.searchParams.set(
        'expandedRowIds',
        expandedRowIds === 'all' ? 'all' : JSON.stringify(expandedRowIds ?? []),
      );

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = (await response.json()) as UserApiResponse;
      return json;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });
};
