'use client';

import { useMemo } from 'react';
import type {
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  GroupingState,
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
  columnPinning: ColumnPinningState;
  grouping: GroupingState;
  expanded: ExpandedState;
  showColumnFilters: boolean;
}

type Updater<T> = T | ((old: T) => T);

export interface SignalTableProps {
  state: SignalTableState;
  onChange: <K extends keyof SignalTableState>(
    key: K,
    updater: Updater<SignalTableState[K]>,
  ) => void;
}

const usd = (value: number | undefined) =>
  value?.toLocaleString?.('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/**
 * A real SRT instance with its sorting, filters, pinning and grouping held
 * by the parent, so the signal band can drive it step by step and still hand
 * every control back to the visitor.
 */
export default function SignalTable({ state, onChange }: SignalTableProps) {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      { header: 'First name', accessorKey: 'firstName', size: 120 },
      { header: 'Last name', accessorKey: 'lastName', size: 120 },
      {
        header: 'State',
        accessorKey: 'state',
        filterFn: 'startsWith',
        size: 136,
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
    data,
    enableGrouping: true,
    enableColumnPinning: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    state,
    onSortingChange: (u) => onChange('sorting', u),
    onColumnFiltersChange: (u) => onChange('columnFilters', u),
    onColumnPinningChange: (u) => onChange('columnPinning', u),
    onGroupingChange: (u) => onChange('grouping', u),
    onExpandedChange: (u) => onChange('expanded', u),
    onShowColumnFiltersChange: (u) => onChange('showColumnFilters', u),
    srtTableContainerProps: { className: 'max-h-[30rem]' },
    srtTableLayoutProps: { className: 'border-0 shadow-none bg-transparent' },
  });

  return <ShadcnReactTable table={table} />;
}
