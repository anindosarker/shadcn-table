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

export function SRT_TableContainerDemo() {
  const columns = useColumns();
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const loading = params.has('loading');
  const sticky = params.has('sticky');
  const slotprops = params.has('slotprops');
  const editmodal = params.has('editmodal');

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
    editDisplayMode: editmodal ? 'modal' : 'row',
    onEditingRowSave: ({ values, table: t }) => {
      console.log('[container-demo] saved row', values);
      t.setEditingRow(null);
    },

    srtTableContainerProps: slotprops
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
      <h2 className="mb-2 text-lg font-semibold">SRT_TableContainer</h2>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        Tests the scroll/overlay container that wraps the table. The container
        applies <code>maxHeight</code>/overflow for sticky and fullscreen modes,
        hosts the loading overlay and the edit/create modal, and merges
        function-form <code>srtTableContainerProps</code> (with user{' '}
        <code>style</code>/<code>className</code> winning). Toggle behaviors via
        URL params: <code>?loading</code> shows the loading overlay (
        <code>state.showLoadingOverlay</code>), <code>?sticky</code> enables the
        sticky header (clamped max-height + overflow), <code>?slotprops</code>{' '}
        applies function-form container props (
        <code>id=&quot;container&quot;</code>, class{' '}
        <code>srt-custom-container</code>, user{' '}
        <code>style.maxHeight: 400px</code> which wins over the lib value), and{' '}
        <code>?editmodal</code> renders row editing in a modal (default is
        inline row). The fullscreen toggle in the top toolbar is enabled in all
        modes.
      </p>
      <ShadcnReactTable table={table} />
    </section>
  );
}
