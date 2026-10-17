import { SquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type SRT_ColumnDef,
  SRT_ToggleFullScreenButton,
} from '@/components/ui/shadcn-react-table';
import { SRT_Tooltip } from '@/components/ui/shadcn-react-table/SRT_Tooltip';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
}));

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
    renderToolbarInternalActions={({ table }) => {
      return (
        <>
          <SRT_ToggleFullScreenButton table={table} />
        </>
      );
    }}
  />
);

export const TableTitle = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <h4 className="text-3xl font-normal">Table Title</h4>;
    }}
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
          <SRT_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </SRT_Tooltip>
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
          <SRT_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </SRT_Tooltip>
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
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            variant="destructive"
          >
            Deactivate
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            className="bg-sky-600 text-white hover:bg-sky-700"
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
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleDeactivate}
            variant="destructive"
          >
            Deactivate
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={table.getSelectedRowModel().flatRows.length === 0}
            onClick={handleActivate}
          >
            Activate
          </Button>
          <Button
            className="bg-sky-600 text-white hover:bg-sky-700"
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
          <SRT_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </SRT_Tooltip>
          <SRT_Tooltip title="Remove Users">
            <span>
              <Button
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveUsers}
                size="icon"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </span>
          </SRT_Tooltip>
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
          <SRT_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </SRT_Tooltip>
          <SRT_Tooltip title="Remove Users">
            <span>
              <Button
                disabled={table.getSelectedRowModel().flatRows.length === 0}
                onClick={handleRemoveUsers}
                size="icon"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </span>
          </SRT_Tooltip>
        </div>
      );
    }}
  />
);

export const renderCustomTopToolbar = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderTopToolbar={() => <div className="p-8">Custom Top Toolbar</div>}
  />
);

export const renderCustomBottomToolbar = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => <div className="p-8">Custom Bottom Toolbar</div>}
  />
);
