import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';

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

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'city', header: 'City' },
];

// ShadcnReactTableProps is an Xor<{ columns; data }, { table }> union, which
// collapses to `never` when inferred through Meta<typeof Component>, so the
// story renders explicitly instead of passing `args`.
const meta: Meta = {
  title: 'Basic',
};

export default meta;

export const Default: StoryObj = {
  render: () => <ShadcnReactTable columns={columns} data={data} />,
};
