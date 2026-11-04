import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Building2Icon,
  MailboxIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Dense Padding Examples',
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
    accessorKey: 'city',
    header: 'City',
    icon: Building2Icon,
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

const data = [...Array(25)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
  zipCode: faker.location.zipCode(),
}));

export const DensePaddingToggleEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const DensePaddingDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableDensityToggle={false} />
);

export const DefaultToDensePadding = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 25 },
    }}
  />
);

/** Each click of the density toggle gives the rows a different height. */
export const ToggleChangesRowHeight = {
  render: () => <DensePaddingToggleEnabledDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText(data[0].firstName);
    const rowHeight = () =>
      canvasElement.querySelector('tbody tr')!.getBoundingClientRect().height;
    const heights = [rowHeight()];
    for (let i = 0; i < 2; i++) {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Toggle density' }),
      );
      await waitFor(() => expect(heights).not.toContain(rowHeight()));
      heights.push(rowHeight());
    }
    expect(new Set(heights).size).toBe(3);
    // The third click comes back to the first density.
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle density' }),
    );
    await waitFor(() => expect(rowHeight()).toBe(heights[0]));
  },
};
