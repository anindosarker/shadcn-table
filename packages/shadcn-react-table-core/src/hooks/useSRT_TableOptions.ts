//TODO: fix themes and icons

import { useId, useMemo } from 'react';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { SRT_AggregationFns } from '../fns/aggregationFns';
import { SRT_FilterFns } from '../fns/filterFns';
import { SRT_SortingFns } from '../fns/sortingFns';
import { SRT_Default_Icons } from '../icons';
import { SRT_Localization_EN } from '../locales/en';
import {
  type SRT_DefinedTableOptions,
  type SRT_RowData,
  type SRT_TableOptions,
} from '../types';

export const SRT_DefaultColumn = {
  filterVariant: 'text',
  maxSize: 1000,
  minSize: 40,
  size: 180,
} as const;

export const SRT_DefaultDisplayColumn = {
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

export const useSRT_TableOptions: <TData extends SRT_RowData>(
  tableOptions: SRT_TableOptions<TData>,
) => SRT_DefinedTableOptions<TData> = <TData extends SRT_RowData>({
  aggregationFns,
  autoResetExpanded = false,
  columnFilterDisplayMode = 'subheader',
  columnResizeDirection,
  columnResizeMode = 'onChange',
  createDisplayMode = 'modal',
  defaultColumn,
  defaultDisplayColumn,
  editDisplayMode = 'modal',
  enableBatchRowSelection = true,
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
  // icons,
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
  rowNumberDisplayMode = 'static',
  rowPinningDisplayMode = 'sticky',
  selectAllMode = 'page',
  sortingFns,
  ...rest
}: SRT_TableOptions<TData>) => {
  // const theme = useTheme();

  // icons = useMemo(() => ({ ...SRT_Default_Icons, ...icons }), [icons]);
  localization = useMemo(
    () => ({
      ...SRT_Localization_EN,
      ...localization,
    }),
    [localization],
  );
  // mrtTheme = useMemo(() => getMRTTheme(mrtTheme, theme), [mrtTheme, theme]);
  aggregationFns = useMemo(
    () => ({ ...SRT_AggregationFns, ...aggregationFns }),
    [],
  );
  filterFns = useMemo(() => ({ ...SRT_FilterFns, ...filterFns }), []);
  sortingFns = useMemo(() => ({ ...SRT_SortingFns, ...sortingFns }), []);
  defaultColumn = useMemo(
    () => ({ ...SRT_DefaultColumn, ...defaultColumn }),
    [defaultColumn],
  );
  defaultDisplayColumn = useMemo(
    () => ({
      ...SRT_DefaultDisplayColumn,
      ...defaultDisplayColumn,
    }),
    [defaultDisplayColumn],
  );
  //cannot be changed after initialization
  [enableColumnVirtualization, enableRowVirtualization] = useMemo(
    () => [enableColumnVirtualization, enableRowVirtualization],
    [],
  );

  // if (!columnResizeDirection) {
  //   columnResizeDirection = theme.direction || 'ltr';
  // }

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
    enableBatchRowSelection,
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
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel:
      enableExpanding || enableGrouping ? getExpandedRowModel() : undefined,
    getFacetedMinMaxValues: enableFacetedValues
      ? getFacetedMinMaxValues()
      : undefined,
    getFacetedRowModel: enableFacetedValues ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFacetedValues
      ? getFacetedUniqueValues()
      : undefined,
    getFilteredRowModel:
      (enableColumnFilters || enableGlobalFilter || enableFilters) &&
      !manualFiltering
        ? getFilteredRowModel()
        : undefined,
    getGroupedRowModel:
      enableGrouping && !manualGrouping ? getGroupedRowModel() : undefined,
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getSubRows: (row) => row?.subRows,
    // icons,
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
    rowNumberDisplayMode,
    rowPinningDisplayMode,
    selectAllMode,
    sortingFns,
    ...rest,
  } as SRT_DefinedTableOptions<TData>;
};
