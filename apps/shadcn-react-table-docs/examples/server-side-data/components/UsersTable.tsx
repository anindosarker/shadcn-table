import { useMemo } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { useTableQueryParams } from '../hooks/useTableQueryParams';
import { useUsersQuery } from '../hooks/useUsersQuery';
import type { User } from '../lib/users.service';

export const UsersTable = () => {
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
