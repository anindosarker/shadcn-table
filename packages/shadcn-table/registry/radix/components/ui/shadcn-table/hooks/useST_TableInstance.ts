import { useEffect, useMemo, useRef, useState } from 'react';
import { useTable } from '@tanstack/react-table';
import {
  type ST_Cell,
  type ST_Column,
  type ST_ColumnDef,
  type ST_ColumnFilterFnsState,
  type ST_ColumnOrderState,
  type ST_ColumnResizingState,
  type ST_DefinedTableOptions,
  type ST_DensityState,
  type ST_FilterOption,
  type ST_GroupingState,
  type ST_PaginationState,
  type ST_Row,
  type ST_RowData,
  type ST_StatefulTableOptions,
  type ST_TableInstance,
  type ST_TableState,
  type ST_Updater,
} from '@/components/ui/shadcn-table/types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '@/components/ui/shadcn-table/utils/column.utils';
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '@/components/ui/shadcn-table/utils/displayColumn.utils';
import { stFeatures } from '@/components/ui/shadcn-table/utils/tanstack.features';
import { createRow } from '@/components/ui/shadcn-table/utils/tanstack.helpers';
import { getST_RowActionsColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowActionsColumnDef';
import { getST_RowDragColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowDragColumnDef';
import { getST_RowExpandColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowExpandColumnDef';
import { getST_RowNumbersColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowNumbersColumnDef';
import { getST_RowPinningColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowPinningColumnDef';
import { getST_RowSelectColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowSelectColumnDef';
import { getST_RowSpacerColumnDef } from '@/components/ui/shadcn-table/hooks/display-columns/getST_RowSpacerColumnDef';
import { useST_Effects } from '@/components/ui/shadcn-table/hooks/useST_Effects';

/**
 * The MRT hook that wraps the TanStack useTable hook and adds additional functionality
 * @param definedTableOptions - table options with proper defaults set
 * @returns the MRT table instance
 */
export const useST_TableInstance = <TData extends ST_RowData>(
  definedTableOptions: ST_DefinedTableOptions<TData>,
): ST_TableInstance<TData> => {
  const actionCellRef = useRef<HTMLTableCellElement>(null);
  const bottomToolbarRef = useRef<HTMLDivElement>(null);
  const editInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const filterInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const tableLayoutRef = useRef<HTMLDivElement>(null);
  const topToolbarRef = useRef<HTMLDivElement>(null);
  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const tableFooterRef = useRef<HTMLTableSectionElement>(null);

  //transform initial state with proper column order
  const initialState: Partial<ST_TableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {};
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as ST_StatefulTableOptions<TData>);
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy';
    // v9 spreads a partial `columnPinning` over its defaults without filling
    // the other side, so `{ start: [...] }` alone would read `end` as undefined
    if (initState.columnPinning) {
      initState.columnPinning = {
        start: initState.columnPinning.start ?? [],
        end: initState.columnPinning.end ?? [],
      };
    }
    return initState;
  }, []);

  definedTableOptions.initialState = initialState;

  const [actionCell, setActionCell] = useState<ST_Cell<TData> | null>(
    initialState.actionCell ?? null,
  );
  const [creatingRow, _setCreatingRow] = useState<ST_Row<TData> | null>(
    initialState.creatingRow ?? null,
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<ST_ColumnFilterFnsState>(() =>
      Object.assign(
        {},
        ...getAllLeafColumnDefs(
          definedTableOptions.columns as ST_ColumnDef<TData>[],
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
  const [columnOrder, onColumnOrderChange] = useState<ST_ColumnOrderState>(
    initialState.columnOrder ?? [],
  );
  const [columnResizing, onColumnResizingChange] =
    useState<ST_ColumnResizingState>(
      initialState.columnResizing ?? ({} as ST_ColumnResizingState),
    );
  const [density, setDensity] = useState<ST_DensityState>(
    initialState?.density ?? 'comfortable',
  );
  const [draggingColumn, setDraggingColumn] = useState<ST_Column<TData> | null>(
    initialState.draggingColumn ?? null,
  );
  const [draggingRow, setDraggingRow] = useState<ST_Row<TData> | null>(
    initialState.draggingRow ?? null,
  );
  const [editingCell, setEditingCell] = useState<ST_Cell<TData> | null>(
    initialState.editingCell ?? null,
  );
  const [editingRow, setEditingRow] = useState<ST_Row<TData> | null>(
    initialState.editingRow ?? null,
  );
  const [globalFilterFn, setGlobalFilterFn] = useState<ST_FilterOption>(
    initialState.globalFilterFn ?? 'fuzzy',
  );
  const [grouping, onGroupingChange] = useState<ST_GroupingState>(
    initialState.grouping ?? [],
  );
  const [hoveredColumn, setHoveredColumn] = useState<Partial<
    ST_Column<TData>
  > | null>(initialState.hoveredColumn ?? null);
  const [hoveredRow, setHoveredRow] = useState<Partial<ST_Row<TData>> | null>(
    initialState.hoveredRow ?? null,
  );
  const [isFullScreen, setIsFullScreen] = useState<boolean>(
    initialState?.isFullScreen ?? false,
  );
  const [pagination, setPagination] = useState<ST_PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );
  // TanStack queues an auto page-index reset in a microtask during the first
  // render when grouping or sorting row models register. React 19 rejects a
  // state update on a component that has not mounted yet, so updates queued
  // before mount are dropped. They only ever target the initial page index.
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const onPaginationChange = (updater: ST_Updater<ST_PaginationState>) => {
    if (!mounted.current) return;
    setPagination(updater);
  };
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
    columnResizing,
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
    definedTableOptions as ST_StatefulTableOptions<TData>;

  //don't recompute columnDefs while resizing column or dragging column/row
  const columnDefsRef = useRef<ST_ColumnDef<TData>[]>([]);
  statefulTableOptions.columns =
    statefulTableOptions.state.columnResizing.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              showRowPinningColumn(statefulTableOptions) &&
                getST_RowPinningColumnDef(statefulTableOptions),
              showRowDragColumn(statefulTableOptions) &&
                getST_RowDragColumnDef(statefulTableOptions),
              showRowActionsColumn(statefulTableOptions) &&
                getST_RowActionsColumnDef(statefulTableOptions),
              showRowExpandColumn(statefulTableOptions) &&
                getST_RowExpandColumnDef(statefulTableOptions),
              showRowSelectionColumn(statefulTableOptions) &&
                getST_RowSelectColumnDef(statefulTableOptions),
              showRowNumbersColumn(statefulTableOptions) &&
                getST_RowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as ST_ColumnDef<TData>[]),
            ...statefulTableOptions.columns,
            ...([
              showRowSpacerColumn(statefulTableOptions) &&
                getST_RowSpacerColumnDef(statefulTableOptions),
            ].filter(Boolean) as ST_ColumnDef<TData>[]),
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

  // The ST-only state slices (density, isFullScreen, ...) live in React state
  // and in `options.state`, not in TanStack's store, so the selector folds
  // them into `table.state` next to the TanStack slices: one read for both.
  const tanstackTable = useTable(
    {
      onColumnOrderChange,
      onColumnResizingChange,
      onGroupingChange,
      onPaginationChange,
      ...statefulTableOptions,
      features: stFeatures,
      globalFilterFn:
        statefulTableOptions.filterFns?.[globalFilterFn ?? 'fuzzy'],
    } as any,
    (state) => ({ ...state, ...statefulTableOptions.state }),
  );

  // v9 assigns the row, column, cell and header APIs on prototypes, so those
  // objects must never be spread; the table instance keeps its APIs as own
  // properties and `Object.assign` extends it in place.
  const table = Object.assign(
    tanstackTable as unknown as ST_TableInstance<TData>,
    {
      refs: {
        actionCellRef,
        bottomToolbarRef,
        editInputRefs,
        filterInputRefs,
        searchInputRef,
        tableContainerRef,
        tableFooterRef,
        tableHeadCellRefs,
        tableHeadRef,
        tableLayoutRef,
        topToolbarRef,
      },
      setActionCell: statefulTableOptions.onActionCellChange ?? setActionCell,
      setCreatingRow: (row: ST_Updater<ST_Row<TData> | null | true>) => {
        let _row = row;
        if (row === true) {
          _row = createRow(table);
        }
        statefulTableOptions?.onCreatingRowChange?.(
          _row as ST_Row<TData> | null,
        ) ?? _setCreatingRow(_row as ST_Row<TData> | null);
      },
      setColumnFilterFns:
        statefulTableOptions.onColumnFilterFnsChange ?? setColumnFilterFns,
      setDensity: statefulTableOptions.onDensityChange ?? setDensity,
      setDraggingColumn:
        statefulTableOptions.onDraggingColumnChange ?? setDraggingColumn,
      setDraggingRow:
        statefulTableOptions.onDraggingRowChange ?? setDraggingRow,
      setEditingCell:
        statefulTableOptions.onEditingCellChange ?? setEditingCell,
      setEditingRow: statefulTableOptions.onEditingRowChange ?? setEditingRow,
      setGlobalFilterFn:
        statefulTableOptions.onGlobalFilterFnChange ?? setGlobalFilterFn,
      setHoveredColumn:
        statefulTableOptions.onHoveredColumnChange ?? setHoveredColumn,
      setHoveredRow: statefulTableOptions.onHoveredRowChange ?? setHoveredRow,
      setIsFullScreen:
        statefulTableOptions.onIsFullScreenChange ?? setIsFullScreen,
      setShowAlertBanner:
        statefulTableOptions.onShowAlertBannerChange ?? setShowAlertBanner,
      setShowColumnFilters:
        statefulTableOptions.onShowColumnFiltersChange ?? setShowColumnFilters,
      setShowGlobalFilter:
        statefulTableOptions.onShowGlobalFilterChange ?? setShowGlobalFilter,
      setShowToolbarDropZone:
        statefulTableOptions.onShowToolbarDropZoneChange ??
        setShowToolbarDropZone,
    },
  );

  useST_Effects(table);

  return table;
};
