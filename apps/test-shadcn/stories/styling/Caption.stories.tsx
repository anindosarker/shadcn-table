import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Caption Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(25);

export const BottomCaption = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderCaption={() => 'Table Caption'}
  />
);

// API GAP: muiTableProps sx (caption captionSide: 'top') not supported in SRT (cva variants / className instead)
export const TopCaption = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderCaption={() => 'Table Caption'}
  />
);
