import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { faker } from '@faker-js/faker';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Styling/Table Alignment Examples',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
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
  {
    accessorKey: 'state',
    footer: 'State',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
  },
];

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int({ max: 60, min: 20 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const DefaultLeft = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const DefaultLeftGrid = () => (
  <ShadcnReactTable columns={columns} data={data} layoutMode="grid" />
);

export const RightCells = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'right',
      },
      srtTableFooterCellProps: {
        align: 'right',
      },
      srtTableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const RightCellsGrid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    layoutMode="grid"
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'right',
      },
      srtTableFooterCellProps: {
        align: 'right',
      },
      srtTableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const CenterCells = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'center',
      },
      srtTableFooterCellProps: {
        align: 'center',
      },
      srtTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsGrid = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    layoutMode="grid"
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'center',
      },
      srtTableFooterCellProps: {
        align: 'center',
      },
      srtTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsWithGrabHandle = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnDragging
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'center',
      },
      srtTableFooterCellProps: {
        align: 'center',
      },
      srtTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsWithGrabHandleNoSorting = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnDragging
    enableSorting={false}
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'center',
      },
      srtTableFooterCellProps: {
        align: 'center',
      },
      srtTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsNoColumnActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableColumnActions={false}
    defaultColumn={{
      srtTableBodyCellProps: {
        align: 'center',
      },
      srtTableFooterCellProps: {
        align: 'center',
      },
      srtTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const RightAlignNumberColumn = () => (
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
        accessorKey: 'age',
        header: 'Age',
        srtTableBodyCellProps: {
          align: 'right',
        },
        srtTableHeadCellProps: {
          align: 'right',
        },
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
  />
);
