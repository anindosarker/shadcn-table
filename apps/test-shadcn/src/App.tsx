import { useEffect, useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { SRT_ButtonsDemo } from './components/SRT_ButtonsDemo';
import { SRT_EditRowModalDemo } from './components/SRT_EditRowModalDemo';
import { SRT_InputsMenusDemo } from './components/SRT_InputsMenusDemo';
import { Button } from './components/ui/button';
import { ShadcnReactTable } from './components/ui/shadcn-react-table/ShadcnReactTable';
import { SRT_AlertBannerDemo } from './demos/SRT_AlertBannerDemo';
import { SRT_EditSelectCellDemo } from './demos/SRT_EditSelectCellDemo';
import { SRT_HeadBodyFooterDemo } from './demos/SRT_HeadBodyFooterDemo';
import { SRT_TableContainerDemo } from './demos/SRT_TableContainerDemo';
import { SRT_TableDemo } from './demos/SRT_TableDemo';
import { SRT_TableLoadingOverlayDemo } from './demos/SRT_TableLoadingOverlayDemo';
import { SRT_ToolbarsDemo } from './demos/SRT_ToolbarsDemo';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  city: string;
  department: 'Engineering' | 'Design' | 'Sales' | 'Marketing' | 'Support';
  salary: number;
};

const cities = ['London', 'Paris', 'Berlin', 'Tokyo', 'New York', 'Sydney'];
const departments: Person['department'][] = [
  'Engineering',
  'Design',
  'Sales',
  'Marketing',
  'Support',
];
const firstNames = [
  'Ada',
  'Grace',
  'Edsger',
  'Alan',
  'Margaret',
  'Charles',
  'Tim',
  'Isaac',
  'Marie',
  'Nikola',
  'Albert',
  'Galileo',
  'Johannes',
  'René',
  'Francis',
  'Carl',
  'Stephen',
  'Katherine',
  'Dorothy',
  'Hedy',
];
const lastNames = [
  'Lovelace',
  'Hopper',
  'Dijkstra',
  'Turing',
  'Hamilton',
  'Babbage',
  'Berners-Lee',
  'Newton',
  'Curie',
  'Tesla',
  'Einstein',
  'Galilei',
  'Kepler',
  'Descartes',
  'Bacon',
  'Sagan',
  'Hawking',
  'Johnson',
  'Vaughan',
  'Lamarr',
];

function makeData(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    return {
      id: i + 1,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      age: 25 + ((i * 7) % 45),
      city: cities[i % cities.length],
      department: departments[i % departments.length],
      salary: 50000 + ((i * 3137) % 120000),
    };
  });
}

const smallData = makeData(25);

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        enableColumnFilter: true,
        enableEditing: true,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        enableColumnFilter: true,
        enableEditing: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnFilter: true,
        enableEditing: true,
        size: 240,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        filterVariant: 'multi-select',
        editVariant: 'select',
        editSelectOptions: departments as unknown as string[],
        filterSelectOptions: departments as unknown as string[],
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'select',
        filterSelectOptions: cities,
        editVariant: 'select',
        editSelectOptions: cities,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        filterVariant: 'range-slider',
        enableEditing: true,
        aggregationFn: 'mean',
        Footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const avg =
            rows.reduce((s, r) => s + r.original.age, 0) / (rows.length || 1);
          return <div className="font-bold">Avg: {avg.toFixed(1)}</div>;
        },
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        filterVariant: 'range',
        Cell: ({ cell }) => (
          <span>${cell.getValue<number>().toLocaleString()}</span>
        ),
      },
    ],
    [],
  );
}

function App() {
  const [isDark, setIsDark] = useState(true);
  const columns = useColumns();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Full-featured table
  const table = useShadcnReactTable<Person>({
    columns,
    data: smallData,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableToolbarInternalActions: true,
    enableFullScreenToggle: true,
    srtTableLayoutProps: {
      id: 'layout',
      className: 'srt-custom-layout',
    },
    enableDensityToggle: true,
    enableGlobalFilter: true,
    positionGlobalFilter: 'right',
    enableColumnFilters: true,

    enableSorting: true,
    enableMultiSort: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableColumnOrdering: true,
    enableColumnDragging: true,
    enableColumnPinning: true,

    enableRowSelection: true,
    enableRowNumbers: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: ({ row, table: t }) => [
      <div
        key="log"
        className="cursor-pointer px-2 py-1.5 text-sm hover:bg-accent"
        onClick={() => {
          console.log('[demo] row action: view', row.original);
        }}
      >
        View details
      </div>,
      <div
        key="edit-row"
        className="cursor-pointer px-2 py-1.5 text-sm hover:bg-accent"
        onClick={() => t.setEditingRow(row)}
      >
        Edit row
      </div>,
    ],

    enableEditing: true,
    editDisplayMode: 'row',
    onEditingRowSave: ({ values, table: t }) => {
      console.log('[demo] saved row', values);
      t.setEditingRow(null);
    },

    enableExpandAll: true,
    renderDetailPanel: ({ row }) => (
      <div className="p-4 text-sm">
        <p>
          <strong>
            {row.original.firstName} {row.original.lastName}
          </strong>{' '}
          — {row.original.department}
        </p>
        <p>Email: {row.original.email}</p>
        <p>City: {row.original.city}</p>
        <p>Salary: ${row.original.salary.toLocaleString()}</p>
      </div>
    ),

    enableTableFooter: true,
    initialState: {
      columnPinning: { left: ['mrt-row-select'], right: ['mrt-row-actions'] },
    },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="sticky top-0 z-40 -mx-6 mb-6 flex items-center gap-4 py-3 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">shadcn-react-table Demo</h1>
        <Button onClick={() => setIsDark(!isDark)} variant="outline" size="sm">
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </div>

      <div className="space-y-10">
        <SRT_EditSelectCellDemo />
        <SRT_AlertBannerDemo />
        <SRT_EditRowModalDemo />
        <SRT_ButtonsDemo />
        <SRT_InputsMenusDemo />
        <SRT_ToolbarsDemo />
        <SRT_HeadBodyFooterDemo />
        <SRT_TableLoadingOverlayDemo />
        <SRT_TableDemo />
        <SRT_TableContainerDemo />
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Full Featured (sort, filter, select, edit, expand, pin, reorder,
            resize, row actions)
          </h2>
          <ShadcnReactTable table={table} />
        </section>
      </div>
    </div>
  );
}

export default App;
