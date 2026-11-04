'use client';

import {
  ShadcnTable,
  useShadcnTable,
  type ST_Row,
  createSRTColumnHelper,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import {
  Building2Icon,
  BuildingIcon,
  DownloadIcon,
  GlobeIcon,
  HashIcon,
  UserIcon,
} from 'lucide-react';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { data, type Person } from './makeData';

const columnHelper = createSRTColumnHelper<Person>();

const columns = [
  columnHelper.accessor('id', {
    icon: HashIcon,
    header: 'ID',
    size: 112,
  }),
  columnHelper.accessor('firstName', {
    icon: UserIcon,
    header: 'First Name',
  }),
  columnHelper.accessor('lastName', {
    icon: UserIcon,
    header: 'Last Name',
  }),
  columnHelper.accessor('company', {
    icon: BuildingIcon,
    header: 'Company',
    size: 300,
  }),
  columnHelper.accessor('city', {
    icon: Building2Icon,
    header: 'City',
  }),
  columnHelper.accessor('country', {
    icon: GlobeIcon,
    header: 'Country',
    size: 220,
  }),
];

const Example = () => {
  const handleExportRows = (rows: ST_Row<Person>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('st-pdf-example.pdf');
  };

  const table = useShadcnTable({
    columns,
    data,
    enableRowSelection: true,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex flex-wrap gap-4 p-2">
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
