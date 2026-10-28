import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Styling/Table Dimensions Examples',
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

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const MaxWidthAndCentered = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableLayoutProps={{
      className: 'm-auto max-w-[800px]',
    }}
  />
);

export const maxHeight = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableContainerProps={{
      className: 'max-h-[500px]',
    }}
  />
);

export const minHeight = () => (
  <ShadcnTable
    columns={columns}
    data={data.slice(0, 5)}
    stTableContainerProps={{
      className: 'min-h-[800px]',
    }}
  />
);

export const minHeightParent = () => (
  <div style={{ height: '700px' }}>
    <ShadcnTable
      columns={columns}
      data={data.slice(0, 5)}
      stTableContainerProps={({ table }) => ({
        style: {
          height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        },
      })}
      stTableLayoutProps={{
        className: 'h-full',
      }}
    />
  </div>
);

export const ContainerHeight = () => (
  <div style={{ height: '300px' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      stTableContainerProps={({ table }) => ({
        style: {
          height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        },
      })}
      stTableLayoutProps={{
        className: 'h-full',
      }}
    />
  </div>
);
