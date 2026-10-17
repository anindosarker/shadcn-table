'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnFiltersState,
  type SRT_PaginationState,
  type SRT_SortingState,
  // type SRT_ColumnOrderState,
} from '@/components/ui/shadcn-react-table';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '@/components/ui/shadcn-react-table/SRT_Tooltip';
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
  const [columnFilters, setColumnFilters] = useState<SRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SRT_SortingState>([]);
  const [pagination, setPagination] = useState<SRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //if using dynamic columns that are loaded after table instance creation, we will need to manage the column order state ourselves
  //UPDATE: No longer needed as of v2.10.0
  // const [columnOrder, setColumnOrder] = useState<SRT_ColumnOrderState>([]);

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
  const columns = useMemo<SRT_ColumnDef<User>[]>(
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

  const table = useShadcnReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    //give loading spinner somewhere to go while loading
    srtTableBodyProps: {
      children: isLoading ? (
        <tr style={{ height: '200px' }}>
          <td />
        </tr>
      ) : undefined,
    },
    srtToolbarAlertBannerProps: isError
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
      <SRT_Tooltip title="Refresh Data">
        <Button variant="ghost" size="icon" onClick={() => refetch()}>
          <RefreshCwIcon />
        </Button>
      </SRT_Tooltip>
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

  return <ShadcnReactTable table={table} />;
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
