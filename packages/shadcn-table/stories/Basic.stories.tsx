import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { Building2Icon, CakeIcon, UserIcon } from 'lucide-react';

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

export const Default: StoryObj<BasicArgs> = {};

/** Every data row renders, its cells in column order. */
export const RendersRows: StoryObj<BasicArgs> = {
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
