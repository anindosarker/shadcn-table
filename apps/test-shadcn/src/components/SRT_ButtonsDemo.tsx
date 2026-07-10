import { useMemo, useState } from 'react';
import {
  type SRT_ColumnDef,
  useShadcnReactTable,
} from 'shadcn-react-table-core';
import { ShadcnReactTable } from './ui/shadcn-react-table/ShadcnReactTable';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

// Tree node: parents carry `subRows` so getSubRows drives the expand button /
// expand-all button, depth indent, and (via renderDetailPanel) a detail panel.
type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  location: string;
  headcount: number;
  subRows?: TeamMember[];
};

const treeData: TeamMember[] = [
  {
    id: 'eng',
    name: 'Engineering',
    role: 'Division',
    email: 'eng@example.com',
    location: 'Berlin',
    headcount: 3,
    subRows: [
      {
        id: 'eng-ada',
        name: 'Ada Lovelace',
        role: 'Principal Engineer',
        email: 'ada.lovelace@example.com',
        location: 'London',
        headcount: 0,
      },
      {
        id: 'eng-alan',
        name: 'Alan Turing',
        role: 'Staff Engineer',
        email: 'alan.turing@example.com',
        location: 'Manchester',
        headcount: 0,
      },
      {
        id: 'eng-grace',
        name: 'Grace Hopper',
        role: 'Engineering Manager',
        email: 'grace.hopper@example.com',
        location: 'New York',
        headcount: 0,
      },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    role: 'Division',
    email: 'design@example.com',
    location: 'Paris',
    headcount: 2,
    subRows: [
      {
        id: 'design-marie',
        name: 'Marie Curie',
        role: 'Design Lead',
        email: 'marie.curie@example.com',
        location: 'Paris',
        headcount: 0,
      },
      {
        id: 'design-nikola',
        name: 'Nikola Tesla',
        role: 'Product Designer',
        email: 'nikola.tesla@example.com',
        location: 'Belgrade',
        headcount: 0,
      },
    ],
  },
  {
    // No subRows -> row is not tree-expandable; still opens a detail panel.
    id: 'sales-lonewolf',
    name: 'Isaac Newton',
    role: 'Head of Sales',
    email: 'isaac.newton@example.com',
    location: 'Cambridge',
    headcount: 0,
  },
];

function useColumns(): SRT_ColumnDef<TeamMember>[] {
  return useMemo(
    () => [
      { accessorKey: 'name', header: 'Name', enableEditing: true },
      { accessorKey: 'role', header: 'Role', enableEditing: true },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 240,
        enableClickToCopy: true,
        enableEditing: true,
      },
      { accessorKey: 'location', header: 'Location', enableEditing: true },
    ],
    [],
  );
}

export function SRT_ButtonsDemo() {
  const columns = useColumns();
  const [rowDragging, setRowDragging] = useState(false);
  const [rowActionsMenu, setRowActionsMenu] = useState(false);
  // getSubRows (tree) and renderDetailPanel both drive the expand button but
  // don't compose on one table, so the panel is a toggle: OFF = tree children
  // (depth indent), ON = detail panel per row.
  const [detailPanel, setDetailPanel] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const table = useShadcnReactTable<TeamMember>({
    columns,
    data: treeData,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.subRows,

    // Toolbar: all five internal toggle buttons.
    enableTopToolbar: true,
    enableToolbarInternalActions: true,
    enableGlobalFilter: true,
    positionGlobalFilter: 'right',
    enableColumnFilters: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableHiding: true,

    // Expand button + expand-all button. enableExpanding is required for the
    // expand column to render off tree data (getSubRows) alone; detail panel
    // is opt-in (see above).
    enableExpanding: true,
    enableExpandAll: true,
    renderDetailPanel: detailPanel
      ? ({ row }) => (
          <div className="p-4 text-sm">
            <p>
              <strong>{row.original.name}</strong> — {row.original.role}
            </p>
            <p>Detail email: {row.original.email}</p>
            <p>Detail location: {row.original.location}</p>
          </div>
        )
      : undefined,

    // Row pin buttons (top & bottom).
    enableRowPinning: true,
    rowPinningDisplayMode: 'top-and-bottom',

    // Column header grab handles (opacity 0.5). Row grab handles (opacity 1)
    // appear when row dragging is toggled on.
    enableColumnOrdering: true,
    enableRowOrdering: rowDragging,
    enableRowDragging: rowDragging,

    // Row editing: pencil -> row mode -> EditActionButtons (cancel X + save).
    enableEditing: true,
    editDisplayMode: 'row',
    onEditingRowSave: ({ values, row, table: t }) => {
      setLastSaved(
        `${row.id}: ${Object.entries(values)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(', ')}`,
      );
      console.log('[buttons-demo] onEditingRowSave', values);
      t.setEditingRow(null);
    },

    // Row actions column. With the toggle OFF, ToggleRowActionMenuButton shows
    // the pencil edit button (aria-label "Edit"); with it ON, the "..." Row
    // Actions button opens a menu (renderRowActionMenuItems suppresses the
    // pencil, per MRT).
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: rowActionsMenu
      ? ({ row, table: t }) => [
          <div
            key="view-details"
            className="cursor-pointer px-2 py-1.5 text-sm hover:bg-accent"
            onClick={() => console.log('[buttons-demo] view', row.original)}
          >
            View details
          </div>,
          <div
            key="edit-member"
            className="cursor-pointer px-2 py-1.5 text-sm hover:bg-accent"
            onClick={() => t.setEditingRow(row)}
          >
            Edit member
          </div>,
        ]
      : undefined,

    srtTableLayoutProps: { id: 'srt-buttons-layout' },
  });

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">SRT Buttons</h2>
      <p className="mb-1 max-w-3xl text-sm text-muted-foreground">
        The full buttons/ cluster on one table: expand + expand-all, row pin
        (top/bottom), column/row grab handles, click-to-copy, row-mode edit
        (pencil + save/cancel), the row-action ... menu, and the five toolbar
        internal toggles.
      </p>
      <ul className="mb-3 ml-5 list-disc text-sm text-muted-foreground">
        <li>
          expand button rotates; tree children indent by depth (or detail panel
          opens when that toggle is on)
        </li>
        <li>expand-all header button expands/collapses every row</li>
        <li>row pin buttons pin to top/bottom; pinned row shows X to unpin</li>
        <li>
          column-header grab handle opacity 0.5; row grab handle opacity 1
        </li>
        <li>
          email cell has a copy button; tooltip flips to Copied to clipboard
        </li>
        <li>
          pencil enters row edit; save fires onEditingRowSave, cancel restores
        </li>
        <li>row ... menu opens with View / Edit items</li>
        <li>
          toolbar: search, filters, density (3 states), fullscreen, columns
        </li>
      </ul>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-md border p-3">
        <Label className="gap-2">
          <Checkbox
            checked={rowDragging}
            onCheckedChange={(v) => setRowDragging(v === true)}
          />
          row dragging (row grab handles, opacity 1)
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={rowActionsMenu}
            onCheckedChange={(v) => setRowActionsMenu(v === true)}
          />
          row actions ... menu (off = pencil edit button)
        </Label>
        <Label className="gap-2">
          <Checkbox
            checked={detailPanel}
            onCheckedChange={(v) => setDetailPanel(v === true)}
          />
          detail panel (off = tree children)
        </Label>
        <span className="text-sm text-muted-foreground">
          last saved edit:{' '}
          <span id="srt-buttons-last-saved" className="font-mono">
            {lastSaved ?? '—'}
          </span>
        </span>
      </div>

      <ShadcnReactTable table={table} />
    </section>
  );
}
