'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  ST_ActionMenuItem,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Pencil, Trash2 } from 'lucide-react';

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

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={({ row, table }) => [
        <ST_ActionMenuItem //or just use a normal shadcn DropdownMenuItem component
          icon={<Pencil />}
          key="edit"
          label="Edit"
          onClick={() => console.info('Edit')}
          table={table}
        />,
        <ST_ActionMenuItem
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
