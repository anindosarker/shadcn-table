'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const Example = () => {
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
    data,
    defaultDisplayColumn: {
      enableResizing: true, //turn on some features that are usually off for all display columns
    },
    displayColumnDefOptions: {
      'st-row-actions': {
        size: 350, //set custom width
        stTableHeadCellProps: {
          align: 'center', //change head cell props
        },
      },
      'st-row-numbers': {
        enableColumnDragging: true,
        enableColumnOrdering: true, //turn on some features that are usually off
        enableResizing: true,
        stTableHeadCellProps: {
          className: 'text-[1.2rem]',
        },
      },
      'st-row-select': {
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

  return <ShadcnTable table={table} />;
};

export default Example;
