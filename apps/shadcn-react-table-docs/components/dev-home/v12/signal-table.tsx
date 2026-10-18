'use client';

import { useEffect, useMemo, useRef } from 'react';
import type {
  ColumnFiltersState,
  ExpandedState,
  GroupingState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import {
  data,
  type Person,
} from '@/examples/aggregation-and-grouping/makeData';

export interface SignalTableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  grouping: GroupingState;
  expanded: ExpandedState;
  showColumnFilters: boolean;
  rowSelection: RowSelectionState;
  globalFilter: string;
  showGlobalFilter: boolean;
  /** Saved salary edits by row id, applied on top of the sample data. */
  salaryEdits: Record<string, number>;
}

type Updater<T> = T | ((old: T) => T);

export interface SignalTableProps {
  state: SignalTableState;
  onChange: <K extends keyof SignalTableState>(
    key: K,
    updater: Updater<SignalTableState[K]>,
  ) => void;
  /** A salary cell the replay holds open in cell edit mode, with the value
   * shown in its input. */
  editing: { rowId: string; value: string } | null;
  /** What the replay just changed, so it can pulse once. */
  cue: SignalCue | null;
}

export type SignalCue =
  | { kind: 'sort' | 'filter' | 'group' | 'select' | 'search' }
  | { kind: 'edit' | 'edited'; rowId: string };

/* One-shot accent pulse classes (v12.css). 'edited' uses the second class
 * so the pulse replays on the same cell once the edit is saved. */
const PULSE = 'v12-cue';
const PULSE_AGAIN = 'v12-cue-2';
const PULSE_FILL = 'v12-cue-fill';
const DIM_MARKS = 'v12-dim-marks';

const usd = (value: number | undefined) =>
  value?.toLocaleString?.('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/**
 * v5's signal table for /dev/12: a real SRT instance whose sorting, filters,
 * grouping, selection, global search and salary edits are held by the
 * parent, so the replay can drive it and still hand every control back to
 * the visitor. Salary cells edit in place (editDisplayMode: 'cell').
 */
export default function SignalTable({
  state,
  onChange,
  editing,
  cue,
}: SignalTableProps) {
  const rows = useMemo(
    () =>
      data.map((p, i) =>
        String(i) in state.salaryEdits
          ? { ...p, salary: state.salaryEdits[String(i)] }
          : p,
      ),
    [state.salaryEdits],
  );

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      {
        header: 'First name',
        accessorKey: 'firstName',
        size: 120,
        enableEditing: false,
      },
      {
        header: 'Last name',
        accessorKey: 'lastName',
        size: 120,
        enableEditing: false,
      },
      {
        header: 'State',
        accessorKey: 'state',
        filterFn: 'startsWith',
        size: 136,
        enableEditing: false,
        GroupedCell: ({ cell, row }) => (
          <span className="font-medium text-(--dh-ink)">
            {cell.getValue<string>()}{' '}
            <span className="text-(--dh-ink-faint)">
              ({row.subRows?.length})
            </span>
          </span>
        ),
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
        aggregationFn: 'mean',
        size: 140,
        Cell: ({ cell }) => usd(cell.getValue<number>()),
        AggregatedCell: ({ cell }) => (
          <span className="text-(--dh-ink-muted)">
            avg{' '}
            <span className="font-medium text-(--dh-accent)">
              {usd(cell.getValue<number>())}
            </span>
          </span>
        ),
      },
    ],
    [],
  );

  const searchThenFilter =
    !!state.globalFilter &&
    state.columnFilters.some((f) => f.id === 'state' && !!f.value);

  const table = useShadcnReactTable({
    columns,
    data: rows,
    enableGrouping: true,
    enableRowSelection: true,
    enableEditing: true,
    editDisplayMode: 'cell',
    // plain substring search, so the replay's term matches whole words the
    // way the highlights show (the default fuzzy match also ranks results
    // and drops the salary sort while searching)
    globalFilterFn: 'contains',
    // giving the top toolbar a custom-actions slot stacks the alert banner
    // (selected count, grouped by) on its own row, so the search field
    // never covers it
    renderTopToolbarCustomActions: () => null,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    state,
    onSortingChange: (u) => onChange('sorting', u),
    onColumnFiltersChange: (u) => onChange('columnFilters', u),
    onGroupingChange: (u) => onChange('grouping', u),
    onExpandedChange: (u) => onChange('expanded', u),
    onShowColumnFiltersChange: (u) => onChange('showColumnFilters', u),
    onRowSelectionChange: (u) => onChange('rowSelection', u),
    onGlobalFilterChange: (u) => onChange('globalFilter', u ?? ''),
    onShowGlobalFilterChange: (u) => onChange('showGlobalFilter', u),
    // the replay shows its value in the open cell; a visitor's edit is
    // saved on blur
    srtEditTextFieldProps: ({ row }) =>
      editing && row.id === editing.rowId
        ? { value: editing.value, readOnly: true }
        : {
            onBlur: (event) => {
              const value = Number(event.target.value);
              if (Number.isFinite(value)) {
                onChange('salaryEdits', (old) => ({
                  ...old,
                  [row.id]: value,
                }));
              }
            },
          },
    srtTableHeadCellProps: ({ column }) => ({
      className:
        (cue?.kind === 'sort' && column.id === 'salary') ||
        (cue?.kind === 'filter' && column.id === 'state')
          ? PULSE
          : undefined,
    }),
    srtTableBodyCellProps: ({ cell, row }) => {
      const pulse =
        (cue?.kind === 'edit' || cue?.kind === 'edited') &&
        row.id === cue.rowId &&
        cell.column.id === 'salary'
          ? cue.kind === 'edit'
            ? PULSE
            : PULSE_AGAIN
          : (cue?.kind === 'group' && row.getIsGrouped()) ||
              (cue?.kind === 'select' && row.getIsSelected())
            ? PULSE_FILL
            : '';
      // once the State filter applies, the older search highlights in the
      // other columns fade out (the search itself stays on)
      const dim = searchThenFilter && cell.column.id !== 'state';
      return {
        className: [pulse, dim ? DIM_MARKS : ''].join(' ').trim() || undefined,
      };
    },
    srtToolbarAlertBannerProps: {
      className: cue?.kind === 'select' ? PULSE : undefined,
    },
    // inline style, not a class: the top toolbar passes its own className
    // to the search field, which replaces ours (keyframes in v12.css)
    srtSearchTextFieldProps:
      cue?.kind === 'search'
        ? {
            style: {
              outline: '1px solid var(--dh-accent)',
              outlineOffset: 1,
              animation: 'v12-pop 600ms var(--dh-ease-out)',
            },
          }
        : {},
    srtTableContainerProps: { className: 'max-h-[30rem]' },
    srtTableLayoutProps: { className: 'border-0 shadow-none bg-transparent' },
  });

  // open or close the salary cell the replay is editing
  const replayEditing = useRef(false);
  const editingRowId = editing?.rowId;
  useEffect(() => {
    if (editingRowId !== undefined) {
      const cell = table
        .getPreFilteredRowModel()
        .rowsById[editingRowId]?.getAllCells()
        .find((c) => c.column.id === 'salary');
      if (cell) {
        table.setEditingCell(cell);
        replayEditing.current = true;
      }
    } else if (replayEditing.current) {
      table.setEditingCell(null);
      replayEditing.current = false;
    }
  }, [editingRowId, table]);

  return <ShadcnReactTable table={table} />;
}
