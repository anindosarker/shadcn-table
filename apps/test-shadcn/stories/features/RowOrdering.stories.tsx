import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef, type SRT_Row } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Row Ordering Examples',
};

export default meta;

// API GAP: MRT used `muiRowDragHandleProps={{ onDragEnd }}` to commit the
// reordered data on drop. SRT has not implemented that prop (it is commented
// out in the core types), so the drag-handle UI and dragging/hovered state are
// preserved, but the array-splice commit on drop has been dropped. The stories
// still demonstrate the drag handle, dragging row, and hovered row tracking.

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email Address' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'state', header: 'State' },
];

const initData = makeData(100);

export const RowOrderingEnabled = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowOrdering
      enableSorting={false}
    />
  );
};

export const RowOrderingWithSelect = () => {
  const [data] = useState(() => initData);
  const [draggingRow, setDraggingRow] = useState<SRT_Row<Person> | null>(null);
  const [hoveredRow, setHoveredRow] = useState<Partial<SRT_Row<Person>> | null>(
    null,
  );

  return (
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowOrdering
      enableRowSelection
      enableSorting={false}
      getRowId={(row) => row.email}
      onDraggingRowChange={setDraggingRow}
      onHoveredRowChange={setHoveredRow}
      state={{
        draggingRow,
        hoveredRow,
      }}
    />
  );
};

export const RowOrderingWithPinning = () => {
  const [data] = useState(() => initData);
  const [draggingRow, setDraggingRow] = useState<SRT_Row<Person> | null>(null);
  const [hoveredRow, setHoveredRow] = useState<Partial<SRT_Row<Person>> | null>(
    null,
  );

  return (
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableColumnPinning
      enableRowOrdering
      enableSorting={false}
      onDraggingRowChange={setDraggingRow}
      onHoveredRowChange={setHoveredRow}
      state={{
        draggingRow,
        hoveredRow,
      }}
    />
  );
};

export const RowAndColumnOrdering = () => {
  const [data] = useState(() => initData);
  const [draggingRow, setDraggingRow] = useState<SRT_Row<Person> | null>(null);
  const [hoveredRow, setHoveredRow] = useState<Partial<SRT_Row<Person>> | null>(
    null,
  );

  return (
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableColumnOrdering
      enableColumnPinning
      enableRowOrdering
      enableSorting={false}
      onDraggingRowChange={setDraggingRow}
      onHoveredRowChange={setHoveredRow}
      state={{
        draggingRow,
        hoveredRow,
      }}
    />
  );
};

export const RowOrderingWithRowVirtualization = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enablePagination={false}
      enableRowOrdering
      enableRowVirtualization
      enableSorting={false}
    />
  );
};

const fakeColumns = [...Array(500)].map((_, i) => {
  return {
    accessorKey: i.toString(),
    header: 'Column ' + i.toString(),
  };
});

const fakeData = [...Array(500)].map(() => ({
  ...Object.fromEntries(fakeColumns.map((col) => [col.accessorKey, 'value'])),
}));

export const RowOrderingWithColumnVirtualization = () => {
  const [data] = useState(() => fakeData);

  return (
    <ShadcnReactTable
      autoResetPageIndex={false}
      columns={fakeColumns}
      data={data}
      displayColumnDefOptions={{
        'mrt-row-drag': {
          enableColumnDragging: true,
          enableColumnOrdering: true,
        },
      }}
      enableColumnOrdering
      enableColumnVirtualization
      enableRowOrdering
      enableSorting={false}
    />
  );
};
