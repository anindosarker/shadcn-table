import { useState } from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
  type ST_PaginationState,
} from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixtures for the part 01 phase 03 verify list. Fixed data so every assertion
// is deterministic. Part 03 consolidates this file.

const meta: Meta = {
  title: 'Features/Phase Three Verify',
};

export default meta;

type Person = { firstName: string };

const data: Person[] = [
  { firstName: 'Mason' },
  { firstName: 'Lily' },
  { firstName: 'Jackson' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
];

const bodyText = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr'))
    .map((row) => row.textContent)
    .join();

// `table.setGlobalFilterFn` from outside the menu re-filters a live search:
// `ily` matches Lily under fuzzy and nothing under Starts With.
export const ProgrammaticGlobalFilterMode = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGlobalFilterModes
      initialState={{ globalFilter: 'ily', showGlobalFilter: true }}
      renderTopToolbarCustomActions={({ table }) => (
        <button
          onClick={() => table.setGlobalFilterFn('startsWith')}
          type="button"
        >
          Starts With
        </button>
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Lily'));
    await userEvent.click(within(canvasElement).getByText('Starts With'));
    await waitFor(() => expect(bodyText(canvasElement)).not.toContain('Lily'));
  },
};

// `table.setColumnFilterFns` from outside the menu re-filters a live column
// filter: `ack` matches Jackson under fuzzy and nothing under Starts With.
export const ProgrammaticColumnFilterMode = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{
        columnFilters: [{ id: 'firstName', value: 'ack' }],
        showColumnFilters: true,
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <button
          onClick={() =>
            table.setColumnFilterFns((old) => ({
              ...old,
              firstName: 'startsWith',
            }))
          }
          type="button"
        >
          Starts With
        </button>
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Jackson'));
    await userEvent.click(within(canvasElement).getByText('Starts With'));
    await waitFor(() =>
      expect(bodyText(canvasElement)).not.toContain('Jackson'),
    );
  },
};

type Numbered = { firstName: string; age: number };

const numbered: Numbered[] = Array.from({ length: 25 }, (_, i) => ({
  firstName: `P${String(i + 1).padStart(2, '0')}`,
  age: 20 + i,
}));

const numberedColumns: ST_ColumnDef<Numbered>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'age', header: 'Age' },
];

const firstNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr')).map(
    (row) => row.textContent?.match(/P\d\d/)?.[0] ?? '',
  );

// `ShadcnTable` built from options re-renders only on the state its column
// transforms read. The display column options are read once per root render
// (for the row numbers column), so a proxy counts root renders: paging,
// sorting, density, selection, search and full screen add none.
const rootRenders = { count: 0 };
const countingDisplayColumnDefOptions = new Proxy(
  {},
  {
    get: (_target, key) => {
      if (key === 'st-row-numbers') rootRenders.count++;
      return undefined;
    },
  },
);

export const RootSkipsStateRenders = {
  render: () => (
    <ShadcnTable
      columns={numberedColumns}
      data={numbered}
      displayColumnDefOptions={countingDisplayColumnDefOptions}
      enableRowNumbers
      enableRowSelection
      initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
      rowNumberDisplayMode="static"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(firstNames(canvasElement)[0]).toBe('P01'));
    const rendersAtStart = rootRenders.count;
    expect(rendersAtStart).toBeGreaterThan(0);
    await userEvent.click(canvas.getByLabelText('Go to next page'));
    await waitFor(() => expect(firstNames(canvasElement)[0]).toBe('P06'));
    // static row numbers follow the page without a root render
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll('tbody tr:first-child td')[1]
          ?.textContent,
      ).toBe('6'),
    );
    await userEvent.click(
      canvasElement.querySelector(
        'button[aria-label="Sort by Age ascending"]',
      ) as HTMLElement,
    );
    const cellClassName = canvasElement.querySelector('tbody td')?.className;
    await userEvent.click(canvas.getByLabelText('Toggle density'));
    await waitFor(() =>
      expect(canvasElement.querySelector('tbody td')?.className).not.toBe(
        cellClassName,
      ),
    );
    await userEvent.click(canvas.getAllByRole('checkbox')[1]);
    await userEvent.click(canvas.getByLabelText('Show/Hide search'));
    await userEvent.type(canvas.getByPlaceholderText('Search'), 'P2');
    await waitFor(() =>
      expect(
        firstNames(canvasElement).every((name) => name.startsWith('P2')),
      ).toBe(true),
    );
    await userEvent.click(canvas.getByLabelText('Toggle full screen'));
    await waitFor(() =>
      expect(canvasElement.querySelector('div.fixed.inset-0')).not.toBeNull(),
    );
    await userEvent.click(canvas.getByLabelText('Toggle full screen'));
    await waitFor(() =>
      expect(canvasElement.querySelector('div.fixed.inset-0')).toBeNull(),
    );
    expect(rootRenders.count).toBe(rendersAtStart);
  },
};

const DataReplacementTable = () => {
  const [rows, setRows] = useState(numbered.slice(0, 3));
  return (
    <>
      <button onClick={() => setRows(numbered.slice(10, 13))} type="button">
        Replace data
      </button>
      <ShadcnTable columns={numberedColumns} data={rows} />
    </>
  );
};

// New `data` from the owner reaches the body with no state change.
export const DataReplacement = {
  render: () => <DataReplacementTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() =>
      expect(firstNames(canvasElement)).toEqual(['P01', 'P02', 'P03']),
    );
    await userEvent.click(within(canvasElement).getByText('Replace data'));
    await waitFor(() =>
      expect(firstNames(canvasElement)).toEqual(['P11', 'P12', 'P13']),
    );
  },
};

const ControlledPaginationTable = () => {
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  return (
    <>
      <span data-testid="page-index">{pagination.pageIndex}</span>
      <ShadcnTable
        columns={numberedColumns}
        data={numbered}
        onPaginationChange={setPagination}
        state={{ pagination }}
      />
    </>
  );
};

// Controlled state drives the table through the owner's `state`.
export const ControlledPagination = {
  render: () => <ControlledPaginationTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(firstNames(canvasElement)[0]).toBe('P01'));
    await userEvent.click(canvas.getByLabelText('Go to next page'));
    await waitFor(() => expect(firstNames(canvasElement)[0]).toBe('P06'));
    expect(canvas.getByTestId('page-index').textContent).toBe('1');
  },
};
