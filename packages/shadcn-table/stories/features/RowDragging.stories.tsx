import { useState } from 'react';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
import { CakeIcon, HashIcon, MailIcon, MapIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Row Dragging Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof initData)[0]>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    icon: HashIcon,
  },
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
    accessorKey: 'email',
    header: 'Email Address',
    icon: MailIcon,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
];

const initData = [...Array(25)].map(() => ({
  age: faker.number.int(20) + 18,
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  id: faker.string.alphanumeric(6),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowDraggingEnabled = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
    />
  );
};

export const RowDraggingEnabledGrid = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
      layoutMode="grid"
    />
  );
};

export const RowDraggingEnabledGridNoGrow = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
      layoutMode="grid-no-grow"
    />
  );
};
