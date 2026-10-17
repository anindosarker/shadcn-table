import { type ChangeEvent, type MouseEvent } from 'react';
import { rankGlobalFuzzy } from '../fns/sortingFns';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { parseFromValuesOrFunc } from './utils';

export const getSRT_Rows = <TData extends SRT_RowData>(
  table: SRT_TableInstance<TData>,
  all?: boolean,
): SRT_Row<TData>[] => {
  const {
    getCenterRows,
    getPrePaginationRowModel,
    getRowModel,
    getState,
    getTopRows,
    options: {
      createDisplayMode,
      enablePagination,
      enableRowPinning,
      manualPagination,
      positionCreatingRow,
      rowPinningDisplayMode,
    },
  } = table;
  const { creatingRow, pagination } = getState();

  const isRankingRows = getIsRankingRows(table);

  let rows: SRT_Row<TData>[] = [];
  if (!isRankingRows) {
    rows =
      !enableRowPinning || rowPinningDisplayMode?.includes('sticky')
        ? all
          ? getPrePaginationRowModel().rows
          : getRowModel().rows
        : getCenterRows();
  } else {
    // fuzzy ranking adjustments
    rows = getPrePaginationRowModel().rows.sort((a, b) =>
      rankGlobalFuzzy(a, b),
    );
    if (enablePagination && !manualPagination && !all) {
      const start = pagination.pageIndex * pagination.pageSize;
      rows = rows.slice(start, start + pagination.pageSize);
    }
    if (enableRowPinning && !rowPinningDisplayMode?.includes('sticky')) {
      // "re-center-ize" the rows (no top or bottom pinned rows unless sticky)
      rows = rows.filter((row) => !row.getIsPinned());
    }
  }
  // row pinning adjustments
  if (enableRowPinning && rowPinningDisplayMode?.includes('sticky')) {
    const centerPinnedRowIds = rows
      .filter((row) => row.getIsPinned())
      .map((r) => r.id);

    rows = [
      ...getTopRows().filter((row) => !centerPinnedRowIds.includes(row.id)),
      ...rows,
    ];
  }
  // blank inserted creating row adjustments
  if (
    positionCreatingRow !== undefined &&
    creatingRow &&
    createDisplayMode === 'row'
  ) {
    const creatingRowIndex = !isNaN(+positionCreatingRow)
      ? +positionCreatingRow
      : positionCreatingRow === 'top'
        ? 0
        : rows.length;
    rows = [
      ...rows.slice(0, creatingRowIndex),
      creatingRow,
      ...rows.slice(creatingRowIndex),
    ];
  }

  return rows;
};

export const getCanRankRows = <TData extends SRT_RowData>(
  table: SRT_TableInstance<TData>,
) => {
  const {
    getState,
    options: {
      enableGlobalFilterRankedResults,
      manualExpanding,
      manualFiltering,
      manualGrouping,
      manualSorting,
    },
  } = table;
  const { expanded, globalFilterFn } = getState();

  return (
    !manualExpanding &&
    !manualFiltering &&
    !manualGrouping &&
    !manualSorting &&
    enableGlobalFilterRankedResults &&
    globalFilterFn === 'fuzzy' &&
    expanded !== true &&
    !Object.values(expanded).some(Boolean)
  );
};

export const getIsRankingRows = <TData extends SRT_RowData>(
  table: SRT_TableInstance<TData>,
) => {
  const { globalFilter, sorting } = table.getState();

  return (
    getCanRankRows(table) &&
    globalFilter &&
    !Object.values(sorting).some(Boolean)
  );
};

export const getIsRowSelected = <TData extends SRT_RowData>({
  row,
  table,
}: {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
}) => {
  const {
    options: { enableRowSelection },
  } = table;

  return (
    row.getIsSelected() ||
    (parseFromValuesOrFunc(enableRowSelection, row) &&
      row.getCanSelectSubRows() &&
      row.getIsAllSubRowsSelected())
  );
};

export const getSRT_RowSelectionHandler =
  <TData extends SRT_RowData>({
    row,
    staticRowIndex = 0,
    table,
  }: {
    row: SRT_Row<TData>;
    staticRowIndex?: number;
    table: SRT_TableInstance<TData>;
  }) =>
  (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLTableRowElement>,
    value?: boolean,
  ) => {
    const {
      getState,
      options: {
        enableBatchRowSelection,
        enableMultiRowSelection,
        enableRowPinning,
        manualPagination,
        rowPinningDisplayMode,
      },
      refs: { lastSelectedRowId: lastSelectedRowId },
    } = table;
    const {
      pagination: { pageIndex, pageSize },
    } = getState();

    const paginationOffset = manualPagination ? 0 : pageSize * pageIndex;

    const wasCurrentRowChecked = getIsRowSelected({ row, table });

    // toggle selection of this row
    row.toggleSelected(value ?? !wasCurrentRowChecked);

    const changedRowIds = new Set<string>([row.id]);

    // if shift key is pressed, select all rows between last selected and this one
    if (
      enableBatchRowSelection &&
      enableMultiRowSelection &&
      (event as any).nativeEvent.shiftKey &&
      lastSelectedRowId.current !== null
    ) {
      const rows = getSRT_Rows(table, true);

      const lastIndex = rows.findIndex(
        (r) => r.id === lastSelectedRowId.current,
      );

      if (lastIndex !== -1) {
        const isLastIndexChecked = getIsRowSelected({
          row: rows?.[lastIndex],
          table,
        });

        const currentIndex = staticRowIndex + paginationOffset;
        const [start, end] =
          lastIndex < currentIndex
            ? [lastIndex, currentIndex]
            : [currentIndex, lastIndex];

        // toggle selection of all rows between last selected and this one
        // but only if the last selected row is not the same as the current one
        if (wasCurrentRowChecked !== isLastIndexChecked) {
          for (let i = start; i <= end; i++) {
            rows[i].toggleSelected(!wasCurrentRowChecked);
            changedRowIds.add(rows[i].id);
          }
        }
      }
    }

    // record the last selected row id
    lastSelectedRowId.current = row.id;

    // if all sub rows were selected, unselect them
    if (row.getCanSelectSubRows() && row.getIsAllSubRowsSelected()) {
      row.subRows?.forEach((r) => r.toggleSelected(false));
    }

    if (enableRowPinning && rowPinningDisplayMode?.includes('select')) {
      changedRowIds.forEach((rowId) => {
        const rowToTogglePin = table.getRow(rowId);
        rowToTogglePin.pin(
          !wasCurrentRowChecked //was not previously pinned or selected
            ? rowPinningDisplayMode?.includes('bottom')
              ? 'bottom'
              : 'top'
            : false,
        );
      });
    }
  };

export const getSRT_SelectAllHandler =
  <TData extends SRT_RowData>({ table }: { table: SRT_TableInstance<TData> }) =>
  (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>,
    value?: boolean,
    forceAll?: boolean,
  ) => {
    const {
      options: { enableRowPinning, rowPinningDisplayMode, selectAllMode },
      refs: { lastSelectedRowId },
    } = table;

    selectAllMode === 'all' || forceAll
      ? table.toggleAllRowsSelected(value ?? (event as any).target.checked)
      : table.toggleAllPageRowsSelected(value ?? (event as any).target.checked);
    if (enableRowPinning && rowPinningDisplayMode?.includes('select')) {
      table.setRowPinning({ bottom: [], top: [] });
    }
    lastSelectedRowId.current = null;
  };
