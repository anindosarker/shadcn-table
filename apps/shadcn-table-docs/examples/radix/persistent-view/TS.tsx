'use client';

import { useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import {
  assignees,
  data,
  priorities,
  projects,
  reporters,
  sprints,
  statuses,
  tags,
  teams,
  type Task,
} from './makeData';

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

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        icon: TypeIcon,
        filterVariant: 'text',
        //the only column with a filter mode picker in its filter editor
        enableColumnFilterModes: true,
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
    data,
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
      pagination: { pageIndex: 0, pageSize: 50 },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Change the density, the grid lines or the column order, then reload the
        page: the table comes back the way you left it. Reset view in the view
        settings panel clears what was saved.
      </p>
      <ShadcnTable table={table} />
    </div>
  );
};

export default Example;
