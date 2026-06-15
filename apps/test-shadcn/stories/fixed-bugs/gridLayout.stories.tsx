import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Fixed Bugs/Grid Layout',
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

// API GAP: MRT's `muiTableBodyCellProps`/`muiTableHeadCellProps` (used here for
// `align: 'center' | 'right'`) are not implemented in SRT. Per-cell alignment
// overrides are unavailable, so these stories only exercise `layoutMode="grid"`.
export const CenterAlignInGridLayoutMode = () => {
  return <ShadcnReactTable columns={columns} data={data} layoutMode="grid" />;
};

export const RightAlignInGridLayoutMode = () => {
  return <ShadcnReactTable columns={columns} data={data} layoutMode="grid" />;
};
