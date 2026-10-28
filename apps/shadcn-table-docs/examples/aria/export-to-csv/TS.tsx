'use client';

import {
  ShadcnTable,
  useShadcnTable,
  type ST_Row,
  createSRTColumnHelper,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { data, type Person } from './makeData';

const columnHelper = createSRTColumnHelper<Person>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 40,
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    size: 120,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    size: 120,
  }),
  columnHelper.accessor('company', {
    header: 'Company',
    size: 300,
  }),
  columnHelper.accessor('city', {
    header: 'City',
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    size: 220,
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const Example = () => {
  const handleExportRows = (rows: ST_Row<Person>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useShadcnTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex flex-wrap gap-4 p-2">
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onPress={handleExportData}
        >
          <DownloadIcon />
          Export All Data
        </Button>
        <Button
          isDisabled={table.getPrePaginatedRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onPress={() => handleExportRows(table.getPrePaginatedRowModel().rows)}
        >
          <DownloadIcon />
          Export All Rows
        </Button>
        <Button
          isDisabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onPress={() => handleExportRows(table.getRowModel().rows)}
        >
          <DownloadIcon />
          Export Page Rows
        </Button>
        <Button
          isDisabled={!table.getIsSomeRowsSelected()}
          //only export selected rows
          onPress={() => handleExportRows(table.getSelectedRowModel().rows)}
        >
          <DownloadIcon />
          Export Selected Rows
        </Button>
      </div>
    ),
  });

  return <ShadcnTable table={table} />;
};

export default Example;
