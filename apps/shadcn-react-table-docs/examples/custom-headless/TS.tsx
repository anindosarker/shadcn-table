'use client';

import {
  SRT_GlobalFilterTextField,
  SRT_TableBodyCellValue,
  SRT_TablePagination,
  SRT_ToolbarAlertBanner,
  flexRender,
  type SRT_ColumnDef,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Person, data } from './makeData';

const columns: SRT_ColumnDef<Person>[] = [
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
  const table = useShadcnReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    //SRT display columns can still work, optionally override cell renders with `displayColumnDefOptions`
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      showGlobalFilter: true,
    },
    //customize the SRT components
    srtPaginationProps: {
      rowsPerPageOptions: [5, 10, 15],
    },
    paginationDisplayMode: 'pages',
  });

  return (
    <div className="my-8 flex flex-col">
      <h4>My Custom Headless Table</h4>
      <div className="flex items-center justify-between">
        {/**
         * Use SRT components along side your own markup.
         * They just need the `table` instance passed as a prop to work!
         */}
        <SRT_GlobalFilterTextField table={table} />
        <SRT_TablePagination table={table} />
      </div>
      {/* Using Vanilla shadcn Table components here */}
      <div>
        <Table>
          {/* Use your own markup, customize however you want using the power of TanStack Table */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-center" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.Header ??
                            header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell, _columnIndex) => (
                  <TableCell className="text-center" key={cell.id}>
                    {/* Use SRT's cell renderer that provides better logic than flexRender */}
                    <SRT_TableBodyCellValue
                      cell={cell}
                      table={table}
                      staticRowIndex={rowIndex} //just for batch row selection to work
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SRT_ToolbarAlertBanner stackAlertBanner table={table} />
    </div>
  );
};

export default Example;
