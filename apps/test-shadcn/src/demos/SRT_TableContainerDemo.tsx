import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
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

const data = makeData(40);

function useColumns(): SRT_ColumnDef<Person>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        enableEditing: true,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        enableEditing: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableEditing: true,
        size: 240,
      },
      {
        accessorKey: 'city',
        header: 'City',
        enableEditing: true,
      },
    ],
    [],
  );
}

type EditMode = 'row' | 'modal';

export function SRT_TableContainerDemo() {
  const columns = useColumns();

  const [loading, setLoading] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [slotProps, setSlotProps] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>('row');

  const table = useShadcnReactTable<Person>({
    columns,
    data,
    getRowId: (row) => String(row.id),

    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableToolbarInternalActions: true,
    enableFullScreenToggle: true,

    enableStickyHeader: sticky,

    enableEditing: true,
    editDisplayMode: editMode,
    onEditingRowSave: ({ values, table: t }) => {
      console.log('[container-demo] saved row', values);
      t.setEditingRow(null);
    },

    srtTableContainerProps: slotProps
      ? () => ({
          id: 'container',
          className: 'srt-custom-container',
          style: { maxHeight: '400px' },
        })
      : undefined,

    state: { showLoadingOverlay: loading },
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT_TableContainer</h2>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        The scroll/overlay container wrapping the table. It handles
        maxHeight/overflow for sticky and fullscreen modes, hosts the loading
        overlay and the edit/create modal, and merges function-form{' '}
        <code>srtTableContainerProps</code>.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>loading overlay dims the body when toggled on</li>
        <li>sticky header stays visible when the container scrolls</li>
        <li>
          slot-props sets <code>id=&quot;container&quot;</code> +{' '}
          <code>srt-custom-container</code>; user <code>maxHeight 400px</code>{' '}
          wins over the lib value
        </li>
        <li>edit-mode select switches between inline-row and modal editing</li>
        <li>fullscreen toggle (top toolbar) works in all modes</li>
      </ul>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border p-3">
        <Label className="gap-2">
          <Checkbox
            checked={loading}
            onCheckedChange={(v) => setLoading(v === true)}
          />
          loading overlay
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={sticky}
            onCheckedChange={(v) => setSticky(v === true)}
          />
          sticky header
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={slotProps}
            onCheckedChange={(v) => setSlotProps(v === true)}
          />
          slot-props
        </Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="srt-container-edit">edit mode</Label>
          <Select
            value={editMode}
            onValueChange={(v) => setEditMode(v as EditMode)}
          >
            <SelectTrigger id="srt-container-edit" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">inline row</SelectItem>
              <SelectItem value="modal">modal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ShadcnReactTable table={table} />
    </section>
  );
}
