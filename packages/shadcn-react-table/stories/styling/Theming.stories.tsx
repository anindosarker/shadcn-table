import { type CSSProperties } from 'react';
import { type Meta } from '@storybook/react-vite';
import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { faker } from '@faker-js/faker';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';

const meta: Meta = {
  title: 'Styling/Theming',
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
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];

const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTheme = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);

export const CustomLightTheme = () => {
  const theme = {
    '--background': '#ffffef',
    '--primary': '#ff9800',
    '--secondary': '#00bcd4',
  } as CSSProperties;
  return (
    <div style={theme}>
      <ShadcnReactTable columns={columns} data={data} enableRowSelection />
    </div>
  );
};

export const CustomDarkTheme = () => {
  const theme = {
    '--primary': '#81980f',
    '--secondary': '#00bcd4',
  } as CSSProperties;
  return (
    <div className="dark" style={theme}>
      <ShadcnReactTable columns={columns} data={data} enableRowSelection />
    </div>
  );
};
