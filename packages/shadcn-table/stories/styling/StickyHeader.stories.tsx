import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  parameters: {
    status: {
      type: 'stable',
    },
  },
  title: 'Styling/Sticky Header Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
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
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const StickyHeaderDisabledDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const EnableStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const StickyHeaderShorterTable = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableRowSelection
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

const columnsWithFooters: ST_ColumnDef<(typeof data)[0]>[] = [
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

export const disableStickyFooter = () => (
  <ShadcnTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter={false}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

export const enableStickyFooter = () => (
  <ShadcnTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);
