import { Component, type ReactNode, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  type ST_RowSelectionState,
  ST_TableProvider,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixtures for the part 01 phase 02 verify list that `RowPinningOnSelect`,
// `Pagination` and `FnRegistries` do not already hold: an external
// `atoms.rowSelection`, 25 rows without pagination, headless display column
// headers, and column filters with every filter flag off. Fixed data so every
// assertion is deterministic. Part 03 consolidates this file.

const meta: Meta = {
  title: 'Features/Phase Two Verify',
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

const firstNames = (root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll(selector))
    .map(
      (row) =>
        data.find(({ firstName }) => row.textContent?.includes(firstName))
          ?.firstName ?? '',
    )
    .sort();

const expectPinned = (root: ParentNode, names: string[]) =>
  waitFor(() =>
    expect(firstNames(root, 'tbody tr[data-pinned]')).toEqual(
      [...names].sort(),
    ),
  );

// Pins follow an external `atoms.rowSelection`: the Shift range pins through
// the atom, and an `atom.set` from outside the table pins and unpins too.
// The atom comes from a seed table's reactivity bindings because the package
// has no direct `@tanstack/store` dependency to import `createAtom` from.
export const ShiftRangeExternalAtom = () => {
  const seed = useShadcnTable({ columns, data: [] });
  const [rowSelection] = useState(() =>
    seed._reactivity.createWritableAtom<ST_RowSelectionState>(
      {},
      { debugName: 'story/rowSelection' },
    ),
  );
  return (
    <ShadcnTable
      atoms={{ rowSelection }}
      columns={columns}
      data={data}
      enablePagination={false}
      enableRowPinning
      enableRowSelection
      renderTopToolbarCustomActions={() => (
        <button
          onClick={() => rowSelection.set({ 0: true, 3: true })}
          type="button"
        >
          Set atom
        </button>
      )}
      rowPinningDisplayMode="select-sticky"
    />
  );
};

ShiftRangeExternalAtom.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  const checkboxes = await canvas.findAllByRole('checkbox', {
    name: 'Toggle select row',
  });
  // one user-event session, so the held Shift reaches the second click
  const user = userEvent.setup();
  await user.click(checkboxes[1]);
  await user.keyboard('{Shift>}');
  await user.click(checkboxes[4]);
  await user.keyboard('{/Shift}');
  await expectPinned(canvasElement, ['Anderson', 'Lily', 'Tom', 'Brooke']);
  await user.click(await canvas.findByRole('button', { name: 'Set atom' }));
  await expectPinned(canvasElement, ['Mason', 'Tom']);
  await waitFor(() =>
    expect(firstNames(canvasElement, 'tbody tr[data-selected]')).toEqual(
      ['Mason', 'Tom'].sort(),
    ),
  );
};

const twentyFive: Person[] = [...Array(25)].map((_, index) => ({
  firstName: `First ${index + 1}`,
  lastName: `Last ${index + 1}`,
}));

export const PaginationDisabledTwentyFiveRows = () => (
  <ShadcnTable
    columns={columns}
    data={twentyFive}
    enablePagination={false}
    manualPagination={false}
  />
);

PaginationDisabledTwentyFiveRows.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr').length).toBe(25),
  );
};

// Renders the thrown message into the DOM, so the assertion reads it instead
// of Storybook's error overlay.
class HeadlessErrorBoundary extends Component<
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
      <pre data-testid="headless-error">{this.state.message}</pre>
    );
  }
}

const displayColumnIds = ['st-row-expand', 'st-row-select'];

// The select and expand display columns rendered outside `ShadcnTable`
// through `flexRender` with the core header context, both the `header`
// label and the `Header` component the library renders itself.
const HeadlessHeaders = ({ component }: { component: boolean }) => {
  const table = useShadcnTable({
    columns,
    data,
    enableExpanding: true,
    enableRowSelection: true,
    getSubRows: () => undefined,
  });
  const headers = table
    .getHeaderGroups()[0]
    .headers.filter((header) => displayColumnIds.includes(header.column.id));
  return (
    <ST_TableProvider table={table}>
      <HeadlessErrorBoundary>
        <div data-testid="headless-headers">
          {headers.map((header) => (
            <div data-column-id={header.column.id} key={header.id}>
              {flexRender(
                component
                  ? // `Header` types its props for the ST instance, which the
                    // core header context is not; the cast is the headless
                    // caller's own, the render decides whether it holds up.
                    (header.column.columnDef.Header as ReactNode)
                  : header.column.columnDef.header,
                header.getContext(),
              )}
            </div>
          ))}
        </div>
      </HeadlessErrorBoundary>
    </ST_TableProvider>
  );
};

const expectHeadlessRendered = (canvasElement: HTMLElement) =>
  waitFor(() => {
    expect(canvasElement.querySelector('[data-testid="headless-error"]')).toBe(
      null,
    );
    expect(
      canvasElement.querySelectorAll('[data-testid="headless-headers"] > div')
        .length,
    ).toBe(2);
  });

export const HeadlessDisplayColumnHeaders = () => (
  <HeadlessHeaders component={false} />
);

HeadlessDisplayColumnHeaders.play = async ({ canvasElement }: StoryContext) =>
  expectHeadlessRendered(canvasElement);

export const HeadlessDisplayColumnHeaderComponents = () => (
  <HeadlessHeaders component />
);

HeadlessDisplayColumnHeaderComponents.play = async ({
  canvasElement,
}: StoryContext) => expectHeadlessRendered(canvasElement);

export const ColumnFiltersWithEveryFilterFlagOff = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnFilters={false}
    enableFilters={false}
    enableGlobalFilter={false}
    enablePagination={false}
    state={{ columnFilters: [{ id: 'firstName', value: 'Mason' }] }}
  />
);

ColumnFiltersWithEveryFilterFlagOff.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() =>
    expect(firstNames(canvasElement, 'tbody tr')).toEqual(
      data.map(({ firstName }) => firstName).sort(),
    ),
  );
};

export const GlobalFilterModeSwitch = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGlobalFilterModes
    enablePagination={false}
    initialState={{ showGlobalFilter: true }}
  />
);
