'use client';

import { useMemo } from 'react';
import { DownloadIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import {
  ShadcnTable,
  ST_ActionMenuItem,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui-radix/shadcn-table';
import { Badge } from '@/components/ui-radix/badge';
import { Button } from '@/components/ui-radix/button';

export interface ThemeTableProps {
  /** Compact mode for the grid variant: fewer rows and columns, no toolbar. */
  compact?: boolean;
}

type Status = 'Active' | 'Invited' | 'Paused' | 'Removed';

interface Member {
  name: string;
  email: string;
  role: string;
  status: Status;
  seats: number;
}

const STATUSES: Status[] = ['Active', 'Invited', 'Paused', 'Removed'];

// every Badge variant the theme recolours
const STATUS_BADGE = {
  Active: 'default',
  Invited: 'secondary',
  Paused: 'outline',
  Removed: 'destructive',
} as const satisfies Record<Status, string>;

const MEMBERS: Member[] = [
  {
    name: 'Ada Brooks',
    email: 'ada@example.com',
    role: 'Owner',
    status: 'Active',
    seats: 12,
  },
  {
    name: 'Kenji Watanabe',
    email: 'kenji@example.com',
    role: 'Admin',
    status: 'Active',
    seats: 8,
  },
  {
    name: 'Lena Fischer',
    email: 'lena@example.com',
    role: 'Editor',
    status: 'Invited',
    seats: 3,
  },
  {
    name: 'Omar Haddad',
    email: 'omar@example.com',
    role: 'Editor',
    status: 'Paused',
    seats: 5,
  },
  {
    name: 'Priya Nair',
    email: 'priya@example.com',
    role: 'Viewer',
    status: 'Active',
    seats: 1,
  },
  {
    name: 'Mateo Rossi',
    email: 'mateo@example.com',
    role: 'Admin',
    status: 'Removed',
    seats: 0,
  },
  {
    name: 'Sofia Lind',
    email: 'sofia@example.com',
    role: 'Viewer',
    status: 'Invited',
    seats: 2,
  },
  {
    name: 'Tomás Silva',
    email: 'tomas@example.com',
    role: 'Editor',
    status: 'Active',
    seats: 4,
  },
];

/**
 * The theme demo's table: a real radix-edition ShadcnTable that shows every
 * themed part at once (toolbar buttons, status badges, selection
 * checkboxes, the row actions menu, filter selects, pagination). It holds
 * no theme state; the ThemeScope around it does.
 */
export default function ThemeTable({ compact = false }: ThemeTableProps) {
  const columns = useMemo<ST_ColumnDef<Member>[]>(
    () => [
      { header: 'Name', accessorKey: 'name', size: compact ? 100 : 160 },
      ...(compact
        ? []
        : [
            { header: 'Email', accessorKey: 'email', size: 180 },
            {
              header: 'Role',
              accessorKey: 'role',
              size: 120,
              filterVariant: 'select',
              filterSelectOptions: ['Owner', 'Admin', 'Editor', 'Viewer'],
            } satisfies ST_ColumnDef<Member>,
          ]),
      {
        header: 'Status',
        accessorKey: 'status',
        size: compact ? 100 : 120,
        // in compact, the spare width goes to Name
        grow: compact ? false : undefined,
        filterVariant: 'select',
        filterSelectOptions: STATUSES,
        Cell: ({ cell }) => {
          const status = cell.getValue<Status>();
          return <Badge variant={STATUS_BADGE[status]}>{status}</Badge>;
        },
      },
      ...(compact ? [] : [{ header: 'Seats', accessorKey: 'seats', size: 90 }]),
    ],
    [compact],
  );

  const table = useShadcnTable({
    columns,
    data: MEMBERS,
    enableRowSelection: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableTopToolbar: !compact,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    // compact fits a ~300px card: columns fill the width, slim display
    // columns, no column menus, and pagination without the page size select
    ...(compact && {
      layoutMode: 'grid',
      enableColumnActions: false,
      displayColumnDefOptions: {
        'st-row-select': { size: 40, grow: false },
        'st-row-actions': { size: 48, grow: false, header: '' },
      },
      stPaginationProps: { showRowsPerPage: false },
    }),
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: compact ? 4 : 5 },
    },
    renderRowActionMenuItems: () => [
      <ST_ActionMenuItem key="edit" icon={<PencilIcon />} label="Edit" />,
      <ST_ActionMenuItem key="remove" icon={<Trash2Icon />} label="Remove" />,
    ],
    renderTopToolbarCustomActions: () => (
      <div className="flex gap-2">
        <Button size="sm">
          <PlusIcon />
          Invite
        </Button>
        <Button size="sm" variant="outline">
          <DownloadIcon />
          Export
        </Button>
      </div>
    ),
  });

  return <ShadcnTable table={table} />;
}
