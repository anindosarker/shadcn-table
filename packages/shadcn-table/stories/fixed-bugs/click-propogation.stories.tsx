import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/Click Propagation',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: ST_ColumnDef<Person>[] = [
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
];

const data = [...Array(6)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowClickAndRowMenuActions = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      stTableBodyRowProps={{
        onClick: () => {
          alert('row click');
        },
      }}
      renderRowActionMenuItems={() => [
        <DropdownMenuItem key="test">Test</DropdownMenuItem>,
      ]}
    />
  );
};

export const RowClickAndRowButtonActions = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      stTableBodyRowProps={{
        onClick: () => {
          alert('row click');
        },
      }}
      renderRowActions={() => (
        <Button onClick={(e) => e.stopPropagation()}>Test</Button>
      )}
    />
  );
};
