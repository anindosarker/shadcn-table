'use client';

import { useMemo } from 'react';
import {
  SRT_Table, //import alternative sub-component if we do not want toolbars
  type SRT_ColumnDef,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

export const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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

  const table = useShadcnReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    srtTableBodyRowProps: { className: 'hover:[&>td]:after:bg-transparent' },
    srtTableProps: {
      className:
        'bg-background border border-[rgba(81,81,81,.5)] [&_caption]:caption-top', //change default background color
    },
    srtTableHeadCellProps: {
      className: 'border border-[rgba(81,81,81,.5)] font-normal italic',
    },
    srtTableBodyCellProps: {
      className: 'border border-[rgba(81,81,81,.5)]',
    },
    renderCaption: ({ table }) =>
      `Here is a table rendered with the lighter weight SRT_Table sub-component, rendering ${table.getRowModel().rows.length} rows.`,
  });

  //using SRT_Table instead of ShadcnReactTable if we do not need any of the toolbar components or features
  return <SRT_Table table={table} />;
};

export default Example;
