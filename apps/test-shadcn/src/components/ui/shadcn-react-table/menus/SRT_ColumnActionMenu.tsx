import { type MouseEvent, type ReactNode, useState } from 'react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SRT_ActionMenuItem } from './SRT_ActionMenuItem';
import { SRT_FilterOptionMenu } from './SRT_FilterOptionMenu';

export interface SRT_ColumnActionMenuProps<TData extends SRT_RowData> {
  anchorEl: HTMLElement | null;
  header: SRT_Header<TData>;
  setAnchorEl: (el: HTMLElement | null) => void;
  table: SRT_TableInstance<TData>;
}

export const SRT_ColumnActionMenu = <TData extends SRT_RowData>({
  anchorEl,
  header,
  setAnchorEl,
  table,
}: SRT_ColumnActionMenuProps<TData>) => {
  const {
    getAllLeafColumns,
    getState,
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      enableColumnFilters,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableHiding,
      enableSorting,
      enableSortingRemoval,
      icons: {
        ClearAllIcon,
        DynamicFeedIcon,
        FilterListIcon,
        FilterListOffIcon,
        PushPinIcon,
        RestartAltIcon,
        SortIcon,
        ViewColumnIcon,
        VisibilityOffIcon,
      },
      localization,
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
    setColumnOrder,
    setColumnSizingInfo,
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { columnSizing, columnVisibility, density, showColumnFilters } =
    getState();
  const dense = density === 'compact';
  const columnFilterValue = column.getFilterValue();

  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<HTMLElement | null>(null);

  const handleClearSort = () => {
    column.clearSorting();
    setAnchorEl(null);
  };

  const handleSortAsc = () => {
    column.toggleSorting(false);
    setAnchorEl(null);
  };

  const handleSortDesc = () => {
    column.toggleSorting(true);
    setAnchorEl(null);
  };

  const handleResetColumnSize = () => {
    setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    setAnchorEl(null);
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    setAnchorEl(null);
  };

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
    setAnchorEl(null);
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setColumnOrder((old: any) => ['srt-row-expand', ...old]);
    setAnchorEl(null);
  };

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
    setAnchorEl(null);
    if (['empty', 'notEmpty'].includes(columnDef._filterFn)) {
      setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
      }));
    }
  };

  const handleFilterByColumn = () => {
    setShowColumnFilters(true);
    queueMicrotask(() => filterInputRefs.current?.[`${column.id}-0`]?.focus());
    setAnchorEl(null);
  };

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    setAnchorEl(null);
  };

  const handleOpenFilterModeMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const isSelectFilter = !!columnDef.filterSelectOptions;

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  const showFilterModeSubMenu =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !isSelectFilter &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  const internalColumnMenuItems: ReactNode[] = [
    ...(enableSorting && column.getCanSort()
      ? [
          enableSortingRemoval !== false && (
            <SRT_ActionMenuItem
              dense={dense}
              disabled={column.getIsSorted() === false}
              icon={<ClearAllIcon className="h-4 w-4" />}
              key={0}
              label={localization.clearSort}
              onClick={handleClearSort}
              table={table}
            />
          ),
          <SRT_ActionMenuItem
            dense={dense}
            disabled={column.getIsSorted() === 'asc'}
            icon={
              <SortIcon
                className="h-4 w-4"
                style={{ transform: 'rotate(180deg) scaleX(-1)' }}
              />
            }
            key={1}
            label={localization.sortByColumnAsc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortAsc}
            table={table}
          />,
          <SRT_ActionMenuItem
            dense={dense}
            disabled={column.getIsSorted() === 'desc'}
            divider={enableColumnFilters || enableGrouping || enableHiding}
            icon={<SortIcon className="h-4 w-4" />}
            key={2}
            label={localization.sortByColumnDesc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortDesc}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnFilters && column.getCanFilter()
      ? [
          <SRT_ActionMenuItem
            dense={dense}
            disabled={
              !columnFilterValue ||
              (Array.isArray(columnFilterValue) &&
                !columnFilterValue.filter((value) => value).length)
            }
            icon={<FilterListOffIcon className="h-4 w-4" />}
            key={3}
            label={localization.clearFilter}
            onClick={handleClearFilter}
            table={table}
          />,
          columnFilterDisplayMode === 'subheader' && (
            <SRT_ActionMenuItem
              dense={dense}
              disabled={showColumnFilters && !enableColumnFilterModes}
              divider={enableGrouping || enableHiding}
              icon={<FilterListIcon className="h-4 w-4" />}
              key={4}
              label={localization.filterByColumn?.replace(
                '{column}',
                String(columnDef.header),
              )}
              onClick={
                showColumnFilters
                  ? handleOpenFilterModeMenu
                  : handleFilterByColumn
              }
              onOpenSubMenu={
                showFilterModeSubMenu ? handleOpenFilterModeMenu : undefined
              }
              table={table}
            />
          ),
          showFilterModeSubMenu && (
            <SRT_FilterOptionMenu
              anchorEl={filterMenuAnchorEl}
              header={header}
              key={5}
              onSelect={handleFilterByColumn}
              setAnchorEl={setFilterMenuAnchorEl}
              table={table}
            />
          ),
        ].filter(Boolean)
      : []),
    ...(enableGrouping && column.getCanGroup()
      ? [
          <SRT_ActionMenuItem
            dense={dense}
            divider={enableColumnPinning}
            icon={<DynamicFeedIcon className="h-4 w-4" />}
            key={6}
            label={localization[
              column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'
            ]?.replace('{column}', String(columnDef.header))}
            onClick={handleGroupByColumn}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnPinning && column.getCanPin()
      ? [
          <SRT_ActionMenuItem
            dense={dense}
            disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
            icon={
              <PushPinIcon
                className="h-4 w-4"
                style={{ transform: 'rotate(90deg)' }}
              />
            }
            key={7}
            label={localization.pinToLeft}
            onClick={() => handlePinColumn('left')}
            table={table}
          />,
          <SRT_ActionMenuItem
            dense={dense}
            disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
            icon={
              <PushPinIcon
                className="h-4 w-4"
                style={{ transform: 'rotate(-90deg)' }}
              />
            }
            key={8}
            label={localization.pinToRight}
            onClick={() => handlePinColumn('right')}
            table={table}
          />,
          <SRT_ActionMenuItem
            dense={dense}
            disabled={!column.getIsPinned()}
            divider={enableHiding}
            icon={<PushPinIcon className="h-4 w-4" />}
            key={9}
            label={localization.unpin}
            onClick={() => handlePinColumn(false)}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnResizing && column.getCanResize()
      ? [
          <SRT_ActionMenuItem
            dense={dense}
            disabled={columnSizing[column.id] === undefined}
            icon={<RestartAltIcon className="h-4 w-4" />}
            key={10}
            label={localization.resetColumnSize}
            onClick={handleResetColumnSize}
            table={table}
          />,
        ]
      : []),
    ...(enableHiding
      ? [
          <SRT_ActionMenuItem
            dense={dense}
            disabled={!column.getCanHide()}
            icon={<VisibilityOffIcon className="h-4 w-4" />}
            key={11}
            label={localization.hideColumn?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleHideColumn}
            table={table}
          />,
          <SRT_ActionMenuItem
            dense={dense}
            disabled={
              !Object.values(columnVisibility).filter((visible) => !visible)
                .length
            }
            icon={<ViewColumnIcon className="h-4 w-4" />}
            key={12}
            label={localization.showAllColumns?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleShowAllColumns}
            table={table}
          />,
        ]
      : []),
  ].filter(Boolean);

  const rect = anchorEl?.getBoundingClientRect();

  return (
    <DropdownMenu
      open={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
      }}
    >
      <DropdownMenuTrigger asChild>
        <span
          aria-hidden
          style={{
            position: 'fixed',
            left: rect?.left ?? 0,
            top: rect?.top ?? 0,
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            pointerEvents: 'none',
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {columnDef.renderColumnActionsMenuItems?.({
          closeMenu: () => setAnchorEl(null),
          column,
          internalColumnMenuItems,
          table,
        }) ??
          renderColumnActionsMenuItems?.({
            closeMenu: () => setAnchorEl(null),
            column,
            internalColumnMenuItems,
            table,
          }) ??
          internalColumnMenuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
