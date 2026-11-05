import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
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
  title: 'Styling/Row Height Examples',
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

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int({ max: 60, min: 20 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SetRowHeight = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyCellProps={{
      className: 'py-0.5 px-4',
    }}
    stTableBodyRowProps={{
      className: 'h-2.5',
    }}
  />
);

// The body cell classes set the cell padding: 2px block, 16px inline.
SetRowHeight.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0]!.firstName);
  const cell = canvasElement.querySelector<HTMLElement>('tbody td')!;
  const style = getComputedStyle(cell);
  expect(style.paddingTop).toBe('2px');
  expect(style.paddingBottom).toBe('2px');
  expect(style.paddingLeft).toBe('16px');
  expect(style.paddingRight).toBe('16px');
};
