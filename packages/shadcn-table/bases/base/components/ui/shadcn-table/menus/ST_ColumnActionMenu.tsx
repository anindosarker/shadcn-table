import {
  type ComponentPropsWithRef,
  type MouseEvent,
  useRef,
  useState,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnPinningPosition,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/menus/ST_ActionMenuItem';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/menus/ST_FilterOptionMenu';

export interface ST_ColumnActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  anchorEl: HTMLElement | null;
  header: ST_Header<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: ST_TableInstance<TData>;
}

export const ST_ColumnActionMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  header,
  setAnchorEl,
  table,
  ...rest
}: ST_ColumnActionMenuProps<TData>) => {
  const {
    getAllLeafColumns,
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
      // Note: mrtTheme.menuBackgroundColor dropped project-wide — DropdownMenuContent's bg-popover themes via shadcn CSS vars
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
    setColumnOrder,
    setColumnResizing,
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { columnSizing, columnVisibility, showColumnFilters } = table.state;
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
    setColumnResizing((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    setAnchorEl(null);
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    setAnchorEl(null);
  };

  const handlePinColumn = (pinDirection: ST_ColumnPinningPosition) => {
    column.pin(pinDirection);
    setAnchorEl(null);
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old) => ['st-row-expand', ...old]);
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

  const internalColumnMenuItems = [
    ...(enableSorting && column.getCanSort()
      ? [
          enableSortingRemoval !== false && (
            <ST_ActionMenuItem
              disabled={column.getIsSorted() === false}
              icon={<ClearAllIcon />}
              key={0}
              label={localization.clearSort}
              onClick={handleClearSort}
              table={table}
            />
          ),
          <ST_ActionMenuItem
            disabled={column.getIsSorted() === 'asc'}
            icon={
              <SortIcon style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
            }
            key={1}
            label={localization.sortByColumnAsc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortAsc}
            table={table}
          />,
          <ST_ActionMenuItem
            disabled={column.getIsSorted() === 'desc'}
            divider={enableColumnFilters || enableGrouping || enableHiding}
            icon={<SortIcon />}
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
          <ST_ActionMenuItem
            disabled={
              !columnFilterValue ||
              (Array.isArray(columnFilterValue) &&
                !columnFilterValue.filter((value) => value).length)
            }
            icon={<FilterListOffIcon />}
            key={3}
            label={localization.clearFilter}
            onClick={handleClearFilter}
            table={table}
          />,
          columnFilterDisplayMode === 'subheader' && (
            <ST_ActionMenuItem
              disabled={showColumnFilters && !enableColumnFilterModes}
              divider={enableGrouping || enableHiding}
              icon={<FilterListIcon />}
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
            <ST_FilterOptionMenu
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
          <ST_ActionMenuItem
            divider={enableColumnPinning}
            icon={<DynamicFeedIcon />}
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
          <ST_ActionMenuItem
            disabled={column.getIsPinned() === 'start' || !column.getCanPin()}
            icon={<PushPinIcon style={{ transform: 'rotate(90deg)' }} />}
            key={7}
            label={localization.pinToLeft}
            onClick={() => handlePinColumn('start')}
            table={table}
          />,
          <ST_ActionMenuItem
            disabled={column.getIsPinned() === 'end' || !column.getCanPin()}
            icon={<PushPinIcon style={{ transform: 'rotate(-90deg)' }} />}
            key={8}
            label={localization.pinToRight}
            onClick={() => handlePinColumn('end')}
            table={table}
          />,
          <ST_ActionMenuItem
            disabled={!column.getIsPinned()}
            divider={enableHiding}
            icon={<PushPinIcon />}
            key={9}
            label={localization.unpin}
            onClick={() => handlePinColumn(false)}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnResizing && column.getCanResize()
      ? [
          <ST_ActionMenuItem
            disabled={columnSizing[column.id] === undefined}
            icon={<RestartAltIcon />}
            key={10}
            label={localization.resetColumnSize}
            onClick={handleResetColumnSize}
            table={table}
          />,
        ]
      : []),
    ...(enableHiding
      ? [
          <ST_ActionMenuItem
            disabled={!column.getCanHide()}
            icon={<VisibilityOffIcon />}
            key={11}
            label={localization.hideColumn?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleHideColumn}
            table={table}
          />,
          <ST_ActionMenuItem
            disabled={
              !Object.values(columnVisibility).filter((visible) => !visible)
                .length
            }
            icon={<ViewColumnIcon />}
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

  // Base UI reads the popup's finalFocus when the menu closes, after this
  // component re-rendered with anchorEl cleared; the ref keeps the element
  // from the last open render.
  const anchorRef = useRef<HTMLElement | null>(null);
  if (anchorEl) anchorRef.current = anchorEl;

  const rect = anchorEl?.getBoundingClientRect();

  return (
    // Note: disableScrollLock dropped — Base UI Menu keeps its modal default (scroll-locks), owner ruling.
    <DropdownMenu
      open={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
      }}
    >
      <DropdownMenuTrigger
        // The library anchors its menus to an invisible span, not a button.
        nativeButton={false}
        render={
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
        }
      />
      <DropdownMenuContent
        align="start"
        // Focus goes back to the real anchor; returning false keeps Base UI
        // off the invisible trigger.
        finalFocus={() => {
          anchorRef.current?.focus();
          return false;
        }}
        className={cn('w-max', className)}
        {...rest}
      >
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
