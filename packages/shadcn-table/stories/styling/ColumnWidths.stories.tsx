import { faker } from '@faker-js/faker';
import { ShadcnTable } from '@/components/ui/shadcn-table';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CakeIcon, HashIcon, MapPinIcon, UserIcon } from 'lucide-react';

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
        icon: HashIcon,
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 50,
      },
      {
        accessorKey: 'address',
        grow: true,
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 300,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 100,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 50,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 10,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 10,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 10,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 10,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 10,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 10,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
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
        icon: HashIcon,
        size: 10,
      },
      {
        accessorKey: 'firstName',
        grow: 1,
        header: 'First Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'lastName',
        grow: 1,
        header: 'Last Name',
        icon: UserIcon,
        size: 10,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
        size: 80,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
        size: 200,
      },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);

// Under grid-no-grow every column renders at its set size.
CustomWidthsGridNoGrow.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByRole('columnheader');
  const width = (id: string) =>
    canvasElement
      .querySelector(`thead th[data-flip-column="${id}"]`)!
      .getBoundingClientRect().width;
  expect(width('firstName')).toBe(300);
  expect(width('lastName')).toBe(100);
  expect(
    canvasElement
      .querySelector('tbody td[data-flip-column="firstName"]')!
      .getBoundingClientRect().width,
  ).toBe(300);
};
