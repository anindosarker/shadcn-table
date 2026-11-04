import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
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
