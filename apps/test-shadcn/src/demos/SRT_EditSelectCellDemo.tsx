import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { ShadcnReactTable } from '../components/ui/shadcn-react-table/ShadcnReactTable';

type Person = {
  id: number;
  firstName: string;
  city: string;
  department: string;
};

const cities = ['London', 'Paris', 'Berlin', 'Tokyo', 'New York', 'Sydney'];
const departments = ['Engineering', 'Design', 'Sales', 'Marketing', 'Support'];

const seed: Person[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  firstName: [
    'Ada',
    'Grace',
    'Alan',
    'Marie',
    'Nikola',
    'Tim',
    'Isaac',
    'Hedy',
  ][i],
  city: cities[i % cities.length],
  department: departments[i % departments.length],
}));

// editDisplayMode 'cell' + editVariant 'select' — the raw <select> is now a
// radix Select. Tests: click cell → radix Select opens → pick option → commits
// + exits; focus the trigger and click elsewhere WITHOUT opening → edit exits
// (blur-exit fix).
export function SRT_EditSelectCellDemo() {
  const [data, setData] = useState<Person[]>(seed);
  const [lastSaved, setLastSaved] = useState('(none yet)');

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'firstName', header: 'Name', enableEditing: false },
      {
        accessorKey: 'city',
        header: 'City',
        enableEditing: true,
        editVariant: 'select',
        editSelectOptions: cities,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        enableEditing: true,
        editVariant: 'select',
        editSelectOptions: departments,
      },
    ],
    [],
  );

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),
    srtTableLayoutProps: { id: 'srt-editselect-layout' },
    // no pagination/bottom toolbar: keeps the only radix Select in this table
    // the edit-cell one (a rows-per-page Select would be another select-trigger)
    enablePagination: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableEditing: true,
    editDisplayMode: 'cell',
    onEditingCellSave: ({ cell, value }) => {
      const rowId = cell.row.original.id;
      const colId = cell.column.id;
      setData((prev) =>
        prev.map((p) => (p.id === rowId ? { ...p, [colId]: value } : p)),
      );
      setLastSaved(`${colId} of row ${rowId} = "${value}"`);
      console.log('[editselect-demo] cell saved', colId, rowId, value);
    },
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT Edit Cell (select)</h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        editDisplayMode 'cell' with editVariant 'select' columns. The edit
        control is a radix Select (data-slot=select-trigger).
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>click City/Department cell → radix Select opens</li>
        <li>pick an option → value commits, edit exits</li>
        <li>focus trigger, click elsewhere without opening → edit exits</li>
      </ul>
      <div className="mb-3 rounded-md border p-3 text-sm">
        <span className="font-medium">Last saved:</span>{' '}
        <span id="srt-editselect-last-saved">{lastSaved}</span>
      </div>
      <ShadcnReactTable table={table} />
    </section>
  );
}
