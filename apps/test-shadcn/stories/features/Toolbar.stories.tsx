import { type Meta } from '@storybook/react';
import { PlusSquare, Trash2 } from 'lucide-react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { SRT_ToggleFullScreenButton } from '@/components/ui/shadcn-react-table/buttons/SRT_ToggleFullScreenButton';
import { Button } from '@/components/ui/button';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(5);

export const ToolbarEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
  />
);

export const NoToolbars = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const HideToolbarInternalActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const CustomToolbarInternalActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    renderToolbarInternalActions={({ table }) => (
      <>
        <SRT_ToggleFullScreenButton table={table} />
      </>
    )}
  />
);

export const TableTitle = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => (
      <h4 className="text-2xl font-semibold">Table Title</h4>
    )}
  />
);

export const CustomTopToolbarActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <Button
            variant="ghost"
            size="icon"
            title="Create New User"
            onClick={handleCreateNewUser}
          >
            <PlusSquare size={18} />
          </Button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <Button
            variant="ghost"
            size="icon"
            title="Create New User"
            onClick={handleCreateNewUser}
          >
            <PlusSquare size={18} />
          </Button>
        </div>
      );
    }}
  />
);

export const CustomTopToolbarSelectionActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="destructive"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarSelectionActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.original.firstName);
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.original.firstName);
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.original.firstName);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="destructive"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
          >
            Deactivate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleContact}
          >
            Contact
          </Button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottom = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderTopToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div>
          <Button
            variant="ghost"
            size="icon"
            title="Create New User"
            onClick={handleCreateNewUser}
          >
            <PlusSquare size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Remove Users"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleRemoveUsers}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
    renderBottomToolbarCustomActions={({ table }) => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };
      const handleRemoveUsers = () => {
        confirm('Are you sure you want to remove the selected users?');
      };

      return (
        <div>
          <Button
            variant="ghost"
            size="icon"
            title="Create New User"
            onClick={handleCreateNewUser}
          >
            <PlusSquare size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Remove Users"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleRemoveUsers}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      );
    }}
  />
);

export const renderCustomTopToolbar = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderTopToolbar={() => (
      <div style={{ padding: '2rem' }}>Custom Top Toolbar</div>
    )}
  />
);

export const renderCustomBottomToolbar = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => (
      <div style={{ padding: '2rem' }}>Custom Bottom Toolbar</div>
    )}
  />
);
