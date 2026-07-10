import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { ShadcnReactTable } from './ui/shadcn-react-table/ShadcnReactTable';
import { Button } from './ui/button';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
};

function makeData(): Person[] {
  const rows: Array<[string, string, string]> = [
    ['Ada', 'Lovelace', 'London'],
    ['Grace', 'Hopper', 'New York'],
    ['Alan', 'Turing', 'Berlin'],
    ['Margaret', 'Hamilton', 'Paris'],
    ['Katherine', 'Johnson', 'Tokyo'],
    ['Tim', 'Berners-Lee', 'Sydney'],
  ];
  return rows.map(([firstName, lastName, city], i) => ({
    id: i + 1,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName
      .toLowerCase()
      .replace(/[^a-z]/g, '')}@example.com`,
    city,
  }));
}

const data = makeData();

export function SRT_EditRowModalDemo() {
  const [lastSaved, setLastSaved] = useState<string>('(none yet)');

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      // enableEditing:false column — MRT still renders it in the modal
      // (internalEditComponents filters columnDefType==='data' only); the
      // per-cell field itself is disabled inside SRT_EditCellTextField.
      { accessorKey: 'id', header: 'ID', enableEditing: false, size: 80 },
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'email', header: 'Email', size: 240 },
      { accessorKey: 'city', header: 'City' },
    ],
    [],
  );

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),
    enableEditing: true,
    editDisplayMode: 'modal',
    createDisplayMode: 'modal',
    onEditingRowSave: ({ exitEditingMode, values }) => {
      setLastSaved(`edit → ${JSON.stringify(values)}`);
      exitEditingMode();
    },
    onCreatingRowSave: ({ exitCreatingMode, values }) => {
      setLastSaved(`create → ${JSON.stringify(values)}`);
      exitCreatingMode();
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        id="srt-editrowmodal-create"
        size="sm"
        variant="outline"
        onClick={() => table.setCreatingRow(true)}
      >
        Create row
      </Button>
    ),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <section id="srt-editrowmodal-demo">
      <h2 className="mb-1 text-lg font-semibold">SRT EditRowModal</h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        The Dialog that hosts row editing / creating when editDisplayMode /
        createDisplayMode is &apos;modal&apos;. Rendered by SRT_TableContainer
        when creatingRow/editingRow is set.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>pencil in the row-actions column opens the Edit modal, centered</li>
        <li>modal has NO top-right close X (MUI-Dialog parity)</li>
        <li>width ~444px (MUI xs breakpoint)</li>
        <li>
          all 4 data columns get inputs; the ID column (enableEditing:false)
          still shows a disabled field
        </li>
        <li>Save persists via onEditingRowSave; Cancel discards</li>
        <li>Escape key + overlay click close via the cancel path</li>
        <li>
          &quot;Create row&quot; toolbar button opens an empty-input modal
        </li>
        <li>no radix &quot;Missing Description&quot; console warning</li>
      </ul>

      <div
        id="srt-editrowmodal-lastsaved"
        className="mb-3 rounded-md border p-3 font-mono text-sm"
      >
        last saved: {lastSaved}
      </div>

      <ShadcnReactTable table={table} />
    </section>
  );
}
