import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { Button } from '@/components/ui/button';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Row Pinning Examples',
};

export default meta;

// API GAP: MRT set a scroll container max-height via
// `muiTableContainerProps={{ sx: { maxHeight: '600px' } }}` and per-row height
// via `muiTableBodyRowProps`. SRT has not implemented those MUI props, so the
// max-height/row-height styling is dropped here; the row-pinning behaviour
// (sticky/top/bottom/select modes) is preserved.

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email Address' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'state', header: 'State' },
];

const data = makeData(50);

export const RowPinningStickyDefaultEnabled = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowPinning />
);

export const RowPinningEnabledConditionally = () => {
  const [enableRowPinning, setEnableRowPinning] = useState(false);
  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableRowPinning={enableRowPinning}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowPinning(!enableRowPinning)}>
          Toggle Row Pinning
        </Button>
      )}
    />
  );
};

export const RowPinningStickyNoPagination = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
  />
);

export const RowPinningStickyCustomRowHeight = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    rowPinningDisplayMode="sticky"
  />
);

export const RowPinningSelectStickyMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    rowPinningDisplayMode="select-sticky"
  />
);

export const RowPinningTopAndBottomMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    rowPinningDisplayMode="top-and-bottom"
  />
);

export const RowPinningTopMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    keepPinnedRows={false}
    rowPinningDisplayMode="top"
  />
);

export const RowPinningSelectTopMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    rowPinningDisplayMode="select-top"
  />
);

export const RowPinningBottomMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    rowPinningDisplayMode="bottom"
  />
);

export const RowPinningSelectBottomMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    rowPinningDisplayMode="select-bottom"
  />
);

export const RowPinningWithStickyHeader = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableStickyFooter
    enableStickyHeader
  />
);

export const RowPinningWithGridLayout = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    layoutMode="grid"
  />
);

export const RowPinningStickyWithVirtualization = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
  />
);

export const RowPinningTopWithVirtualization = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    rowPinningDisplayMode="top"
  />
);

export const RowAndColumnPinning = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnPinning
    enablePagination={false}
    enableRowPinning
    initialState={{
      columnPinning: {
        left: ['firstName'],
        right: ['lastName'],
      },
      rowPinning: {
        top: ['3', '5'],
      },
    }}
  />
);
