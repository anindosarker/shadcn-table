import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_RowSelectionState,
  type ST_TableOptions,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixtures for the decisions item 8 verify list (row pinning follows the
// selection store under `rowPinningDisplayMode: 'select-*'`): Shift range
// under internal, controlled and external-atom selection for each select
// mode, select all per `selectAllMode`, unselect unpins, programmatic
// `row.toggleSelected`. Fixed data so every assertion is deterministic.

const meta: Meta = {
  title: 'Features/Row Pinning On Select',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Anderson', lastName: 'Kim' },
  { firstName: 'Lily', lastName: 'Brown' },
  { firstName: 'Tom', lastName: 'Garcia' },
  { firstName: 'Brooke', lastName: 'Diaz' },
  { firstName: 'Jackson', lastName: 'Reed' },
  { firstName: 'Nora', lastName: 'Hill' },
  { firstName: 'Owen', lastName: 'Shaw' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

const rowFirstName = (row: Element) =>
  data.find(({ firstName }) => row.textContent?.includes(firstName))
    ?.firstName ?? '';

const firstNames = (root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll(selector)).map(rowFirstName).sort();

const expectPinned = (root: ParentNode, names: string[]) =>
  waitFor(() =>
    expect(firstNames(root, 'tbody tr[data-pinned]')).toEqual(
      [...names].sort(),
    ),
  );

// Body rows in DOM order: the top pinned tbody, the center rows, the bottom
// pinned tbody.
const bodyOrder = (root: ParentNode) =>
  Array.from(root.querySelectorAll('tbody tr')).map(rowFirstName);

type PinMode = 'select-bottom' | 'select-sticky' | 'select-top';

// Outside `select-sticky`, the pinned rows leave the center and render first
// (`select-top`) or last (`select-bottom`).
const expectPinnedAt = (root: ParentNode, mode: PinMode, names: string[]) =>
  waitFor(() => {
    const order = bodyOrder(root);
    expect(order).toHaveLength(data.length);
    if (mode === 'select-sticky') return;
    const edge =
      mode === 'select-top'
        ? order.slice(0, names.length)
        : order.slice(-names.length);
    expect(edge.sort()).toEqual([...names].sort());
  });

// The row's checkbox wherever the row renders now: outside `select-sticky`
// the first click moves its row out of the center.
const rowCheckbox = async ({ canvas }: StoryContext, firstName: string) =>
  (await canvas.findAllByRole('checkbox', { name: 'Toggle select row' })).find(
    (checkbox) => rowFirstName(checkbox.closest('tr')!) === firstName,
  )!;

const shiftClickRange = async (context: StoryContext) => {
  // one user-event session, so the held Shift reaches the second click
  const user = userEvent.setup();
  await user.click(await rowCheckbox(context, 'Anderson'));
  await user.keyboard('{Shift>}');
  await user.click(await rowCheckbox(context, 'Brooke'));
  await user.keyboard('{/Shift}');
};

type PinArgs = {
  rowPinningDisplayMode: PinMode;
  source: 'controlled' | 'external-atom' | 'internal';
};

// One table per selection source. The toolbar button writes the selection
// from outside the rows: `atom.set` for the external atom, `setRowSelection`
// otherwise. The atom comes from a seed table's reactivity bindings because
// the package has no direct `@tanstack/store` dependency to import
// `createAtom` from.
const PinOnSelectTable = ({ rowPinningDisplayMode, source }: PinArgs) => {
  const seed = useShadcnTable({ columns, data: [] });
  const [atom] = useState(() =>
    seed._reactivity.createWritableAtom<ST_RowSelectionState>(
      {},
      { debugName: 'story/rowSelection' },
    ),
  );
  const [rowSelection, setRowSelection] = useState<ST_RowSelectionState>({});
  const sourceOptions: Partial<ST_TableOptions<Person>> =
    source === 'controlled'
      ? { onRowSelectionChange: setRowSelection, state: { rowSelection } }
      : source === 'external-atom'
        ? { atoms: { rowSelection: atom } }
        : {};
  return (
    <ShadcnTable
      {...sourceOptions}
      columns={columns}
      data={data}
      enablePagination={false}
      enableRowPinning
      enableRowSelection
      renderTopToolbarCustomActions={({ table }) => (
        <button
          onClick={() =>
            source === 'external-atom'
              ? atom.set({ 0: true, 3: true })
              : table.setRowSelection({ 0: true, 3: true })
          }
          type="button"
        >
          Select Mason and Tom
        </button>
      )}
      rowPinningDisplayMode={rowPinningDisplayMode}
    />
  );
};

// Shift range pins the whole range where the mode puts it; a selection
// written from outside the rows pins its rows and unpins the rest.
const pinOnSelectPlay = async (context: StoryContext) => {
  const { canvas, canvasElement } = context;
  const mode = (context.args as PinArgs).rowPinningDisplayMode;
  await shiftClickRange(context);
  const range = ['Anderson', 'Lily', 'Tom', 'Brooke'];
  await expectPinned(canvasElement, range);
  await expectPinnedAt(canvasElement, mode, range);
  await userEvent.click(
    await canvas.findByRole('button', { name: 'Select Mason and Tom' }),
  );
  await expectPinned(canvasElement, ['Mason', 'Tom']);
  await expectPinnedAt(canvasElement, mode, ['Mason', 'Tom']);
  await waitFor(() =>
    expect(firstNames(canvasElement, 'tbody tr[data-selected]')).toEqual(
      ['Mason', 'Tom'].sort(),
    ),
  );
};

const pinStory = (args: PinArgs) => ({
  args,
  render: (storyArgs: PinArgs) => <PinOnSelectTable {...storyArgs} />,
  play: pinOnSelectPlay,
});

export const ShiftRangeInternalState = {
  args: { rowPinningDisplayMode: 'select-sticky', source: 'internal' },
  render: (args: PinArgs) => <PinOnSelectTable {...args} />,
  play: async (context: StoryContext) => {
    await shiftClickRange(context);
    await expectPinned(context.canvasElement, [
      'Anderson',
      'Lily',
      'Tom',
      'Brooke',
    ]);
  },
};

export const ShiftRangeControlledState = {
  args: { rowPinningDisplayMode: 'select-sticky', source: 'controlled' },
  render: (args: PinArgs) => <PinOnSelectTable {...args} />,
  play: async (context: StoryContext) => {
    await shiftClickRange(context);
    await expectPinned(context.canvasElement, [
      'Anderson',
      'Lily',
      'Tom',
      'Brooke',
    ]);
    // unselecting unpins
    const checkboxes = await context.canvas.findAllByRole('checkbox', {
      name: 'Toggle select row',
    });
    const lily = checkboxes.find((checkbox) =>
      checkbox.closest('tr')?.textContent?.includes('Lily'),
    );
    await userEvent.click(lily!);
    await expectPinned(context.canvasElement, ['Anderson', 'Tom', 'Brooke']);
  },
};

// Pins follow an external `atoms.rowSelection`: the Shift range pins through
// the atom, and an `atom.set` from outside the table pins and unpins too.
export const ShiftRangeExternalAtom = pinStory({
  rowPinningDisplayMode: 'select-sticky',
  source: 'external-atom',
});

export const SelectTopInternalState = pinStory({
  rowPinningDisplayMode: 'select-top',
  source: 'internal',
});

export const SelectTopControlledState = pinStory({
  rowPinningDisplayMode: 'select-top',
  source: 'controlled',
});

export const SelectTopExternalAtom = pinStory({
  rowPinningDisplayMode: 'select-top',
  source: 'external-atom',
});

export const SelectBottomInternalState = pinStory({
  rowPinningDisplayMode: 'select-bottom',
  source: 'internal',
});

export const SelectBottomControlledState = pinStory({
  rowPinningDisplayMode: 'select-bottom',
  source: 'controlled',
});

export const SelectBottomExternalAtom = pinStory({
  rowPinningDisplayMode: 'select-bottom',
  source: 'external-atom',
});

export const SelectAllPageMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowPinning
    enableRowSelection
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    rowPinningDisplayMode="select-sticky"
  />
);

SelectAllPageMode.play = async ({ canvas, canvasElement }: StoryContext) => {
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await expectPinned(canvasElement, [
    'Mason',
    'Anderson',
    'Lily',
    'Tom',
    'Brooke',
  ]);
  await userEvent.click(selectAll);
  await expectPinned(canvasElement, []);
};

export const SelectAllAllMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowPinning
    enableRowSelection
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    rowPinningDisplayMode="select-sticky"
    selectAllMode="all"
  />
);

SelectAllAllMode.play = async ({ canvas, canvasElement }: StoryContext) => {
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await expectPinned(
    canvasElement,
    data.map(({ firstName }) => firstName),
  );
};

export const ProgrammaticToggleSelected = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => (
      <button
        onClick={() => table.getRow('5').toggleSelected(true)}
        type="button"
      >
        Select Jackson
      </button>
    )}
    rowPinningDisplayMode="select-bottom"
  />
);

ProgrammaticToggleSelected.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  await userEvent.click(
    await canvas.findByRole('button', { name: 'Select Jackson' }),
  );
  await expectPinned(canvasElement, ['Jackson']);
  await expectPinnedAt(canvasElement, 'select-bottom', ['Jackson']);
};
