'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

const Example = () => {
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
    data,
    defaultDisplayColumn: {
      enableResizing: true, //turn on some features that are usually off for all display columns
    },
    displayColumnDefOptions: {
      'srt-row-actions': {
        size: 350, //set custom width
        srtTableHeadCellProps: {
          align: 'center', //change head cell props
        },
      },
      'srt-row-numbers': {
        enableColumnDragging: true,
        enableColumnOrdering: true, //turn on some features that are usually off
        enableResizing: true,
        srtTableHeadCellProps: {
          className: 'text-[1.2rem]',
        },
      },
      'srt-row-select': {
        enableColumnActions: true,
        enableHiding: true,
        size: 100,
      },
    },
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowNumbers: true,
    enableRowSelection: true,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <div className="flex gap-4">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </div>
    ),
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
