'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        renderColumnActionsMenuItems: ({ closeMenu }) => [
          <DropdownMenuItem
            key={1}
            onClick={() => {
              console.log('Item 1 clicked');
              closeMenu();
            }}
          >
            Item 1
          </DropdownMenuItem>,
          <DropdownMenuItem
            key={2}
            onClick={() => {
              console.log('Item 2 clicked');
              closeMenu();
            }}
          >
            Item 2
          </DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        renderColumnActionsMenuItems: ({
          closeMenu,
          internalColumnMenuItems,
        }) => [
          ...internalColumnMenuItems,
          <DropdownMenuSeparator key="divider-1" />,
          <DropdownMenuItem
            key={'item-1'}
            onClick={() => {
              console.log('Item 1 clicked');
              closeMenu();
            }}
          >
            Item 1
          </DropdownMenuItem>,
          <DropdownMenuItem
            key={'item-2'}
            onClick={() => {
              console.log('Item 2 clicked');
              closeMenu();
            }}
          >
            Item 2
          </DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        renderColumnActionsMenuItems: ({
          closeMenu,
          internalColumnMenuItems,
        }) => [
          <DropdownMenuItem
            key={'item-1'}
            onClick={() => {
              console.log('Item 1 clicked');
              closeMenu();
            }}
          >
            Item 1
          </DropdownMenuItem>,
          <DropdownMenuItem
            key={'item-2'}
            onClick={() => {
              console.log('Item 2 clicked');
              closeMenu();
            }}
          >
            Item 2
          </DropdownMenuItem>,
          <DropdownMenuSeparator key="divider-1" />,
          ...internalColumnMenuItems.splice(0, 3),
        ],
      },
    ],
    [],
  );

  const table = useShadcnReactTable({
    columns,
    data,
    //or you could define the menu items here for all columns
    // renderColumnActionsMenuItems: ({ closeMenu }) => [],
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
