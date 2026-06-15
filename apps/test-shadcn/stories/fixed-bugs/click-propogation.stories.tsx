import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Fixed Bugs/Click Propagation',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: SRT_ColumnDef<Person>[] = [
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
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
];

const data = [...Array(6)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

// API GAP: MRT's `muiTableBodyRowProps={{ onClick }}` (the row-level click
// handler this regression checks against action-cell clicks) is not implemented
// in SRT — there is no per-row props passthrough. The stories still exercise the
// action menu/button rendering with a plain <button> using stopPropagation.
export const RowClickAndRowMenuActions = () => {
  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      renderRowActionMenuItems={() => [<div key="test">Test</div>]}
    />
  );
};

export const RowClickAndRowButtonActions = () => {
  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      renderRowActions={() => (
        <button type="button" onClick={(e) => e.stopPropagation()}>
          Test
        </button>
      )}
    />
  );
};
