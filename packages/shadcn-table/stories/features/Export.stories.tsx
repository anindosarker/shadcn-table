import {
  type ST_Row,
  ShadcnTable,
  createSRTColumnHelper,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import {
  Building2Icon,
  BuildingIcon,
  DownloadIcon,
  GlobeIcon,
  HashIcon,
  UserIcon,
} from 'lucide-react';
import { download, generateCsv, mkConfig } from 'export-to-csv'; //or use your library of choice here
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { ST_BASE } from '../../.storybook/themes';

// The exact stories of the docs examples export-csv and export-pdf: the same
// columns, options and data, and the same export libraries.
const meta: Meta = {
  title: 'Features/Export',
};

export default meta;

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  city: string;
  country: string;
};

const data: Person[] = [
  {
    id: 1,
    firstName: 'Elenora',
    lastName: 'Wilkinson',
    company: 'Feest - Reilly',
    city: 'Hertaland',
    country: 'Qatar',
  },
  {
    id: 2,
    firstName: 'Berneice',
    lastName: 'Feil',
    company: 'Deckow, Leuschke and Jaskolski',
    city: 'Millcreek',
    country: 'Nepal',
  },
  {
    id: 3,
    firstName: 'Frieda',
    lastName: 'Baumbach',
    company: 'Heidenreich, Grady and Durgan',
    city: 'Volkmanside',
    country: 'Croatia',
  },
  {
    id: 4,
    firstName: 'Zachery',
    lastName: 'Brown',
    company: 'Cormier - Skiles',
    city: 'Faychester',
    country: 'Saint Pierre and Miquelon',
  },
  {
    id: 5,
    firstName: 'Kendra',
    lastName: 'Bins',
    company: 'Wehner - Wilderman',
    city: 'New Valentin',
    country: 'Senegal',
  },
  {
    id: 6,
    firstName: 'Lysanne',
    lastName: 'Fisher',
    company: 'Schmidt LLC',
    city: 'Malachitown',
    country: 'Costa Rica',
  },
  {
    id: 7,
    firstName: 'Garrick',
    lastName: 'Ryan',
    company: 'Ryan - Buckridge',
    city: 'East Pearl',
    country: 'Cocos (Keeling) Islands',
  },
  {
    id: 8,
    firstName: 'Hollis',
    lastName: 'Medhurst',
    company: 'Quitzon Group',
    city: 'West Sienna',
    country: 'Papua New Guinea',
  },
  {
    id: 9,
    firstName: 'Arlo',
    lastName: 'Buckridge',
    company: 'Konopelski - Spinka',
    city: 'Chino',
    country: 'Congo',
  },
  {
    id: 10,
    firstName: 'Rickie',
    lastName: 'Auer',
    company: 'Lehner - Walsh',
    city: 'Nyahfield',
    country: 'Sudan',
  },
  {
    id: 11,
    firstName: 'Isidro',
    lastName: 'Larson',
    company: 'Reichert - Paucek',
    city: 'Fort Rosinaside',
    country: 'Belize',
  },
  {
    id: 12,
    firstName: 'Bettie',
    lastName: 'Skiles',
    company: 'Zulauf, Flatley and Rolfson',
    city: 'West Feltonchester',
    country: 'Poland',
  },
];

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

/**
 * A button's disabled state on every base: React Aria's Button reads
 * `isDisabled`, the others the native `disabled`.
 */
const disabledProps = (disabled: boolean) =>
  ST_BASE === 'aria' ? { isDisabled: disabled } : { disabled };

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const CsvExportTable = () => {
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
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex flex-wrap gap-4 p-2">
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
        >
          <DownloadIcon />
          Export All Data
        </Button>
        <Button
          {...disabledProps(table.getPrePaginatedRowModel().rows.length === 0)}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginatedRowModel().rows)}
        >
          <DownloadIcon />
          Export All Rows
        </Button>
        <Button
          {...disabledProps(table.getRowModel().rows.length === 0)}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
        >
          <DownloadIcon />
          Export Page Rows
        </Button>
        <Button
          {...disabledProps(!table.getIsSomeRowsSelected())}
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        >
          <DownloadIcon />
          Export Selected Rows
        </Button>
      </div>
    ),
  });

  return <ShadcnTable table={table} />;
};

const PdfExportTable = () => {
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
          {...disabledProps(table.getPrePaginatedRowModel().rows.length === 0)}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginatedRowModel().rows)}
        >
          <DownloadIcon />
          Export All Rows
        </Button>
        <Button
          {...disabledProps(table.getRowModel().rows.length === 0)}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
        >
          <DownloadIcon />
          Export Page Rows
        </Button>
        <Button
          {...disabledProps(!table.getIsSomeRowsSelected())}
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        >
          <DownloadIcon />
          Export Selected Rows
        </Button>
      </div>
    ),
  });

  return <ShadcnTable table={table} />;
};

/** Ticks the first two rows. */
const selectTwoRows = async (canvasElement: HTMLElement) => {
  const [first, second] = within(canvasElement).getAllByRole('checkbox', {
    name: 'Toggle select row',
  });
  await userEvent.click(first!);
  await userEvent.click(second!);
};

/**
 * The CSV export: the play catches each file before the browser saves it
 * and counts its lines, a header and one line per row.
 */
export const CsvExport = {
  name: 'CSV Export',
  render: () => <CsvExportTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Elenora');
    const files: Blob[] = [];
    const createUrl = spyOn(URL, 'createObjectURL').mockImplementation(
      (file) => {
        files.push(file as Blob);
        return 'blob:story';
      },
    );
    const click = spyOn(
      HTMLAnchorElement.prototype,
      'click',
    ).mockImplementation(() => {});
    const lines = async (file: Blob) =>
      (await file.text()).trim().split('\n').length;
    try {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Export All Data' }),
      );
      await waitFor(() => expect(files).toHaveLength(1));
      expect(await lines(files[0]!)).toBe(1 + data.length);

      await selectTwoRows(canvasElement);
      await userEvent.click(
        canvas.getByRole('button', { name: 'Export Selected Rows' }),
      );
      await waitFor(() => expect(files).toHaveLength(2));
      expect(await lines(files[1]!)).toBe(1 + 2);
    } finally {
      createUrl.mockRestore();
      click.mockRestore();
    }
  },
};

/**
 * The PDF export: the play catches each document before it is saved and
 * counts the rows of its table.
 */
export const PdfExport = {
  name: 'PDF Export',
  render: () => <PdfExportTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Elenora');
    const rowCounts: number[] = [];
    // A plugin on jsPDF.API overrides the built-in save of every new document.
    const api = jsPDF.API as unknown as { save?: (this: jsPDF) => jsPDF };
    api.save = function () {
      const table = (this as unknown as { lastAutoTable: { body: unknown[] } })
        .lastAutoTable;
      rowCounts.push(table.body.length);
      return this;
    };
    try {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Export All Rows' }),
      );
      await waitFor(() => expect(rowCounts).toEqual([data.length]));

      await selectTwoRows(canvasElement);
      await userEvent.click(
        canvas.getByRole('button', { name: 'Export Selected Rows' }),
      );
      await waitFor(() => expect(rowCounts).toEqual([data.length, 2]));
    } finally {
      delete api.save;
    }
  },
};
