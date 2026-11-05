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
import {
  Building2Icon,
  Mail,
  MapIcon,
  MapPinIcon,
  UserIcon,
  UserX,
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
