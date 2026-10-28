import { Component, type ReactNode, useState } from 'react';
import {
  type ST_ColumnDef,
  ST_TableContainer,
  ST_TablePagination,
  ST_TableProvider,
  ST_ToggleDensePaddingButton,
  ST_ToggleGlobalFilterButton,
  ST_TopToolbar,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// `ST_TableProvider` and the table context (decisions items 3 and 4): hand
// composition of library pieces, a reader beside and inside each of two
// tables, portals that read the context, the error outside every provider,
// no table hook rebuild across owner renders, option changes after mount, a
// table swap without a `key`.
// Fixed data so every assertion is deterministic.

const meta: Meta = {
  title: 'Features/Table Provider',
};

export default meta;

type Person = { city: string; firstName: string; lastName: string };

const data: Person[] = [
  { city: 'Austin', firstName: 'Mason', lastName: 'Lee' },
  { city: 'Denver', firstName: 'Anderson', lastName: 'Kim' },
  { city: 'Boston', firstName: 'Lily', lastName: 'Brown' },
  { city: 'Miami', firstName: 'Tom', lastName: 'Garcia' },
  { city: 'Dallas', firstName: 'Brooke', lastName: 'Diaz' },
  { city: 'Tampa', firstName: 'Jackson', lastName: 'Reed' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
];

const bodyText = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr'))
    .map((row) => row.textContent)
    .join();

// The last cell of the first row is a data column: `p-2` under compact.
const dataCellClass = (root: HTMLElement) =>
  root.querySelector('tbody tr td:last-child')?.className ?? '';

// The library pieces composed by hand under one provider: a pagination
// summary and two toolbar buttons of the owner's own layout, the top toolbar
// and the table container. No piece takes a `table` prop.
const HandComposedTable = () => {
  const table = useShadcnTable({ columns, data });
  return (
    <ST_TableProvider table={table}>
      <div className="flex flex-col gap-2 rounded-md border p-2">
        <div className="flex items-center gap-2" data-testid="owner-bar">
          <ST_ToggleGlobalFilterButton />
          <ST_ToggleDensePaddingButton />
          <ST_TablePagination showRowsPerPage={false} />
        </div>
        <ST_TopToolbar />
        <ST_TableContainer />
      </div>
    </ST_TableProvider>
  );
};

export const HandComposition = {
  render: () => <HandComposedTable />,
  play: async ({ canvas, canvasElement }: StoryContext) => {
    const ownerBar = within(canvas.getByTestId('owner-bar'));
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr').length).toBe(
        data.length,
      ),
    );
    await expect(canvas.getByTestId('owner-bar')).toHaveTextContent('1-6 of 6');
    // the owner's density button drives the container's cells
    await userEvent.click(ownerBar.getByLabelText('Toggle density'));
    await waitFor(() => expect(dataCellClass(canvasElement)).toContain('p-2'));
    // the owner's search button opens the search in ST_TopToolbar, which
    // filters the container's rows and the owner's pagination summary
    await userEvent.click(ownerBar.getByLabelText('Show/Hide search'));
    await userEvent.type(await canvas.findByPlaceholderText('Search'), 'Lily');
    await waitFor(() => {
      expect(bodyText(canvasElement)).toContain('Lily');
      expect(bodyText(canvasElement)).not.toContain('Mason');
      expect(canvas.getByTestId('owner-bar')).toHaveTextContent('1-1 of 1');
    });
  },
};

const ControlledToolbar = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) => (
  <div className="p-4">
    <input
      aria-label="Toolbar input"
      className="rounded border px-2 py-1"
      data-testid="toolbar-input"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
    <span data-testid="toolbar-echo">{value}</span>
  </div>
);

// The input's state lives above the table, so each keystroke re-renders
// ShadcnTable with a fresh `renderTopToolbar` closure. Focus survives only
// when the table hook is not rebuilt across renders.
export const ControlledInputInCustomToolbar = () => {
  const [value, setValue] = useState('');
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      renderTopToolbar={() => (
        <ControlledToolbar onChange={setValue} value={value} />
      )}
    />
  );
};

ControlledInputInCustomToolbar.play = async ({
  canvas,
  userEvent,
}: StoryContext) => {
  const input = canvas.getByTestId('toolbar-input');
  await userEvent.click(input);
  await userEvent.type(input, 'focus kept');
  await expect(input).toHaveValue('focus kept');
  await expect(document.activeElement).toBe(input);
  await expect(canvas.getByTestId('toolbar-echo')).toHaveTextContent(
    'focus kept',
  );
};

// A library sub-component reads the table from the nearest provider; its
// row summary (`1-2 of 2`) shows which table it found.
const ContextReader = ({ label }: { label: string }) => (
  <div data-testid={label}>
    <ST_TablePagination showRowsPerPage={false} />
  </div>
);

const ProvidedTable = ({ id, rows }: { id: string; rows: Person[] }) => {
  const table = useShadcnTable({
    columns,
    data: rows,
    id,
    renderTopToolbarCustomActions: () => (
      <ContextReader label={`${id}-inner`} />
    ),
  });
  return (
    <ST_TableProvider table={table}>
      <ContextReader label={`${id}-outer`} />
      <ShadcnTable table={table} />
    </ST_TableProvider>
  );
};

// Two tables, each with a reader beside it (through ST_TableProvider) and a
// reader inside it (rendered by ShadcnTable). Each reader must see its own
// table.
export const ProviderWithTwoTables = () => (
  <div className="flex flex-col gap-8">
    <ProvidedTable id="first" rows={data.slice(0, 2)} />
    <ProvidedTable id="second" rows={data.slice(2)} />
  </div>
);

ProviderWithTwoTables.play = async ({ canvas }: StoryContext) => {
  await expect(canvas.getByTestId('first-outer')).toHaveTextContent('1-2 of 2');
  await expect(canvas.getByTestId('first-inner')).toHaveTextContent('1-2 of 2');
  await expect(canvas.getByTestId('second-outer')).toHaveTextContent(
    '1-4 of 4',
  );
  await expect(canvas.getByTestId('second-inner')).toHaveTextContent(
    '1-4 of 4',
  );
};

// Counts mounts, so a remount shows as a new id.
let nextMountId = 0;
const MountId = () => {
  const [id] = useState(() => ++nextMountId);
  return <span data-testid="mount-id">{id}</span>;
};

// One provider handed a different table on a later render, with no `key`.
// The reader follows the new table, and the subtree under the provider
// remounts, so no state of the first table's components carries over.
const SwappedTable = () => {
  const first = useShadcnTable({ columns, data: data.slice(0, 2), id: 'a' });
  const second = useShadcnTable({ columns, data: data.slice(2), id: 'b' });
  const [swapped, setSwapped] = useState(false);
  return (
    <>
      <button onClick={() => setSwapped(true)} type="button">
        Swap table
      </button>
      <ST_TableProvider table={swapped ? second : first}>
        <MountId />
        <ContextReader label="swapped" />
      </ST_TableProvider>
    </>
  );
};

export const TableSwapWithoutKey = {
  render: () => <SwappedTable />,
  play: async ({ canvas }: StoryContext) => {
    await expect(canvas.getByTestId('swapped')).toHaveTextContent('1-2 of 2');
    const mountId = canvas.getByTestId('mount-id').textContent;
    await userEvent.click(canvas.getByText('Swap table'));
    await waitFor(() =>
      expect(canvas.getByTestId('swapped')).toHaveTextContent('1-4 of 4'),
    );
    expect(canvas.getByTestId('mount-id').textContent).not.toBe(mountId);
  },
};

// Menus, dialogs and tooltips render through portals outside the table
// element; each reads its labels from the context, so a missing context would
// throw instead of showing them. The dialog opens through `setCreatingRow`.
export const PortalsReadContext = {
  render: () => (
    <ShadcnTable
      columns={columns}
      createDisplayMode="modal"
      data={data}
      enableEditing
      enableRowActions
      renderTopToolbarCustomActions={({ table }) => (
        <button onClick={() => table.setCreatingRow(true)} type="button">
          Create
        </button>
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Mason'));
    await userEvent.click(canvas.getAllByLabelText('Column Actions')[0]);
    await waitFor(() =>
      expect(body.getByText('Sort by First Name ascending')).toBeTruthy(),
    );
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByText('Create'));
    await waitFor(() => expect(body.getByRole('dialog')).toBeTruthy());
    expect(body.getByRole('dialog').querySelector('input')).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await userEvent.hover(canvas.getByLabelText('Toggle density'));
    await waitFor(() =>
      expect(body.getAllByText('Toggle density').length).toBeGreaterThan(0),
    );
  },
};

// Renders the thrown message into the DOM, so the assertion reads it instead
// of Storybook's error overlay.
class MessageBoundary extends Component<
  { children: ReactNode },
  { message: string | null }
> {
  state = { message: null };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }

  render() {
    return this.state.message === null ? (
      this.props.children
    ) : (
      <pre data-testid="no-provider-error">{this.state.message}</pre>
    );
  }
}

// A context component outside every provider throws at mount.
export const NoProviderThrows = {
  render: () => (
    <MessageBoundary>
      <ST_TablePagination />
    </MessageBoundary>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() =>
      expect(
        within(canvasElement).getByTestId('no-provider-error'),
      ).toHaveTextContent('`useTableContext` must be used within'),
    );
  },
};

const OptionChangeTable = () => {
  const [german, setGerman] = useState(false);
  const [selectable, setSelectable] = useState(false);
  return (
    <>
      <button onClick={() => setGerman(true)} type="button">
        German labels
      </button>
      <button onClick={() => setSelectable(true)} type="button">
        Enable selection
      </button>
      <ShadcnTable
        columns={columns}
        data={data.slice(0, 3)}
        enableRowSelection={selectable}
        localization={german ? { toggleDensity: 'Dichte umschalten' } : {}}
      />
    </>
  );
};

// `localization` and an `enable*` option change after mount: the density
// button (a context reader) shows the new label, and the select column shows
// up, both through the owner's re-render.
export const OptionChangeAfterMount = {
  render: () => <OptionChangeTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Mason'));
    expect(canvas.queryAllByLabelText('Toggle select row').length).toBe(0);
    await userEvent.click(canvas.getByText('German labels'));
    await waitFor(() =>
      expect(canvas.getByLabelText('Dichte umschalten')).toBeTruthy(),
    );
    await userEvent.click(canvas.getByText('Enable selection'));
    await waitFor(() =>
      expect(canvas.getAllByLabelText('Toggle select row').length).toBe(3),
    );
  },
};
