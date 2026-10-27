import {
  Component,
  Profiler,
  type ProfilerOnRenderCallback,
  type ReactNode,
  useState,
} from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
  type ST_DensityState,
  type ST_PaginationState,
  type ST_RowSelectionState,
  ST_ShowHideColumnsButton,
  ST_TablePagination,
  ST_ToggleDensePaddingButton,
  ST_ToggleFiltersButton,
  ST_ToggleFullScreenButton,
  ST_ToggleGlobalFilterButton,
  useShadcnTable,
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

type Profiled = { age: number; firstName: string; lastName: string };

const thousand: Profiled[] = Array.from({ length: 1000 }, (_, i) => ({
  firstName: `First${String(i + 1).padStart(4, '0')}`,
  lastName: `Last${String(i + 1).padStart(4, '0')}`,
  age: 20 + (i % 50),
}));

// Render and commit counters for the Profiler fixtures. Module level, so the
// readout component can show them without owning them (a state update in the
// readout must not re-render the table).
type RenderCounts = {
  bodyCellProps: Record<string, number>;
  bodyRowProps: Record<string, number>;
  buttonCommits: Record<string, number>;
  headCellProps: Record<string, number>;
  probeCell: Record<string, number>;
  probeHeader: number;
  tableCommits: number;
};

const freshCounts = (): RenderCounts => ({
  bodyCellProps: {},
  bodyRowProps: {},
  buttonCommits: {},
  headCellProps: {},
  probeCell: {},
  probeHeader: 0,
  tableCommits: 0,
});

let counts = freshCounts();

const bump = (record: Record<string, number>, key: string) => {
  record[key] = (record[key] ?? 0) + 1;
};

const onButtonRender: ProfilerOnRenderCallback = (id) =>
  bump(counts.buttonCommits, id);

const profiledColumns: ST_ColumnDef<Profiled>[] = [
  {
    // A display column's `Cell` and `Header` run inside the td and th state
    // subscriptions, so these count the commits of one cell per row and of
    // one head cell.
    id: 'probe',
    columnDefType: 'display',
    header: 'Probe',
    Header: () => {
      counts.probeHeader++;
      return <span data-testid="probe-header">Probe</span>;
    },
    Cell: ({ row }) => {
      bump(counts.probeCell, row.id);
      return <span data-probe={row.id} />;
    },
    size: 60,
  },
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
];

// Shows the counters on demand. Its own state, so the snapshot re-renders this
// readout only, never the table beside it.
const CountsReadout = () => {
  const [snapshot, setSnapshot] = useState('');
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-2">
        <button
          onClick={() => setSnapshot(JSON.stringify(counts))}
          type="button"
        >
          Snapshot counts
        </button>
        <button
          onClick={() => {
            counts = freshCounts();
            setSnapshot('');
          }}
          type="button"
        >
          Reset counts
        </button>
      </div>
      <pre data-testid="counts">{snapshot}</pre>
    </div>
  );
};

const readCounts = (root: HTMLElement): RenderCounts =>
  JSON.parse(root.querySelector('[data-testid="counts"]')?.textContent || '{}');

// The last cell of the first row is a data column: `p-2` under compact.
const dataCellClass = (root: HTMLElement) =>
  root.querySelector('tbody tr td:last-child')?.className ?? '';

const sum = (record: Record<string, number>) =>
  Object.values(record).reduce((total, n) => total + n, 0);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Waits until the table stops committing (the container measures the toolbars
// after mount), so the counters start from a settled tree.
const settle = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  let last = -1;
  for (;;) {
    await userEvent.click(canvas.getByText('Snapshot counts'));
    const { tableCommits } = readCounts(canvasElement);
    if (tableCommits === last) return;
    last = tableCommits;
    await sleep(400);
  }
};

// A 1,000-row table built from props (the root opts out of state renders)
// under a React Profiler, with per-component render counters: `st*Props`
// functions count the renders of the cell, head cell and row components, the
// probe column counts the commits inside their subscriptions, and a Profiler
// around each toolbar button counts its commits.
type ProfiledArgs = { positionToolbarAlertBanner: 'none' | 'top' };

export const ProfiledThousandRows = {
  args: { positionToolbarAlertBanner: 'top' },
  render: (args: ProfiledArgs) => (
    <>
      <CountsReadout />
      <Profiler
        id="table"
        onRender={() => {
          counts.tableCommits++;
        }}
      >
        <ShadcnTable
          columns={profiledColumns}
          data={thousand}
          enablePagination={false}
          enableRowSelection
          getRowId={(row) => row.firstName}
          positionToolbarAlertBanner={args.positionToolbarAlertBanner}
          renderTopToolbarCustomActions={({ table }) => (
            <div className="flex gap-2">
              <button
                onClick={() => table.setHoveredRow({ id: 'First0006' })}
                type="button"
              >
                Hover row 6
              </button>
              <button onClick={() => table.setHoveredRow(null)} type="button">
                Clear hover
              </button>
            </div>
          )}
          renderToolbarInternalActions={() => (
            <>
              <Profiler id="search" onRender={onButtonRender}>
                <ST_ToggleGlobalFilterButton />
              </Profiler>
              <Profiler id="filters" onRender={onButtonRender}>
                <ST_ToggleFiltersButton />
              </Profiler>
              <Profiler id="columns" onRender={onButtonRender}>
                <ST_ShowHideColumnsButton />
              </Profiler>
              <Profiler id="density" onRender={onButtonRender}>
                <ST_ToggleDensePaddingButton />
              </Profiler>
              <Profiler id="full-screen" onRender={onButtonRender}>
                <ST_ToggleFullScreenButton />
              </Profiler>
            </>
          )}
          stTableBodyCellProps={({ cell }) => {
            bump(counts.bodyCellProps, cell.id);
            return {};
          }}
          stTableBodyRowProps={({ row }) => {
            bump(counts.bodyRowProps, row.id);
            return {};
          }}
          stTableHeadCellProps={({ column }) => {
            bump(counts.headCellProps, column.id);
            return {};
          }}
        />
      </Profiler>
    </>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr').length).toBe(1000),
    );
    await settle(canvasElement);
    await userEvent.click(canvas.getByText('Reset counts'));

    // Density: every probe cell and the probe head cell commit once; the cell,
    // row and head cell components themselves do not render; the other toolbar
    // buttons do not commit.
    await userEvent.click(canvas.getByLabelText('Toggle density'));
    await waitFor(() => expect(dataCellClass(canvasElement)).toContain('p-2'));
    await userEvent.click(canvas.getByText('Snapshot counts'));
    const afterDensity = readCounts(canvasElement);
    expect(sum(afterDensity.probeCell), 'density: probe cells').toBe(1000);
    expect(afterDensity.probeHeader, 'density: probe header').toBe(1);
    expect(sum(afterDensity.bodyCellProps), 'density: cell renders').toBe(0);
    expect(sum(afterDensity.bodyRowProps), 'density: row renders').toBe(0);
    expect(sum(afterDensity.headCellProps), 'density: head renders').toBe(0);
    expect(afterDensity.buttonCommits['full-screen'] ?? 0).toBe(0);
    expect(afterDensity.buttonCommits['columns'] ?? 0).toBe(0);
    expect(afterDensity.buttonCommits['filters'] ?? 0).toBe(0);
    expect(afterDensity.buttonCommits['search'] ?? 0).toBe(0);

    // Hover: a mouse hover is CSS only (`hover:[&>td]:after:*` on the row), so
    // nothing commits. The library writes `hoveredRow` only while a row drags
    // (`onDragEnter`), so the drag hover is driven through `setHoveredRow`:
    // the hovered row's cells commit once (`isHoveredRow` in the td selector),
    // no other row's cells do, and no cell or row component renders.
    await settle(canvasElement);
    await userEvent.click(canvas.getByText('Reset counts'));
    await userEvent.hover(canvasElement.querySelectorAll('tbody tr')[3]);
    await userEvent.unhover(canvasElement.querySelectorAll('tbody tr')[3]);
    await settle(canvasElement);
    const afterMouseHover = readCounts(canvasElement);
    expect(sum(afterMouseHover.probeCell), 'mouse hover: probe cells').toBe(0);
    expect(afterMouseHover.tableCommits, 'mouse hover: table commits').toBe(0);
    await userEvent.click(canvas.getByText('Hover row 6'));
    await settle(canvasElement);
    const afterHover = readCounts(canvasElement);
    expect(afterHover.probeCell, 'hovered row: probe cells').toEqual({
      First0006: 1,
    });
    expect(sum(afterHover.bodyRowProps), 'hovered row: row renders').toBe(0);
    expect(sum(afterHover.bodyCellProps), 'hovered row: cell renders').toBe(0);
    await userEvent.click(canvas.getByText('Clear hover'));
    await settle(canvasElement);
    expect(readCounts(canvasElement).probeCell, 'cleared hover').toEqual({
      First0006: 2,
    });

    // Selection: the row's checkbox and the select-all header update; no
    // probe cell commits (the cells do not subscribe to the selection) and no
    // row or cell component renders.
    await settle(canvasElement);
    await userEvent.click(canvas.getByText('Reset counts'));
    const rowCheckboxes = canvas.getAllByLabelText('Toggle select row');
    await userEvent.click(rowCheckboxes[2]);
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll('tbody tr[data-selected]').length,
      ).toBe(1),
    );
    expect(
      canvas.getByLabelText('Toggle select all').getAttribute('aria-checked'),
    ).toBe('mixed');
    await settle(canvasElement);
    const afterSelect = readCounts(canvasElement);
    expect(sum(afterSelect.probeCell), 'select: probe cells').toBe(0);
    expect(sum(afterSelect.bodyRowProps), 'select: row renders').toBe(0);
    expect(sum(afterSelect.bodyCellProps), 'select: cell renders').toBe(0);
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
        data={data}
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

type Tree = { age: number; firstName: string; subRows?: Tree[] };

const tree: Tree[] = Array.from({ length: 25 }, (_, i) => ({
  firstName: `P${String(i + 1).padStart(2, '0')}`,
  age: 20 + (i % 5),
  subRows: [{ firstName: `P${String(i + 1).padStart(2, '0')}-child`, age: 1 }],
}));

const treeColumns: ST_ColumnDef<Tree>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'age', header: 'Age' },
];

const rowNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('tbody tr')).map(
    (row) => row.textContent?.match(/P\d\d(-child)?/)?.[0] ?? '',
  );

// The body follows every row model slice. Each change comes from a setter
// called outside the body (a toolbar button), so only the subscriptions carry
// it: sort, filter, paginate, expand and group.
export const RowModelFollowsState = {
  render: () => (
    <ShadcnTable
      columns={treeColumns}
      data={tree}
      enableExpanding
      enableGrouping
      getSubRows={(row) => row.subRows}
      initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
      renderTopToolbarCustomActions={({ table }) => (
        <div className="flex gap-2">
          <button
            onClick={() => table.setSorting([{ desc: true, id: 'firstName' }])}
            type="button"
          >
            Sort desc
          </button>
          <button
            onClick={() =>
              table.setColumnFilters([{ id: 'firstName', value: 'P2' }])
            }
            type="button"
          >
            Filter P2
          </button>
          <button onClick={() => table.setPageIndex(1)} type="button">
            Page 2
          </button>
          <button onClick={() => table.setExpanded(true)} type="button">
            Expand all
          </button>
          <button
            onClick={() => {
              table.setExpanded({});
              table.setPageIndex(0);
              table.setGrouping(['age']);
            }}
            type="button"
          >
            Group by age
          </button>
          <button onClick={() => table.resetColumnFilters()} type="button">
            Clear filters
          </button>
        </div>
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(rowNames(canvasElement)[0]).toBe('P01'));
    await userEvent.click(canvas.getByText('Sort desc'));
    await waitFor(() => expect(rowNames(canvasElement)[0]).toBe('P25'));
    await userEvent.click(canvas.getByText('Filter P2'));
    await waitFor(() =>
      expect(rowNames(canvasElement)).toEqual([
        'P25',
        'P24',
        'P23',
        'P22',
        'P21',
      ]),
    );
    // the fuzzy filter also keeps P12 and P02, so page 2 holds three rows
    await userEvent.click(canvas.getByText('Page 2'));
    await waitFor(() =>
      expect(rowNames(canvasElement)).toEqual(['P20', 'P12', 'P02']),
    );
    // expanded rows paginate too, so page 2 now starts inside P23
    await userEvent.click(canvas.getByText('Expand all'));
    await waitFor(() =>
      expect(rowNames(canvasElement)).toEqual([
        'P23-child',
        'P22',
        'P22-child',
        'P21',
        'P21-child',
      ]),
    );
    await userEvent.click(canvas.getByText('Clear filters'));
    await userEvent.click(canvas.getByText('Group by age'));
    // five collapsed age groups of five rows each
    await waitFor(() =>
      expect(
        Array.from(canvasElement.querySelectorAll('tbody tr')).map(
          (row) => row.textContent?.match(/\(5\)/)?.[0],
        ),
      ).toEqual(['(5)', '(5)', '(5)', '(5)', '(5)']),
    );
  },
};

const innerRows: Person[] = [
  { firstName: 'Inner1' },
  { firstName: 'Inner2' },
  { firstName: 'Inner3' },
  { firstName: 'Inner4' },
  { firstName: 'Inner5' },
];

// A reader inside each table's toolbar: the row summary tells which table the
// context served (`1-3 of 3` outer, `1-5 of 5` inner).
const PaginationReader = ({ label }: { label: string }) => (
  <div data-testid={label}>
    <ST_TablePagination showRowsPerPage={false} />
  </div>
);

// Custom renderers print `table.options.data.length`: the outer renderers
// see 3, the inner ones 5, and each one proves `table` arrived.
export const NestedDetailPanelTable = {
  render: () => (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
          Cell: ({ renderedCellValue, table }) => (
            <span data-testid="outer-cell">
              {renderedCellValue} ({table.options.data.length})
            </span>
          ),
          Header: ({ table }) => (
            <span data-testid="outer-header">
              First Name ({table.options.data.length})
            </span>
          ),
          Footer: ({ table }) => (
            <span data-testid="outer-footer">
              Footer ({table.options.data.length})
            </span>
          ),
        },
      ]}
      data={data}
      enableRowActions
      initialState={{ expanded: true }}
      renderDetailPanel={({ row, table }) => (
        <div data-testid={`detail-${row.id}`}>
          <span data-testid="outer-detail">
            Detail ({table.options.data.length})
          </span>
          <ShadcnTable
            columns={[
              {
                accessorKey: 'firstName',
                header: 'Inner',
                Cell: ({ renderedCellValue, table }) => (
                  <span data-testid="inner-cell">
                    {renderedCellValue} ({table.options.data.length})
                  </span>
                ),
              },
            ]}
            data={innerRows}
            enableBottomToolbar={false}
            renderTopToolbarCustomActions={() => (
              <PaginationReader label="inner-reader" />
            )}
          />
        </div>
      )}
      renderRowActions={({ table }) => (
        <span data-testid="outer-row-actions">
          Actions ({table.options.data.length})
        </span>
      )}
      renderTopToolbarCustomActions={() => (
        <PaginationReader label="outer-reader" />
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByTestId('outer-reader')).toHaveTextContent('1-3 of 3'),
    );
    expect(canvas.getAllByTestId('inner-reader')[0]).toHaveTextContent(
      '1-5 of 5',
    );
    expect(canvas.getAllByTestId('outer-cell')[0]).toHaveTextContent('(3)');
    expect(canvas.getByTestId('outer-header')).toHaveTextContent('(3)');
    expect(canvas.getByTestId('outer-footer')).toHaveTextContent('(3)');
    expect(canvas.getAllByTestId('outer-row-actions')[0]).toHaveTextContent(
      '(3)',
    );
    expect(canvas.getAllByTestId('outer-detail')[0]).toHaveTextContent('(3)');
    expect(canvas.getAllByTestId('inner-cell')[0]).toHaveTextContent('(5)');
    // inner tables: 3 panels of 5 rows each, beside the 3 outer rows
    expect(canvas.getAllByTestId('inner-cell').length).toBe(15);
  },
};

// Menus, dialogs and tooltips render through Radix portals outside the table
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

const ControlledDensityAndSelectionTable = () => {
  const [density, setDensity] = useState<ST_DensityState>('comfortable');
  const [rowSelection, setRowSelection] = useState<ST_RowSelectionState>({});
  return (
    <>
      <span data-testid="owner-density">{density}</span>
      <span data-testid="owner-selection">
        {Object.keys(rowSelection).join()}
      </span>
      <ShadcnTable
        columns={columns}
        data={data}
        enableRowSelection
        onDensityChange={setDensity}
        onRowSelectionChange={setRowSelection}
        state={{ density, rowSelection }}
      />
    </>
  );
};

// Controlled `density` and `rowSelection`: the owner's state drives the cell
// padding and the row highlight through the subscriptions.
export const ControlledDensityAndSelection = {
  render: () => <ControlledDensityAndSelectionTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Mason'));
    await userEvent.click(canvas.getByLabelText('Toggle density'));
    await waitFor(() =>
      expect(canvas.getByTestId('owner-density')).toHaveTextContent('compact'),
    );
    expect(dataCellClass(canvasElement)).toContain('p-2');
    await userEvent.click(canvas.getAllByLabelText('Toggle select row')[1]);
    await waitFor(() =>
      expect(canvas.getByTestId('owner-selection')).toHaveTextContent('1'),
    );
    expect(
      canvasElement.querySelectorAll('tbody tr[data-selected]').length,
    ).toBe(1);
  },
};

// External `atoms.density` and `atoms.rowSelection`, written from outside the
// table. The atoms come from a seed table's reactivity bindings because the
// package has no direct `@tanstack/store` dependency.
const ExternalAtomsTable = () => {
  const seed = useShadcnTable({ columns, data: [] });
  const [density] = useState(() =>
    seed._reactivity.createWritableAtom<ST_DensityState>('comfortable', {
      debugName: 'story/density',
    }),
  );
  const [rowSelection] = useState(() =>
    seed._reactivity.createWritableAtom<ST_RowSelectionState>(
      {},
      { debugName: 'story/rowSelection' },
    ),
  );
  return (
    <>
      <button onClick={() => density.set('compact')} type="button">
        Set compact
      </button>
      <button
        onClick={() => rowSelection.set({ 0: true, 2: true })}
        type="button"
      >
        Select two
      </button>
      <ShadcnTable
        atoms={{ density, rowSelection }}
        columns={columns}
        data={data}
        enableRowSelection
      />
    </>
  );
};

export const ExternalAtomsDensityAndSelection = {
  render: () => <ExternalAtomsTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Mason'));
    await userEvent.click(canvas.getByText('Set compact'));
    await waitFor(() => expect(dataCellClass(canvasElement)).toContain('p-2'));
    await userEvent.click(canvas.getByText('Select two'));
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll('tbody tr[data-selected]').length,
      ).toBe(2),
    );
    expect(
      canvas.getByLabelText('Toggle select all').getAttribute('aria-checked'),
    ).toBe('mixed');
  },
};

// Edit from the cell action menu: the menu's close must not refocus the cell,
// so the edit input it opened keeps focus.
export const CellActionMenuEditKeepsFocus = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      editDisplayMode="cell"
      enableCellActions
      enableClickToCopy="context-menu"
      enableEditing
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const body = within(document.body);
    await waitFor(() => expect(bodyText(canvasElement)).toContain('Mason'));
    const cell = canvasElement.querySelector('tbody td') as HTMLElement;
    await userEvent.pointer({ keys: '[MouseRight]', target: cell });
    await userEvent.click(await body.findByText('Edit'));
    await waitFor(() => {
      const input = cell.querySelector('input');
      expect(input).not.toBeNull();
      expect(document.activeElement).toBe(input);
    });
    // still focused once the menu has fully closed
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(document.activeElement).toBe(cell.querySelector('input'));
  },
};
