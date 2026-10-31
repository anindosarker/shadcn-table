import { type ComponentPropsWithRef } from 'react';
import { flushSync } from 'react-dom';
import { Pressable } from 'react-aria-components';
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from '@/components/ui-aria/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnPinningPosition,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import { ST_ActionMenuItem } from '@/components/ui-aria/shadcn-table/components/menus/ST_ActionMenuItem';
import { ST_FilterOptionMenu } from '@/components/ui-aria/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useST_MenuAnchor } from '@/components/ui-aria/shadcn-table/hooks/useST_MenuAnchor';

export interface ST_ColumnActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenu> {
  anchorEl: HTMLElement | null;
  header: ST_Header<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
}

export const ST_ColumnActionMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  header,
  setAnchorEl,
  ...rest
}: ST_ColumnActionMenuProps<TData>) => {
  const table = header.table;
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
    if (['empty', 'notEmpty'].includes(getColumnFilterFnName(columnDef))) {
      setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
      }));
    }
  };

  // "Filter by column" hands focus to the column's filter input. React Aria
  // menus have no close-focus hook, and the open menu keeps the rest of the
  // page inert, so the filter row shows and the menu closes in one commit
  // first. The menu restores focus to the opener a frame later only when
  // focus fell to the body, so the focused input keeps it.
  const handleFilterByColumn = () => {
    flushSync(() => {
      setShowColumnFilters(true);
      setAnchorEl(null);
    });
    filterInputRefs.current?.[`${column.id}-0`]?.focus();
  };

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    setAnchorEl(null);
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

  const { onOpenChange, spanProps } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });

  return (
    <DropdownMenuTrigger isOpen={!!anchorEl} onOpenChange={onOpenChange}>
      <Pressable>
        <span {...spanProps} />
      </Pressable>
      <DropdownMenu
        placement="bottom start"
        className={cn('w-max', className)}
        {...rest}
      >
        <table.Subscribe
          selector={(state) => ({
            columnFilters: state.columnFilters,
            columnPinning: state.columnPinning,
            columnSizing: state.columnSizing,
            columnVisibility: state.columnVisibility,
            grouping: state.grouping,
            showColumnFilters: state.showColumnFilters,
            sorting: state.sorting,
          })}
        >
          {({ columnSizing, columnVisibility, showColumnFilters }) => {
            const columnFilterValue = column.getFilterValue();

            const filterByColumnItem = (
              <ST_ActionMenuItem
                isDisabled={showColumnFilters && !enableColumnFilterModes}
                divider={enableGrouping || enableHiding}
                icon={<FilterListIcon />}
                key={4}
                label={localization.filterByColumn?.replace(
                  '{column}',
                  String(columnDef.header),
                )}
                onClick={showColumnFilters ? undefined : handleFilterByColumn}
              />
            );

            const internalColumnMenuItems = [
              ...(enableSorting && column.getCanSort()
                ? [
                    enableSortingRemoval !== false && (
                      <ST_ActionMenuItem
                        isDisabled={column.getIsSorted() === false}
                        icon={<ClearAllIcon />}
                        key={0}
                        label={localization.clearSort}
                        onClick={handleClearSort}
                      />
                    ),
                    <ST_ActionMenuItem
                      isDisabled={column.getIsSorted() === 'asc'}
                      icon={
                        <SortIcon
                          style={{ transform: 'rotate(180deg) scaleX(-1)' }}
                        />
                      }
                      key={1}
                      label={localization.sortByColumnAsc?.replace(
                        '{column}',
                        String(columnDef.header),
                      )}
                      onClick={handleSortAsc}
                    />,
                    <ST_ActionMenuItem
                      isDisabled={column.getIsSorted() === 'desc'}
                      divider={
                        enableColumnFilters || enableGrouping || enableHiding
                      }
                      icon={<SortIcon />}
                      key={2}
                      label={localization.sortByColumnDesc?.replace(
                        '{column}',
                        String(columnDef.header),
                      )}
                      onClick={handleSortDesc}
                    />,
                  ]
                : []),
              ...(enableColumnFilters && column.getCanFilter()
                ? [
                    <ST_ActionMenuItem
                      isDisabled={
                        !columnFilterValue ||
                        (Array.isArray(columnFilterValue) &&
                          !columnFilterValue.filter((value) => value).length)
                      }
                      icon={<FilterListOffIcon />}
                      key={3}
                      label={localization.clearFilter}
                      onClick={handleClearFilter}
                    />,
                    columnFilterDisplayMode === 'subheader' &&
                      (showFilterModeSubMenu ? (
                        // The filter mode menu opens as a submenu of this item.
                        <DropdownMenuSub key={4}>
                          {filterByColumnItem}
                          <ST_FilterOptionMenu
                            anchorEl={anchorEl}
                            header={header}
                            isSubMenu
                            onSelect={handleFilterByColumn}
                            setAnchorEl={setAnchorEl}
                          />
                        </DropdownMenuSub>
                      ) : (
                        filterByColumnItem
                      )),
                  ].filter(Boolean)
                : []),
              ...(enableGrouping && column.getCanGroup()
                ? [
                    <ST_ActionMenuItem
                      divider={enableColumnPinning}
                      icon={<DynamicFeedIcon />}
                      key={6}
                      label={localization[
                        column.getIsGrouped()
                          ? 'ungroupByColumn'
                          : 'groupByColumn'
                      ]?.replace('{column}', String(columnDef.header))}
                      onClick={handleGroupByColumn}
                    />,
                  ]
                : []),
              ...(enableColumnPinning && column.getCanPin()
                ? [
                    <ST_ActionMenuItem
                      isDisabled={
                        column.getIsPinned() === 'start' || !column.getCanPin()
                      }
                      icon={
                        <PushPinIcon style={{ transform: 'rotate(90deg)' }} />
                      }
                      key={7}
                      label={localization.pinToLeft}
                      onClick={() => handlePinColumn('start')}
                    />,
                    <ST_ActionMenuItem
                      isDisabled={
                        column.getIsPinned() === 'end' || !column.getCanPin()
                      }
                      icon={
                        <PushPinIcon style={{ transform: 'rotate(-90deg)' }} />
                      }
                      key={8}
                      label={localization.pinToRight}
                      onClick={() => handlePinColumn('end')}
                    />,
                    <ST_ActionMenuItem
                      isDisabled={!column.getIsPinned()}
                      divider={enableHiding}
                      icon={<PushPinIcon />}
                      key={9}
                      label={localization.unpin}
                      onClick={() => handlePinColumn(false)}
                    />,
                  ]
                : []),
              ...(enableColumnResizing && column.getCanResize()
                ? [
                    <ST_ActionMenuItem
                      isDisabled={columnSizing[column.id] === undefined}
                      icon={<RestartAltIcon />}
                      key={10}
                      label={localization.resetColumnSize}
                      onClick={handleResetColumnSize}
                    />,
                  ]
                : []),
              ...(enableHiding
                ? [
                    <ST_ActionMenuItem
                      isDisabled={!column.getCanHide()}
                      icon={<VisibilityOffIcon />}
                      key={11}
                      label={localization.hideColumn?.replace(
                        '{column}',
                        String(columnDef.header),
                      )}
                      onClick={handleHideColumn}
                    />,
                    <ST_ActionMenuItem
                      isDisabled={
                        !Object.values(columnVisibility).filter(
                          (visible) => !visible,
                        ).length
                      }
                      icon={<ViewColumnIcon />}
                      key={12}
                      label={localization.showAllColumns?.replace(
                        '{column}',
                        String(columnDef.header),
                      )}
                      onClick={handleShowAllColumns}
                    />,
                  ]
                : []),
            ].filter(Boolean);

            return (
              <>
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
              </>
            );
          }}
        </table.Subscribe>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
};
