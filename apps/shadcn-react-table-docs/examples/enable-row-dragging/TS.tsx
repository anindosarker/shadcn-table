'use client';

import { useMemo, useState } from 'react';
import {
  type SRT_TableOptions,
  type SRT_ColumnDef,
  type SRT_Row,
  ShadcnReactTable,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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

  const [draggingRow, setDraggingRow] = useState<SRT_Row<Person> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const commonTableProps: Partial<SRT_TableOptions<Person>> & {
    columns: SRT_ColumnDef<Person>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    srtTableContainerProps: {
      className: 'min-h-[320px]',
    },
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };

  const table1 = useShadcnReactTable({
    ...commonTableProps,
    data: data1,
    getRowId: (originalRow) => `table-1-${originalRow.firstName}`,
    srtRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-2') {
          setData2((data2) => [...data2, draggingRow!.original]);
          setData1((data1) => data1.filter((d) => d !== draggingRow!.original));
        }
        setHoveredTable(null);
      },
    },
    srtTableLayoutProps: {
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

  const table2 = useShadcnReactTable({
    ...commonTableProps,
    data: data2,
    defaultColumn: {
      size: 100,
    },
    getRowId: (originalRow) => `table-2-${originalRow.firstName}`,
    srtRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-1') {
          setData1((data1) => [...data1, draggingRow!.original]);
          setData2((data2) => data2.filter((d) => d !== draggingRow!.original));
        }
        setHoveredTable(null);
      },
    },
    srtTableLayoutProps: {
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
      <ShadcnReactTable table={table1} />
      <ShadcnReactTable table={table2} />
    </div>
  );
};

export default Example;
