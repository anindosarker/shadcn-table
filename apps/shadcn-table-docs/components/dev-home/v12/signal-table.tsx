'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
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
import { DropdownMenuItem } from '@/components/ui-radix/dropdown-menu';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui-radix/shadcn-table';
import { getST_ColumnFlipPositions } from '@/components/ui-radix/shadcn-table/hooks/useST_ColumnFlip';
import { data, type Task } from '@/examples/.radix/persistent-view/makeData';

export interface SignalTableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  showGlobalFilter: boolean;
  /** Data column ids in their new order, filling the slots those columns
   * hold in the default order; the first one is the column that moved.
   * Empty for the default order. */
  columnOrder: string[];
  /** The view settings the replay changes, on top of the stock ones. */
  viewSettings: { striped: boolean };
  /** Saved estimate edits by row id, applied on top of the sample data. */
  estimateEdits: Record<string, number>;
}

type Updater<T> = T | ((old: T) => T);

export interface SignalTableProps {
  state: SignalTableState;
  onChange: <K extends keyof SignalTableState>(
    key: K,
    updater: Updater<SignalTableState[K]>,
  ) => void;
  /** An estimate cell the replay holds open in cell edit mode, with the
   * value shown in its input. */
  editing: { rowId: string; value: string } | null;
  /** What the replay just changed, so it can pulse once. */
  cue: SignalCue | null;
}

export type SignalCue =
  | { kind: 'sort' | 'filter' | 'order' | 'search' | 'view' }
  | { kind: 'edit'; rowId: string };

/* One-shot accent pulse class (v12.css). */
const PULSE = 'v12-cue';
const PULSE_MS = 1200;

// The persistent-view example's columns (the header demo's); the Filtering
// step picks one Status value, and only Estimate edits.
const columns: ST_ColumnDef<Task>[] = (
  [
    {
      accessorKey: 'name',
      enableColumnOrdering: false,
      header: 'Name',
      icon: TypeIcon,
      size: 260,
    },
    {
      accessorKey: 'status',
      filterVariant: 'select',
      header: 'Status',
      icon: CircleDotIcon,
      size: 150,
    },
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
      enableEditing: true,
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
    { accessorKey: 'notes', header: 'Notes', icon: StickyNoteIcon, size: 260 },
  ] as ST_ColumnDef<Task>[]
).map((column) => ({ enableEditing: false, ...column }));

/** The toolbar control a cue pulses, found in the table's own markup. */
const cueTarget = (root: HTMLElement, kind: SignalCue['kind']) => {
  if (kind === 'filter') {
    return root.querySelector<HTMLElement>('[data-filter-chip="status"]');
  }
  if (kind === 'view') {
    return root.querySelector<HTMLElement>(
      'button[aria-label="View settings"]',
    );
  }
  if (kind === 'sort') {
    // the sort chip: the toolbar button that names the sorted column
    return (
      [...root.querySelectorAll<HTMLElement>('button')].find(
        (button) =>
          !button.closest('table') &&
          !button.hasAttribute('data-filter-chip') &&
          button.textContent?.trim() === 'Due',
      ) ?? null
    );
  }
  return null;
};

/**
 * The homepage's replaying table: the stock table on the persistent-view
 * data, whose sorting, filters, search, column order, view settings and
 * estimate edits the parent drives, so the replay can play them and still
 * hand every control back to the visitor. Estimate cells edit in place
 * (editDisplayMode: 'cell').
 */
export default function SignalTable({
  state,
  onChange,
  editing,
  cue,
}: SignalTableProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(
    () =>
      data.map((task) =>
        task.id in state.estimateEdits
          ? { ...task, estimate: state.estimateEdits[task.id] }
          : task,
      ),
    [state.estimateEdits],
  );

  const table = useShadcnTable({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    enableRowActions: true,
    renderRowActionMenuItems: ({ closeMenu }) => [
      <DropdownMenuItem key="edit" onClick={() => closeMenu()}>
        <Pencil /> Edit
      </DropdownMenuItem>,
      <DropdownMenuItem key="share" onClick={() => closeMenu()}>
        <Share2 /> Share
      </DropdownMenuItem>,
      <DropdownMenuItem key="delete" onClick={() => closeMenu()}>
        <Trash2 /> Delete
      </DropdownMenuItem>,
    ],
    enableEditing: true,
    editDisplayMode: 'cell',
    // plain substring search, so the replay's term matches whole words the
    // way the highlights show (the default fuzzy match also ranks results
    // and drops the due date sort while searching)
    globalFilterFn: 'contains',
    state: {
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      showGlobalFilter: state.showGlobalFilter,
      sorting: state.sorting,
    },
    onSortingChange: (u) => onChange('sorting', u),
    onColumnFiltersChange: (u) => onChange('columnFilters', u),
    onGlobalFilterChange: (u) => onChange('globalFilter', u ?? ''),
    onShowGlobalFilterChange: (u) => onChange('showGlobalFilter', u),
    // the replay shows its value in the open cell; a visitor's edit is
    // saved on blur
    stEditTextFieldProps: ({ row }) =>
      editing && row.id === editing.rowId
        ? { value: editing.value, readOnly: true }
        : {
            onBlur: (event) => {
              const value = Number(event.target.value);
              if (Number.isFinite(value)) {
                onChange('estimateEdits', (old) => ({
                  ...old,
                  [row.id]: value,
                }));
              }
            },
          },
    stTableBodyCellProps: ({ cell, row }) => ({
      className:
        cue?.kind === 'edit' &&
        row.id === cue.rowId &&
        cell.column.id === 'estimate'
          ? PULSE
          : undefined,
    }),
    // inline style, not a class: the top toolbar passes its own className
    // to the search field, which replaces ours (keyframes in v12.css)
    stSearchTextFieldProps:
      cue?.kind === 'search'
        ? {
            style: {
              outline: '1px solid var(--dh-accent)',
              outlineOffset: 1,
              animation: 'v12-pop 1200ms linear',
            },
          }
        : {},
    stTableContainerProps: { className: 'max-h-[30rem]' },
  });

  // useShadcnTable returns a new table object every render, so the effects
  // below read the latest one through this ref instead of depending on it: a
  // table dependency re-ran the edit effect, whose setEditingCell re-rendered,
  // on every commit (React error #185).
  const tableRef = useRef(table);
  useLayoutEffect(() => {
    tableRef.current = table;
  });

  // the stock column order, before any replay or visitor move
  const defaultOrder = useRef<string[] | null>(null);
  if (defaultOrder.current === null) {
    defaultOrder.current = [...table.atoms.columnOrder.get()];
  }

  // play the replay's column move: the headers slide from where they sat
  // (the column drag animation) and the moved column flashes
  const orderKey = state.columnOrder.join(',');
  useLayoutEffect(() => {
    const table = tableRef.current;
    const base = defaultOrder.current ?? [];
    const moved = orderKey ? orderKey.split(',') : [];
    const slots = new Set(moved);
    let next = 0;
    const order = base.map((id) => (slots.has(id) ? moved[next++] : id));
    const current = table.atoms.columnOrder.get();
    if (order.join(',') === current.join(',')) return;
    if (moved.length) {
      table.setColumnFlipPending({
        dragDrop: false,
        movedId: moved[0],
        positions: getST_ColumnFlipPositions(table),
      });
    }
    table.setColumnOrder(order);
  }, [orderKey]);

  // the replay's view settings, over whatever the visitor set
  const striped = state.viewSettings.striped;
  useLayoutEffect(() => {
    tableRef.current.setViewSettings((old) =>
      old.striped === striped ? old : { ...old, striped },
    );
  }, [striped]);

  // pulse the toolbar control the replay just changed
  const cueKind = cue?.kind;
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !cueKind) return;
    const target = cueTarget(root, cueKind);
    if (!target) return;
    target.classList.add(PULSE);
    const timer = setTimeout(() => target.classList.remove(PULSE), PULSE_MS);
    return () => {
      clearTimeout(timer);
      target.classList.remove(PULSE);
    };
  }, [cueKind]);

  // open or close the estimate cell the replay is editing
  const replayEditing = useRef(false);
  const editingRowId = editing?.rowId;
  useEffect(() => {
    const table = tableRef.current;
    if (editingRowId !== undefined) {
      const cell = table
        .getPreFilteredRowModel()
        .rowsById[editingRowId]?.getAllCells()
        .find((c) => c.column.id === 'estimate');
      if (cell) {
        table.setEditingCell(cell);
        replayEditing.current = true;
      }
    } else if (replayEditing.current) {
      table.setEditingCell(null);
      replayEditing.current = false;
    }
  }, [editingRowId]);

  return (
    <div ref={rootRef}>
      <ShadcnTable table={table} />
    </div>
  );
}
