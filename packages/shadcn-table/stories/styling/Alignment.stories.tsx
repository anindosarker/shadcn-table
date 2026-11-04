import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  CakeIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Styling/Table Alignment Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    footer: 'First Name',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    footer: 'Last Name',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'age',
    footer: 'Age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    footer: 'Address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    footer: 'State',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
    icon: PhoneIcon,
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

export const DefaultLeft = () => <ShadcnTable columns={columns} data={data} />;

export const DefaultLeftGrid = () => (
  <ShadcnTable columns={columns} data={data} layoutMode="grid" />
);

export const RightCells = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'right',
      },
      stTableFooterCellProps: {
        align: 'right',
      },
      stTableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const RightCellsGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    layoutMode="grid"
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'right',
      },
      stTableFooterCellProps: {
        align: 'right',
      },
      stTableHeadCellProps: {
        align: 'right',
      },
    }}
  />
);

export const CenterCells = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'center',
      },
      stTableFooterCellProps: {
        align: 'center',
      },
      stTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    layoutMode="grid"
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'center',
      },
      stTableFooterCellProps: {
        align: 'center',
      },
      stTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsWithGrabHandle = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnDragging
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'center',
      },
      stTableFooterCellProps: {
        align: 'center',
      },
      stTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsWithGrabHandleNoSorting = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnDragging
    enableSorting={false}
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'center',
      },
      stTableFooterCellProps: {
        align: 'center',
      },
      stTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const CenterCellsNoColumnActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnActions={false}
    defaultColumn={{
      stTableBodyCellProps: {
        align: 'center',
      },
      stTableFooterCellProps: {
        align: 'center',
      },
      stTableHeadCellProps: {
        align: 'center',
      },
    }}
  />
);

export const RightAlignNumberColumn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        stTableBodyCellProps: {
          align: 'right',
        },
        stTableHeadCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);
