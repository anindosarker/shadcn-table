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
  city: string;
};

const cities = ['London', 'Paris', 'Berlin', 'Tokyo', 'New York', 'Sydney'];
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
    };
  });
}

const data = makeData(30);

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 240,
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
    ],
    [],
  );
}

type LayoutMode = 'semantic' | 'grid' | 'grid-no-grow';

export function SRT_TableDemo() {
  const columns = useColumns();

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('semantic');
  const [resizing, setResizing] = useState(false);
  const [caption, setCaption] = useState(false);
  const [memo, setMemo] = useState(false);
  const [slotProps, setSlotProps] = useState(false);

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableBottomToolbar: true,

    enableColumnResizing: resizing,
    columnResizeMode: 'onChange',

    layoutMode,
    memoMode: memo ? 'table-body' : undefined,

    renderCaption: caption
      ? ({ table: t }) =>
          `SRT_Table caption — ${t.getRowModel().rows.length} rows shown`
      : undefined,

    srtTableProps: slotProps
      ? () => ({
          id: 'srt-table',
          className: 'srt-custom-table',
        })
      : undefined,
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT_Table</h2>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        The <code>&lt;table&gt;</code> element itself: applies the{' '}
        <code>layoutMode</code> variant, writes live column-size CSS vars,
        renders an optional caption, dispatches the memoized vs plain body, and
        merges function-form <code>srtTableProps</code>.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>layoutMode select changes grid vs semantic table display</li>
        <li>
          resizing ON flips the default layout to <code>grid-no-grow</code> per
          core — drag a header border to watch size vars update
        </li>
        <li>caption renders a caption row above the head</li>
        <li>memoMode swaps in the memoized table body</li>
        <li>
          slot-props applies <code>id=&quot;srt-table&quot;</code> +{' '}
          <code>srt-custom-table</code> class merged last
        </li>
      </ul>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border p-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-table-layout">layoutMode</Label>
          <Select
            value={layoutMode}
            onValueChange={(v) => setLayoutMode(v as LayoutMode)}
          >
            <SelectTrigger id="srt-table-layout" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semantic">semantic</SelectItem>
              <SelectItem value="grid">grid</SelectItem>
              <SelectItem value="grid-no-grow">grid-no-grow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* enableColumnResizing flips the layoutMode default to 'grid-no-grow'
            (core useSRT_TableOptions.ts, mirrors MRT). */}
        <Label className="gap-2">
          <Checkbox
            checked={resizing}
            onCheckedChange={(v) => setResizing(v === true)}
          />
          resizing
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={caption}
            onCheckedChange={(v) => setCaption(v === true)}
          />
          caption
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={memo}
            onCheckedChange={(v) => setMemo(v === true)}
          />
          memoMode
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={slotProps}
            onCheckedChange={(v) => setSlotProps(v === true)}
          />
          slot-props
        </Label>
      </div>

      <ShadcnReactTable table={table} />
    </section>
  );
}
