'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnFilterFnsState,
  type SRT_ColumnFiltersState,
  type SRT_PaginationState,
  type SRT_RowData,
  type SRT_SortingState,
  type SRT_Updater,
} from '@/components/ui/shadcn-react-table';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5

// ---------------------------------------------------------------------------
// lib/services/users.service.ts
// ---------------------------------------------------------------------------

export type User = {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
  lastLogin: string;
};

//the query params YOUR server accepts
export type UsersQueryParams = {
  page: number; //1-based
  limit: number;
  search?: string;
  sortBy?: string[]; //"lastName:desc"
  filter?: string[]; //"state[$contains]=tex"
};

//the page shape YOUR server returns
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export async function getUsers(
  params: UsersQueryParams,
): Promise<PaginatedResponse<User>> {
  const url = new URL('/api/users', location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    //arrays become repeated keys: sortBy=a&sortBy=b
    for (const item of [value].flat()) {
      url.searchParams.append(key, String(item));
    }
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET /api/users: ${response.status}`);
  return response.json();
}

// ---------------------------------------------------------------------------
// hooks/queries/use-users-query.ts
// ---------------------------------------------------------------------------

export function useUsersQuery(params: UsersQueryParams) {
  return useQuery({
    queryKey: ['users', params], //new params, new cache entry, new request
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData, //keep the old page on screen while the next one loads
  });
}

// ---------------------------------------------------------------------------
// hooks/use-table-query-params.ts
// ---------------------------------------------------------------------------

//filter values can be strings, numbers or Dates (date filters)
const toParam = (value: unknown) =>
  value instanceof Date ? value.toISOString() : String(value);

export function useTableQueryParams<TData extends SRT_RowData>({
  columns,
  pageSize = 10,
}: {
  columns: SRT_ColumnDef<TData>[];
  pageSize?: number;
}) {
  const [pagination, setPagination] = useState<SRT_PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<SRT_ColumnFiltersState>(
    [],
  );
  //one filter mode per column, from the column's filterFn or 'contains'
  const [columnFilterFns, setColumnFilterFns] =
    useState<SRT_ColumnFilterFnsState>(() =>
      Object.fromEntries(
        columns.map((column) => [
          column.id ?? String(column.accessorKey),
          typeof column.filterFn === 'string' ? column.filterFn : 'contains',
        ]),
      ),
    );

  //new search, sort or filter: the old page number means nothing, go back to page 1
  const resetPageIndex = () =>
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

  const handlers = {
    onPaginationChange: setPagination,
    onGlobalFilterChange: (value: string | undefined) => {
      setSearch(value ?? '');
      resetPageIndex();
    },
    onSortingChange: (updater: SRT_Updater<SRT_SortingState>) => {
      setSorting(updater);
      resetPageIndex();
    },
    onColumnFiltersChange: (updater: SRT_Updater<SRT_ColumnFiltersState>) => {
      setColumnFilters(updater);
      resetPageIndex();
    },
    onColumnFilterFnsChange: (
      updater: SRT_Updater<SRT_ColumnFilterFnsState>,
    ) => {
      setColumnFilterFns(updater);
      resetPageIndex();
    },
  };

  //translate table state into the params YOUR server accepts
  const params: UsersQueryParams = {
    page: pagination.pageIndex + 1, //table is 0-based, server is 1-based
    limit: pagination.pageSize,
    search: search || undefined,
    sortBy: sorting.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`),
    filter: columnFilters.map(
      ({ id, value }) =>
        `${id}[$${columnFilterFns[id] ?? 'contains'}]=${toParam(value)}`,
    ),
  };

  return {
    params,
    handlers,
    state: {
      pagination,
      globalFilter: search,
      sorting,
      columnFilters,
      columnFilterFns,
    },
  };
}

// ---------------------------------------------------------------------------
// components/users-table.tsx
// ---------------------------------------------------------------------------

const UsersTable = () => {
  const columns = useMemo<SRT_ColumnDef<User>[]>(
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
      {
        accessorFn: (row) => new Date(row.lastLogin),
        id: 'lastLogin',
        header: 'Last Login',
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
        filterFn: 'greaterThan',
        filterVariant: 'date',
        columnFilterModeOptions: ['greaterThan', 'lessThan'],
        enableGlobalFilter: false,
      },
    ],
    [],
    //end
  );

  const { params, handlers, state } = useTableQueryParams({ columns });
  const { data, isError, isFetching, isLoading, refetch } =
    useUsersQuery(params);

  const table = useShadcnReactTable({
    columns,
    data: data?.data ?? [],
    rowCount: data?.total ?? 0, //the server knows the total, the table does not
    manualPagination: true, //turn off client-side pagination
    manualSorting: true, //turn off client-side sorting
    manualFiltering: true, //turn off client-side filtering
    enableColumnFilterModes: true,
    //only the operators the server understands
    columnFilterModeOptions: [
      'contains',
      'startsWith',
      'endsWith',
      'equals',
      'notEquals',
    ],
    initialState: { showColumnFilters: true },
    ...handlers,
    srtToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" onClick={() => refetch()}>
            <RefreshCw />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh Data</TooltipContent>
      </Tooltip>
    ),
    state: {
      ...state,
      isLoading, //first load only: skeleton rows
      showProgressBars: isFetching, //every later request: thin progress bar
      showAlertBanner: isError,
    },
  });

  return <ShadcnReactTable table={table} />;
};

//react query setup in App.tsx
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersTable />
    </QueryClientProvider>
  );
}
