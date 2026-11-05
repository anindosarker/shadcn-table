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
  title: 'Styling/Custom Table Body Examples',
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

export const CustomTableBody = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableBodyProps={{
      children: 'Custom Table Body',
    }}
  />
);

export const CustomEmptyRowsJSX = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    renderEmptyRowsFallback={() => <p>OMG THERE ARE NO ROWS 😳</p>}
  />
);

// With no rows the body shows the consumer's fallback instead of the default.
CustomEmptyRowsJSX.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const fallback = await canvas.findByText('OMG THERE ARE NO ROWS 😳');
  expect(fallback.tagName).toBe('P');
  expect(canvasElement.querySelector('tbody')).toContainElement(fallback);
  expect(canvas.queryByText('No records to display')).toBeNull();
};
