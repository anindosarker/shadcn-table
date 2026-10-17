import { useMemo } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
import { ShadcnReactTable } from '../components/ui/shadcn-react-table/ShadcnReactTable';

type Person = {
  id: number;
  name: string;
  role: string;
  email: string;
  city: string;
};

const data: Person[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    role: 'Engineer',
    email: 'ada@example.com',
    city: 'London',
  },
  {
    id: 2,
    name: 'Grace Hopper',
    role: 'Admiral',
    email: 'grace@example.com',
    city: 'New York',
  },
  {
    id: 3,
    name: 'Alan Turing',
    role: 'Mathematician',
    email: 'alan@example.com',
    city: 'Manchester',
  },
  {
    id: 4,
    name: 'Marie Curie',
    role: 'Physicist',
    email: 'marie@example.com',
    city: 'Paris',
  },
  {
    id: 5,
    name: 'Nikola Tesla',
    role: 'Inventor',
    email: 'nikola@example.com',
    city: 'New York',
  },
  {
    id: 6,
    name: 'Isaac Newton',
    role: 'Physicist',
    email: 'isaac@example.com',
    city: 'London',
  },
  {
    id: 7,
    name: 'Katherine Johnson',
    role: 'Mathematician',
    email: 'katherine@example.com',
    city: 'Hampton',
  },
];

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'role', header: 'Role' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'city', header: 'City' },
    ],
    [],
  );
}

export function SRT_PopoverFiltersDemo() {
  const columns = useColumns();

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    columnFilterDisplayMode: 'popover',
    enableColumnFilters: true,

    srtTableLayoutProps: { id: 'srt-popover-filters-layout' },
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT Popover Column Filters</h2>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>funnel icon beside each header opens the filter in a popover</li>
        <li>typing a value keeps the funnel at full opacity</li>
        <li>toolbar filter toggle is hidden in popover mode</li>
      </ul>
      <ShadcnReactTable table={table} />
    </section>
  );
}
