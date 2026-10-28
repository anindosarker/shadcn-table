'use client';

import { useState } from 'react';
import type { Key } from 'react-aria-components';
import {
  ST_GlobalFilterTextField,
  ST_TableBodyCellValue,
  ST_TablePagination,
  ST_TableProvider,
  ST_ToolbarAlertBanner,
  flexRender,
  type ST_ColumnDef,
  type ST_RowSelectionState,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Person, data } from './makeData';

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'name.firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'name.lastName',
    header: 'Last Name',
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

const Example = () => {
  //the React Aria Table drives the selection; the ST table reads it as its row selection state
  const [rowSelection, setRowSelection] = useState<ST_RowSelectionState>({});

  const table = useShadcnTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    //ST display columns can still work, optionally override cell renders with `displayColumnDefOptions`
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    //the React Aria Table owns the selection checkboxes (slot "selection")
    displayColumnDefOptions: {
      'st-row-select': {
        Cell: () => <Checkbox slot="selection" />,
        Header: () => <Checkbox slot="selection" />,
      },
    },
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    //customize the ST components
    stPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
    },
    paginationDisplayMode: 'pages',
  });

  //the first data column names each row for assistive technology
  const rowHeaderId = table
    .getVisibleLeafColumns()
    .find((column) => column.columnDef.columnDefType === 'data')?.id;

  //React Aria selection in, ST row selection state out: `all` means every row of the page
  const selectedKeys = new Set(
    Object.keys(rowSelection).filter((id) => rowSelection[id]),
  );
  const onSelectionChange = (keys: Set<Key> | 'all') => {
    const next = { ...rowSelection };
    for (const row of table.getRowModel().rows) {
      if (keys === 'all' || keys.has(row.id)) next[row.id] = true;
      else delete next[row.id];
    }
    setRowSelection(next);
  };

  return (
    <ST_TableProvider table={table}>
      <div className="my-8 flex flex-col">
        <h4>My Custom Headless Table</h4>
        <div className="flex items-center justify-between">
          {/**
           * Use ST components along side your own markup.
           * They read the table from the `ST_TableProvider` around them.
           */}
          <ST_GlobalFilterTextField />
          <ST_TablePagination />
        </div>
        {/* Your own markup with the React Aria Table collection parts, driven by the power of TanStack Table */}
        <Table
          aria-label="My Custom Headless Table"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
        >
          {/* A React Aria table has one header row: the flat headers of this column set */}
          <TableHeader>
            {table.getFlatHeaders().map((header) => (
              <TableHead
                className="text-center"
                id={header.id}
                isRowHeader={header.column.id === rowHeaderId}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.Header ??
                        header.column.columnDef.header,
                      //pass the ST table: `header.getContext().table` is the plain TanStack table, without `table.state`
                      { ...header.getContext(), table },
                    )}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow id={row.id} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center" key={cell.id}>
                    {/* Use ST's cell renderer that provides better logic than flexRender */}
                    <ST_TableBodyCellValue
                      cell={cell}
                      staticRowIndex={rowIndex} //just for batch row selection to work
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ST_ToolbarAlertBanner stackAlertBanner />
      </div>
    </ST_TableProvider>
  );
};

export default Example;
