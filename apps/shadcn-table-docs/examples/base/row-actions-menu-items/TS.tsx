'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  ST_ActionMenuItem,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import {
  Building2Icon,
  MapIcon,
  MapPinIcon,
  Pencil,
  Trash2,
  UserIcon,
} from 'lucide-react';

export const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        icon: MapPinIcon,
        header: 'Address',
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
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
      renderRowActionMenuItems={({ row }) => [
        <ST_ActionMenuItem //or just use a normal shadcn DropdownMenuItem component
          icon={<Pencil />}
          key="edit"
          label="Edit"
          onClick={() => console.info('Edit')}
        />,
        <ST_ActionMenuItem
          icon={<Trash2 />}
          key="delete"
          label="Delete"
          onClick={() => console.info('Delete')}
        />,
      ]}
    />
  );
};

export default Example;
