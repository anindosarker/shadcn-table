import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Column Action Examples',
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

export const ColumnActionsEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const ColumnActionsDisabled = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnActions={false} />
);

export const ColumnActionsDisabledPerColumn = () => (
  <ShadcnReactTable
    columns={[
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
        enableColumnActions: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        enableColumnActions: false,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: false,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);

export const ColumnActionsEnabledPerColumn = () => (
  <ShadcnReactTable
    columns={[
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
        enableColumnActions: true,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
      },
    ]}
    data={data}
    enableColumnActions={false}
  />
);

export const CustomColumnActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderColumnActionsMenuItems={() => [
      <DropdownMenuItem key={1}>Item 1</DropdownMenuItem>,
      <DropdownMenuItem key={2}>Item 2</DropdownMenuItem>,
    ]}
  />
);

export const CustomColumnActionsPerColumn = () => (
  <ShadcnReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        renderColumnActionsMenuItems: () => [
          <DropdownMenuItem key={1}>Item 1</DropdownMenuItem>,
          <DropdownMenuItem key={2}>Item 2</DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        renderColumnActionsMenuItems: () => [
          <DropdownMenuItem key={1}>Item 2</DropdownMenuItem>,
          <DropdownMenuItem key={3}>Item 3</DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'address',
        enableColumnActions: true,
        header: 'Address',
        renderColumnActionsMenuItems: ({ internalColumnMenuItems }) => [
          ...internalColumnMenuItems,
          <DropdownMenuSeparator key={3332} />,
          <DropdownMenuItem key={3333}>Item 1</DropdownMenuItem>,
          <DropdownMenuItem key={3334}>Item 2</DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);
