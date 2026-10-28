'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  ST_ActionMenuItem,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Mail, UserX } from 'lucide-react';

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
    data,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'cell',
    renderCellActionMenuItems: ({ closeMenu, internalMenuItems }) => [
      ...internalMenuItems,
      <DropdownMenuSeparator key="divider" />,
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
      />,
    ],
  });

  return <ShadcnTable table={table} />;
};

export default Example;
