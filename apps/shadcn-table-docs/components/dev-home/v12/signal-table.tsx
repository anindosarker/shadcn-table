'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
} from 'react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
  CalendarIcon,
  CircleDotIcon,
  FlagIcon,
  FolderIcon,
  HashIcon,
  Pencil,
  Share2,
  Trash2,
  TypeIcon,
  UserIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui-radix/badge';
import { DropdownMenuItem } from '@/components/ui-radix/dropdown-menu';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui-radix/shadcn-table';
import { getST_ColumnFlipPositions } from '@/components/ui-radix/shadcn-table/hooks/useST_ColumnFlip';
import {
  assignees,
  data,
  priorities,
  projects,
  statuses,
  type Task,
} from '@/examples/.radix/persistent-view/makeData';

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
}

/* A small dot tells the statuses and the priorities apart (the header
 * demo's cells, as in the persistent-view example). */
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

// The persistent-view example's definitions (the header demo's, D55) for the
// seven columns the steps use (D54). Three sizes differ so the seven headers
// read in full and fit the frame at 1440 px: Name 196 (demo 260), Estimate
// 136 (120) and Priority 132 (120), whose labels truncate at the demo's size
// beside the header's menu button. Only Estimate edits.
const columns: ST_ColumnDef<Task>[] = (
  [
    {
      accessorKey: 'name',
      header: 'Name',
      icon: TypeIcon,
      filterVariant: 'text',
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
      size: 196,
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
      enableColumnOrdering: false,
      header: 'Due',
      icon: CalendarIcon,
      filterVariant: 'date',
      filterFn: 'lessThan',
      size: 130,
    },
    {
      accessorKey: 'estimate',
      enableEditing: true,
      header: 'Estimate',
      icon: HashIcon,
      filterVariant: 'range',
      size: 136,
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
      size: 132,
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
  ] as ST_ColumnDef<Task>[]
).map((column) => ({ enableEditing: false, ...column }));

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
}: SignalTableProps) {
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
    // lets the replay find the row it edits
    stTableBodyRowProps: ({ row }) =>
      ({ 'data-row-id': row.id }) as HTMLAttributes<HTMLTableRowElement>,
    // a fixed height for the header and a page of ten 48px rows: no row cut
    // off at the bottom, and a page of fewer rows (the search) keeps the
    // pagination bar and the band where they were
    stTableContainerProps: { className: 'h-[32.5rem]' },
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

  // a reset or a jump drops the chips of columns without a filter, unless
  // an editor is open on one (the Filtering step picks the column first)
  const filtersKey = state.columnFilters.map((filter) => filter.id).join(',');
  useLayoutEffect(() => {
    const table = tableRef.current;
    const chips = table.atoms.filterChips.get();
    if (chips.openColumnId !== null) return;
    const ids = filtersKey ? filtersKey.split(',') : [];
    const kept = chips.columnIds.filter((id) => ids.includes(id));
    if (kept.length !== chips.columnIds.length) {
      table.setFilterChips({ ...chips, columnIds: kept });
    }
  }, [filtersKey]);

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

  return <ShadcnTable table={table} />;
}
