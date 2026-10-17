import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Layout Mode Examples',
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

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const DefaultSemantic = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableRowSelection
    layoutMode="semantic"
  />
);

export const Grid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableRowSelection
    layoutMode="grid"
  />
);

export const GridNoGrow = () => (
  <ShadcnReactTable
    columns={columns.slice(0, 2)}
    data={data}
    enableColumnOrdering
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

export const GridWithResizing = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableColumnResizing
    enableRowSelection
    layoutMode="grid"
  />
);

export const GridNoGrowWithResizing = () => (
  <ShadcnReactTable
    columns={columns.slice(0, 2)}
    data={data}
    enableColumnOrdering
    enableColumnResizing
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);
