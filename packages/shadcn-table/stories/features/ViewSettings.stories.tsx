import { useMemo, useState } from 'react';
import { useSelector } from '@tanstack/react-store';
import {
  ArchiveIcon,
  CalendarClockIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CircleDotIcon,
  FlagIcon,
  FolderIcon,
  GaugeIcon,
  GitPullRequestIcon,
  HashIcon,
  SquareCheckIcon,
  SquareIcon,
  StickyNoteIcon,
  TagsIcon,
  TimerIcon,
  TypeIcon,
  UserIcon,
  UserPenIcon,
  UsersIcon,
} from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Badge } from '@/components/ui/badge';
import { ST_Default_Icons as hugeicons } from '@/components/ui/shadcn-table/icons/hugeicons';
import { ST_Default_Icons as phosphor } from '@/components/ui/shadcn-table/icons/phosphor';
import { ST_Default_Icons as remixicon } from '@/components/ui/shadcn-table/icons/remixicon';
import { ST_Default_Icons as tabler } from '@/components/ui/shadcn-table/icons/tabler';

// The view settings panel: one row per table preference with a pin toggle
// that places it in the toolbar, and "Reset view".
const meta: Meta = {
  title: 'Features/View Settings',
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
  const pageSize = useSelector(
    table.atoms.pagination,
    (state) => state.pageSize,
  );
  const pageIndex = useSelector(
    table.atoms.pagination,
    (state) => state.pageIndex,
  );
  return (
    <>
      <ShadcnTable table={table} />
      <output className="text-sm" data-testid="view-state">
        {`density=${density} gridLines=${gridLines} pageSize=${pageSize} pageIndex=${pageIndex}`}
      </output>
    </>
  );
};

export const ViewSettingsDefault = {
  render: () => <ViewSettingsTable />,
  play: async (context: StoryContext) => {
    await context.step('PinUnpinAndSteppers', () =>
      pinUnpinAndSteppers(context),
    );
    await context.step('PanelRowsAndRowNumbers', () =>
      panelRowsAndRowNumbers(context),
    );
  },
};

export const ViewSettingsSeeded = {
  render: () => (
    <ViewSettingsTable
      initialState={{
        columnVisibility: { priority: false },
        density: 'compact',
      }}
    />
  ),
  play: async (context: StoryContext) => {
    await context.step('ToolbarGroupOrder', () => toolbarGroupOrder(context));
    await context.step('ResetView', () => resetView(context));
  },
};

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

const panelRowsAndRowNumbers = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Plan audit log');

  await openPanel(canvasElement);
  expect(
    [...document.body.querySelectorAll<HTMLElement>('[data-view-setting]')].map(
      (row) => row.dataset.viewSetting,
    ),
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
  await userEvent.click(body.getByRole('switch', { name: 'Row numbers' }));
  await canvas.findByRole('columnheader', { name: '#' });
  await userEvent.click(body.getByRole('switch', { name: 'Row numbers' }));
  await waitFor(() =>
    expect(canvas.queryByRole('columnheader', { name: '#' })).toBeNull(),
  );
};

const pinUnpinAndSteppers = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Plan audit log');

  // Columns and Density are pinned by default; the toolbar buttons fade in
  // from 0 opacity on mount (D70).
  await waitFor(() => {
    expect(
      canvas.getByRole('button', { name: 'Show/Hide columns' }),
    ).toBeVisible();
    expect(
      canvas.getByRole('button', { name: 'Toggle density' }),
    ).toBeVisible();
  });
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
    expect(canvas.queryByRole('button', { name: 'Toggle density' })).toBeNull(),
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
};

const resetView = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Plan audit log');
  expect(viewState(canvasElement)).toContain('density=compact');
  expect(canvas.queryByRole('columnheader', { name: /Priority/ })).toBeNull();

  await userEvent.click(canvas.getByRole('button', { name: 'Toggle density' }));
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
    expect(canvas.queryByRole('button', { name: 'Sticky header' })).toBeNull(),
  );
  await waitFor(() =>
    expect(
      canvas.getByRole('button', { name: 'Toggle density' }),
    ).toBeVisible(),
  );
  expect(canvas.queryByRole('columnheader', { name: /Priority/ })).toBeNull();
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

    // Rows per page is part of the stored view (D25).
    await userEvent.click(
      canvas
        .getAllByLabelText('Rows per page')
        .find((element) => element.tagName === 'BUTTON')!,
    );
    await userEvent.click(
      await within(document.body).findByRole('option', { name: '20' }),
    );
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('pageSize=20'),
    );
    await waitFor(() =>
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        '"pageSize":20',
      ),
    );

    // A remount reads the stored view and clears the pending mark.
    await userEvent.click(canvas.getByRole('button', { name: 'Remount' }));
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('density=spacious'),
    );
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('pageSize=20'),
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

// Sixty rows, so the third page exists at 10 and at 20 rows per page.
const manyTasks: Task[] = Array.from({ length: 60 }, (_, index) => ({
  ...data[index % data.length],
  name: `Task ${index + 1}`,
}));

// A restored rows per page keeps the initial page index instead of remapping
// it to keep the top row (F22, D33).
export const PersistenceKeepsPageIndex = {
  render: () => (
    <ViewSettingsPersisted
      data={manyTasks}
      initialState={{ pagination: { pageIndex: 2, pageSize: 10 } }}
    />
  ),
  beforeEach: Persistence.beforeEach,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Task 21');
    expect(viewState(canvasElement)).toContain('pageSize=10 pageIndex=2');

    await userEvent.click(
      canvas
        .getAllByLabelText('Rows per page')
        .find((element) => element.tagName === 'BUTTON')!,
    );
    await userEvent.click(
      await within(document.body).findByRole('option', { name: '20' }),
    );
    await waitFor(() =>
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        '"pageSize":20',
      ),
    );

    // The remount restores 20 rows per page on the initial third page.
    await userEvent.click(canvas.getByRole('button', { name: 'Remount' }));
    await waitFor(() =>
      expect(viewState(canvasElement)).toContain('pageSize=20 pageIndex=2'),
    );
    await canvas.findByText('Task 41');
    expect(canvas.queryByText('Task 21')).toBeNull();
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
    await userEvent.click(body.getByRole('switch', { name: 'Row numbers' }));
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

const toolbarGroupOrder = async ({ canvasElement }: StoryContext) => {
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
};

// The view settings icons of the four icon editions (D75 keys, D77 picks):
// one cell per icon, the columns icon rotated and the comfortable density
// icon mirrored by the edition's wrapper.
const EDITIONS = { hugeicons, phosphor, remixicon, tabler };
const VIEW_SETTINGS_ICON_KEYS = [
  'GridLinesAllIcon',
  'GridLinesRowsIcon',
  'GridLinesColumnsIcon',
  'GridLinesNoneIcon',
  'ViewColumnIcon',
  'DensitySmallIcon',
  'DensityMediumIcon',
  'DensityLargeIcon',
] as const;

export const EditionIconsRender = {
  render: () => (
    <div className="grid grid-cols-8 gap-2">
      {Object.entries(EDITIONS).flatMap(([set, icons]) =>
        VIEW_SETTINGS_ICON_KEYS.map((key) => {
          const Icon = icons[key];
          return (
            <span data-testid={`${set}-${key}`} key={`${set}-${key}`}>
              <Icon />
            </span>
          );
        }),
      )}
    </div>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const svgOf = (id: string) => canvas.getByTestId(id).querySelector('svg');
    for (const set of Object.keys(EDITIONS)) {
      for (const key of VIEW_SETTINGS_ICON_KEYS) {
        await expect(svgOf(`${set}-${key}`)).not.toBeNull();
      }
      await expect(
        svgOf(`${set}-GridLinesColumnsIcon`)?.classList.contains('rotate-90'),
      ).toBe(true);
    }
    // Tabler keeps its IconBaselineDensity trio, unmirrored (D77).
    for (const set of ['hugeicons', 'phosphor', 'remixicon']) {
      await expect(
        svgOf(`${set}-DensityMediumIcon`)?.classList.contains('-scale-x-100'),
      ).toBe(true);
    }
  },
};

// The docs example persistent-view: 19 task columns, every view item pinned,
// and the view saved to localStorage under the id 'persistent-view'.
type PersistentTask = {
  archived: boolean;
  assignee: string;
  created: string;
  due: string;
  estimate: number;
  id: string;
  name: string;
  notes: string;
  priority: string;
  /** Percent, 0 to 100 */
  progress: number;
  prLink: string;
  project: string;
  reporter: string;
  sprint: string;
  status: string;
  storyPoints: number;
  tags: string[];
  team: string;
  updated: string;
};

const statuses = ['Not Started', 'In Progress', 'In Review', 'Done'];
const assignees = [
  'Ava Chen',
  'Ben Ortiz',
  'Chloe Park',
  'Dev Patel',
  'Elena Rossi',
  'Farid Khan',
];
const projects = ['Atlas', 'Beacon', 'Comet', 'Delta'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const tags = ['Frontend', 'Backend', 'Bug', 'Feature', 'Docs', 'Infra'];
const reporters = ['Grace Liu', 'Hugo Silva', 'Iris Novak', 'Jonas Berg'];
const teams = ['Platform', 'Growth', 'Payments', 'Mobile'];
const sprints = [
  'Sprint 41',
  'Sprint 42',
  'Sprint 43',
  'Sprint 44',
  'Sprint 45',
  'Sprint 46',
];

// The example's makeData.ts: a seeded generator, so every render shows the
// same 50 rows.
const makePersistentTasks = (): PersistentTask[] => {
  const notes = [
    'Waiting on design sign-off before the second pass on spacing and copy.',
    'Blocked by the staging migration; pick up again once the schema lands.',
    'Customer reported this twice last week, keep the scope small and ship.',
    'Pairs with the backend change, merge both in the same release window.',
    'Needs a follow-up ticket for the edge cases found during review.',
    'Low risk, mostly copy and layout changes behind the existing flag.',
  ];
  const verbs = [
    'Design',
    'Build',
    'Review',
    'Refactor',
    'Test',
    'Document',
    'Ship',
    'Plan',
  ];
  const nouns = [
    'onboarding flow',
    'billing page',
    'search index',
    'auth service',
    'settings panel',
    'export job',
    'dashboard charts',
    'notification center',
    'audit log',
    'API rate limits',
  ];

  const makeRandom = (seed: number) => {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  };

  const random = makeRandom(42);
  const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)];
  const day = 86_400_000;
  const start = Date.UTC(2026, 10, 1);
  const isoDate = (time: number) => new Date(time).toISOString().slice(0, 10);

  return Array.from({ length: 50 }, (_, index) => {
    const due = isoDate(start + Math.floor(random() * 90) * day);
    const created = Date.UTC(2026, 8, 1) + Math.floor(random() * 50) * day;
    const updated = created + Math.floor(random() * 30) * day;
    const name = `${pick(verbs)} ${pick(nouns)}`;
    const status = pick(statuses);
    const assignee = pick(assignees);
    const project = pick(projects);
    const estimate = 1 + Math.floor(random() * 40);
    const priority = pick(priorities);
    const tagCount = 1 + Math.floor(random() * 3);
    const picked = new Set<string>();
    while (picked.size < tagCount) picked.add(pick(tags));
    const task = {
      assignee,
      created: isoDate(created),
      due,
      estimate,
      id: `task-${index + 1}`,
      name,
      priority,
      project,
      reporter: pick(reporters),
      status,
      tags: tags.filter((tag) => picked.has(tag)),
      team: pick(teams),
      sprint: pick(sprints),
      updated: isoDate(updated),
      storyPoints: pick([1, 2, 3, 5, 8, 13]),
    };
    const progress = Math.floor(random() * 21) * 5;
    const prLink = `https://github.com/acme/app/pull/${1200 + index * 7}`;
    const archived = random() < 0.2;
    return { ...task, progress, prLink, archived, notes: pick(notes) };
  });
};

const persistentTasks = makePersistentTasks();

//a small dot tells the statuses and the priorities apart
const statusDot: Record<string, string> = {
  'Not Started': 'bg-zinc-400 dark:bg-zinc-500',
  'In Progress': 'bg-blue-500',
  'In Review': 'bg-amber-500',
  Done: 'bg-green-500',
};

const priorityDot: Record<string, string> = {
  Low: 'bg-zinc-400 dark:bg-zinc-500',
  Medium: 'bg-sky-500',
  High: 'bg-amber-500',
  Urgent: 'bg-red-500',
};

//tags shown before the rest fold into "+n"
const visibleTagCount = 2;

const PersistentViewTable = () => {
  const columns = useMemo<ST_ColumnDef<PersistentTask>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        icon: TypeIcon,
        filterVariant: 'text',
        columnFilterModeOptions: [
          'fuzzy',
          'contains',
          'startsWith',
          'endsWith',
          'equals',
          'notEquals',
          'empty',
          'notEmpty',
        ],
        size: 260,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        icon: CircleDotIcon,
        filterVariant: 'select',
        filterSelectOptions: statuses,
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          return (
            <Badge className="max-w-full" variant="secondary">
              <span
                className={`size-1.5 shrink-0 rounded-full ${statusDot[status]}`}
              />
              <span className="truncate">{status}</span>
            </Badge>
          );
        },
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        icon: UserIcon,
        filterVariant: 'select',
        filterSelectOptions: assignees,
        size: 160,
      },
      {
        accessorKey: 'project',
        header: 'Project',
        icon: FolderIcon,
        filterVariant: 'select',
        filterSelectOptions: projects,
        size: 130,
      },
      {
        accessorKey: 'due',
        enableColumnOrdering: false, //locked in place
        header: 'Due',
        icon: CalendarIcon,
        filterVariant: 'date',
        filterFn: 'lessThan',
        size: 130,
      },
      {
        accessorKey: 'estimate',
        header: 'Estimate',
        icon: HashIcon,
        filterVariant: 'range',
        size: 120,
        Cell: ({ cell }) => (
          <span className="tabular-nums">{cell.getValue<number>()}h</span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        icon: FlagIcon,
        filterVariant: 'select',
        filterSelectOptions: priorities,
        size: 120,
        //by rank, not alphabetically
        sortFn: (rowA, rowB, columnId) =>
          priorities.indexOf(rowA.getValue<string>(columnId)) -
          priorities.indexOf(rowB.getValue<string>(columnId)),
        Cell: ({ cell }) => {
          const priority = cell.getValue<string>();
          return (
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className={`size-1.5 shrink-0 rounded-full ${priorityDot[priority]}`}
              />
              <span className="truncate">{priority}</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        icon: TagsIcon,
        filterVariant: 'multi-select',
        filterSelectOptions: tags,
        //a row matches when it has any of the picked tags
        filterFn: 'arrIncludesSome',
        enableGlobalFilter: false,
        enableSorting: false,
        size: 200,
        Cell: ({ cell, table }) => {
          const rowTags = cell.getValue<string[]>();
          //with wrap cell text on, every tag shows and wraps
          const wrap = table.atoms.viewSettings.get().wrapText;
          const shown = wrap ? rowTags : rowTags.slice(0, visibleTagCount);
          const hidden = rowTags.length - shown.length;
          return (
            <span
              className={`flex gap-1 ${wrap ? 'flex-wrap' : 'overflow-hidden'}`}
            >
              {shown.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {hidden > 0 && (
                <Badge title={rowTags.join(', ')} variant="secondary">
                  +{hidden}
                </Badge>
              )}
            </span>
          );
        },
      },
      {
        accessorKey: 'reporter',
        header: 'Reporter',
        icon: UserPenIcon,
        filterVariant: 'select',
        filterSelectOptions: reporters,
        size: 150,
      },
      {
        accessorKey: 'team',
        enableColumnOrdering: false, //locked in place
        header: 'Team',
        icon: UsersIcon,
        filterVariant: 'select',
        filterSelectOptions: teams,
        size: 120,
      },
      {
        accessorKey: 'sprint',
        header: 'Sprint',
        icon: TimerIcon,
        filterVariant: 'select',
        filterSelectOptions: sprints,
        size: 120,
      },
      {
        accessorKey: 'created',
        header: 'Created',
        icon: CalendarPlusIcon,
        filterVariant: 'date',
        filterFn: 'lessThan',
        size: 130,
      },
      {
        accessorKey: 'updated',
        header: 'Updated',
        icon: CalendarClockIcon,
        filterVariant: 'date',
        filterFn: 'lessThan',
        size: 130,
      },
      {
        accessorKey: 'storyPoints',
        header: 'Story points',
        icon: HashIcon,
        filterVariant: 'range',
        size: 130,
        Cell: ({ cell }) => (
          <span className="tabular-nums">{cell.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'progress',
        header: 'Progress',
        icon: GaugeIcon,
        filterVariant: 'range',
        size: 150,
        Cell: ({ cell }) => {
          const progress = cell.getValue<number>();
          return (
            <span className="flex w-full items-center gap-2">
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </span>
              <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                {progress}%
              </span>
            </span>
          );
        },
      },
      {
        accessorKey: 'prLink',
        header: 'PR link',
        icon: GitPullRequestIcon,
        filterVariant: 'text',
        size: 160,
        Cell: ({ cell }) => {
          const url = cell.getValue<string>();
          return (
            <a
              className="truncate text-primary underline-offset-4 hover:underline"
              href={url}
              rel="noreferrer"
              target="_blank"
              title={url}
            >
              {url.replace('https://github.com/', '')}
            </a>
          );
        },
      },
      {
        accessorKey: 'archived',
        header: 'Archived',
        icon: ArchiveIcon,
        filterVariant: 'checkbox',
        enableGlobalFilter: false,
        size: 110,
        Cell: ({ cell }) => {
          const archived = cell.getValue<boolean>();
          const Icon = archived ? SquareCheckIcon : SquareIcon;
          return (
            <Icon
              aria-label={archived ? 'Archived' : 'Not archived'}
              className={`size-4 ${archived ? 'text-foreground' : 'text-muted-foreground/50'}`}
              role="img"
            />
          );
        },
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        icon: StickyNoteIcon,
        filterVariant: 'text',
        size: 260,
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: persistentTasks,
    //saves the view settings, pins, column order, pinning and visibility to localStorage
    persistViewSettings: true,
    //optional: a stable name for the storage key (a hash of the column ids otherwise)
    id: 'persistent-view',
    initialState: {
      //every view settings item pinned to the toolbar
      viewSettings: {
        gridLines: 'rows',
        pins: [
          'columns',
          'density',
          'wrapText',
          'gridLines',
          'stickyHeader',
          'striped',
          'rowNumbers',
        ],
        rowNumbers: false,
        stickyHeader: false,
        striped: false,
        wrapText: false,
      },
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Change the density or the column order, then reload the page: the table
        comes back the way you left it.
      </p>
      <ShadcnTable table={table} />
    </div>
  );
};

const PERSISTENT_VIEW_KEY = 'shadcn-table:persistent-view:view';

export const PersistentView = {
  render: () => <PersistentViewTable />,
  beforeEach: () => {
    window.localStorage.removeItem(PERSISTENT_VIEW_KEY);
    return () => window.localStorage.removeItem(PERSISTENT_VIEW_KEY);
  },
  play: async ({ canvasElement, step }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(persistentTasks[0].name);
    expect(canvas.queryByRole('columnheader', { name: '#' })).toBeNull();

    await step('Row numbers from the toolbar are saved', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Row numbers' }),
      );
      await canvas.findByRole('columnheader', { name: '#' });
      await waitFor(() =>
        expect(window.localStorage.getItem(PERSISTENT_VIEW_KEY)).toContain(
          '"rowNumbers":true',
        ),
      );
    });

    await step('Reset view returns the first look', async () => {
      await openPanel(canvasElement);
      await userEvent.click(
        within(document.body).getByRole('button', { name: 'Reset view' }),
      );
      await waitFor(() =>
        expect(canvas.queryByRole('columnheader', { name: '#' })).toBeNull(),
      );
      await waitFor(() =>
        expect(window.localStorage.getItem(PERSISTENT_VIEW_KEY)).toBeNull(),
      );
    });
  },
};
