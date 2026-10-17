'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  SRT_ActionMenuItem,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';
import { Pencil, Trash2 } from 'lucide-react';

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

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={({ row, table }) => [
        <SRT_ActionMenuItem //or just use a normal shadcn DropdownMenuItem component
          icon={<Pencil />}
          key="edit"
          label="Edit"
          onClick={() => console.info('Edit')}
          table={table}
        />,
        <SRT_ActionMenuItem
          icon={<Trash2 />}
          key="delete"
          label="Delete"
          onClick={() => console.info('Delete')}
          table={table}
        />,
      ]}
    />
  );
};

export default Example;
