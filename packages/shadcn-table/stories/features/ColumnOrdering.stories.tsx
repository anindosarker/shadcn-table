import { useState } from 'react';
import { type Meta } from '@storybook/react-vite';
import {
  type ST_ColumnDef,
  type ST_ColumnOrderState,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Column Ordering Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
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
    header: 'Email Address',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    enablePinning: false,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
  phone: faker.phone.number(),
}));

export const ColumnOrderingEnabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnOrdering />
);

export const DisplayColumnOrderingEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    defaultDisplayColumn={{ enableColumnOrdering: true }}
    enableColumnOrdering
    enableRowActions
    enableRowDragging
    enableRowNumbers
    enableRowSelection
    positionActionsColumn="last"
  />
);

export const ColumnOrderingDisabledPerColumn = () => (
  <ShadcnTable
    columns={[
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
        header: 'Email Address',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        enableColumnOrdering: false,
        header: 'State',
      },
    ]}
    data={data}
    enableColumnOrdering
  />
);

export const ColumnOrderingWithSelect = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableRowSelection
  />
);

export const ColumnOrderingWithPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableColumnPinning
  />
);

export const ColumnOrderingNoDragHandles = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnDragging={false}
    enableColumnOrdering
  />
);

export const ColumnOrderingStateManaged = () => {
  const [columnOrder, setColumnOrder] = useState<ST_ColumnOrderState>(() =>
    columns.map((c) => c.accessorKey as string),
  );
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      defaultDisplayColumn={{ enableColumnOrdering: true, enableHiding: true }}
      enableColumnOrdering
      enableRowSelection
      onColumnOrderChange={setColumnOrder}
      state={{ columnOrder }}
    />
  );
};

export const ColumnOrderingStateManagedCustom = () => {
  const [columnOrder, setColumnOrder] = useState<ST_ColumnOrderState>(() => [
    ...columns.map((c) => c.accessorKey as string),
    'st-row-select',
  ]);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      defaultDisplayColumn={{ enableColumnOrdering: true, enableHiding: true }}
      enableColumnOrdering
      enableRowSelection
      onColumnOrderChange={setColumnOrder}
      state={{ columnOrder }}
    />
  );
};

export const ColumnOrderingEnabledWithColumnVirtualization = () => (
  <ShadcnTable
    columnVirtualizerOptions={{
      overscan: 0,
    }}
    columns={columns}
    data={data}
    enableColumnOrdering
    enableColumnVirtualization
  />
);
