import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  CalendarClockIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CircleDotIcon,
  FlagIcon,
  FolderIcon,
  HashIcon,
  Pencil,
  Share2,
  StickyNoteIcon,
  TagsIcon,
  TimerIcon,
  Trash2,
  TypeIcon,
  UserIcon,
  UserPenIcon,
  UsersIcon,
} from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
} from '@/components/ui/shadcn-table';

// The v0.8 default look on the stock defaults, with the header demo's columns
// and data: the capture source for specs 02, 03 and 04.
const meta: Meta = {
  title: 'Styling/Default Look',
};

export default meta;

type Task = {
  assignee: string;
  created: string;
  due: string;
  estimate: number;
  id: string;
  name: string;
  notes: string;
  priority: string;
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

// The demo's seeded generator, call for call, so every capture shows the
// demo's rows.
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

const data: Task[] = Array.from({ length: 50 }, (_, index) => {
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
  // Progress, PR link and archived: drawn as the demo draws them.
  random();
  random();
  return { ...task, notes: pick(notes) };
});

// The demo's columns and sizes; Name, Due and Team are locked.
const columns: ST_ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    enableColumnOrdering: false,
    header: 'Name',
    icon: TypeIcon,
    size: 260,
  },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon, size: 150 },
  { accessorKey: 'assignee', header: 'Assignee', icon: UserIcon, size: 160 },
  { accessorKey: 'project', header: 'Project', icon: FolderIcon, size: 130 },
  {
    accessorKey: 'due',
    enableColumnOrdering: false,
    header: 'Due',
    icon: CalendarIcon,
    size: 130,
  },
  {
    accessorKey: 'estimate',
    Cell: ({ cell }) => `${cell.getValue<number>()}h`,
    header: 'Estimate',
    icon: HashIcon,
    size: 120,
  },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon, size: 120 },
  {
    accessorFn: (row) => row.tags.join(', '),
    enableSorting: false,
    header: 'Tags',
    icon: TagsIcon,
    id: 'tags',
    size: 200,
  },
  { accessorKey: 'reporter', header: 'Reporter', icon: UserPenIcon, size: 150 },
  {
    accessorKey: 'team',
    enableColumnOrdering: false,
    header: 'Team',
    icon: UsersIcon,
    size: 120,
  },
  { accessorKey: 'sprint', header: 'Sprint', icon: TimerIcon, size: 120 },
  {
    accessorKey: 'created',
    header: 'Created',
    icon: CalendarPlusIcon,
    size: 130,
  },
  {
    accessorKey: 'updated',
    header: 'Updated',
    icon: CalendarClockIcon,
    size: 130,
  },
  {
    accessorKey: 'storyPoints',
    header: 'Story points',
    icon: HashIcon,
    size: 130,
  },
  { accessorKey: 'notes', header: 'Notes', icon: StickyNoteIcon, size: 260 },
];

// The stock table: the v0.8 look comes from the defaults; a story overrides
// what it tests.
const DefaultLookTable = (props: Partial<ST_TableOptions<Task>>) => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowActions
    getRowId={(row) => row.id}
    renderRowActionMenuItems={({ closeMenu, row }) => [
      <DropdownMenuItem
        key="edit"
        onClick={() => {
          console.info('Edit', row.original.id);
          closeMenu();
        }}
      >
        <Pencil /> Edit
      </DropdownMenuItem>,
      <DropdownMenuItem
        key="share"
        onClick={() => {
          console.info('Share', row.original.id);
          closeMenu();
        }}
      >
        <Share2 /> Share
      </DropdownMenuItem>,
      <DropdownMenuItem
        key="delete"
        onClick={() => {
          console.info('Delete', row.original.id);
          closeMenu();
        }}
      >
        <Trash2 /> Delete
      </DropdownMenuItem>,
    ]}
    {...props}
  />
);

export const Default = () => <DefaultLookTable />;

// The body rows of the table under `root` that holds data rows.
const bodyRows = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLTableRowElement>('tbody tr[data-index]'),
];

const scrollBoxes = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLElement>(
    '[data-slot="st-scroll-wrapper"] > div:first-child',
  ),
];

const fewRows = data.slice(0, 3);

// Notes long enough to wrap at any frame width.
const longNoteRows = fewRows.map((task) => ({
  ...task,
  notes: task.notes.repeat(4),
}));

// One table per density: rows 40, 48 and 56 px tall.
export const RowMetrics = () => (
  <div className="flex flex-col gap-4">
    {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
      <div data-density={density} key={density}>
        <DefaultLookTable
          data={fewRows}
          initialState={{
            columnPinning: { end: ['st-row-actions'], start: [] },
            density,
          }}
        />
      </div>
    ))}
    <div data-density="wrap">
      <DefaultLookTable
        data={longNoteRows}
        initialState={{
          columnPinning: { end: ['st-row-actions'], start: [] },
          viewSettings: {
            gridLines: 'rows',
            pins: ['columns', 'density'],
            rowNumbers: false,
            stickyHeader: false,
            striped: false,
            wrapText: true,
          },
        }}
      />
    </div>
  </div>
);

RowMetrics.play = async ({ canvasElement }: StoryContext) => {
  const expected = { comfortable: 48, compact: 40, spacious: 56 };
  for (const [density, height] of Object.entries(expected)) {
    const root = canvasElement.querySelector<HTMLElement>(
      `[data-density="${density}"]`,
    )!;
    await waitFor(() => expect(bodyRows(root)).toHaveLength(3));
    for (const row of bodyRows(root)) {
      expect(row.getBoundingClientRect().height).toBe(height);
    }
    // Rows-only hairlines: none under the last row.
    const [, , last] = bodyRows(root);
    const lastCell = last.querySelector('td')!;
    expect(getComputedStyle(lastCell).borderBottomWidth).toBe('0px');
    const firstCell = bodyRows(root)[0].querySelector('td')!;
    expect(getComputedStyle(firstCell).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(firstCell).borderInlineEndWidth).toBe('0px');
  }

  // Wrapped text shows in full: the row grows past the density height and
  // no cell clips its content.
  const wrapRoot = canvasElement.querySelector<HTMLElement>(
    '[data-density="wrap"]',
  )!;
  await waitFor(() => expect(bodyRows(wrapRoot)).toHaveLength(3));
  for (const row of bodyRows(wrapRoot)) {
    expect(row.getBoundingClientRect().height).toBeGreaterThan(48);
    for (const cell of row.querySelectorAll('td')) {
      expect(cell.scrollHeight).toBeLessThanOrEqual(cell.clientHeight);
    }
  }

  // Hover tints the whole row evenly: the row carries the hover tint and
  // every cell, pinned ones included, inherits the row's background, with
  // no per-cell overlay.
  const root = canvasElement.querySelector<HTMLElement>(
    '[data-density="comfortable"]',
  )!;
  const [row] = bodyRows(root);
  expect(row.className).toContain('hover:bg-(--st-hover)');
  const cells = [...row.querySelectorAll('td')];
  expect(cells.some((cell) => cell.hasAttribute('data-pinned'))).toBe(true);
  // The hover colour, set inline the way :hover sets it.
  row.style.backgroundColor = 'var(--st-hover)';
  const hoverColor = getComputedStyle(row).backgroundColor;
  for (const cell of cells) {
    expect(getComputedStyle(cell).backgroundColor).toBe(hoverColor);
    const after = getComputedStyle(cell, '::after');
    // Locked columns keep an overlay for drags, invisible at rest.
    expect(after.content === 'none' || after.opacity === '0').toBe(true);
  }
  row.style.backgroundColor = '';
};

// A frame narrower than the columns: the end chevron shows on hover.
export const ScrollCues = () => (
  <div className="flex flex-col gap-4">
    <div className="w-[700px]" data-testid="narrow">
      <DefaultLookTable data={fewRows} />
    </div>
    <div className="w-[1600px]" data-testid="wide">
      <DefaultLookTable
        columns={columns.slice(0, 3)}
        data={fewRows}
        enableRowActions={false}
      />
    </div>
  </div>
);

ScrollCues.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const narrow = canvas.getByTestId('narrow');
  const wide = canvas.getByTestId('wide');
  const [box] = scrollBoxes(narrow);
  const wrapper = box.parentElement!;
  const button = (host: HTMLElement, name: string) =>
    host.querySelector<HTMLElement>(`button[aria-label="${name}"]`)!;
  const left = button(wrapper, 'Scroll left');
  const right = button(wrapper, 'Scroll right');
  await waitFor(() =>
    expect(wrapper.hasAttribute('data-overflow-end')).toBe(true),
  );
  expect(wrapper.hasAttribute('data-overflow-start')).toBe(false);
  expect(getComputedStyle(right).visibility).toBe('hidden');

  // The cue shows on wrapper hover, the rule `group-hover/st-scroll:`.
  expect(right.className).toContain(
    'group-hover/st-scroll:group-data-overflow-end/st-scroll:visible',
  );
  expect(getComputedStyle(left).visibility).toBe('hidden');

  const pinned =
    (parseFloat(wrapper.style.getPropertyValue('--st-pin-start')) || 0) +
    (parseFloat(wrapper.style.getPropertyValue('--st-pin-end')) || 0);
  const step = 0.8 * (box.clientWidth - pinned);
  // A real press at the chevron's centre: mousedown applies `:active`, and the
  // button must stay under the pointer for the click to reach it (D22).
  const browserUserEvent = (
    globalThis as {
      stBrowserUserEvent?: {
        click: (element: Element) => Promise<void>;
        hover: (element: Element) => Promise<void>;
      };
    }
  ).stBrowserUserEvent;
  if (browserUserEvent) {
    await browserUserEvent.hover(wrapper);
    await waitFor(() => expect(getComputedStyle(right).opacity).toBe('1'));
    await browserUserEvent.click(right);
  } else {
    right.click();
  }
  await waitFor(() =>
    expect(Math.abs(box.scrollLeft - step)).toBeLessThanOrEqual(1),
  );
  await waitFor(() =>
    expect(wrapper.hasAttribute('data-overflow-start')).toBe(true),
  );

  // Columns that fit: no overflow, no chevron.
  const [wideBox] = scrollBoxes(wide);
  const wideWrapper = wideBox.parentElement!;
  expect(wideWrapper.hasAttribute('data-overflow-start')).toBe(false);
  expect(wideWrapper.hasAttribute('data-overflow-end')).toBe(false);
  for (const name of ['Scroll left', 'Scroll right']) {
    expect(getComputedStyle(button(wideWrapper, name)).visibility).toBe(
      'hidden',
    );
  }
};

// A narrow Name column cuts the task names off; Project values fit.
export const OverflowTooltip = () => (
  <DefaultLookTable
    columns={columns.map((column) =>
      column.header === 'Name' ? { ...column, size: 90 } : column,
    )}
    data={fewRows}
  />
);

OverflowTooltip.play = async ({ canvasElement }: StoryContext) => {
  const tooltip = () =>
    canvasElement.ownerDocument.querySelector('[data-slot="tooltip-content"]');
  const [row] = bodyRows(canvasElement);
  const nameText = row.querySelector<HTMLElement>(
    'td[data-flip-column="name"] span.truncate',
  )!;
  expect(nameText.scrollWidth).toBeGreaterThan(nameText.clientWidth);
  await userEvent.hover(nameText);
  await waitFor(() => expect(tooltip()).toHaveTextContent(fewRows[0].name), {
    timeout: 3000,
  });
  await userEvent.unhover(nameText);
  await waitFor(() => expect(tooltip()).toBeNull());

  const projectText = row.querySelector<HTMLElement>(
    'td[data-flip-column="project"] span.truncate',
  )!;
  expect(projectText.scrollWidth).toBe(projectText.clientWidth);
  await userEvent.hover(projectText);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  expect(tooltip()).toBeNull();
};

const pendingKey = 'shadcn-table:default-look-test:view';

// A persisted table and a stock one. On the client the pending script is a
// `text/plain` data block, so the play runs its text the way the server HTML
// runs it: as a fresh script inside the table root.
export const PendingView = () => (
  <div className="flex flex-col gap-4">
    <div data-testid="persisted">
      <DefaultLookTable data={fewRows} persistViewSettings={pendingKey} />
    </div>
    <div data-testid="stock">
      <DefaultLookTable data={fewRows} />
    </div>
  </div>
);

PendingView.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const layout = (id: string) =>
    canvas
      .getByTestId(id)
      .querySelector<HTMLElement>('[data-slot="st-table-layout"]')!;
  const root = layout('persisted');
  const source = root.querySelector('script');
  expect(source?.type).toBe('text/plain');
  const runScript = () => {
    const script = document.createElement('script');
    script.textContent = source!.textContent;
    root.prepend(script);
    script.remove();
  };
  try {
    // A stored view that differs from the defaults marks the root, and the
    // body cells show the skeleton bar.
    window.localStorage.setItem(
      pendingKey,
      JSON.stringify({ density: 'compact' }),
    );
    runScript();
    expect(root.hasAttribute('data-st-view-pending')).toBe(true);
    expect(root.getAttribute('aria-busy')).toBe('true');
    const cell = root.querySelector<HTMLElement>('tbody td')!;
    expect(getComputedStyle(cell, '::before').content).not.toBe('none');

    // Nothing stored: no mark.
    root.removeAttribute('data-st-view-pending');
    await waitFor(() => expect(root.hasAttribute('aria-busy')).toBe(false));
    window.localStorage.removeItem(pendingKey);
    runScript();
    expect(root.hasAttribute('data-st-view-pending')).toBe(false);
    expect(getComputedStyle(cell, '::before').content).toBe('none');
  } finally {
    window.localStorage.removeItem(pendingKey);
  }

  // Persistence off: no script.
  expect(layout('stock').querySelector('script')).toBeNull();
};

// Sticky by choice caps the box at 70vh; forced by row virtualization it
// keeps the full-height clamp.
export const StickyHeights = () => (
  <div className="flex flex-col gap-4">
    <div data-testid="option">
      <DefaultLookTable enableStickyHeader />
    </div>
    <div data-testid="setting">
      <DefaultLookTable
        initialState={{
          columnPinning: { end: ['st-row-actions'], start: [] },
          viewSettings: {
            gridLines: 'rows',
            pins: ['columns', 'density'],
            rowNumbers: false,
            stickyHeader: true,
            striped: false,
            wrapText: false,
          },
        }}
      />
    </div>
    <div data-testid="virtual">
      <DefaultLookTable enablePagination={false} enableRowVirtualization />
    </div>
  </div>
);

StickyHeights.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const maxHeight = (id: string) =>
    parseFloat(
      getComputedStyle(scrollBoxes(canvas.getByTestId(id))[0]).maxHeight,
    );
  await waitFor(() =>
    expect(maxHeight('option')).toBeCloseTo(window.innerHeight * 0.7, 0),
  );
  expect(maxHeight('setting')).toBeCloseTo(window.innerHeight * 0.7, 0);
  const virtualBox = scrollBoxes(canvas.getByTestId('virtual'))[0];
  const toolbars =
    parseFloat(virtualBox.style.getPropertyValue('--st-toolbar-height')) || 0;
  expect(maxHeight('virtual')).toBeCloseTo(
    Math.max(350, window.innerHeight - toolbars),
    0,
  );
};
