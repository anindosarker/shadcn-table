'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        enableColumnPinning: false, //disable column pinning for this column
        header: 'ID',
        size: 50,
      },
      //column definitions...
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 300,
      },
      //end
      {
        accessorKey: 'city', //this column gets pinned to the right by default because of the initial state,
        header: 'City',
      },
      {
        accessorKey: 'state', //this column gets pinned left by default because of the the initial state,
        header: 'State',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableColumnPinning: true,
    enableRowActions: true,
    layoutMode: 'grid-no-grow', //constant column widths
    renderRowActionMenuItems: () => [
      <DropdownMenuItem key="action">Action</DropdownMenuItem>,
    ],
    initialState: {
      columnPinning: { left: ['st-row-actions', 'state'], right: ['city'] },
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
