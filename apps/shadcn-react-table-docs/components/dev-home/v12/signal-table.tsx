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
  type SRT_Cell,
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
}

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

  const table = useShadcnReactTable({
    columns,
    data: rows,
    enableGrouping: true,
    enableRowSelection: true,
    enableEditing: true,
    editDisplayMode: 'cell',
    // keep the salary sort while searching (ranked results would clear it,
    // then restore it on the next replay)
    enableGlobalFilterRankedResults: false,
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
    srtTableContainerProps: { className: 'max-h-[30rem]' },
    srtTableLayoutProps: { className: 'border-0 shadow-none bg-transparent' },
  });

  // open or close the salary cell the replay is editing
  const replayEditing = useRef(false);
  const editingRowId = editing?.rowId;
  useEffect(() => {
    if (editingRowId !== undefined) {
      const cell = table
        .getRow(editingRowId, true)
        ?.getAllCells()
        .find((c) => c.column.id === 'salary');
      if (cell) {
        table.setEditingCell(cell as SRT_Cell<Person>);
        replayEditing.current = true;
      }
    } else if (replayEditing.current) {
      table.setEditingCell(null);
      replayEditing.current = false;
    }
  }, [editingRowId, table]);

  return <ShadcnReactTable table={table} />;
}
