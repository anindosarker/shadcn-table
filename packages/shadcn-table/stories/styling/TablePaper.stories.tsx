import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Styling/Table Paper Examples',
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

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const NoBoxShadow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stTableLayoutProps={{
      className: 'shadow-none',
    }}
  />
);

// `shadow-none` on the layout removes its shadow: every shadow layer left is
// fully transparent with no offset or blur.
NoBoxShadow.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0]!.firstName);
  const layout = canvasElement.querySelector<HTMLElement>('.shadow-none')!;
  expect(layout).toContainElement(canvasElement.querySelector('table'));
  const shadow = getComputedStyle(layout).boxShadow;
  expect(
    shadow === 'none'
      ? ''
      : shadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?/g, ''),
  ).toBe('');
};
