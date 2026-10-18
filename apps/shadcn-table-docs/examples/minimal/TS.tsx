'use client';

import { useMemo } from 'react';
import {
  ST_Table, //import alternative sub-component if we do not want toolbars
  type ST_ColumnDef,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

export const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
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
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    stTableBodyRowProps: { className: 'hover:[&>td]:after:bg-transparent' },
    stTableProps: {
      className:
        'bg-background border border-[rgba(81,81,81,.5)] [&_caption]:caption-top', //change default background color
    },
    stTableHeadCellProps: {
      className: 'border border-[rgba(81,81,81,.5)] font-normal italic',
    },
    stTableBodyCellProps: {
      className: 'border border-[rgba(81,81,81,.5)]',
    },
    renderCaption: ({ table }) =>
      `Here is a table rendered with the lighter weight ST_Table sub-component, rendering ${table.getRowModel().rows.length} rows.`,
  });

  //using ST_Table instead of ShadcnTable if we do not need any of the toolbar components or features
  return <ST_Table table={table} />;
};

export default Example;
