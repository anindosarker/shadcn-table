import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { ShadcnReactTable } from '../components/ui/shadcn-react-table/ShadcnReactTable';
import { Button } from '../components/ui/button';
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
  city: string;
  department: 'Engineering' | 'Design' | 'Sales' | 'Marketing' | 'Support';
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
      city: cities[i % cities.length],
      department: departments[i % departments.length],
    };
  });
}

const data = makeData(40);

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'email', header: 'Email', size: 240 },
      { accessorKey: 'city', header: 'City' },
      { accessorKey: 'department', header: 'Department' },
    ],
    [],
  );
}

type PaginationMode = 'default' | 'pages' | 'custom';
type PaginationPosition = 'bottom' | 'top' | 'both';
type AlertPosition = 'bottom' | 'top' | 'head-overlay';

interface ToolbarSettings {
  paginationMode: PaginationMode;
  paginationPosition: PaginationPosition;
  showProgressBars: boolean;
  alertPosition: AlertPosition;
  grouping: boolean;
  selection: boolean;
  customActions: boolean;
}

// Inner component owns the table instance. The parent remounts it (via `key`)
// only when the grouping toggle flips, so initialState.grouping takes effect;
// every other setting flows in as props and updates live without a remount.
function ToolbarsTable({ settings }: { settings: ToolbarSettings }) {
  const columns = useColumns();

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableToolbarInternalActions: true,
    enableFullScreenToggle: true,
    enableDensityToggle: true,
    enableGlobalFilter: true,
    positionGlobalFilter: 'right',
    enableColumnFilters: true,

    enablePagination: true,
    paginationDisplayMode: settings.paginationMode,
    positionPagination: settings.paginationPosition,

    enableRowSelection: settings.selection,

    enableGrouping: settings.grouping,

    positionToolbarAlertBanner: settings.alertPosition,

    srtTableLayoutProps: { id: 'srt-toolbars-layout' },

    renderTopToolbarCustomActions: settings.customActions
      ? () => (
          <Button
            id="srt-toolbars-top-action"
            size="sm"
            variant="outline"
            onClick={() => console.log('[toolbars-demo] top custom action')}
          >
            Top action
          </Button>
        )
      : undefined,
    renderBottomToolbarCustomActions: settings.customActions
      ? () => (
          <Button
            id="srt-toolbars-bottom-action"
            size="sm"
            variant="secondary"
            onClick={() => console.log('[toolbars-demo] bottom custom action')}
          >
            Bottom action
          </Button>
        )
      : undefined,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
      ...(settings.grouping ? { grouping: ['department'] } : {}),
    },
    state: {
      showProgressBars: settings.showProgressBars,
    },
  });

  return <ShadcnReactTable table={table} />;
}

export function SRT_ToolbarsDemo() {
  const [paginationMode, setPaginationMode] =
    useState<PaginationMode>('default');
  const [paginationPosition, setPaginationPosition] =
    useState<PaginationPosition>('bottom');
  const [showProgressBars, setShowProgressBars] = useState(false);
  const [alertPosition, setAlertPosition] = useState<AlertPosition>('bottom');
  const [grouping, setGrouping] = useState(false);
  const [selection, setSelection] = useState(true);
  const [customActions, setCustomActions] = useState(false);

  const settings: ToolbarSettings = {
    paginationMode,
    paginationPosition,
    showProgressBars,
    alertPosition,
    grouping,
    selection,
    customActions,
  };

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT Toolbars</h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        Top &amp; bottom toolbars: pagination, alert banner, linear progress
        bars, drop zone, internal action buttons and custom-action slots. This
        is the toolbar cluster that wraps the table body.
      </p>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        pageSize is 5 so the pagination row is always exercised. Original bug:
        the pagination row was clipped at the bottom of the card.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>bottom toolbar is min-h-14 (56px); pagination row not clipped</li>
        <li>pagination next/prev, rows-per-page, first/last buttons work</li>
        <li>
          pages mode renders numbered buttons + ellipsis; active highlighted
        </li>
        <li>custom mode drops the built-in pagination UI</li>
        <li>global search button reveals input and filters rows</li>
        <li>
          internal buttons: filters, density cycle, fullscreen, columns menu
        </li>
        <li>selection shows &quot;N of M rows selected&quot; + clear works</li>
        <li>grouping-on shows groupedBy chips; chip delete ungroups</li>
        <li>progress bars animate in both toolbars</li>
      </ul>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border p-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-toolbars-pagmode">pagination mode</Label>
          <Select
            value={paginationMode}
            onValueChange={(v) => setPaginationMode(v as PaginationMode)}
          >
            <SelectTrigger id="srt-toolbars-pagmode" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">default</SelectItem>
              <SelectItem value="pages">pages</SelectItem>
              <SelectItem value="custom">custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-toolbars-pagpos">pagination position</Label>
          <Select
            value={paginationPosition}
            onValueChange={(v) =>
              setPaginationPosition(v as PaginationPosition)
            }
          >
            <SelectTrigger id="srt-toolbars-pagpos" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom">bottom</SelectItem>
              <SelectItem value="top">top</SelectItem>
              <SelectItem value="both">both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-toolbars-alertpos">alert position</Label>
          <Select
            value={alertPosition}
            onValueChange={(v) => setAlertPosition(v as AlertPosition)}
          >
            <SelectTrigger id="srt-toolbars-alertpos" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom">bottom</SelectItem>
              <SelectItem value="top">top</SelectItem>
              <SelectItem value="head-overlay">head-overlay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Label className="gap-2">
          <Checkbox
            checked={showProgressBars}
            onCheckedChange={(v) => setShowProgressBars(v === true)}
          />
          progress bars
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={grouping}
            onCheckedChange={(v) => setGrouping(v === true)}
          />
          grouping
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
            checked={customActions}
            onCheckedChange={(v) => setCustomActions(v === true)}
          />
          custom actions
        </Label>
      </div>

      <ToolbarsTable
        key={grouping ? 'grouped' : 'ungrouped'}
        settings={settings}
      />
    </section>
  );
}
