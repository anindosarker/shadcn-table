import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  parameters: {
    status: {
      type: 'stable',
    },
  },
  title: 'Styling/Sticky Header Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(100);

export const StickyHeaderDisabledDefault = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const EnableStickyHeader = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

// API GAP: muiTableContainerProps sx (maxHeight) not supported in SRT (cva variants / className instead); enableStickyHeader is supported
export const StickyHeaderShorterTable = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableRowSelection
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

const columnsWithFooters: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', footer: 'First Name', header: 'First Name' },
  { accessorKey: 'lastName', footer: 'Last Name', header: 'Last Name' },
  { accessorKey: 'address', footer: 'Address', header: 'Address' },
  { accessorKey: 'state', footer: 'State', header: 'State' },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
  },
];

// API GAP: muiTableContainerProps sx (maxHeight) not supported in SRT (cva variants / className instead); enableStickyFooter/Header supported
export const disableStickyFooter = () => (
  <ShadcnReactTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter={false}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

// API GAP: muiTableContainerProps sx (maxHeight) not supported in SRT (cva variants / className instead); enableStickyFooter/Header supported
export const enableStickyFooter = () => (
  <ShadcnReactTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);
