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

const tableOptions: SRT_TableOptions<Person> = {
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'age', header: 'Age' },
  ],
  data,
};

function App() {
  const table = useShadcnReactTable<Person>(tableOptions);
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">shadcn-react-table Demo</h1>
      <ShadcnReactTable {...tableOptions} />

      <h1 className="mb-4 mt-8 text-2xl font-bold">Hook Example</h1>
      <ShadcnReactTable table={table} />
    </div>
  );
}

export default App;
