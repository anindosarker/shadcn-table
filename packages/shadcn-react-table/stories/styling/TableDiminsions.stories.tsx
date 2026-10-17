import { type Meta } from '@storybook/react-vite';
import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { faker } from '@faker-js/faker';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Styling/Table Dimensions Examples',
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

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const MaxWidthAndCentered = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableLayoutProps={{
      className: 'm-auto max-w-[800px]',
    }}
  />
);

export const maxHeight = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtTableContainerProps={{
      className: 'max-h-[500px]',
    }}
  />
);

export const minHeight = () => (
  <ShadcnReactTable
    columns={columns}
    data={data.slice(0, 5)}
    srtTableContainerProps={{
      className: 'min-h-[800px]',
    }}
  />
);

export const minHeightParent = () => (
  <div style={{ height: '700px' }}>
    <ShadcnReactTable
      columns={columns}
      data={data.slice(0, 5)}
      srtTableContainerProps={({ table }) => ({
        style: {
          height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        },
      })}
      srtTableLayoutProps={{
        className: 'h-full',
      }}
    />
  </div>
);

export const ContainerHeight = () => (
  <div style={{ height: '300px' }}>
    <ShadcnReactTable
      columns={columns}
      data={data}
      srtTableContainerProps={({ table }) => ({
        style: {
          height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        },
      })}
      srtTableLayoutProps={{
        className: 'h-full',
      }}
    />
  </div>
);
