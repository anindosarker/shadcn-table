import { type Meta } from '@storybook/react-vite';
import {
  CalendarIcon,
  CircleDotIcon,
  FlagIcon,
  FolderIcon,
  HashIcon,
  Pencil,
  Share2,
  TagsIcon,
  Trash2,
  TypeIcon,
  UserIcon,
  UserPenIcon,
} from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';

// The v0.8 default look with every new option set explicitly, on the header
// demo's columns and data: the capture source for specs 02, 03 and 04.
const meta: Meta = {
  title: 'Styling/Default Look',
};

export default meta;

type Task = {
  assignee: string;
  due: string;
  estimate: number;
  id: string;
  name: string;
  priority: string;
  project: string;
  reporter: string;
  status: string;
  tags: string[];
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

// The demo's seeded generator, so every capture shows the same rows.
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

const data: Task[] = Array.from({ length: 50 }, (_, index) => {
  const tagCount = 1 + Math.floor(random() * 3);
  const picked = new Set<string>();
  while (picked.size < tagCount) picked.add(pick(tags));
  return {
    assignee: pick(assignees),
    due: new Date(start + Math.floor(random() * 90) * day)
      .toISOString()
      .slice(0, 10),
    estimate: 1 + Math.floor(random() * 40),
    id: `task-${index + 1}`,
    name: `${pick(verbs)} ${pick(nouns)}`,
    priority: pick(priorities),
    project: pick(projects),
    reporter: pick(reporters),
    status: pick(statuses),
    tags: tags.filter((tag) => picked.has(tag)),
  };
});

const columns: ST_ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    enableColumnOrdering: false,
    header: 'Name',
    icon: TypeIcon,
  },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon },
  { accessorKey: 'project', header: 'Project', icon: FolderIcon },
  { accessorKey: 'assignee', header: 'Assignee', icon: UserIcon },
  {
    accessorKey: 'due',
    enableColumnOrdering: false,
    header: 'Due',
    icon: CalendarIcon,
  },
  {
    accessorKey: 'estimate',
    Cell: ({ cell }) => `${cell.getValue<number>()}h`,
    header: 'Estimate',
    icon: HashIcon,
  },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon },
  {
    accessorFn: (row) => row.tags.join(', '),
    enableSorting: false,
    header: 'Tags',
    icon: TagsIcon,
    id: 'tags',
  },
  { accessorKey: 'reporter', header: 'Reporter', icon: UserPenIcon },
];

export const Default = () => (
  <ShadcnTable
    columnFilterDisplayMode="chips"
    columns={columns}
    data={data}
    enableCellOverflowTooltip
    enableColumnOrdering
    enableColumnPinning
    enableColumnResizing
    enableRowActions
    enableScrollButtons
    enableSortPopover
    enableViewSettings
    getRowId={(row) => row.id}
    initialState={{ columnPinning: { end: ['st-row-actions'], start: [] } }}
    layoutMode="grid"
    paginationDisplayMode="pages"
    positionActionsColumn="last"
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
  />
);
