import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { ShadcnReactTable } from '../components/ui/shadcn-react-table/ShadcnReactTable';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

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

const data = makeData(60);

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        filterVariant: 'text',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        filterVariant: 'text',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 240,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        filterVariant: 'multi-select',
        filterSelectOptions: departments as unknown as string[],
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'select',
        filterSelectOptions: cities,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        filterVariant: 'range-slider',
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        filterVariant: 'range',
        Cell: ({ cell }) => (
          <span>${cell.getValue<number>().toLocaleString()}</span>
        ),
        // numeric column carrying an aggregate Footer (tfoot)
        Footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = rows.reduce((s, r) => s + r.original.salary, 0);
          return (
            <div className="font-bold">Total: ${total.toLocaleString()}</div>
          );
        },
      },
    ],
    [],
  );
}

type LayoutMode = 'semantic' | 'grid' | 'grid-no-grow';
type RowPinning = 'off' | 'sticky' | 'top-and-bottom';

type TableProps = {
  sticky: boolean;
  layoutMode: LayoutMode;
  resizing: boolean;
  selection: boolean;
  expand: boolean;
  pinning: boolean;
  rowPinning: RowPinning;
  skeletons: boolean;
  footer: boolean;
  columnFilters: boolean;
};

// Table lives in an inner component so structural toggles (pinning, row
// pinning, column filters) can remount it via `key` and re-seed initialState.
function HeadBodyFooterTable(props: TableProps) {
  const columns = useColumns();
  const {
    sticky,
    layoutMode,
    resizing,
    selection,
    expand,
    pinning,
    rowPinning,
    skeletons,
    footer,
    columnFilters,
  } = props;

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableToolbarInternalActions: true,
    enableDensityToggle: true,

    enableStickyHeader: sticky,
    enableStickyFooter: sticky,
    layoutMode,

    enableColumnResizing: resizing,

    enableRowSelection: selection,
    enableSelectAll: selection,

    enableExpandAll: expand,
    renderDetailPanel: expand
      ? ({ row }) => (
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
        )
      : undefined,

    enableColumnPinning: pinning,

    enableRowPinning: rowPinning !== 'off',
    rowPinningDisplayMode:
      rowPinning === 'sticky' ? 'sticky' : 'top-and-bottom',

    enableColumnFilters: columnFilters,

    enableTableFooter: footer,

    initialState: {
      ...(pinning
        ? { columnPinning: { left: ['firstName'], right: ['salary'] } }
        : {}),
      ...(rowPinning !== 'off'
        ? { rowPinning: { top: ['3'], bottom: ['7'] } }
        : {}),
      showColumnFilters: columnFilters,
    },

    state: { showSkeletons: skeletons },
  });

  return <ShadcnReactTable table={table} />;
}

export function SRT_HeadBodyFooterDemo() {
  const [sticky, setSticky] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('semantic');
  const [resizing, setResizing] = useState(false);
  const [selection, setSelection] = useState(false);
  const [expand, setExpand] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [rowPinning, setRowPinning] = useState<RowPinning>('off');
  const [skeletons, setSkeletons] = useState(false);
  const [footer, setFooter] = useState(true);
  const [columnFilters, setColumnFilters] = useState(false);

  // remount when initialState-seeded structural options change
  const remountKey = `${pinning}-${rowPinning}-${columnFilters}`;

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">
        SRT_TableHead + Body + Footer
      </h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        The three main table regions: the <code>thead</code> (head rows/cells,
        sort/filter/resize/pin/select-all/expand-all controls), the{' '}
        <code>tbody</code> (body rows/cells, selection, expand, detail panels,
        skeletons), and the <code>tfoot</code> (footer rows/cells with aggregate
        Footers).
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>semantic layout: table fills card width, thead has no bg band</li>
        <li>column resize handle drags width; double-click resets</li>
        <li>grid mode grows to fill; grid-no-grow keeps fixed widths</li>
        <li>sticky header stays visible with solid bg on scroll</li>
        <li>select-all + per-row checkboxes select (row turns muted)</li>
        <li>expand-all + per-row expand render the detail panel</li>
        <li>pinned columns stick during horizontal scroll</li>
        <li>row pinning keeps pinned rows stuck with offset</li>
        <li>skeletons show pulse placeholders per cell when loading</li>
        <li>footer renders aggregate Salary total in tfoot</li>
      </ul>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border p-3">
        <Label className="gap-2">
          <Checkbox
            checked={sticky}
            onCheckedChange={(v) => setSticky(v === true)}
          />
          sticky header
        </Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-hbf-layout">layout</Label>
          <Select
            value={layoutMode}
            onValueChange={(v) => setLayoutMode(v as LayoutMode)}
          >
            <SelectTrigger id="srt-hbf-layout" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semantic">semantic</SelectItem>
              <SelectItem value="grid">grid</SelectItem>
              <SelectItem value="grid-no-grow">grid-no-grow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Label className="gap-2">
          <Checkbox
            checked={resizing}
            onCheckedChange={(v) => setResizing(v === true)}
          />
          resizing
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={selection}
            onCheckedChange={(v) => setSelection(v === true)}
          />
          selection
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={expand}
            onCheckedChange={(v) => setExpand(v === true)}
          />
          expand
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={pinning}
            onCheckedChange={(v) => setPinning(v === true)}
          />
          column pinning
        </Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-hbf-rowpin">row pinning</Label>
          <Select
            value={rowPinning}
            onValueChange={(v) => setRowPinning(v as RowPinning)}
          >
            <SelectTrigger id="srt-hbf-rowpin" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">off</SelectItem>
              <SelectItem value="sticky">sticky</SelectItem>
              <SelectItem value="top-and-bottom">top-and-bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Label className="gap-2">
          <Checkbox
            checked={skeletons}
            onCheckedChange={(v) => setSkeletons(v === true)}
          />
          loading skeletons
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={footer}
            onCheckedChange={(v) => setFooter(v === true)}
          />
          footer
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={columnFilters}
            onCheckedChange={(v) => setColumnFilters(v === true)}
          />
          column filters
        </Label>
      </div>

      <HeadBodyFooterTable
        key={remountKey}
        sticky={sticky}
        layoutMode={layoutMode}
        resizing={resizing}
        selection={selection}
        expand={expand}
        pinning={pinning}
        rowPinning={rowPinning}
        skeletons={skeletons}
        footer={footer}
        columnFilters={columnFilters}
      />
    </section>
  );
}
