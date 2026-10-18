import { SquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type ST_ColumnDef,
  ST_ToggleFullScreenButton,
} from '@/components/ui/shadcn-table';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Toolbar Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
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
  <ShadcnTable columns={columns} data={data} enableRowSelection />
);

export const TopToolbarHidden = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const BottomToolbarHidden = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
  />
);

export const NoToolbars = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enableRowSelection
    enableTopToolbar={false}
  />
);

export const HideToolbarInternalActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    enableToolbarInternalActions={false}
  />
);

export const CustomToolbarInternalActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    renderToolbarInternalActions={({ table }) => {
      return (
        <>
          <ST_ToggleFullScreenButton table={table} />
        </>
      );
    }}
  />
);

export const TableTitle = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      return <h4 className="text-3xl font-normal">Table Title</h4>;
    }}
  />
);

export const CustomTopToolbarActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderTopToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const CustomBottomToolbarActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    renderBottomToolbarCustomActions={() => {
      const handleCreateNewUser = () => {
        prompt('Create new user modal');
      };

      return (
        <div>
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const CustomTopToolbarSelectionActions = () => (
  <ShadcnTable
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
  <ShadcnTable
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
  <ShadcnTable
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
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
          <ST_Tooltip title="Remove Users">
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
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const ToolbarAlertBannerBottomWithActionsAlsoBottom = () => (
  <ShadcnTable
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
          <ST_Tooltip title="Create New User">
            <Button onClick={handleCreateNewUser} size="icon" variant="ghost">
              <SquarePlus />
            </Button>
          </ST_Tooltip>
          <ST_Tooltip title="Remove Users">
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
          </ST_Tooltip>
        </div>
      );
    }}
  />
);

export const renderCustomTopToolbar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderTopToolbar={() => <div className="p-8">Custom Top Toolbar</div>}
  />
);

export const renderCustomBottomToolbar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderBottomToolbar={() => <div className="p-8">Custom Bottom Toolbar</div>}
  />
);
