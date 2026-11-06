import { ShadcnTable } from '@/components/ui/shadcn-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];
const data = [
  { name: 'Ada', age: 36 },
  { name: 'Linus', age: 54 },
];

export default function App() {
  return <ShadcnTable columns={columns} data={data} />;
}
