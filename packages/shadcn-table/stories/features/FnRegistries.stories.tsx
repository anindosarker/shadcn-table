import { useState } from 'react';
import { constructAggregationFn } from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  type ST_FilterFn,
  ST_TablePagination,
  ST_TableProvider,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixtures for the decisions item 3 verify list (per-call fn registries,
// context readers, no AppTable remount). Fixed data so every assertion is
// deterministic.

const meta: Meta = {
  title: 'Features/Fn Registries',
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

export const UnknownFilterFnName = () => (
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
);

// Core logs its dev warning and the filter is skipped: every row stays.
UnknownFilterFnName.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(firstNameCells(canvasElement)).toHaveLength(data.length),
  );
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
