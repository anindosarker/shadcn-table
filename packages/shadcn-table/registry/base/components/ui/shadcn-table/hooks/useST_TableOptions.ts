import { useId, useMemo } from 'react';
import { ST_AggregationFns } from '@/components/ui/shadcn-table/fns/aggregationFns';
import { ST_FilterFns } from '@/components/ui/shadcn-table/fns/filterFns';
import { ST_SortFns } from '@/components/ui/shadcn-table/fns/sortFns';
import { ST_Default_Icons } from '@/components/ui/shadcn-table/icons';
import { ST_Localization_EN } from '@/components/ui/shadcn-table/locales/en';
import {
  type ST_DefinedTableOptions,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';

export const ST_DefaultColumn = {
  filterVariant: 'text',
  maxSize: 1000,
  minSize: 40,
  size: 180,
} as const;

export const ST_DefaultDisplayColumn = {
  columnDefType: 'display',
  enableClickToCopy: false,
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnFilter: false,
  enableColumnOrdering: false,
  enableEditing: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableResizing: false,
  enableSorting: false,
} as const;

export const useST_TableOptions: <TData extends ST_RowData>(
  tableOptions: ST_TableOptions<TData>,
) => ST_DefinedTableOptions<TData> = <TData extends ST_RowData>({
  aggregationFns,
  autoResetExpanded = false,
  columnFilterDisplayMode = 'subheader',
  columnResizeDirection,
  columnResizeMode = 'onChange',
  createDisplayMode = 'modal',
  defaultColumn,
  defaultDisplayColumn,
  editDisplayMode = 'modal',
  enableBottomToolbar = true,
  enableColumnActions = true,
  enableColumnFilters = true,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  enableColumnResizing = false,
  enableColumnVirtualization,
  enableDensityToggle = true,
  enableExpandAll = true,
  enableExpanding,
  enableFacetedValues = false,
  enableFilterMatchHighlighting = true,
  enableFilters = true,
  enableFullScreenToggle = true,
  enableGlobalFilter = true,
  enableGlobalFilterRankedResults = true,
  enableGrouping = false,
  enableHiding = true,
  enableKeyboardShortcuts = true,
  enableMultiRowSelection = true,
  enableMultiSort = true,
  enablePagination = true,
  enableRowPinning = false,
  enableRowSelection = false,
  enableRowVirtualization,
  enableSelectAll = true,
  enableSorting = true,
  enableStickyHeader = false,
  enableTableFooter = true,
  enableTableHead = true,
  enableToolbarInternalActions = true,
  enableTopToolbar = true,
  filterFns,
  getRowCanExpand,
  icons,
  id = useId(),
  layoutMode,
  localization,
  manualFiltering,
  manualGrouping,
  manualPagination,
  manualSorting,
  // mrtTheme,
  paginationDisplayMode = 'default',
  positionActionsColumn = 'first',
  positionCreatingRow = 'top',
  positionExpandColumn = 'first',
  positionGlobalFilter = 'right',
  positionPagination = 'bottom',
  positionToolbarAlertBanner = 'top',
  positionToolbarDropZone = 'top',
  renderDetailPanel,
  rowNumberDisplayMode = 'static',
  rowPinningDisplayMode = 'sticky',
  selectAllMode = 'page',
  sortFns,
  ...rest
}: ST_TableOptions<TData>) => {
  icons = useMemo(() => ({ ...ST_Default_Icons, ...icons }), [icons]);
  localization = useMemo(
    () => ({
      ...ST_Localization_EN,
      ...localization,
    }),
    [localization],
  );
  // mrtTheme = useMemo(() => getMRTTheme(mrtTheme, theme), [mrtTheme, theme]);
  // Note: mrtTheme dropped project-wide (Conventions); theme tokens instead.
  aggregationFns = useMemo(
    () => ({ ...ST_AggregationFns, ...aggregationFns }),
    [],
  );
  filterFns = useMemo(() => ({ ...ST_FilterFns, ...filterFns }), []);
  sortFns = useMemo(() => ({ ...ST_SortFns, ...sortFns }), []);
  defaultColumn = useMemo(
    () => ({ ...ST_DefaultColumn, ...defaultColumn }),
    [defaultColumn],
  );
  defaultDisplayColumn = useMemo(
    () => ({
      ...ST_DefaultDisplayColumn,
      ...defaultDisplayColumn,
    }),
    [defaultDisplayColumn],
  );
  //cannot be changed after initialization
  [enableColumnVirtualization, enableRowVirtualization] = useMemo(
    () => [enableColumnVirtualization, enableRowVirtualization],
    [],
  );

  if (!columnResizeDirection) {
    // columnResizeDirection = theme.direction || 'ltr';
    // Note: no MUI theme in ST; MUI theme.direction defaults to 'ltr'.
    columnResizeDirection = 'ltr';
  }

  layoutMode =
    layoutMode || (enableColumnResizing ? 'grid-no-grow' : 'semantic');
  if (
    layoutMode === 'semantic' &&
    (enableRowVirtualization || enableColumnVirtualization)
  ) {
    layoutMode = 'grid';
  }

  if (enableRowVirtualization) {
    enableStickyHeader = true;
  }

  if (enablePagination === false && manualPagination === undefined) {
    manualPagination = true;
  }

  if (!rest.data?.length) {
    manualFiltering = true;
    manualGrouping = true;
    manualPagination = true;
    manualSorting = true;
  }

  return {
    aggregationFns,
    autoResetExpanded,
    columnFilterDisplayMode,
    columnResizeDirection,
    columnResizeMode,
    createDisplayMode,
    defaultColumn,
    defaultDisplayColumn,
    editDisplayMode,
    enableBottomToolbar,
    enableColumnActions,
    enableColumnFilters,
    enableColumnOrdering,
    enableColumnPinning,
    enableColumnResizing,
    enableColumnVirtualization,
    enableDensityToggle,
    enableExpandAll,
    enableExpanding,
    enableFacetedValues,
    enableFilterMatchHighlighting,
    enableFilters,
    enableFullScreenToggle,
    enableGlobalFilter,
    enableGlobalFilterRankedResults,
    enableGrouping,
    enableHiding,
    enableKeyboardShortcuts,
    enableMultiRowSelection,
    enableMultiSort,
    enablePagination,
    enableRowPinning,
    enableRowSelection,
    enableRowVirtualization,
    enableSelectAll,
    enableSorting,
    enableStickyHeader,
    enableTableFooter,
    enableTableHead,
    enableToolbarInternalActions,
    enableTopToolbar,
    filterFns,
    // v9 makes `row.toggleExpanded()` a no-op when `row.getCanExpand()` is
    // false (v8 toggled regardless) and detail-panel rows have no sub rows, so
    // a table with `renderDetailPanel` treats every row as expandable.
    getRowCanExpand:
      getRowCanExpand ??
      ((row) =>
        !!renderDetailPanel ||
        ((enableExpanding ?? true) && !!row.subRows?.length)),
    getSubRows: (row) => row?.subRows,
    icons,
    id,
    layoutMode,
    localization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    // mrtTheme,
    paginationDisplayMode,
    positionActionsColumn,
    positionCreatingRow,
    positionExpandColumn,
    positionGlobalFilter,
    positionPagination,
    positionToolbarAlertBanner,
    positionToolbarDropZone,
    renderDetailPanel,
    rowNumberDisplayMode,
    rowPinningDisplayMode,
    selectAllMode,
    sortFns,
    ...rest,
  } as ST_DefinedTableOptions<TData>;
};
