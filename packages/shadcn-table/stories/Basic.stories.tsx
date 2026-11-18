import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import {
  Building2Icon,
  CakeIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  city: string;
};

const data: Person[] = [
  { firstName: 'Ada', lastName: 'Lovelace', age: 36, city: 'London' },
  { firstName: 'Alan', lastName: 'Turing', age: 41, city: 'Manchester' },
  { firstName: 'Grace', lastName: 'Hopper', age: 85, city: 'Arlington' },
  { firstName: 'Linus', lastName: 'Torvalds', age: 54, city: 'Portland' },
  { firstName: 'Margaret', lastName: 'Hamilton', age: 88, city: 'Boston' },
  {
    firstName: 'Dennis',
    lastName: 'Ritchie',
    age: 70,
    city: 'Berkeley Heights',
  },
  { firstName: 'Barbara', lastName: 'Liskov', age: 85, city: 'Cambridge' },
  { firstName: 'Ken', lastName: 'Thompson', age: 81, city: 'Murray Hill' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
  { accessorKey: 'lastName', header: 'Last Name', icon: UserIcon },
  { accessorKey: 'age', header: 'Age', icon: CakeIcon },
  { accessorKey: 'city', header: 'City', icon: Building2Icon },
];

// ShadcnTableProps is an Xor<{ columns; data }, { table }> union, which
// collapses to `never` when inferred through Meta<typeof Component>, so the
// args are typed explicitly and handed to the component in `render`.
type BasicArgs = { columns: ST_ColumnDef<Person>[]; data: Person[] };

const meta: Meta<BasicArgs> = {
  title: 'Basic',
  args: { columns, data },
  render: (args) => <ShadcnTable columns={args.columns} data={args.data} />,
};

export default meta;

/** Every data row renders, its cells in column order. */
export const Default: StoryObj<BasicArgs> = {
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Ada');
    const rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(data.length);
    rows.forEach((row, index) => {
      const person = data[index]!;
      expect(
        [...row.querySelectorAll('td')].map((cell) =>
          (cell.textContent ?? '').trim(),
        ),
      ).toEqual([
        person.firstName,
        person.lastName,
        String(person.age),
        person.city,
      ]);
    });
  },
};

// The docs example `basic`: nested data read through dot accessor keys.
type Address = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

const addresses: Address[] = [
  {
    name: { firstName: 'John', lastName: 'Doe' },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: { firstName: 'Jane', lastName: 'Doe' },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: { firstName: 'Joe', lastName: 'Doe' },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: { firstName: 'Kevin', lastName: 'Vandy' },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: { firstName: 'Joshua', lastName: 'Rolluffs' },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const addressColumns: ST_ColumnDef<Address>[] = [
  {
    accessorKey: 'name.firstName',
    icon: UserIcon,
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'name.lastName',
    icon: UserIcon,
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'address',
    icon: MapPinIcon,
    header: 'Address',
    size: 200,
  },
  {
    accessorKey: 'city',
    icon: Building2Icon,
    header: 'City',
    size: 150,
  },
  {
    accessorKey: 'state',
    icon: MapIcon,
    header: 'State',
    size: 150,
  },
];

const BasicExample = () => {
  const table = useShadcnTable({ columns: addressColumns, data: addresses });
  return <ShadcnTable table={table} />;
};

/** The nested name fields render through their dot accessor keys. */
export const Basic: StoryObj<BasicArgs> = {
  render: () => <BasicExample />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Rolluffs');
    const rows = canvasElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(addresses.length);
    rows.forEach((row, index) => {
      const entry = addresses[index]!;
      expect(
        [...row.querySelectorAll('td')].map((cell) =>
          (cell.textContent ?? '').trim(),
        ),
      ).toEqual([
        entry.name.firstName,
        entry.name.lastName,
        entry.address,
        entry.city,
        entry.state,
      ]);
    });
  },
};
