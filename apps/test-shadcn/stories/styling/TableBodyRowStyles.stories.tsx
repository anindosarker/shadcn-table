import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Style Table Body Rows',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
];

const data = makeData(21);

export const DefaultTableBodyRowStyles = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableBodyRowProps (hover toggle) not supported in SRT (cva variants / className instead)
export const DisableRowHoverEffect = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableBodyRowProps sx (backgroundColor/borderRight) not supported in SRT (cva variants / className instead)
export const StyleMuiTableBodyRow = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableBodyProps sx (striped rows) and muiTableBodyCellProps sx (border) not supported in SRT (cva variants / className instead)
export const StyleCustomStripedRows = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

// API GAP: muiTableBodyProps sx (striped rows) and muiTableBodyCellProps sx (border) not supported in SRT (cva variants / className instead); renderDetailPanel is supported
export const StyleCustomStripedRowsDetailPanel = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderDetailPanel={() => <div>Detail Panel</div>}
  />
);

// API GAP: muiTableBodyRowProps sx (conditional row styling by value) not supported in SRT (cva variants / className instead)
export const ConditionallyStyleMuiTableRow = () => (
  <ShadcnReactTable columns={columns} data={data} />
);
