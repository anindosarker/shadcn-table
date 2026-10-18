import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Row Number Examples',
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
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const enableRowNumbersStatic = () => (
  <ShadcnTable columns={columns} data={data} enableRowNumbers />
);

export const enableRowNumbersConditionally = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [enableRowNumbers, setEnableRowNumbers] = useState(false);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowNumbers={enableRowNumbers}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowNumbers(!enableRowNumbers)}>
          Toggle Row Numbers
        </Button>
      )}
    />
  );
};

export const enableRowNumbersStaticGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid"
  />
);

export const enableRowNumbersStaticGridNoGrow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid-no-grow"
  />
);

export const enableRowNumbersOriginal = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersOriginalVirtual = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersStaticVirtual = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="static"
  />
);
