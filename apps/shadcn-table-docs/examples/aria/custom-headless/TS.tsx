'use client';

import {
  ST_GlobalFilterTextField,
  ST_TableBodyCellValue,
  ST_TablePagination,
  ST_TableProvider,
  ST_ToolbarAlertBanner,
  flexRender,
  type ST_ColumnDef,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
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
  const table = useShadcnTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    //ST display columns can still work, optionally override cell renders with `displayColumnDefOptions`
    enableRowSelection: true,
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
        {/* Plain table markup here, styled like the shadcn Table, the same on every shadcn base */}
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            {/* Use your own markup, customize however you want using the power of TanStack Table */}
            <thead className="[&_tr]:border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="border-b" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="h-10 px-2 text-center align-middle font-medium whitespace-nowrap text-foreground"
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
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell, _columnIndex) => (
                    <td
                      className="p-2 text-center align-middle whitespace-nowrap"
                      key={cell.id}
                    >
                      {/* Use ST's cell renderer that provides better logic than flexRender */}
                      <ST_TableBodyCellValue
                        cell={cell}
                        staticRowIndex={rowIndex} //just for batch row selection to work
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ST_ToolbarAlertBanner stackAlertBanner />
      </div>
    </ST_TableProvider>
  );
};

export default Example;
