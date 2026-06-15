import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Styling Display Columns',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
];

const data = makeData(21);

// API GAP: displayColumnDefOptions muiTableHeadCellProps/muiTableBodyCellProps sx not supported in SRT (cva variants / className instead).
// Supported sub-options (size, enableColumnActions, enableResizing, enableColumnOrdering) are kept.
export const CustomizeDisplayColumns = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'mrt-row-actions': {
        size: 160,
      },
      'mrt-row-expand': {
        enableColumnActions: true,
        enableResizing: true,
        size: 70,
      },
      'mrt-row-numbers': {
        enableColumnOrdering: true,
      },
    }}
    enableColumnOrdering
    enableColumnResizing
    enableRowActions
    enableRowNumbers
    enableRowSelection
    renderDetailPanel={() => <div>Detail Panel</div>}
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <button
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </button>
        <button
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </button>
      </div>
    )}
  />
);
