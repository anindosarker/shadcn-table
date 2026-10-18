'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  SRT_ActionMenuItem,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Mail, UserX } from 'lucide-react';

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
    data,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'cell',
    renderCellActionMenuItems: ({ closeMenu, table, internalMenuItems }) => [
      ...internalMenuItems,
      <DropdownMenuSeparator key="divider" />,
      <SRT_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
        table={table}
      />,
      <SRT_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
        table={table}
      />,
    ],
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
