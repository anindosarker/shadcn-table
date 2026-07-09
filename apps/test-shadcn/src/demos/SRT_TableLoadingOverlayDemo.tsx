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
  city: string;
};

const rows: Person[] = [
  { id: 1, firstName: 'Ada', lastName: 'Lovelace', city: 'London' },
  { id: 2, firstName: 'Grace', lastName: 'Hopper', city: 'New York' },
  { id: 3, firstName: 'Alan', lastName: 'Turing', city: 'Manchester' },
  { id: 4, firstName: 'Katherine', lastName: 'Johnson', city: 'Hampton' },
];

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'city', header: 'City' },
    ],
    [],
  );
}

type Spinner = 'default' | 'custom' | 'styled';

export function SRT_TableLoadingOverlayDemo() {
  const columns = useColumns();

  const [overlay, setOverlay] = useState(true);
  const [spinner, setSpinner] = useState<Spinner>('default');

  const table = useShadcnReactTable<Person>({
    columns,
    data: rows,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableBottomToolbar: true,

    state: { showLoadingOverlay: overlay },

    srtCircularProgressProps:
      spinner === 'custom'
        ? () => ({
            Component: (
              <div className="rounded-md border bg-background px-3 py-2 text-sm font-medium">
                Loading people…
              </div>
            ),
          })
        : spinner === 'styled'
          ? { className: 'text-red-500', size: 64 }
          : undefined,
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT_TableLoadingOverlay</h2>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        The absolutely-positioned overlay that dims the table body while data
        loads. It renders inside <code>SRT_TableContainer</code> whenever{' '}
        <code>showLoadingOverlay</code> is true; the spinner is a lucide{' '}
        <code>LoaderCircleIcon</code> (default size 40).
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>overlay toggle shows/hides the dimming layer + spinner</li>
        <li>default spinner is the animate-spin loader at size 40</li>
        <li>
          custom passes function-form <code>Component</code> that replaces the
          spinner entirely
        </li>
        <li>
          styled passes <code>{'{ className: "text-red-500", size: 64 }'}</code>{' '}
          — user class composes with <code>animate-spin</code>, size overrides
          the default
        </li>
      </ul>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border p-3">
        <Label className="gap-2">
          <Checkbox
            checked={overlay}
            onCheckedChange={(v) => setOverlay(v === true)}
          />
          overlay on
        </Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-overlay-spinner">spinner</Label>
          <Select
            value={spinner}
            onValueChange={(v) => setSpinner(v as Spinner)}
          >
            <SelectTrigger id="srt-overlay-spinner" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">default</SelectItem>
              <SelectItem value="custom">custom Component</SelectItem>
              <SelectItem value="styled">styled red 64px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ShadcnReactTable table={table} />
    </section>
  );
}
