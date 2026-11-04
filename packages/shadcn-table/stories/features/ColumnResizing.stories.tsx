import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  CakeIcon,
  HashIcon,
  MailboxIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Resizing Examples',
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
    accessorKey: 'zipCode',
    header: 'Zip Code',
    icon: MailboxIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(88)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  id: faker.number.int(100),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
  zipCode: faker.location.zipCode(),
}));

export const ColumnResizingEnabledDefaultOnChange = () => (
  <ShadcnTable columns={columns} data={data} />
);

// Resizing is on by default; `false` removes the resize handles.
export const ColumnResizingDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnResizing={false} />
);

export const ColumnResizingEnabledDefaultOnChangeRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable columnResizeDirection="rtl" columns={columns} data={data} />
  </div>
);

export const ColumnResizingEnabledDefaultOnChangeGrid = () => (
  <ShadcnTable columns={columns} data={data} layoutMode="grid" />
);

export const ColumnResizingDefaultOnChangeGridWithIndividualShrink = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        grow: false,
        header: 'ID',
        icon: HashIcon,
        size: 50,
      },
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
    ]}
    data={data}
    layoutMode="grid"
  />
);

export const ColumnResizingEnabledDefaultOnChangeGridRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columns={columns}
      data={data}
      layoutMode="grid"
    />
  </div>
);

export const ColumnResizingEnabledDefaultOnChangeSemantic = () => (
  <ShadcnTable columns={columns} data={data} layoutMode="semantic" />
);

export const ColumnResizingEnabledDefaultOnChangeSemanticRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columns={columns}
      data={data}
      layoutMode="semantic"
    />
  </div>
);

export const ColumnResizingEnabledNoColumnActions = () => (
  <ShadcnTable columns={columns} data={data} enableColumnActions={false} />
);

export const ColumnResizingDisabledSomeColumns = () => (
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
        accessorKey: 'zipCode',
        enableResizing: false,
        header: 'Zip Code',
        icon: MailboxIcon,
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

export const ColumnResizingEnabledOnEnd = () => (
  <ShadcnTable columnResizeMode="onEnd" columns={columns} data={data} />
);

export const ColumnResizingEnabledOnEndRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columnResizeMode="onEnd"
      columns={columns}
      data={data}
    />
  </div>
);

export const ColumnResizingCustomDefaultWidths = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    defaultColumn={{ maxSize: 300, minSize: 100, size: 150 }}
  />
);

export const ColumnResizingWithPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{
      columnPinning: { start: ['firstName', 'lastName'], end: [] },
    }}
  />
);

export const ColumnResizingWithHeaderGroups = () => (
  <ShadcnTable
    columns={[
      {
        columns: [
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
        ],
        footer: 'Name',
        header: 'Name',
      },
      {
        columns: [
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
        ],
        footer: 'Info',
        header: 'Info',
      },
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }))}
  />
);

export const ColumnResizingWithHeaderGroupsGridGrow = () => (
  <ShadcnTable
    columns={[
      {
        columns: [
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
        ],
        footer: 'Name',
        header: 'Name',
      },
      {
        columns: [
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
        ],
        footer: 'Info',
        header: 'Info',
      },
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }))}
    enableRowSelection
    layoutMode="grid"
  />
);

export const ColumnResizingLayoutGridGrow = () => (
  <ShadcnTable
    columns={columns.slice(0, 3)}
    data={data}
    enableRowSelection
    layoutMode="grid"
  />
);

export const ColumnResizingLayoutGridGrowRTL = () => (
  <div style={{ direction: 'rtl' }}>
    <ShadcnTable
      columnResizeDirection="rtl"
      columns={columns.slice(0, 3)}
      data={data}
      enableRowSelection
      layoutMode="grid"
    />
  </div>
);
