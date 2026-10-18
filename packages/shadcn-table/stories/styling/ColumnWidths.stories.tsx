import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Styling/Custom Column Widths',
};

export default meta;

const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  id: faker.number.int(100),
  lastName: faker.person.lastName(),
}));

export const CustomWidthsSemantic = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
  />
);

export const CustomWidthsGrid = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
    layoutMode="grid"
  />
);

export const CustomWidthsGridNoGrow = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);

export const CustomWidthsGridNoGrowIndividualGrow = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 50,
      },
      {
        accessorKey: 'address',
        grow: true,
        header: 'Address',
      },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);

export const CustomWidthsGridIndividualShrink = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        grow: false,
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
    ]}
    data={data}
    layoutMode="grid"
  />
);

export const SmallWidthsSemantic = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 10,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 10,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 10,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 10,
      },
    ]}
    data={data}
  />
);

export const SmallWidthsGrid = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 10,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 10,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 10,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 10,
      },
    ]}
    data={data}
    layoutMode="grid"
  />
);

export const SmallWidthsGridNoGrow = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 10,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 10,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 10,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 10,
      },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);

export const SmallWidthsGridNoGrowIndividualGrow = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'id',
        header: 'ID',
        size: 10,
      },
      {
        accessorKey: 'firstName',
        grow: 1,
        header: 'First Name',
        size: 10,
      },
      {
        accessorKey: 'lastName',
        grow: 1,
        header: 'Last Name',
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 80,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 200,
      },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);
