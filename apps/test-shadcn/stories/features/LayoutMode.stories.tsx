import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Layout Mode Examples',
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

export const DefaultSemantic = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableRowSelection
    layoutMode="semantic"
  />
);

export const Grid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableRowSelection
    layoutMode="grid"
  />
);

export const GridNoGrow = () => (
  <ShadcnReactTable
    columns={columns.slice(0, 2)}
    data={data}
    enableColumnOrdering
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

export const GridWithResizing = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableColumnResizing
    enableRowSelection
    layoutMode="grid"
  />
);

export const GridNoGrowWithResizing = () => (
  <ShadcnReactTable
    columns={columns.slice(0, 2)}
    data={data}
    enableColumnOrdering
    enableColumnResizing
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);
