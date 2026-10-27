import { useMemo } from 'react';
import {
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { getST_Rows } from '@/components/ui-base/shadcn-table/shared/utils/row.utils';
import { useST_Atom } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export const useST_Rows = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): ST_Row<TData>[] => {
  const {
    getRowModel,
    options: { data, enableGlobalFilterRankedResults, positionCreatingRow },
  } = table;
  // Every slice that feeds the row model, the ranking and the creating row
  // feeds the memo, so each is a hook subscription. The caller re-renders on
  // them too, which keeps its own row model reads current.
  const columnFilterFns = useST_Atom(table.atoms.columnFilterFns);
  const columnFilters = useST_Atom(table.atoms.columnFilters);
  const creatingRow = useST_Atom(table.atoms.creatingRow);
  const expanded = useST_Atom(table.atoms.expanded);
  const globalFilter = useST_Atom(table.atoms.globalFilter);
  const globalFilterFn = useST_Atom(table.atoms.globalFilterFn);
  const grouping = useST_Atom(table.atoms.grouping);
  const pagination = useST_Atom(table.atoms.pagination);
  const rowPinning = useST_Atom(table.atoms.rowPinning);
  const sorting = useST_Atom(table.atoms.sorting);

  const rows = useMemo(
    () => getST_Rows(table),
    [
      columnFilterFns,
      columnFilters,
      creatingRow,
      data,
      enableGlobalFilterRankedResults,
      expanded,
      getRowModel().rows,
      globalFilter,
      globalFilterFn,
      grouping,
      pagination.pageIndex,
      pagination.pageSize,
      positionCreatingRow,
      rowPinning,
      sorting,
    ],
  );

  return rows;
};
