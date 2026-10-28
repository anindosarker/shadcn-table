import { useMemo } from 'react';
import { useSelector } from '@tanstack/react-store';
import {
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getST_Rows } from '@/components/ui/shadcn-table/shared/utils/row.utils';

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
  const columnFilterFns = useSelector(table.atoms.columnFilterFns);
  const columnFilters = useSelector(table.atoms.columnFilters);
  const creatingRow = useSelector(table.atoms.creatingRow);
  const expanded = useSelector(table.atoms.expanded);
  const globalFilter = useSelector(table.atoms.globalFilter);
  const globalFilterFn = useSelector(table.atoms.globalFilterFn);
  const grouping = useSelector(table.atoms.grouping);
  const pagination = useSelector(table.atoms.pagination);
  const rowPinning = useSelector(table.atoms.rowPinning);
  const sorting = useSelector(table.atoms.sorting);

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
