import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeNestedData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Sub Row Tree Examples',
};

export default meta;

// API GAP: the RTL examples used MUI's `ThemeProvider` / `useTheme` and the
// `SRT_Localization_HE` locale (not re-exported from the core package's public
// entry). Those are dropped here; RTL direction is applied with `dir="rtl"` on
// the wrapping element and the table is left with its default localization.

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeNestedData(5, 3);

export const SubRowTreeEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} enableExpanding />
);

export const SubRowTreeLayoutGrid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid"
  />
);

export const SubRowTreeLayoutGridNoGrow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid-no-grow"
  />
);

export const SubRowTreeEnabledPositionLast = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    positionExpandColumn="last"
  />
);

export const SubRowTreeEnabledDefaultRTL = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnReactTable columns={columns} data={data} enableExpanding />
  </div>
);

export const SubRowTreeEnabledDefaultRTLAndPositionLast = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableExpanding
      positionActionsColumn="last"
    />
  </div>
);

export const SubRowTreeDisableExpandAll = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpandAll={false}
    enableExpanding
  />
);

export const SubRowTreeFilterFromLeafRows = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    initialState={{ expanded: true, showColumnFilters: true }}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth0 = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth1 = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={1}
  />
);

export const SubRowTreeMaxLeafRowFilterDepthAndFilterFromLeafRows = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeWithSelection = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
  />
);

export const SubRowTreeWithSelectionNoSubRowSelection = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
    enableSubRowSelection={false}
  />
);

export const SubRowTreeWithSingleSelection = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableExpanding
    enableMultiRowSelection={false}
    enablePagination={false}
    enableRowSelection
  />
);
