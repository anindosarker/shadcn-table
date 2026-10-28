import { constructAggregationFn } from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  type ST_FilterFn,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Per-call `filterFns`, `sortFns` and `aggregationFns` resolved by name
// (decisions item 3): custom names filter, sort and aggregate; two tables on
// one page keep their own registries; an unknown name is skipped; a filter
// mode switch re-filters a live value. Fixed data so every assertion is
// deterministic.

const meta: Meta = {
  title: 'Features/Custom Filter Fns',
};

export default meta;

type Person = {
  age: number;
  city: string;
  firstName: string;
  lastName: string;
  team: string;
};

const data: Person[] = [
  { age: 41, city: 'Austin', firstName: 'Mason', lastName: 'Lee', team: 'A' },
  {
    age: 29,
    city: 'Denver',
    firstName: 'Anderson',
    lastName: 'Kim',
    team: 'A',
  },
  { age: 35, city: 'Boston', firstName: 'Lily', lastName: 'Brown', team: 'A' },
  { age: 22, city: 'Miami', firstName: 'Tom', lastName: 'Garcia', team: 'B' },
  { age: 50, city: 'Dallas', firstName: 'Brooke', lastName: 'Diaz', team: 'B' },
  { age: 33, city: 'Tampa', firstName: 'Jackson', lastName: 'Reed', team: 'B' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'age', header: 'Age' },
];

// Matches when the cell text has exactly `filterValue` characters. Neither
// 'fuzzy' nor 'contains' can produce the same rows for a numeric query.
const lengthEquals: Exclude<ST_FilterFn<Person>, string> = (
  row,
  id,
  filterValue,
) => String(row.getValue(id)).length === Number(filterValue);

const firstNameCells = (root: ParentNode) =>
  Array.from(root.querySelectorAll('tbody tr td:first-child')).map(
    (cell) => cell.textContent ?? '',
  );

const bodyText = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr'))
    .map((row) => row.textContent)
    .join();

export const CustomColumnFilterFn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        filterFn: 'customFilterFn',
        header: 'First Name',
      },
      { accessorKey: 'lastName', header: 'Last Name' },
    ]}
    data={data}
    filterFns={{ customFilterFn: lengthEquals }}
    initialState={{
      columnFilters: [{ id: 'firstName', value: '5' }],
      showColumnFilters: true,
    }}
  />
);

CustomColumnFilterFn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(firstNameCells(canvasElement)).toEqual(['Mason']));
};

export const CustomGlobalFilterFn = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    filterFns={{ customFilterFn: lengthEquals }}
    globalFilterFn="customFilterFn"
    initialState={{ globalFilter: '5', showGlobalFilter: true }}
  />
);

// Mason (first name), Lily (Brown), Tom (Miami) and Jackson (Tampa) have one
// five-letter cell; Anderson and Brooke have none.
CustomGlobalFilterFn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(firstNameCells(canvasElement).sort()).toEqual(
      ['Jackson', 'Lily', 'Mason', 'Tom'].sort(),
    ),
  );
};

export const DefaultFuzzyGlobalFilter = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ globalFilter: 'Mas', showGlobalFilter: true }}
  />
);

DefaultFuzzyGlobalFilter.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(firstNameCells(canvasElement)).toEqual(['Mason']));
  const marks = canvasElement.querySelectorAll(
    'mark[data-slot="st-match-highlight"]',
  );
  await expect(marks.length).toBeGreaterThan(0);
  await expect(marks[0]?.textContent).toBe('Mas');
};

export const CustomSortFn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        sortFn: 'customSortFn',
      },
      { accessorKey: 'lastName', header: 'Last Name' },
    ]}
    data={data}
    initialState={{ sorting: [{ desc: false, id: 'firstName' }] }}
    sortFns={{
      customSortFn: (rowA, rowB, id) =>
        String(rowA.getValue(id)).length - String(rowB.getValue(id)).length,
    }}
  />
);

CustomSortFn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(firstNameCells(canvasElement)).toEqual([
      'Tom',
      'Lily',
      'Mason',
      'Brooke',
      'Jackson',
      'Anderson',
    ]),
  );
};

export const CustomAggregationFn = () => (
  <ShadcnTable
    aggregationFns={{
      customAggregationFn: constructAggregationFn({
        aggregate: ({ getValue, rows }) => {
          const ages = rows.map((row) => Number(getValue(row)));
          return `${Math.min(...ages)}-${Math.max(...ages)}`;
        },
      }),
    }}
    columns={[
      { accessorKey: 'team', header: 'Team' },
      { accessorKey: 'firstName', header: 'First Name' },
      {
        AggregatedCell: ({ cell }) => cell.getValue<string>(),
        accessorKey: 'age',
        aggregationFn: 'customAggregationFn',
        header: 'Age',
      },
    ]}
    data={data}
    enableGrouping
    initialState={{ expanded: true, grouping: ['team'] }}
  />
);

CustomAggregationFn.play = async ({ canvas }: StoryContext) => {
  await waitFor(async () => {
    await expect(canvas.getByText('29-41')).toBeInTheDocument();
    await expect(canvas.getByText('22-50')).toBeInTheDocument();
  });
};

// An array of built-in names aggregates with each one: count and mean of
// the ages per team (both teams hold three people with a mean age of 35).
export const AggregationFnArray = () => (
  <ShadcnTable
    columns={[
      { accessorKey: 'team', header: 'Team' },
      { accessorKey: 'firstName', header: 'First Name' },
      {
        AggregatedCell: ({ cell }) => (
          <span data-testid="aggregated-age">
            {JSON.stringify(cell.getValue())}
          </span>
        ),
        accessorKey: 'age',
        aggregationFn: ['count', 'mean'],
        header: 'Age',
      },
    ]}
    data={data}
    enableGrouping
    initialState={{ grouping: ['team'] }}
  />
);

AggregationFnArray.play = async ({ canvas }: StoryContext) => {
  await waitFor(() =>
    expect(
      canvas.getAllByTestId('aggregated-age').map((cell) => cell.textContent),
    ).toEqual(['[3,35]', '[3,35]']),
  );
};

// The second table names the first table's filter fn, which its own registry
// does not have: core warns and that column filters nothing, while the first
// table filters with the same name and the second filters with its own.
export const TwoTablesDifferentRegistries = () => (
  <div className="flex flex-col gap-8">
    <div data-testid="table-a">
      <ShadcnTable
        columns={[
          {
            accessorKey: 'firstName',
            filterFn: 'tableAFilterFn',
            header: 'First Name',
          },
        ]}
        data={data}
        filterFns={{ tableAFilterFn: lengthEquals }}
        initialState={{
          columnFilters: [{ id: 'firstName', value: '5' }],
          showColumnFilters: true,
        }}
      />
    </div>
    <div data-testid="table-b">
      <ShadcnTable
        columns={[
          {
            accessorKey: 'firstName',
            filterFn: 'tableAFilterFn',
            header: 'First Name',
          },
          {
            accessorKey: 'lastName',
            filterFn: 'tableBFilterFn',
            header: 'Last Name',
          },
        ]}
        data={data}
        filterFns={{
          tableBFilterFn: (row, id, filterValue: string) =>
            String(row.getValue(id)).startsWith(filterValue),
        }}
        initialState={{
          columnFilters: [
            { id: 'firstName', value: '5' },
            { id: 'lastName', value: 'D' },
          ],
          showColumnFilters: true,
        }}
      />
    </div>
  </div>
);

TwoTablesDifferentRegistries.play = async ({ canvasElement }: StoryContext) => {
  const names = (testId: string) =>
    firstNameCells(canvasElement.querySelector(`[data-testid="${testId}"]`)!);
  await waitFor(() => {
    expect(names('table-a')).toEqual(['Mason']);
    // 'tableAFilterFn' is unknown to table B, so only its own lastName
    // filter applies: Diaz.
    expect(names('table-b')).toEqual(['Brooke']);
  });
};

let unknownNameWarn: ReturnType<typeof spyOn> | undefined;

// Core skips the filter and keeps every row, no throw. Its warning is
// development only (`process.env.NODE_ENV === 'development'`), so the play
// checks it only there.
export const UnknownFilterFnName = {
  beforeEach: () => {
    const spy = spyOn(console, 'warn');
    unknownNameWarn = spy;
    return () => spy.mockRestore();
  },
  render: () => (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          filterFn: 'doesNotExist',
          header: 'First Name',
        },
      ]}
      data={data}
      initialState={{
        columnFilters: [{ id: 'firstName', value: 'zzz' }],
        showColumnFilters: true,
      }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() =>
      expect(firstNameCells(canvasElement)).toHaveLength(data.length),
    );
    if (process.env.NODE_ENV === 'development') {
      await expect(unknownNameWarn).toHaveBeenCalledWith(
        expect.stringContaining("filterFn 'doesNotExist'"),
      );
    }
  },
};

// The search mode menu switches the applied function. A mode pick clears the
// search: `ily` matches Lily under fuzzy, nothing under Starts With (where
// `Li` does), Lily again under Contains.
export const GlobalFilterModeSwitch = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGlobalFilterModes
      enablePagination={false}
      initialState={{ showGlobalFilter: true }}
    />
  ),
  play: async ({ canvas, canvasElement }: StoryContext) => {
    const body = within(document.body);
    const search = canvas.getByPlaceholderText('Search');
    const searchFor = async (value: string) => {
      await userEvent.clear(search);
      await userEvent.type(search, value);
    };
    const selectMode = async (label: string) => {
      await userEvent.click(canvas.getByLabelText('Change search mode'));
      await userEvent.click(
        await body.findByRole('menuitem', { name: new RegExp(label) }),
      );
      await waitFor(() => expect(search).toHaveValue(''));
    };
    await searchFor('ily');
    await waitFor(() =>
      expect(firstNameCells(canvasElement)).toEqual(['Lily']),
    );
    await selectMode('Starts With');
    await searchFor('ily');
    await waitFor(() => expect(bodyText(canvasElement)).not.toContain('Lily'));
    await searchFor('Li');
    await waitFor(() =>
      expect(firstNameCells(canvasElement)).toEqual(['Lily']),
    );
    await selectMode('Contains');
    await searchFor('ily');
    await waitFor(() =>
      expect(firstNameCells(canvasElement)).toEqual(['Lily']),
    );
  },
};

const modeColumns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
];

const modeData = data.filter(({ firstName }) =>
  ['Mason', 'Lily', 'Jackson'].includes(firstName),
);

// `table.setGlobalFilterFn` from outside the menu re-filters a live search:
// `ily` matches Lily under fuzzy and nothing under Starts With.
export const ProgrammaticGlobalFilterMode = {
  render: () => (
    <ShadcnTable
      columns={modeColumns}
      data={modeData}
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
      columns={modeColumns}
      data={modeData}
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

// The column filter mode menu (ST_FilterOptionMenu) switches the applied
// function and the helper label reads the new name: `ack` matches Jackson
// under fuzzy, nothing under Starts With, Jackson again under Contains.
// Fresh column objects per render: the table writes the picked mode onto the
// column def it is handed, so a shared module-level array would start the
// next mount in the last picked mode.
export const ColumnFilterModeSwitch = {
  render: () => (
    <ShadcnTable
      columns={[{ accessorKey: 'firstName', header: 'First Name' }]}
      data={modeData}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvas, canvasElement }: StoryContext) => {
    const body = within(document.body);
    const selectMode = async (label: string) => {
      await userEvent.click(canvas.getByLabelText('Change filter mode'));
      await userEvent.click(
        await body.findByRole('menuitem', { name: new RegExp(label) }),
      );
      await waitFor(() =>
        expect(canvas.getByText(`Filter Mode: ${label}`)).toBeVisible(),
      );
    };
    await expect(canvas.getByText('Filter Mode: Fuzzy')).toBeVisible();
    await userEvent.type(
      canvas.getByPlaceholderText('Filter by First Name'),
      'ack',
    );
    await waitFor(() =>
      expect(firstNameCells(canvasElement)).toEqual(['Jackson']),
    );
    await selectMode('Starts With');
    await waitFor(() =>
      expect(bodyText(canvasElement)).not.toContain('Jackson'),
    );
    await selectMode('Contains');
    await waitFor(() =>
      expect(firstNameCells(canvasElement)).toEqual(['Jackson']),
    );
  },
};
