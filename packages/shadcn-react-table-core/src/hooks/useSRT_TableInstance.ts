import { useMemo, useRef, useState } from 'react';
import { useReactTable } from '@tanstack/react-table';
import {
  SRT_DefinedTableOptions,
  SRT_StatefulTableOptions,
  type SRT_Cell,
  type SRT_Column,
  type SRT_ColumnDef,
  type SRT_ColumnFilterFnsState,
  type SRT_ColumnOrderState,
  type SRT_ColumnSizingInfoState,
  type SRT_DensityState,
  type SRT_FilterOption,
  type SRT_GroupingState,
  type SRT_PaginationState,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_TableState,
  type SRT_Updater,
} from '../types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '../utils/column.utils';
import {
  getDefaultColumnOrderIds,
  // showRowActionsColumn,
  // showRowDragColumn,
  // showRowExpandColumn,
  // showRowNumbersColumn,
  // showRowPinningColumn,
  // showRowSelectionColumn,
  // showRowSpacerColumn,
} from '../utils/displayColumn.utils';
import { createRow } from '../utils/tanstack.helpers';
import { useSRT_Effects } from './useSRT_Effects';
// import { getSRT_RowActionsColumnDef } from './display-columns/getSRT_RowActionsColumnDef';
// import { getSRT_RowDragColumnDef } from './display-columns/getSRT_RowDragColumnDef';
// import { getSRT_RowExpandColumnDef } from './display-columns/getSRT_RowExpandColumnDef';
// import { getSRT_RowNumbersColumnDef } from './display-columns/getSRT_RowNumbersColumnDef';
// import { getSRT_RowPinningColumnDef } from './display-columns/getSRT_RowPinningColumnDef';
// import { getSRT_RowSelectColumnDef } from './display-columns/getSRT_RowSelectColumnDef';
// import { getSRT_RowSpacerColumnDef } from './display-columns/getSRT_RowSpacerColumnDef';

/**
 * The MRT hook that wraps the TanStack useReactTable hook and adds additional functionality
 * @param definedTableOptions - table options with proper defaults set
 * @returns the MRT table instance
 */
export const useSRT_TableInstance = <TData extends SRT_RowData>(
  definedTableOptions: SRT_DefinedTableOptions<TData>,
): SRT_TableInstance<TData> => {
  const lastSelectedRowId = useRef<null | string>(null);
  const actionCellRef = useRef<HTMLTableCellElement>(null);
  const bottomToolbarRef = useRef<HTMLDivElement>(null);
  const editInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const filterInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const tablePaperRef = useRef<HTMLDivElement>(null);
  const topToolbarRef = useRef<HTMLDivElement>(null);
  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const tableFooterRef = useRef<HTMLTableSectionElement>(null);

  //transform initial state with proper column order
  const initialState: Partial<SRT_TableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {};
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as SRT_StatefulTableOptions<TData>);
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy';
    return initState;
  }, []);

  definedTableOptions.initialState = initialState;

  const [actionCell, setActionCell] = useState<SRT_Cell<TData> | null>(
    initialState.actionCell ?? null,
  );
  const [creatingRow, _setCreatingRow] = useState<SRT_Row<TData> | null>(
    initialState.creatingRow ?? null,
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<SRT_ColumnFilterFnsState>(() =>
      Object.assign(
        {},
        ...getAllLeafColumnDefs(
          definedTableOptions.columns as SRT_ColumnDef<TData>[],
        ).map((col) => ({
          [getColumnId(col)]:
            col.filterFn instanceof Function
              ? (col.filterFn.name ?? 'custom')
              : (col.filterFn ??
                initialState?.columnFilterFns?.[getColumnId(col)] ??
                getDefaultColumnFilterFn(col)),
        })),
      ),
    );
  const [columnOrder, onColumnOrderChange] = useState<SRT_ColumnOrderState>(
    initialState.columnOrder ?? [],
  );
  const [columnSizingInfo, onColumnSizingInfoChange] =
    useState<SRT_ColumnSizingInfoState>(
      initialState.columnSizingInfo ?? ({} as SRT_ColumnSizingInfoState),
    );
  const [density, setDensity] = useState<SRT_DensityState>(
    initialState?.density ?? 'comfortable',
  );
  const [draggingColumn, setDraggingColumn] =
    useState<SRT_Column<TData> | null>(initialState.draggingColumn ?? null);
  const [draggingRow, setDraggingRow] = useState<SRT_Row<TData> | null>(
    initialState.draggingRow ?? null,
  );
  const [editingCell, setEditingCell] = useState<SRT_Cell<TData> | null>(
    initialState.editingCell ?? null,
  );
  const [editingRow, setEditingRow] = useState<SRT_Row<TData> | null>(
    initialState.editingRow ?? null,
  );
  const [globalFilterFn, setGlobalFilterFn] = useState<SRT_FilterOption>(
    initialState.globalFilterFn ?? 'fuzzy',
  );
  const [grouping, onGroupingChange] = useState<SRT_GroupingState>(
    initialState.grouping ?? [],
  );
  const [hoveredColumn, setHoveredColumn] = useState<Partial<
    SRT_Column<TData>
  > | null>(initialState.hoveredColumn ?? null);
  const [hoveredRow, setHoveredRow] = useState<Partial<SRT_Row<TData>> | null>(
    initialState.hoveredRow ?? null,
  );
  const [isFullScreen, setIsFullScreen] = useState<boolean>(
    initialState?.isFullScreen ?? false,
  );
  const [pagination, onPaginationChange] = useState<SRT_PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(
    initialState?.showAlertBanner ?? false,
  );
  const [showColumnFilters, setShowColumnFilters] = useState<boolean>(
    initialState?.showColumnFilters ?? false,
  );
  const [showGlobalFilter, setShowGlobalFilter] = useState<boolean>(
    initialState?.showGlobalFilter ?? false,
  );
  const [showToolbarDropZone, setShowToolbarDropZone] = useState<boolean>(
    initialState?.showToolbarDropZone ?? false,
  );

  definedTableOptions.state = {
    actionCell,
    columnFilterFns,
    columnOrder,
    columnSizingInfo,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    globalFilterFn,
    grouping,
    hoveredColumn,
    hoveredRow,
    isFullScreen,
    pagination,
    showAlertBanner,
    showColumnFilters,
    showGlobalFilter,
    showToolbarDropZone,
    ...definedTableOptions.state,
  };

  //The table options now include all state needed to help determine column visibility and order logic
  const statefulTableOptions =
    definedTableOptions as SRT_StatefulTableOptions<TData>;

  //don't recompute columnDefs while resizing column or dragging column/row
  const columnDefsRef = useRef<SRT_ColumnDef<TData>[]>([]);
  statefulTableOptions.columns =
    statefulTableOptions.state.columnSizingInfo.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              // TODO: implement later
              // showRowPinningColumn(statefulTableOptions) &&
              //   getSRT_RowPinningColumnDef(statefulTableOptions),
              // showRowDragColumn(statefulTableOptions) &&
              //   getSRT_RowDragColumnDef(statefulTableOptions),
              // showRowActionsColumn(statefulTableOptions) &&
              //   getSRT_RowActionsColumnDef(statefulTableOptions),
              // showRowExpandColumn(statefulTableOptions) &&
              //   getSRT_RowExpandColumnDef(statefulTableOptions),
              // showRowSelectionColumn(statefulTableOptions) &&
              //   getSRT_RowSelectColumnDef(statefulTableOptions),
              // showRowNumbersColumn(statefulTableOptions) &&
              //   getSRT_RowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as SRT_ColumnDef<TData>[]),
            ...statefulTableOptions.columns,
            // TODO: implement later
            // ...([
            //   showRowSpacerColumn(statefulTableOptions) &&
            //     getSRT_RowSpacerColumnDef(statefulTableOptions),
            // ].filter(Boolean) as SRT_ColumnDef<TData>[]),
          ],
          tableOptions: statefulTableOptions,
        });
  columnDefsRef.current = statefulTableOptions.columns;

  //if loading, generate blank rows to show skeleton loaders
  statefulTableOptions.data = useMemo(
    () =>
      (statefulTableOptions.state.isLoading ||
        statefulTableOptions.state.showSkeletons) &&
      !statefulTableOptions.data.length
        ? [
            ...Array(
              Math.min(statefulTableOptions.state.pagination.pageSize, 20),
            ).fill(null),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(statefulTableOptions.columns).map(
                (col) => ({
                  [getColumnId(col)]: null,
                }),
              ),
            ),
          )
        : statefulTableOptions.data,
    [
      statefulTableOptions.data,
      statefulTableOptions.state.isLoading,
      statefulTableOptions.state.showSkeletons,
    ],
  );

  //@ts-expect-error
  const table = useReactTable({
    onColumnOrderChange,
    onColumnSizingInfoChange,
    onGroupingChange,
    onPaginationChange,
    ...statefulTableOptions,
    globalFilterFn: statefulTableOptions.filterFns?.[globalFilterFn ?? 'fuzzy'],
  }) as SRT_TableInstance<TData>;

  table.refs = {
    actionCellRef,
    bottomToolbarRef,
    editInputRefs,
    filterInputRefs,
    lastSelectedRowId,
    searchInputRef,
    tableContainerRef,
    tableFooterRef,
    tableHeadCellRefs,
    tableHeadRef,
    tablePaperRef,
    topToolbarRef,
  };

  table.setActionCell =
    statefulTableOptions.onActionCellChange ?? setActionCell;
  table.setCreatingRow = (row: SRT_Updater<SRT_Row<TData> | null | true>) => {
    let _row = row;
    if (row === true) {
      _row = createRow(table);
    }
    statefulTableOptions?.onCreatingRowChange?.(
      _row as SRT_Row<TData> | null,
    ) ?? _setCreatingRow(_row as SRT_Row<TData> | null);
  };
  table.setColumnFilterFns =
    statefulTableOptions.onColumnFilterFnsChange ?? setColumnFilterFns;
  table.setDensity = statefulTableOptions.onDensityChange ?? setDensity;
  table.setDraggingColumn =
    statefulTableOptions.onDraggingColumnChange ?? setDraggingColumn;
  table.setDraggingRow =
    statefulTableOptions.onDraggingRowChange ?? setDraggingRow;
  table.setEditingCell =
    statefulTableOptions.onEditingCellChange ?? setEditingCell;
  table.setEditingRow =
    statefulTableOptions.onEditingRowChange ?? setEditingRow;
  table.setGlobalFilterFn =
    statefulTableOptions.onGlobalFilterFnChange ?? setGlobalFilterFn;
  table.setHoveredColumn =
    statefulTableOptions.onHoveredColumnChange ?? setHoveredColumn;
  table.setHoveredRow =
    statefulTableOptions.onHoveredRowChange ?? setHoveredRow;
  table.setIsFullScreen =
    statefulTableOptions.onIsFullScreenChange ?? setIsFullScreen;
  table.setShowAlertBanner =
    statefulTableOptions.onShowAlertBannerChange ?? setShowAlertBanner;
  table.setShowColumnFilters =
    statefulTableOptions.onShowColumnFiltersChange ?? setShowColumnFilters;
  table.setShowGlobalFilter =
    statefulTableOptions.onShowGlobalFilterChange ?? setShowGlobalFilter;
  table.setShowToolbarDropZone =
    statefulTableOptions.onShowToolbarDropZoneChange ?? setShowToolbarDropZone;

  useSRT_Effects(table);

  return table;
};
