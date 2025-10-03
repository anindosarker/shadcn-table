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
];

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'age', header: 'Age' },
];
const tableOptions: SRT_TableOptions<Person> = {
  columns,
  data,
};

function App() {
  const [isDark, setIsDark] = useState(false);

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
    state: {
      isLoading: true,
      showProgressBars: true,
    },
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

      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Table Options API</h2>
          <ShadcnReactTable {...tableOptions} />
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Hook Example</h2>
          <ShadcnReactTable table={table} />
        </div>
      </div>
    </div>
  );
}

export default App;
