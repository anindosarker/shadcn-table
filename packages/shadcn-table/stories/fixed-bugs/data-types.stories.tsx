import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/Data Types',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: null | string;
  lastName: string;
  state: string;
  states: string[];
};

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    enableGlobalFilter: true,
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
    Cell: ({ cell }) => cell.getValue<string[]>().join(', '),
    accessorKey: 'states',
    header: 'States',
    icon: MapIcon,
  },
];

const data = [...Array(66)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: Math.random() > 0.5 ? faker.person.firstName() : null,
  lastName: faker.person.lastName(),
  state: faker.location.state(),
  states: [
    faker.location.state(),
    faker.location.state(),
    faker.location.state(),
  ],
}));

export const NullColumn = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGlobalFilterModes
      initialState={{ showGlobalFilter: true }}
    />
  );
};

// Null values and an array column do not break the search: null cells render
// empty and a search filters on the joined array text.
NullColumn.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  await canvas.findAllByText(data[0]!.lastName);
  const nullIndex = data.findIndex((person) => person.firstName === null);
  if (nullIndex >= 0 && nullIndex < 10) {
    const row = canvasElement.querySelectorAll('tbody tr')[nullIndex]!;
    expect(
      row.querySelector('td[data-flip-column="firstName"]'),
    ).toHaveTextContent(/^$/);
  }
  const term = data[0]!.states[1]!;
  await userEvent.type(canvas.getByPlaceholderText('Search'), term);
  await waitFor(() => {
    const rows = [...canvasElement.querySelectorAll('tbody tr')];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(10);
  });
};
