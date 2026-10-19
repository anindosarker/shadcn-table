import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Row Pinning Examples',
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
];

const data = [...Array(50)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowPinningStickyDefaultEnabled = () => (
  <ShadcnTable columns={columns} data={data} enableRowPinning />
);

export const RowPinningEnabledConditionally = () => {
  const [enableRowPinning, setEnableRowPinning] = useState(false);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowPinning={enableRowPinning}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowPinning(!enableRowPinning)}>
          Toggle Row Pinning
        </Button>
      )}
    />
  );
};

export const RowPinningStickyNoPagination = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyCustomRowHeight = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableBodyRowProps={{
      className: 'h-[100px]',
    }}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="sticky"
  />
);

export const RowPinningSelectStickyMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-sticky"
  />
);

export const RowPinningTopAndBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top-and-bottom"
  />
);

export const RowPinningTopMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    keepPinnedRows={false}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowPinningSelectTopMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-top"
  />
);

export const RowPinningBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="bottom"
  />
);

export const RowPinningSelectBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-bottom"
  />
);

export const RowPinningWithStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableStickyFooter
    enableStickyHeader
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningWithGridLayout = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    layoutMode="grid"
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningTopWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowAndColumnPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enablePagination={false}
    enableRowPinning
    initialState={{
      columnPinning: {
        start: ['firstName'],
        end: ['lastName'],
      },
      rowPinning: {
        top: ['3', '5'],
      },
    }}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);
