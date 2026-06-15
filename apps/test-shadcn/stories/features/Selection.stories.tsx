import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { Minus, Send } from 'lucide-react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { SRT_SelectCheckbox } from '@/components/ui/shadcn-react-table/inputs/SRT_SelectCheckbox';
import { Button } from '@/components/ui/button';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Selection Examples',
};

export default meta;

// API GAP: several MRT examples wired row-click selection through
// `muiTableBodyRowProps` (onClick) and styled checkboxes via
// `muiSelectCheckboxProps` / `muiSelectAllCheckboxProps` /
// `muiToolbarAlertBannerProps`. SRT has not implemented those MUI props, so the
// row-click handlers and checkbox color overrides are dropped; the underlying
// selection features (enableRowSelection, selectAllMode, single/multi, alert
// banner positions, conditional selection) are preserved.

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
];

const data = makeData(15);

export const SelectionEnabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
  />
);

export const DisableSelectAll = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableSelectAll={false}
    enableRowSelection
  />
);

export const SelectionEnabledGrid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
    layoutMode="grid"
  />
);

export const SelectionEnabledGridNoGrow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

export const BatchSelectionDisabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableBatchRowSelection={false}
    enableRowNumbers
    enableRowSelection
  />
);

export const SelectionEnabledConditionally = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
  />
);

export const SelectionEnabledConditionallyWithInitial = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    initialState={{
      rowSelection: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
      },
    }}
  />
);

export const SelectionEnabledWithRowClick = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);

export const ManualSelection = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  console.info(rowSelection);

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      onRowSelectionChange={setRowSelection}
      state={{ rowSelection }}
    />
  );
};

export const SelectAllModeAll = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    selectAllMode="all"
  />
);

export const SelectAllModeAllConditionally = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    selectAllMode="all"
  />
);

export const SelectAllModePage = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    selectAllMode="page"
  />
);

export const SelectAllDisabledCustomHeader = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'mrt-row-select': { header: 'Your Custom Header' },
    }}
    enableRowSelection
    enableSelectAll={false}
  />
);

export const SingleSelectionRadio = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
  />
);

export const SingleSelectionRadioWithRowClick = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
  />
);

export const SelectCheckboxSecondaryColor = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);

export const AlertBannerBottom = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
  />
);

export const AlertBannerHeadOverlay = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="head-overlay"
  />
);

export const CustomAlertBannerHeadOverlay = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="head-overlay"
    renderToolbarAlertBannerContent={({ selectedAlert, table }) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '6px',
            padding: '4px 12px',
            width: '100%',
          }}
        >
          <SRT_SelectCheckbox table={table} /> {selectedAlert}{' '}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button>
            <Send size={16} /> Email
          </Button>
          <Button variant="destructive">
            <Minus size={16} /> Remove
          </Button>
        </div>
      </div>
    )}
  />
);

export const MultiSelectRowWithHoldShift = () => {
  // API GAP: the original used `muiSelectCheckboxProps` /
  // `muiSelectAllCheckboxProps` / `muiTableBodyRowProps` onClick handlers to
  // implement shift-click range selection. SRT has not implemented those MUI
  // props, so the shift-select wiring is dropped; standard virtualized
  // selection is shown instead.
  const table = useShadcnReactTable({
    columns,
    data,
    enablePagination: false,
    enableRowSelection: (row) => row.original.age > 10,
    enableRowVirtualization: true,
    getRowId: (row) => row.firstName,
  });

  return <ShadcnReactTable table={table} />;
};
