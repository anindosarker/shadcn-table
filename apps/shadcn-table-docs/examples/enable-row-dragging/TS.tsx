'use client';

import { useMemo, useState } from 'react';
import {
  type ST_TableOptions,
  type ST_ColumnDef,
  type ST_Row,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
    ],
    [],
    //end
  );

  const [data1, setData1] = useState<Person[]>(() => data.slice(0, 3));
  const [data2, setData2] = useState<Person[]>(() => data.slice(3, 5));

  const [draggingRow, setDraggingRow] = useState<ST_Row<Person> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const commonTableProps: Partial<ST_TableOptions<Person>> & {
    columns: ST_ColumnDef<Person>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    stTableContainerProps: {
      className: 'min-h-[320px]',
    },
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };

  const table1 = useShadcnTable({
    ...commonTableProps,
    data: data1,
    getRowId: (originalRow) => `table-1-${originalRow.firstName}`,
    stRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-2') {
          setData2((data2) => [...data2, draggingRow!.original]);
          setData1((data1) => data1.filter((d) => d !== draggingRow!.original));
        }
        setHoveredTable(null);
      },
    },
    stTableLayoutProps: {
      onDragEnter: () => setHoveredTable('table-1'),
      className:
        hoveredTable === 'table-1'
          ? 'outline-2 outline-dashed outline-pink-400'
          : undefined,
    },
    renderTopToolbarCustomActions: () => (
      <span className="text-2xl font-semibold text-green-600">Nice List</span>
    ),
  });

  const table2 = useShadcnTable({
    ...commonTableProps,
    data: data2,
    defaultColumn: {
      size: 100,
    },
    getRowId: (originalRow) => `table-2-${originalRow.firstName}`,
    stRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-1') {
          setData1((data1) => [...data1, draggingRow!.original]);
          setData2((data2) => data2.filter((d) => d !== draggingRow!.original));
        }
        setHoveredTable(null);
      },
    },
    stTableLayoutProps: {
      onDragEnter: () => setHoveredTable('table-2'),
      className:
        hoveredTable === 'table-2'
          ? 'outline-2 outline-dashed outline-pink-400'
          : undefined,
    },
    renderTopToolbarCustomActions: () => (
      <span className="text-2xl font-semibold text-destructive">
        Naughty List
      </span>
    ),
  });

  return (
    <div className="grid grid-cols-1 gap-4 overflow-auto p-1 lg:grid-cols-2">
      <ShadcnTable table={table1} />
      <ShadcnTable table={table2} />
    </div>
  );
};

export default Example;
