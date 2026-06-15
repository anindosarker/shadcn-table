import { useMemo } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { getSRT_Rows } from '../utils/row.utils';

export const useSRT_Rows = <TData extends SRT_RowData>(
  table: SRT_TableInstance<TData>,
): SRT_Row<TData>[] => {
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
    () => getSRT_Rows(table),
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
