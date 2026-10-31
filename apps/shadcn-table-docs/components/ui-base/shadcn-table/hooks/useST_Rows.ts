import { useSelector } from '@tanstack/react-store';
import {
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { getST_Rows } from '@/components/ui-base/shadcn-table/shared/utils/row.utils';

export const useST_Rows = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): ST_Row<TData>[] => {
  // The caller re-renders on every slice that feeds the rows, which keeps its
  // own row model reads current.
  useSelector(table.atoms.columnFilterFns);
  useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.creatingRow);
  useSelector(table.atoms.expanded);
  useSelector(table.atoms.globalFilter);
  useSelector(table.atoms.globalFilterFn);
  useSelector(table.atoms.grouping);
  useSelector(table.atoms.pagination);
  useSelector(table.atoms.rowPinning);
  useSelector(table.atoms.sorting);

  return getST_Rows(table);
};
