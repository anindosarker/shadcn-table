import { useState } from 'react';
import { Pencil, Share2, Trash2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Row Actions Examples',
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
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(10)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const RowActionsEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <UserCircle /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share2 /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const RowActionsEnabledConditionally = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowActions={enabled}
      renderRowActionMenuItems={({ closeMenu, row }) => [
        <DropdownMenuItem
          key={1}
          onClick={() => {
            console.info('View Profile', row);
            closeMenu();
          }}
        >
          <UserCircle /> View Profile
        </DropdownMenuItem>,
        <DropdownMenuItem
          key={2}
          onClick={() => {
            console.info('Remove', row);
            closeMenu();
          }}
        >
          <Trash2 /> Remove
        </DropdownMenuItem>,
        <DropdownMenuItem
          key={3}
          onClick={() => {
            console.info('Share', row);
            closeMenu();
          }}
        >
          <Share2 /> Share
        </DropdownMenuItem>,
      ]}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnabled(!enabled)}>Toggle Row Actions</Button>
      )}
    />
  );
};

export const RowActionsEnabledConditionallyPerRow = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={({ closeMenu, row }) =>
        row.index % 2 === 0
          ? undefined
          : [
              <DropdownMenuItem
                key={1}
                onClick={() => {
                  console.info('View Profile', row);
                  closeMenu();
                }}
              >
                <UserCircle /> View Profile
              </DropdownMenuItem>,
              <DropdownMenuItem
                key={2}
                onClick={() => {
                  console.info('Remove', row);
                  closeMenu();
                }}
              >
                <Trash2 /> Remove
              </DropdownMenuItem>,
              <DropdownMenuItem
                key={3}
                onClick={() => {
                  console.info('Share', row);
                  closeMenu();
                }}
              >
                <Share2 /> Share
              </DropdownMenuItem>,
            ]
      }
    />
  );
};

export const RowActionsAndEditingEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <UserCircle /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share2 /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const RowActionsAndEditingCellEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableEditing
    enableRowActions
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <UserCircle /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share2 /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const RowActionsLastColumn = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowActions
    initialState={{ density: 'compact' }}
    positionActionsColumn="last"
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key={1}
        onClick={() => {
          console.info('View Profile', row);
          closeMenu();
        }}
      >
        <UserCircle /> View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={2}
        onClick={() => {
          console.info('Remove', row);
          closeMenu();
        }}
      >
        <Trash2 /> Remove
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={3}
        onClick={() => {
          console.info('Share', row);
          closeMenu();
        }}
      >
        <Share2 /> Share
      </DropdownMenuItem>,
    ]}
  />
);

export const CustomRowActionButtons = () => (
  <ShadcnTable
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
  <ShadcnTable
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
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-actions': {
        Cell: ({ row, table }) => (
          <>
            <Button>Custom Row Action</Button>
            <Button size="icon" onClick={() => table.setEditingRow(row)}>
              <Pencil />
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
