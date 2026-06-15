import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Row Dragging Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email Address' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'state', header: 'State' },
];

const initData = makeData(25);

export const RowDraggingEnabled = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnReactTable
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
    <ShadcnReactTable
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
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
      layoutMode="grid-no-grow"
    />
  );
};
