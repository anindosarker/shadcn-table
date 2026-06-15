import { useState } from 'react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Full Screen Examples',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
  {
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    header: 'Employee',
    id: 'employee',
  },
  {
    columns: [
      {
        accessorKey: 'jobTitle',
        header: 'Job Title',
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
      },
    ],
    header: 'Job Info',
    id: 'jobInfo',
  },
];

const data = [...Array(128)].map(() => ({
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  jobTitle: faker.person.jobTitle(),
  lastName: faker.person.lastName(),
  salary: +faker.finance.amount({ dec: 0, max: 150000, min: 20000 }),
  signatureCatchPhrase: faker.company.catchPhrase(),
  startDate: faker.date.past({ years: 8 }).toLocaleDateString(),
}));

export const FullScreenToggleEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const DisableFullScreenToggle = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableFullScreenToggle={false}
  />
);

export const DefaultFullScreenOn = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ isFullScreen: true }}
  />
);

export const ControlledFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      // API GAP: muiTableBodyCellProps (cell `title` attribute) has no SRT
      // equivalent; dropped.
      onIsFullScreenChange={setIsFullScreen}
      state={{ isFullScreen }}
    />
  );
};
