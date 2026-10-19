import { useMemo } from 'react';
import { type ST_Row, type ST_RowData, type ST_TableInstance } from '../types';
import { getST_Rows } from '../utils/row.utils';

export const useST_Rows = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): ST_Row<TData>[] => {
  const {
    getRowModel,
    getState,
    options: { data, enableGlobalFilterRankedResults, positionCreatingRow },
  } = table;
  const {
    creatingRow,
    expanded,
    globalFilter,
    pagination,
    rowPinning,
    sorting,
  } = getState();

  const rows = useMemo(
    () => getST_Rows(table),
    [
      creatingRow,
      data,
      enableGlobalFilterRankedResults,
      expanded,
      getRowModel().rows,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      positionCreatingRow,
      rowPinning,
      sorting,
    ],
  );

  return rows;
};
