import { useMemo } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { ShadcnReactTable } from '../components/ui/shadcn-react-table/ShadcnReactTable';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  department: 'Engineering' | 'Design' | 'Sales' | 'Marketing' | 'Support';
};

const cities = ['London', 'Paris', 'Berlin', 'Tokyo'];
const departments: Person['department'][] = [
  'Engineering',
  'Design',
  'Sales',
  'Marketing',
  'Support',
];
const firstNames = ['Ada', 'Grace', 'Alan', 'Marie', 'Nikola', 'Isaac'];
const lastNames = ['Lovelace', 'Hopper', 'Turing', 'Curie', 'Tesla', 'Newton'];

const data: Person[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  firstName: firstNames[i % firstNames.length],
  lastName: lastNames[i % lastNames.length],
  city: cities[i % cities.length],
  department: departments[i % departments.length],
}));

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'city', header: 'City' },
      { accessorKey: 'department', header: 'Department' },
    ],
    [],
  );
}

// Dedicated harness for SRT_ToolbarAlertBanner (shadcn Alert + Badge + Button
// rewrite). Selection + select-all populate the "N of M row(s) selected"
// alert; two initial grouped columns exercise the "Grouped by … then by …"
// chips so the thenBy path is covered.
export function SRT_AlertBannerDemo() {
  const columns = useColumns();

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableToolbarInternalActions: true,

    enableRowSelection: true,
    enableSelectAll: true,

    enableGrouping: true,

    srtTableLayoutProps: { id: 'srt-alertbanner-layout' },

    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
      grouping: ['department', 'city'],
    },
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT Alert Banner (rewrite)</h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        Toolbar alert banner rebuilt on shadcn Alert + Badge + Button. Sits at
        the top of the table body, between the top toolbar and the head.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>banner renders as shadcn Alert (role=alert, no border/radius)</li>
        <li>
          select rows shows &quot;N of M row(s) selected&quot; + clear button
        </li>
        <li>
          grouped by 2 columns shows &quot;Grouped by … then by …&quot; badges
        </li>
        <li>chip X ungroups that column; clear button clears selection</li>
      </ul>
      <ShadcnReactTable table={table} />
    </section>
  );
}
