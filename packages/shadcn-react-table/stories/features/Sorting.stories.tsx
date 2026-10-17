import { useState } from 'react';
import {
  type SRT_ColumnDef,
  type SRT_SortingState,
} from '@/components/ui/shadcn-react-table';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Sorting Examples',
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

export const SortingEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const DisableSorting = () => (
  <ShadcnReactTable columns={columns} data={data} enableSorting={false} />
);

export const DisableSortingForSpecificColumns = () => (
  <ShadcnReactTable
    columns={[
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
        enableSorting: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableSorting: false,
        header: 'Phone Number',
      },
    ]}
    data={data}
  />
);

export const DisableMultiSorting = () => (
  <ShadcnReactTable columns={columns} data={data} enableMultiSort={false} />
);

export const DisableSortingRemoval = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableSortingRemoval={false}
  />
);

export const SortRanking = () => (
  <ShadcnReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        sortingFn: 'fuzzy',
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
    ]}
    data={data}
    enableRowNumbers
    initialState={{ sorting: [{ desc: false, id: 'firstName' }] }}
  />
);

export const SortingStateManaged = () => {
  const [sorting, setSorting] = useState<SRT_SortingState>([]);
  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      onSortingChange={setSorting}
      state={{ sorting }}
    />
  );
};
