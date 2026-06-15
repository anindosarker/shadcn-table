import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Style Table Head Cells',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
];

const data = makeData(21);

export const DefaultTableHeadCellStyles = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableHeadCellProps sx (sort icon color) not supported in SRT (cva variants / className instead)
export const ColorSortIcon = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableHeadCellProps sx (background/border/theme color) not supported in SRT (cva variants / className instead)
export const StyleAllMuiTableHeadCell = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: column-level muiTableHeadCellProps sx (per-column color) not supported in SRT (cva variants / className instead)
export const StyleTableHeadCellsIndividually = () => (
  <ShadcnReactTable
    columns={[
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'age', header: 'Age' },
      { accessorKey: 'address', header: 'Address' },
    ]}
    data={data}
  />
);

export const CustomHeadCellRenders = () => (
  <ShadcnReactTable
    columns={[
      {
        Header: <em>First Name</em>,
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        Header: () => <em>Last Name</em>,
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        Header: ({ column }) => <div>{column.columnDef.header}</div>,
        accessorKey: 'age',
        header: 'Current Age',
      },
      {
        accessorKey: 'address',
        header: 'Address of Residence (Permanent)',
      },
    ]}
    data={data}
    enableColumnResizing
  />
);
