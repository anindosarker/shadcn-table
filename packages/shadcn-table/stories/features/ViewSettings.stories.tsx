import { useState } from 'react';
import { useSelector } from '@tanstack/react-store';
import { CircleDotIcon, FlagIcon, TypeIcon } from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';

// The view settings panel: one row per table preference with a pin toggle
// that places it in the toolbar, and "Reset view".
const meta: Meta = {
  title: 'Features/View Settings Examples',
};

export default meta;

type Task = { name: string; priority: string; status: string };

const data: Task[] = [
  { name: 'Build search index', priority: 'High', status: 'Done' },
  { name: 'Plan audit log', priority: 'Low', status: 'In Progress' },
  { name: 'Review billing page', priority: 'High', status: 'Not Started' },
];

const columns: ST_ColumnDef<Task>[] = [
  { accessorKey: 'name', header: 'Name', icon: TypeIcon },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon },
];

const options: Partial<ST_TableOptions<Task>> = {
  columnFilterDisplayMode: 'chips',
  enableSortPopover: true,
  enableViewSettings: true,
};

const STORAGE_KEY = 'st-story-view-settings';

/** The table with its density and grid lines printed below it. */
const ViewSettingsTable = (props: Partial<ST_TableOptions<Task>>) => {
  const table = useShadcnTable({ columns, data, ...options, ...props });
  const density = useSelector(table.atoms.density);
  const gridLines = useSelector(
    table.atoms.viewSettings,
    (state) => state.gridLines,
  );
  return (
    <>
      <ShadcnTable table={table} />
      <output className="text-sm" data-testid="view-state">
        {`density=${density} gridLines=${gridLines}`}
      </output>
    </>
  );
};

export const ViewSettingsDefault = () => <ViewSettingsTable />;

export const ViewSettingsSeeded = () => (
  <ViewSettingsTable
    initialState={{
      columnVisibility: { priority: false },
      density: 'compact',
    }}
  />
);

export const ViewSettingsPersisted = (
  props: Partial<ST_TableOptions<Task>>,
) => {
  const [mount, setMount] = useState(0);
  return (
    <>
      <button onClick={() => setMount((n) => n + 1)} type="button">
        Remount
      </button>
      <ViewSettingsTable
        key={`mount-${mount}`}
        persistViewSettings={STORAGE_KEY}
        {...props}
      />
    </>
  );
};

const viewState = (canvasElement: HTMLElement) =>
  within(canvasElement).getByTestId('view-state').textContent;

const openPanel = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'View settings' }),
  );
  await waitFor(() =>
    expect(document.body.querySelectorAll('[data-view-setting]')).toHaveLength(
      7,
    ),
  );
};

export const PanelRowsAndRowNumbers = {
  render: ViewSettingsDefault,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await openPanel(canvasElement);
    expect(
      [
        ...document.body.querySelectorAll<HTMLElement>('[data-view-setting]'),
      ].map((row) => row.dataset.viewSetting),
    ).toEqual([
      'columns',
      'density',
      'wrapText',
      'gridLines',
      'stickyHeader',
      'striped',
      'rowNumbers',
    ]);
    expect(body.getByRole('button', { name: 'Reset view' })).toBeEnabled();

    expect(canvas.queryByRole('columnheader', { name: '#' })).toBeNull();
    await userEvent.click(body.getByRole('switch', { name: 'Row Numbers' }));
    await canvas.findByRole('columnheader', { name: '#' });
    await userEvent.click(body.getByRole('switch', { name: 'Row Numbers' }));
    await waitFor(() =>
      expect(canvas.queryByRole('columnheader', { name: '#' })).toBeNull(),
    );
  },
};

export const PinUnpinAndSteppers = {
  render: ViewSettingsDefault,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    // Columns and Density are pinned by default.
    expect(
      canvas.getByRole('button', { name: 'Show/Hide columns' }),
    ).toBeVisible();
    expect(
      canvas.getByRole('button', { name: 'Toggle density' }),
    ).toBeVisible();
    expect(canvas.queryByRole('button', { name: 'Grid lines' })).toBeNull();

    await openPanel(canvasElement);
    const pinGridLines = body.getByRole('button', {
      name: 'Pin to toolbar: Grid lines',
    });
    expect(pinGridLines.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(pinGridLines);
    await canvas.findByRole('button', { name: 'Grid lines' });
    await userEvent.click(
      body.getByRole('button', { name: 'Unpin from toolbar: Density' }),
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('button', { name: 'Toggle density' }),
      ).toBeNull(),
    );
    // A click outside closes the panel.
    await userEvent.click(canvas.getByText('Plan audit log'));
    await waitFor(() =>
      expect(document.body.querySelector('[data-view-setting]')).toBeNull(),
    );

    // The pinned stepper moves to the next value.
    const before = viewState(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Grid lines' }));
    await waitFor(() => expect(viewState(canvasElement)).not.toBe(before));
  },
};

export const ResetView = {
  render: ViewSettingsSeeded,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');
    expect(viewState(canvasElement)).toContain('density=compact');
    expect(canvas.queryByRole('columnheader', { name: /Priority/ })).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle density' }),
    );
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('density=comfortable'),
    );
    await openPanel(canvasElement);
    await userEvent.click(
      body.getByRole('button', { name: 'Pin to toolbar: Sticky header' }),
    );
    await canvas.findByRole('button', { name: 'Sticky header' });

    await userEvent.click(body.getByRole('button', { name: 'Reset view' }));
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('density=compact'),
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('button', { name: 'Sticky header' }),
      ).toBeNull(),
    );
    expect(
      canvas.getByRole('button', { name: 'Toggle density' }),
    ).toBeVisible();
    expect(canvas.queryByRole('columnheader', { name: /Priority/ })).toBeNull();
  },
};

export const Persistence = {
  render: ViewSettingsPersisted,
  beforeEach: () => {
    window.localStorage.removeItem(STORAGE_KEY);
    return () => window.localStorage.removeItem(STORAGE_KEY);
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Plan audit log');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle density' }),
    );
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('density=spacious'),
    );
    await waitFor(() =>
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain('spacious'),
    );

    // A remount reads the stored view and clears the pending mark.
    await userEvent.click(canvas.getByRole('button', { name: 'Remount' }));
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('density=spacious'),
    );
    expect(canvasElement.querySelector('[data-st-view-pending]')).toBeNull();

    // Reset view deletes the stored view.
    await userEvent.click(
      canvas.getByRole('button', { name: 'View settings' }),
    );
    await userEvent.click(
      await within(document.body).findByRole('button', { name: 'Reset view' }),
    );
    await waitFor(() =>
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull(),
    );
  },
};

// Display columns sit in the stored column order; a stored view that names
// them still restores.
export const PersistenceWithDisplayColumns = {
  render: () => <ViewSettingsPersisted enableRowActions />,
  beforeEach: Persistence.beforeEach,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await openPanel(canvasElement);
    await userEvent.click(body.getByRole('switch', { name: 'Row Numbers' }));
    await canvas.findByRole('columnheader', { name: '#' });
    await waitFor(() =>
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        'st-row-numbers',
      ),
    );
    await userEvent.keyboard('{Escape}');

    await userEvent.click(canvas.getByRole('button', { name: 'Remount' }));
    await canvas.findByRole('columnheader', { name: '#' });
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
      'st-row-numbers',
    );
  },
};

// Row numbers turned on through the view settings: every body cell keeps its
// header cell's edges (F16), as on the persistent view docs page.
export const RowNumbersKeepAlignment = {
  render: () => (
    <ViewSettingsTable
      initialState={{
        viewSettings: { gridLines: 'all' },
      }}
      persistViewSettings={`${STORAGE_KEY}-alignment`}
    />
  ),
  beforeEach: () => {
    window.localStorage.removeItem(`${STORAGE_KEY}-alignment`);
    return () => window.localStorage.removeItem(`${STORAGE_KEY}-alignment`);
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Plan audit log');
    await openPanel(canvasElement);
    await userEvent.click(
      within(document.body).getByRole('switch', { name: /row numbers/i }),
    );
    await canvas.findByRole('columnheader', { name: '#' });
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      const headers = [
        ...canvasElement.querySelectorAll<HTMLElement>(
          'thead th[data-flip-column]',
        ),
      ];
      expect(headers.map((th) => th.dataset.flipColumn)).toContain(
        'st-row-numbers',
      );
      for (const th of headers) {
        const td = canvasElement.querySelector<HTMLElement>(
          `tbody tr td[data-flip-column="${th.dataset.flipColumn}"]`,
        );
        expect(td, th.dataset.flipColumn).not.toBeNull();
        const head = th.getBoundingClientRect();
        const cell = td!.getBoundingClientRect();
        expect(
          Math.abs(head.left - cell.left),
          `${th.dataset.flipColumn} left`,
        ).toBeLessThanOrEqual(1);
        expect(
          Math.abs(head.right - cell.right),
          `${th.dataset.flipColumn} right`,
        ).toBeLessThanOrEqual(1);
      }
    });
  },
};

export const ToolbarGroupOrder = {
  render: ViewSettingsSeeded,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Plan audit log');
    const labels = [
      'Show/Hide search',
      'Filter',
      'Sort',
      'Show/Hide columns',
      'Toggle density',
      'Toggle full screen',
      'View settings',
    ];
    const buttons = labels.map((name) => canvas.getByRole('button', { name }));
    buttons
      .slice(1)
      .forEach((button, index) =>
        expect(
          buttons[index].compareDocumentPosition(button) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy(),
      );
    // Only the filter button with filters and the sort button with sorts
    // take the secondary fill; with neither, every button is ghost.
    buttons.forEach((button) =>
      expect(button.getAttribute('data-variant')).not.toBe('secondary'),
    );
  },
};
