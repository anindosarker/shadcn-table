import { type ComponentPropsWithRef, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnPinningPosition,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/components/menus/ST_ActionMenuItem';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

export interface ST_ColumnActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
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

  // "Filter by column" hands focus to the column's filter input when the
  // menu closes, instead of back to the opener.
  const focusFilterOnCloseRef = useRef(false);

  const handleFilterByColumn = () => {
    setShowColumnFilters(true);
    focusFilterOnCloseRef.current = true;
    setAnchorEl(null);
  };

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    setAnchorEl(null);
  };

  const filterByColumnLabel = localization.filterByColumn?.replace(
    '{column}',
    String(columnDef.header),
  );

  const isSelectFilter = !!columnDef.filterSelectOptions;

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  const showFilterModeSubMenu =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !isSelectFilter &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  const { anchorRef, onOpenChange, spanProps } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });

  return (
    <DropdownMenu open={!!anchorEl} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        nativeButton={false}
        render={<span {...spanProps} />}
      />
      <DropdownMenuContent
        align="start"
        finalFocus={() =>
          focusFilterOnCloseRef.current
            ? (filterInputRefs.current?.[`${column.id}-0`] ?? anchorRef.current)
            : anchorRef.current
        }
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
                      />
                    ),
                    <ST_ActionMenuItem
                      disabled={column.getIsSorted() === 'asc'}
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
                      disabled={column.getIsSorted() === 'desc'}
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
                      disabled={
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
                        // The filter modes open as a submenu of this item.
                        <DropdownMenuSub key={4}>
                          <DropdownMenuSubTrigger
                            className={cn(
                              'my-0',
                              (enableGrouping || enableHiding) &&
                                'border-b bg-clip-padding',
                            )}
                          >
                            <span className="inline-flex min-w-9 shrink-0">
                              <FilterListIcon />
                            </span>
                            {filterByColumnLabel}
                          </DropdownMenuSubTrigger>
                          <ST_FilterOptionMenu
                            // The submenu owns its open state.
                            anchorEl={null}
                            header={header}
                            isSubMenu
                            onSelect={handleFilterByColumn}
                            setAnchorEl={() => {}}
                          />
                        </DropdownMenuSub>
                      ) : (
                        <ST_ActionMenuItem
                          disabled={showColumnFilters}
                          divider={enableGrouping || enableHiding}
                          icon={<FilterListIcon />}
                          key={4}
                          label={filterByColumnLabel}
                          onClick={handleFilterByColumn}
                        />
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
                      disabled={
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
                      disabled={
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
                      disabled={!column.getIsPinned()}
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
                      disabled={columnSizing[column.id] === undefined}
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
                      disabled={!column.getCanHide()}
                      icon={<VisibilityOffIcon />}
                      key={11}
                      label={localization.hideColumn?.replace(
                        '{column}',
                        String(columnDef.header),
                      )}
                      onClick={handleHideColumn}
                    />,
                    <ST_ActionMenuItem
                      disabled={
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
