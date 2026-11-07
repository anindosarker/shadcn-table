import { useId, useMemo, useState } from 'react';
import { ST_Default_Icons } from '@/components/ui-base/shadcn-table/icons';
import { ST_Localization_EN } from '@/components/ui-base/shadcn-table/shared/locales/en';
import {
  type ST_DefinedTableOptions,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableOptions,
} from '@/components/ui-base/shadcn-table/types';

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
  autoResetExpanded = false,
  columnFilterDisplayMode = 'chips',
  columnResizeDirection,
  columnResizeMode = 'onChange',
  createDisplayMode = 'modal',
  defaultColumn,
  defaultDisplayColumn,
  editDisplayMode = 'modal',
  enableBottomToolbar = true,
  enableCellOverflowTooltip = true,
  enableColumnActions = true,
  enableColumnFilterModes = true,
  enableColumnFilters = true,
  enableColumnOrdering = true,
  enableColumnPinning = true,
  enableColumnResizing = true,
  enableColumnVirtualization: enableColumnVirtualizationProp,
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
  enableRowVirtualization: enableRowVirtualizationProp,
  enableScrollButtons = true,
  enableSelectAll = true,
  enableSortPopover = true,
  enableSorting = true,
  enableStickyHeader = false,
  enableTableFooter = true,
  enableTableHead = true,
  enableToolbarInternalActions = true,
  enableTopToolbar = true,
  enableViewSettings = true,
  getRowCanExpand,
  icons,
  id: idProp,
  layoutMode,
  localization,
  manualFiltering,
  manualGrouping,
  manualPagination,
  manualSorting,
  paginationDisplayMode = 'pages',
  persistViewSettings = false,
  positionActionsColumn = 'last',
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
  showClearSearchButton = false,
  showColumnDragHandle = false,
  ...rest
}: ST_TableOptions<TData>) => {
  // The caller's own id, before a generated one fills in: the view settings
  // storage key needs one that is stable across reloads.
  const viewSettingsKeyInput = idProp;
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const definedIcons = useMemo(
    () => ({ ...ST_Default_Icons, ...icons }),
    [icons],
  );
  const definedLocalization = useMemo(
    () => ({
      ...ST_Localization_EN,
      ...localization,
    }),
    [localization],
  );
  const definedDefaultColumn = useMemo(
    () => ({ ...ST_DefaultColumn, ...defaultColumn }),
    [defaultColumn],
  );
  const definedDefaultDisplayColumn = useMemo(
    () => ({
      ...ST_DefaultDisplayColumn,
      ...defaultDisplayColumn,
    }),
    [defaultDisplayColumn],
  );
  // Virtualization is fixed at mount.
  const [{ enableColumnVirtualization, enableRowVirtualization }] = useState(
    () => ({
      enableColumnVirtualization: enableColumnVirtualizationProp,
      enableRowVirtualization: enableRowVirtualizationProp,
    }),
  );

  if (!columnResizeDirection) {
    columnResizeDirection = 'ltr';
  }

  layoutMode = layoutMode || 'grid';
  if (
    layoutMode === 'semantic' &&
    (enableRowVirtualization || enableColumnVirtualization)
  ) {
    layoutMode = 'grid';
  }

  if (enableRowVirtualization) {
    enableStickyHeader = true;
  }

  if (enablePagination === false) {
    manualPagination = true;
  }

  if (!enableFilters && !enableColumnFilters && !enableGlobalFilter) {
    manualFiltering = true;
  }

  if (!rest.data?.length) {
    manualFiltering = true;
    manualGrouping = true;
    manualPagination = true;
    manualSorting = true;
  }

  return {
    autoResetExpanded,
    columnFilterDisplayMode,
    columnResizeDirection,
    columnResizeMode,
    createDisplayMode,
    defaultColumn: definedDefaultColumn,
    defaultDisplayColumn: definedDefaultDisplayColumn,
    editDisplayMode,
    enableBottomToolbar,
    enableCellOverflowTooltip,
    enableColumnActions,
    enableColumnFilterModes,
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
    enableScrollButtons,
    enableSelectAll,
    enableSortPopover,
    enableSorting,
    enableStickyHeader,
    enableTableFooter,
    enableTableHead,
    enableToolbarInternalActions,
    enableTopToolbar,
    enableViewSettings,
    // `row.toggleExpanded()` is a no-op when `row.getCanExpand()` is false,
    // and detail-panel rows have no sub rows, so a row can expand when its
    // detail panel renders something; a row whose panel is null keeps a
    // disabled expand button instead of opening an empty panel.
    getRowCanExpand:
      getRowCanExpand ??
      ((row) =>
        (!!renderDetailPanel &&
          !!renderDetailPanel({
            row: row as unknown as ST_Row<TData>,
            table: row.table as unknown as ST_TableInstance<TData>,
          })) ||
        ((enableExpanding ?? true) && !!row.subRows?.length)),
    getSubRows: (row) => row?.subRows,
    icons: definedIcons,
    id,
    layoutMode,
    localization: definedLocalization,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    paginationDisplayMode,
    persistViewSettings,
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
    showClearSearchButton,
    showColumnDragHandle,
    viewSettingsKeyInput,
    ...rest,
  } as ST_DefinedTableOptions<TData>;
};
