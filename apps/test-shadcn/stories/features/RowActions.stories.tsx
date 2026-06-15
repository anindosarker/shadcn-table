import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { Pencil, Share2, Trash2, UserCircle } from 'lucide-react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { Button } from '@/components/ui/button';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Row Actions Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(10);

// MRT used MUI <MenuItem>; SRT renders these inside its own menu, so plain
// buttons styled as menu items are used here with lucide icons.
const menuItems = ({
  closeMenu,
  row,
}: {
  closeMenu: () => void;
  row: { index: number };
}) => [
  <button
    key={1}
    className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
    onClick={() => {
      console.info('View Profile', row);
      closeMenu();
    }}
  >
    <UserCircle size={16} /> View Profile
  </button>,
  <button
    key={2}
    className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
    onClick={() => {
      console.info('Remove', row);
      closeMenu();
    }}
  >
    <Trash2 size={16} /> Remove
  </button>,
  <button
    key={3}
    className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
    onClick={() => {
      console.info('Share', row);
      closeMenu();
    }}
  >
    <Share2 size={16} /> Share
  </button>,
];

export const RowActionsEnabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActionMenuItems={menuItems}
  />
);

export const RowActionsEnabledConditionally = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableRowActions={enabled}
      renderRowActionMenuItems={menuItems}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnabled(!enabled)}>Toggle Row Actions</Button>
      )}
    />
  );
};

export const RowActionsEnabledConditionallyPerRow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) =>
      row.index % 2 === 0 ? undefined : menuItems({ closeMenu, row })
    }
  />
);

export const RowActionsAndEditingEnabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableEditing
    enableRowActions
    renderRowActionMenuItems={menuItems}
  />
);

export const RowActionsAndEditingCellEnabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableEditing
    enableRowActions
    renderRowActionMenuItems={menuItems}
  />
);

export const RowActionsLastColumn = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowActions
    initialState={{ density: 'compact' }}
    positionActionsColumn="last"
    renderRowActionMenuItems={menuItems}
  />
);

export const CustomRowActionButtons = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </Button>
      </div>
    )}
  />
);

export const CustomRowActionButtonsLastColumn = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowActions
    positionActionsColumn="last"
    renderRowActions={({ row }) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
        <Button
          onClick={() => {
            console.info('View Profile', row);
          }}
        >
          View
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.info('Remove', row);
          }}
        >
          Remove
        </Button>
      </div>
    )}
  />
);

export const RowActionsCompleteOverride = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'mrt-row-actions': {
        Cell: ({ row, table }) => (
          <>
            <Button>Custom Row Action</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.setEditingRow(row)}
            >
              <Pencil size={16} />
            </Button>
          </>
        ),
        size: 300,
      },
    }}
    editDisplayMode="row"
    enableEditing
    enableRowActions
  />
);
