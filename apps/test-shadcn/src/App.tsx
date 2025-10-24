import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import ShadcnReactTable from './components/ui/shadcn-react-table/ShadcnReactTable';
import {
  type SRT_TableOptions,
  useShadcnReactTable,
} from 'shadcn-react-table-core';

type Person = { name: string; email: string; age: number };

const data: Person[] = [
  { name: 'Ada Lovelace', email: 'ada@example.com', age: 36 },
  { name: 'Grace Hopper', email: 'grace@example.com', age: 45 },
  { name: 'Edsger Dijkstra', email: 'edsger@example.com', age: 51 },
  { name: 'Alan Turing', email: 'alan@example.com', age: 41 },
  { name: 'Margaret Hamilton', email: 'margaret@example.com', age: 38 },
  { name: 'Charles Babbage', email: 'charles@example.com', age: 47 },
  { name: 'Tim Berners-Lee', email: 'tim@example.com', age: 56 },
  { name: 'Isaac Newton', email: 'isaac@example.com', age: 64 },
  { name: 'Marie Curie', email: 'marie@example.com', age: 54 },
  { name: 'Nikola Tesla', email: 'nikola@example.com', age: 58 },
  { name: 'Albert Einstein', email: 'albert@example.com', age: 62 },
  { name: 'Galileo Galilei', email: 'galileo@example.com', age: 70 },
  { name: 'Johannes Kepler', email: 'johannes@example.com', age: 67 },
  { name: 'René Descartes', email: 'rene@example.com', age: 59 },
  { name: 'Francis Bacon', email: 'francis@example.com', age: 63 },
  { name: 'Isaac Asimov', email: 'isaac@example.com', age: 62 },
  { name: 'Carl Sagan', email: 'carl@example.com', age: 65 },
  { name: 'Stephen Hawking', email: 'stephen@example.com', age: 66 },
];

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    enableSorting: true,
    enableColumnFilter: true,
    Footer: () => {
      const total = data.reduce((sum, person) => sum + person.age, 0);
      return (
        <div className="font-bold">Avg: {(total / data.length).toFixed(1)}</div>
      );
    },
  },
];
const tableOptions: SRT_TableOptions<Person> = {
  columns,
  data,
};

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    // Toolbar
    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableToolbarInternalActions: true,

    // Toolbar buttons
    enableFullScreenToggle: true,
    enableDensityToggle: true,
    enableGlobalFilter: true,
    positionGlobalFilter: 'right',
    enableColumnFilters: true,
    // enableFiltersButton: true, // TODO: Add to core types
    // enableShowHideColumnsButton: true, // TODO: Add to core types

    // Table features
    enableSorting: true,
    enableColumnResizing: false,
    enableRowSelection: false,
    enableExpandAll: false,

    // Footer
    enableTableFooter: true,

    // Loading/Progress
    state: {
      isLoading: false,
      showProgressBars: false,
    },

    // Detail panel for row expansion (commented for now)
    // renderDetailPanel: ({ row }) => (
    //   <div className="p-4 text-sm">
    //     <p>Details for <strong>{row.original.name}</strong></p>
    //     <p>Email: {row.original.email}</p>
    //     <p>Age: {row.original.age} years old</p>
    //   </div>
    // ),
  });
  return (
    <div className="min-h-screen p-6">
      {/* Theme Controls */}
      <div className="mb-6 flex gap-4">
        <Button onClick={() => setIsDark(!isDark)} variant="outline">
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Button>
      </div>

      <h1 className="mb-4 text-2xl font-bold">shadcn-react-table Demo</h1>

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
          🧪 Testing Components - {data.length} rows
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
              Toolbar Buttons (Top Right)
            </h4>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>
                🔍 <strong>Global Search</strong> - Click to show/hide search
                input
              </li>
              <li>
                🗂️ <strong>Show/Hide Columns</strong> - Toggle column visibility
              </li>
              <li>
                🔽 <strong>Filters</strong> - Show/hide column filters
              </li>
              <li>
                📏 <strong>Density</strong> - Cycle: Comfortable → Compact →
                Spacious
              </li>
              <li>
                ⛶ <strong>Fullscreen</strong> - Maximize/minimize view
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
              Table Features
            </h4>
            <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <li>
                ↕️ <strong>Sorting</strong> - Click column headers to sort
              </li>
              <li>
                🔎 <strong>Column Filters</strong> - Filter individual columns
              </li>
              <li>
                📊 <strong>Footer</strong> - See age average calculation
              </li>
              <li>
                🌓 <strong>Theme</strong> - Toggle dark/light mode
              </li>
              <li>
                📦 <strong>59 Components</strong> - All scaffolded!
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-lg font-semibold">
            Hook Example - Full Featured
          </h2>
          <ShadcnReactTable table={table} />
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">
            Table Options API - Minimal
          </h2>
          <ShadcnReactTable {...tableOptions} />
        </div>
      </div>
    </div>
  );
}

export default App;
