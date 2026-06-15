import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Header Groups Examples',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
  {
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },

      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
    header: 'Name',
    id: 'name',
  },
  {
    columns: [
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ],
    header: 'Info',
    id: 'info',
  },
];

const data = [...Array(555)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const HeaderGroups = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const HeaderGroupsWithStickyHeader = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const HeaderAndFooterGroups = () => (
  <ShadcnReactTable
    columns={[
      {
        columns: [
          {
            accessorKey: 'firstName',
            footer: 'First Name',
            header: 'First Name',
          },
          {
            accessorKey: 'lastName',
            footer: 'Last Name',
            header: 'Last Name',
          },
        ],
        footer: 'Name',
        header: 'Name',
        id: 'name',
      },
      {
        columns: [
          {
            accessorKey: 'age',
            footer: 'Age',
            header: 'Age',
          },
          {
            accessorKey: 'address',
            footer: 'Address',
            header: 'Address',
          },
        ],
        footer: 'Info',
        header: 'Info',
        id: 'info',
      },
    ]}
    data={data}
    enableColumnPinning
  />
);

export const HeaderGroupsWithColumnOrdering = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnOrdering />
);

export const HeaderGroupsWithColumnPinning = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnPinning />
);

export const HeaderGroupsWithColumResizing = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnResizing
    enableRowSelection
  />
);

export const HeaderGroupsWithColumResizingGrid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnResizing
    layoutMode="grid"
  />
);

export const HeaderGroupsWithSemanticColumResizing = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnResizing
    layoutMode="semantic"
  />
);

export const MixedHeaderGroups = () => {
  return (
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
          columns: [
            {
              accessorKey: 'address',
              header: 'Address',
            },
          ],
          header: 'Grouped',
          id: 'grouped',
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
    />
  );
};

export const DeepMixedHeaderGroups = () => {
  return (
    <ShadcnReactTable
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          columns: [
            {
              columns: [
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
              ],
              header: 'Location',
              id: 'location',
            },
          ],
          header: 'Grouped',
          id: 'grouped',
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
      ]}
      data={data}
    />
  );
};

export const HeaderGroupsWithRowVirtualization = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowVirtualization
  />
);

export const HeaderGroupsWithColumnVirtualization = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnVirtualization />
);
