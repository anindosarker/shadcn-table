import { rankGlobalFuzzy } from '@/components/ui-aria/shadcn-table/shared/fns/sortFns';
import {
  type ST_Row,
  type ST_RowData,
  type ST_CoreTableInstance,
  type ST_SelectionEvent,
  type ST_TableInstance,
  type ST_TableState,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';

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
  } = table;
  // The live store: the caller's subscription lists these slices.
  const { creatingRow, pagination } = table.store.state as ST_TableState<TData>;

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
    rows = getPrePaginatedRowModel().rows.sort((a, b) => rankGlobalFuzzy(a, b));
    if (enablePagination && !manualPagination && !all) {
      const start = pagination.pageIndex * pagination.pageSize;
      rows = rows.slice(start, start + pagination.pageSize);
    }
    if (enableRowPinning && !rowPinningDisplayMode?.includes('sticky')) {
      rows = rows.filter((row) => !row.getIsPinned());
    }
  }
  if (enableRowPinning && rowPinningDisplayMode?.includes('sticky')) {
    const centerPinnedRowIds = rows
      .filter((row) => row.getIsPinned())
      .map((r) => r.id);
    const keptPinnedRows = getTopRows().filter(
      (row) => !centerPinnedRowIds.includes(row.id),
    );

    if (rowPinningDisplayMode.startsWith('select') && rows.length) {
      // The selection pins keep the row model order: rows pinned on an
      // earlier page go above the page rows, rows pinned on a later page
      // below them.
      const positions = new Map(
        getPrePaginatedRowModel().flatRows.map((row, index) => [row.id, index]),
      );
      const position = (row: ST_Row<TData>) => positions.get(row.id) ?? -1;
      const pageStart = position(rows[0]);
      keptPinnedRows.sort((a, b) => position(a) - position(b));
      rows = [
        ...keptPinnedRows.filter((row) => position(row) < pageStart),
        ...rows,
        ...keptPinnedRows.filter((row) => position(row) >= pageStart),
      ];
    } else {
      rows = [...keptPinnedRows, ...rows];
    }
  }
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
  table: ST_TableInstance<TData, unknown>,
) => {
  const {
    options: {
      enableGlobalFilterRankedResults,
      manualExpanding,
      manualFiltering,
      manualGrouping,
      manualSorting,
    },
  } = table;
  const { expanded, globalFilterFn } = table.store.state;

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
  const { globalFilter, sorting } = table.store.state;

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
  table: ST_CoreTableInstance<TData>;
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
    table: ST_CoreTableInstance<TData>;
  }) =>
  (event: ST_SelectionEvent, value?: boolean) => {
    const wasCurrentRowChecked = getIsRowSelected({ row, table });
    const checked = value ?? !wasCurrentRowChecked;

    // toggle selection of this row; with Shift held (or any event that
    // `isRowRangeSelectionEvent` accepts) TanStack extends the toggle to the
    // rows between the last toggled row and this one (`enableRowRangeSelection`)
    row.getToggleSelectedHandler()({
      nativeEvent: (event as any).nativeEvent,
      shiftKey: (event as any).shiftKey,
      target: { checked },
    });

    if (row.getCanSelectSubRows() && row.getIsAllSubRowsSelected()) {
      row.subRows?.forEach((r) => r.toggleSelected(false));
    }
  };

export const getST_SelectAllHandler =
  <TData extends ST_RowData>({
    table,
  }: {
    table: ST_CoreTableInstance<TData>;
  }) =>
  (event: ST_SelectionEvent, value?: boolean, forceAll?: boolean) => {
    const {
      options: { enableRowPinning, rowPinningDisplayMode, selectAllMode },
    } = table;
    const isAllMode = selectAllMode === 'all' || forceAll;
    // The checkbox roots and the keyboard handler's cell carry no `checked`;
    // select all then toggles, as TanStack does without a value.
    const checked =
      value ??
      (event.target as { checked?: boolean }).checked ??
      !(isAllMode
        ? table.getIsAllRowsSelected()
        : table.getIsAllPageRowsSelected());

    isAllMode
      ? table.toggleAllRowsSelected(checked)
      : table.toggleAllPageRowsSelected(checked);
    // Unselect all clears every pin, hand-pinned rows included; the selection
    // subscription in useST_Effects pins and unpins the rows that changed.
    if (
      !checked &&
      enableRowPinning &&
      rowPinningDisplayMode?.includes('select')
    ) {
      table.setRowPinning({ bottom: [], top: [] });
    }
  };
