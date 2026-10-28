import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { useTableQueryParams } from '../hooks/useTableQueryParams';
import { useUsersQuery } from '../hooks/useUsersQuery';
import type { User } from '../lib/users.service';

export const UsersTable = () => {
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

  const table = useShadcnTable({
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
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <TooltipTrigger>
        <Button size="icon" variant="ghost" onPress={() => refetch()}>
          <RefreshCw />
        </Button>
        <Tooltip>Refresh Data</Tooltip>
      </TooltipTrigger>
    ),
    state: {
      ...state,
      isLoading, //first load only: skeleton rows
      showProgressBars: isFetching, //every later request: thin progress bar
      showAlertBanner: isError,
    },
  });

  return <ShadcnTable table={table} />;
};
