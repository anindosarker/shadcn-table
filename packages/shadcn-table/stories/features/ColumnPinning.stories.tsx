import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Column Pinning Examples',
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
    accessorKey: 'email',
    header: 'Email Address',
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

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const ColumnPinningEnabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnPinning />
);

export const ColumnPinningInitial = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    initialState={{ columnPinning: { start: ['email'], end: ['state'] } }}
  />
);

export const ColumnPinningDisabledPerColumn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        enablePinning: false,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
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
    ]}
    data={data}
    enableColumnPinning
  />
);

export const ColumnPinningWithSelect = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableRowSelection
  />
);

export const ColumnPinningWithDetailPanel = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableExpanding
    renderDetailPanel={() => <h1>Hi</h1>}
  />
);
