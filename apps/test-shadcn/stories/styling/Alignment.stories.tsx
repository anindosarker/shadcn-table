import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Table Alignment Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', footer: 'First Name', header: 'First Name' },
  { accessorKey: 'lastName', footer: 'Last Name', header: 'Last Name' },
  { accessorKey: 'age', footer: 'Age', header: 'Age' },
  { accessorKey: 'address', footer: 'Address', header: 'Address' },
  { accessorKey: 'state', footer: 'State', header: 'State' },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
  },
];

const data = makeData(25);

export const DefaultLeft = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const DefaultLeftGrid = () => (
  <ShadcnReactTable columns={columns} data={data} layoutMode="grid" />
);

// API GAP: defaultColumn.muiTableBodyCellProps/muiTableHeadCellProps/muiTableFooterCellProps `align` not supported in SRT (cva variants / className instead)
export const RightCells = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: defaultColumn.muiTable*CellProps `align` not supported in SRT (cva variants / className instead)
export const RightCellsGrid = () => (
  <ShadcnReactTable columns={columns} data={data} layoutMode="grid" />
);

// API GAP: defaultColumn.muiTable*CellProps `align` not supported in SRT (cva variants / className instead)
export const CenterCells = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: defaultColumn.muiTable*CellProps `align` not supported in SRT (cva variants / className instead)
export const CenterCellsGrid = () => (
  <ShadcnReactTable columns={columns} data={data} layoutMode="grid" />
);

// API GAP: defaultColumn.muiTable*CellProps `align` not supported in SRT (cva variants / className instead)
export const CenterCellsWithGrabHandle = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnDragging />
);

// API GAP: defaultColumn.muiTable*CellProps `align` not supported in SRT (cva variants / className instead)
export const CenterCellsWithGrabHandleNoSorting = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnDragging
    enableSorting={false}
  />
);

// API GAP: defaultColumn.muiTable*CellProps `align` not supported in SRT (cva variants / className instead)
export const CenterCellsNoColumnActions = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnActions={false} />
);

// API GAP: column-level muiTableBodyCellProps/muiTableHeadCellProps `align` not supported in SRT (cva variants / className instead)
export const RightAlignNumberColumn = () => (
  <ShadcnReactTable
    columns={[
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'age', header: 'Age' },
      { accessorKey: 'address', header: 'Address' },
      { accessorKey: 'state', header: 'State' },
      { accessorKey: 'phoneNumber', header: 'Phone Number' },
    ]}
    data={data}
  />
);
