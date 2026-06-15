import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import { Mail, UserX } from 'lucide-react';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { SRT_ActionMenuItem } from '@/components/ui/shadcn-react-table/menus/SRT_ActionMenuItem';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Cell Action Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
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
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = makeData(100);

export const CellActionsEnabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableCellActions
    enableClickToCopy="context-menu"
  />
);

export const CellActionsEnabledConditionally = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableCellActions={(cell) => cell.row.index % 2 === 0}
    enableClickToCopy="context-menu"
  />
);

export const CellActionsEnabledCustom = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableCellActions
    renderCellActionMenuItems={({ closeMenu, table }) => [
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
    ]}
  />
);

export const CellActionsWithClickToCopy = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableCellActions
    enableClickToCopy
    renderCellActionMenuItems={({ closeMenu, table }) => [
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
    ]}
  />
);

export const CellActionsWithBuiltIns = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableCellActions
    enableClickToCopy="context-menu"
    enableEditing
    renderCellActionMenuItems={({ closeMenu, internalMenuItems, table }) => [
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
    ]}
  />
);
