import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Table Dimensions Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(25);

// API GAP: muiTablePaperProps sx (m: auto, maxWidth) not supported in SRT (cva variants / className instead)
export const MaxWidthAndCentered = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableContainerProps sx (maxHeight) not supported in SRT (cva variants / className instead)
export const maxHeight = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableContainerProps sx (minHeight) not supported in SRT (cva variants / className instead)
export const minHeight = () => (
  <ShadcnReactTable columns={columns} data={data.slice(0, 5)} />
);

// API GAP: muiTableContainerProps sx + table.refs height calc and muiTablePaperProps sx height not supported in SRT (cva variants / className instead)
export const minHeightParent = () => (
  <div style={{ height: '700px' }}>
    <ShadcnReactTable columns={columns} data={data.slice(0, 5)} />
  </div>
);

// API GAP: muiTableContainerProps sx + table.refs height calc and muiTablePaperProps sx height not supported in SRT (cva variants / className instead)
export const ContainerHeight = () => (
  <div style={{ height: '300px' }}>
    <ShadcnReactTable columns={columns} data={data} />
  </div>
);
