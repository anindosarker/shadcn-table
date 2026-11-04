import { type CSSProperties } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { CakeIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Styling/Theming',
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
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
];

const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const DefaultTheme = () => (
  <ShadcnTable columns={columns} data={data} enableRowSelection />
);

export const CustomLightTheme = () => {
  const theme = {
    '--background': '#ffffef',
    '--primary': '#ff9800',
    '--secondary': '#00bcd4',
  } as CSSProperties;
  return (
    <div style={theme}>
      <ShadcnTable columns={columns} data={data} enableRowSelection />
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
      <ShadcnTable columns={columns} data={data} enableRowSelection />
    </div>
  );
};

// The wrapper's CSS variables theme the table: rows take the custom
// background colour.
CustomLightTheme.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0]!.firstName);
  expect(
    getComputedStyle(canvasElement.querySelector('tbody tr')!).backgroundColor,
  ).toBe('rgb(255, 255, 239)');
};
