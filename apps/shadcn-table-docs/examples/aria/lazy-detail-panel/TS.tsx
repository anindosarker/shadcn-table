'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  type ST_PaginationState,
  type ST_SortingState,
  type ST_Row,
} from '@/components/ui/shadcn-table';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Minus as MinusIcon, Plus as AddIcon } from 'lucide-react';
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
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
  lastLogin: Date;
};

type FullUserInfoApiResponse = FullUserInfo;

type FullUserInfo = User & {
  favoriteMusic: string;
  favoriteSong: string;
  quote: string;
};

const DetailPanel = ({ row }: { row: ST_Row<User> }) => {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useFetchUserInfo(
    {
      phoneNumber: row.id, //the row id is set to the user's phone number
    },
    {
      enabled: row.getIsExpanded(),
    },
  );
  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading User Info</AlertTitle>
      </Alert>
    );

  const { favoriteMusic, favoriteSong, quote } = userInfo ?? {};

  return (
    <div className="flex flex-col gap-2" style={{ minHeight: '00px' }}>
      <div>
        <b>Favorite Music:</b> {favoriteMusic}
      </div>
      <div>
        <b>Favorite Song:</b> {favoriteSong}
      </div>
      <div>
        <b>Quote:</b> {quote}
      </div>
    </div>
  );
};

const Example = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useFetchUsers({
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  const columns = useMemo<ST_ColumnDef<User>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    getRowId: (row) => row.phoneNumber,
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    stExpandButtonProps: ({ row }) => ({
      children: row.getIsExpanded() ? <MinusIcon /> : <AddIcon />,
    }),
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
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

//fetch user hook
const useFetchUsers = ({
  columnFilters,
  globalFilter,
  pagination,
  sorting,
}: {
  columnFilters: ST_ColumnFiltersState;
  globalFilter: string;
  pagination: ST_PaginationState;
  sorting: ST_SortingState;
}) => {
  return useQuery<UserApiResponse>({
    queryKey: [
      'users', //give a unique key for this query
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const fetchURL = new URL('/api/data', location.origin);

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
};

//fetch more user info hook
const useFetchUserInfo = (
  params: { phoneNumber: string },
  options: { enabled: boolean },
) => {
  return useQuery<FullUserInfoApiResponse>({
    enabled: options.enabled, //only fetch when the detail panel is opened
    staleTime: 60 * 1000, //don't refetch for 60 seconds
    queryKey: ['user', params.phoneNumber], //give a unique key for this query for each user fetch
    queryFn: async () => {
      const fetchURL = new URL(
        `/api/moredata/${params.phoneNumber
          .replaceAll('-', '')
          .replaceAll('.', '')
          .replaceAll('(', '')
          .replaceAll(')', '')}`,
        location.origin,
      );

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = (await response.json()) as FullUserInfoApiResponse;
      return json;
    },
  });
};
