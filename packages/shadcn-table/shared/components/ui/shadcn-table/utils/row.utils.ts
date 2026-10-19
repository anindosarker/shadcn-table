import { type ChangeEvent, type MouseEvent } from 'react';
import { rankGlobalFuzzy } from '@/components/ui/shadcn-table/fns/sortFns';
import {
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';

export const getST_Rows = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  all?: boolean,
): ST_Row<TData>[] => {
  const {
    getCenterRows,
    getPrePaginatedRowModel,
    getRowModel,
    getTopRows,
    options: {
      createDisplayMode,
      enablePagination,
      enableRowPinning,
      manualPagination,
      positionCreatingRow,
      rowPinningDisplayMode,
    },
    state: { creatingRow, pagination },
  } = table;

  const isRankingRows = getIsRankingRows(table);

  let rows: ST_Row<TData>[] = [];
  if (!isRankingRows) {
    rows =
      !enableRowPinning || rowPinningDisplayMode?.includes('sticky')
        ? all
          ? getPrePaginatedRowModel().rows
          : getRowModel().rows
        : getCenterRows();
  } else {
    // fuzzy ranking adjustments
    rows = getPrePaginatedRowModel().rows.sort((a, b) => rankGlobalFuzzy(a, b));
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

export const getCanRankRows = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
) => {
  const {
    options: {
      enableGlobalFilterRankedResults,
      manualExpanding,
      manualFiltering,
      manualGrouping,
      manualSorting,
    },
    state: { expanded, globalFilterFn },
  } = table;

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

export const getIsRankingRows = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
) => {
  const { globalFilter, sorting } = table.state;

  return (
    getCanRankRows(table) &&
    globalFilter &&
    !Object.values(sorting).some(Boolean)
  );
};

export const getIsRowSelected = <TData extends ST_RowData>({
  row,
  table,
}: {
  row: ST_Row<TData>;
  table: ST_TableInstance<TData>;
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

export const getST_RowSelectionHandler =
  <TData extends ST_RowData>({
    row,
    table,
  }: {
    row: ST_Row<TData>;
    staticRowIndex?: number;
    table: ST_TableInstance<TData>;
  }) =>
  (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLTableRowElement>,
    value?: boolean,
  ) => {
    const {
      options: { enableRowPinning, rowPinningDisplayMode },
    } = table;

    const wasCurrentRowChecked = getIsRowSelected({ row, table });
    const checked = value ?? !wasCurrentRowChecked;

    // toggle selection of this row; with Shift held (or any event that
    // `isRowRangeSelectionEvent` accepts) TanStack extends the toggle to the
    // rows between the last toggled row and this one (`enableRowRangeSelection`)
    const selectionBefore = table.baseAtoms.rowSelection.get();
    row.getToggleSelectedHandler()({
      nativeEvent: (event as any).nativeEvent,
      shiftKey: (event as any).shiftKey,
      target: { checked },
    });
    const selectionAfter = table.baseAtoms.rowSelection.get();

    const changedRowIds = new Set<string>([row.id]);
    for (const rowId of new Set([
      ...Object.keys(selectionBefore),
      ...Object.keys(selectionAfter),
    ])) {
      if (!!selectionBefore[rowId] !== !!selectionAfter[rowId]) {
        changedRowIds.add(rowId);
      }
    }

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

export const getST_SelectAllHandler =
  <TData extends ST_RowData>({ table }: { table: ST_TableInstance<TData> }) =>
  (
    event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>,
    value?: boolean,
    forceAll?: boolean,
  ) => {
    const {
      options: { enableRowPinning, rowPinningDisplayMode, selectAllMode },
    } = table;

    selectAllMode === 'all' || forceAll
      ? table.toggleAllRowsSelected(value ?? (event as any).target.checked)
      : table.toggleAllPageRowsSelected(value ?? (event as any).target.checked);
    if (enableRowPinning && rowPinningDisplayMode?.includes('select')) {
      table.setRowPinning({ bottom: [], top: [] });
    }
  };
