'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  type ST_PaginationState,
  type ST_SortingState,
  // type ST_ColumnOrderState,
  ST_Tooltip,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
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
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
  lastLogin: Date;
};

const columnNames = {
  firstName: 'First Name',
  lastName: 'Last Name',
  address: 'Address',
  state: 'State',
  phoneNumber: 'Phone Number',
  lastLogin: 'Last Login',
} as const;

const Example = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //if using dynamic columns that are loaded after table instance creation, we will need to manage the column order state ourselves
  //UPDATE: No longer needed as of v2.10.0
  // const [columnOrder, setColumnOrder] = useState<ST_ColumnOrderState>([]);

  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'users-list',
      {
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
      },
    ],
    queryFn: async () => {
      const fetchURL = new URL('/api/data', location.origin); // nextjs api route

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = (await response.json()) as UserApiResponse;
      return json;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  //create columns from data
  const columns = useMemo<ST_ColumnDef<User>[]>(
    () =>
      data.length
        ? Object.keys(data[0]).map((columnId) => ({
            header: columnNames[columnId as keyof User] ?? columnId,
            accessorKey: columnId,
            id: columnId,
          }))
        : [],
    [data],
  );

  //UPDATE: No longer needed as of v2.10.0
  // useEffect(() => {
  //   //if using dynamic columns that are loaded after table instance creation, we will need to set the column order state ourselves
  //   setColumnOrder(columns.map((column) => column.id!));
  // }, [columns]);

  const table = useShadcnTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    //give loading spinner somewhere to go while loading
    stTableBodyProps: {
      children: isLoading ? (
        <tr style={{ height: '200px' }}>
          <td />
        </tr>
      ) : undefined,
    },
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    // onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <ST_Tooltip title="Refresh Data">
        <Button variant="ghost" size="icon" onClick={() => refetch()}>
          <RefreshCwIcon />
        </Button>
      </ST_Tooltip>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      // columnOrder,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <ShadcnTable table={table} />;
};

//react query setup in App.tsx
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}
