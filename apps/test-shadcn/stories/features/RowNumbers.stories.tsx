import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { Button } from '@/components/ui/button';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Row Number Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(100);

export const enableRowNumbersStatic = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowNumbers />
);

export const enableRowNumbersConditionally = () => {
  const [enableRowNumbers, setEnableRowNumbers] = useState(false);
  return (
    <ShadcnReactTable
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
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid"
  />
);

export const enableRowNumbersStaticGridNoGrow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowNumbers
    layoutMode="grid-no-grow"
  />
);

export const enableRowNumbersOriginal = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersOriginalVirtual = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    rowNumberDisplayMode="original"
  />
);

export const enableRowNumbersStaticVirtual = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    rowNumberDisplayMode="static"
  />
);
