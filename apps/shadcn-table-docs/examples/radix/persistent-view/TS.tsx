'use client';

import { useMemo } from 'react';
import {
  CalendarClockIcon,
  CalendarIcon,
  CalendarPlusIcon,
  CircleDotIcon,
  FlagIcon,
  FolderIcon,
  HashIcon,
  StickyNoteIcon,
  TagsIcon,
  TimerIcon,
  TypeIcon,
  UserIcon,
  UserPenIcon,
  UsersIcon,
} from 'lucide-react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Task } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'name',
        enableColumnOrdering: false,
        header: 'Name',
        icon: TypeIcon,
        size: 260,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        icon: CircleDotIcon,
        size: 150,
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        icon: UserIcon,
        size: 160,
      },
      {
        accessorKey: 'project',
        header: 'Project',
        icon: FolderIcon,
        size: 130,
      },
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
      {
        accessorKey: 'priority',
        header: 'Priority',
        icon: FlagIcon,
        size: 120,
      },
      {
        accessorFn: (row) => row.tags.join(', '),
        enableSorting: false,
        header: 'Tags',
        icon: TagsIcon,
        id: 'tags',
        size: 200,
      },
      {
        accessorKey: 'reporter',
        header: 'Reporter',
        icon: UserPenIcon,
        size: 150,
      },
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
      {
        accessorKey: 'notes',
        header: 'Notes',
        icon: StickyNoteIcon,
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
