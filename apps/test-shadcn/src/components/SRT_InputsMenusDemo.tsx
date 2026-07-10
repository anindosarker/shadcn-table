import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { Copy, Eye, Trash2 } from 'lucide-react';
import { ShadcnReactTable } from './ui/shadcn-react-table/ShadcnReactTable';
import { SRT_ActionMenuItem } from './ui/shadcn-react-table/menus/SRT_ActionMenuItem';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  city: string;
  department: 'Engineering' | 'Design' | 'Sales' | 'Marketing' | 'Support';
  salary: number;
  // string 'true' / 'false' so the checkbox filter's equals compare matches
  active: 'true' | 'false';
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
      active: i % 3 === 0 ? 'false' : 'true',
    };
  });
}

const seedData = makeData(15);

export function SRT_InputsMenusDemo() {
  const [data, setData] = useState<Person[]>(seedData);
  const [lastSaved, setLastSaved] = useState<string>('(none yet)');

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        // text filter + click-to-copy via right-click context menu
        enableClickToCopy: 'context-menu',
        enableEditing: true,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        filterVariant: 'text',
        enableEditing: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 240,
        enableEditing: true,
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'select',
        filterSelectOptions: cities,
        enableEditing: false,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        filterVariant: 'multi-select',
        filterSelectOptions: departments as unknown as string[],
        enableEditing: false,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        filterVariant: 'range',
        enableEditing: false,
        Cell: ({ cell }) => (
          <span>${cell.getValue<number>().toLocaleString()}</span>
        ),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        filterVariant: 'range-slider',
        enableEditing: false,
      },
      {
        accessorKey: 'active',
        header: 'Active',
        filterVariant: 'checkbox',
        enableEditing: false,
        Cell: ({ cell }) => (
          <span>{cell.getValue<string>() === 'true' ? 'Yes' : 'No'}</span>
        ),
      },
    ],
    [],
  );

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    srtTableLayoutProps: { id: 'srt-inputs-menus-layout' },

    enableColumnFilters: true,
    enableColumnFilterModes: true,
    enableGlobalFilter: true,
    positionGlobalFilter: 'right',

    enableColumnActions: true,
    enableColumnOrdering: true,
    enableColumnDragging: true,
    enableColumnPinning: true,
    enableHiding: true,

    enableRowSelection: true,

    enableEditing: true,
    editDisplayMode: 'cell',

    enableCellActions: true,

    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <SRT_ActionMenuItem
        key="view"
        icon={<Eye className="h-4 w-4" />}
        label="View details"
        table={table}
        onClick={() => {
          console.log('[inputs-menus-demo] view', row.original);
          closeMenu();
        }}
      />,
      <SRT_ActionMenuItem
        key="copy"
        icon={<Copy className="h-4 w-4" />}
        label="Copy email"
        divider
        table={table}
        onClick={() => {
          navigator.clipboard?.writeText(row.original.email);
          console.log('[inputs-menus-demo] copy email', row.original.email);
          closeMenu();
        }}
      />,
      <SRT_ActionMenuItem
        key="delete"
        icon={<Trash2 className="h-4 w-4" />}
        label="Delete row"
        table={table}
        onClick={() => {
          setData((prev) => prev.filter((p) => p.id !== row.original.id));
          console.log('[inputs-menus-demo] delete', row.original.id);
          closeMenu();
        }}
      />,
    ],

    // editDisplayMode 'cell' fires this on blur / Enter
    onEditingCellSave: ({ cell, value }) => {
      const rowId = cell.row.original.id;
      const colId = cell.column.id;
      setData((prev) =>
        prev.map((p) => (p.id === rowId ? { ...p, [colId]: value } : p)),
      );
      setLastSaved(`${colId} of row ${rowId} = "${value}"`);
      console.log('[inputs-menus-demo] cell saved', colId, rowId, value);
    },

    initialState: {
      showColumnFilters: true,
      columnPinning: { left: ['mrt-row-select'], right: ['mrt-row-actions'] },
    },
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">
        SRT Inputs &amp; Menus cluster
      </h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        Combined exercise of the inputs/ filter + edit fields and the menus/
        action/column/cell/show-hide menus. Column filters are shown by default.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>global filter: search button reveals input, filters, clears</li>
        <li>text filter (Last Name) filters and clears</li>
        <li>select filter (City) + multi-select filter (Department)</li>
        <li>range filter (Salary min/max) + range-slider filter (Age)</li>
        <li>checkbox filter (Active) tri-state toggle</li>
        <li>filter option menu: column actions → filter mode, switch mode</li>
        <li>column actions menu: sort, hide, pin left/right/unpin</li>
        <li>
          show/hide columns menu (toolbar): toggle stays open, hide/show all
        </li>
        <li>row actions menu: 3 items, divider after &quot;Copy email&quot;</li>
        <li>
          cell actions: right-click First Name → Copy + Edit (editDisplayMode
          cell)
        </li>
        <li>edit cell: double-click editable cell, type, blur saves</li>
        <li>row selection checkboxes + select-all</li>
      </ul>

      <div className="mb-3 rounded-md border p-3 text-sm">
        <span className="font-medium">Last edited cell save:</span>{' '}
        <span id="srt-inputs-menus-last-saved">{lastSaved}</span>
      </div>

      <ShadcnReactTable table={table} />
    </section>
  );
}
