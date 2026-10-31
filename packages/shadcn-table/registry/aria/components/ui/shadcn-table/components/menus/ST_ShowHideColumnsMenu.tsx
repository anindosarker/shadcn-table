import { type ComponentPropsWithRef, useMemo, useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-store';
import { Header, Pressable, type Selection } from 'react-aria-components';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getDefaultColumnOrderIds } from '@/components/ui/shadcn-table/shared/utils/displayColumn.utils';
import { ST_ShowHideColumnsMenuItems } from '@/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenuItems';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

export interface ST_ShowHideColumnsMenuProps
  extends ComponentPropsWithRef<typeof DropdownMenu> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
}

/** The columns the menu lists, group children included, in menu order. */
const getListedColumns = <TData extends ST_RowData>(
  columns: ST_Column<TData>[],
): ST_Column<TData>[] =>
  columns.flatMap((column) =>
    !column.columnDef.header || column.columnDef.visibleInShowHideMenu === false
      ? []
      : [column, ...getListedColumns(column.columns ?? [])],
  );

const getVisibleColumnIds = <TData extends ST_RowData>(
  columns: ST_Column<TData>[],
) =>
  getListedColumns(columns)
    .filter((column) => column.getIsVisible())
    .map((column) => column.id);

export const ST_ShowHideColumnsMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  setAnchorEl,
  ...rest
}: ST_ShowHideColumnsMenuProps) => {
  const table = useSTContext<TData>();
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getEndLeafColumns,
    getIsSomeColumnsVisible,
    getStartLeafColumns,
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
  } = table;
  const columnOrder = useSelector(table.atoms.columnOrder);
  // A pin change reorders the leaf column getters below.
  useSelector(table.atoms.columnPinning);

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value));
  };

  const toggleColumn = (column: ST_Column<TData>) => {
    if (column.columnDef.columnDefType === 'group') {
      const isVisible = column.getIsVisible();
      column.columns?.forEach((childColumn) =>
        childColumn.toggleVisibility(!isVisible),
      );
    } else {
      column.toggleVisibility();
    }
  };

  const columns = getAllColumns();
  const centerLeafColumns = getCenterLeafColumns();
  const startLeafColumns = getStartLeafColumns();
  const endLeafColumns = getEndLeafColumns();
  const allColumns = useMemo(() => {
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...startLeafColumns,
        ...Array.from(new Set(columnOrder)).map((colId) =>
          centerLeafColumns.find((col) => col?.id === colId),
        ),
        ...endLeafColumns,
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columns,
    centerLeafColumns,
    startLeafColumns,
    endLeafColumns,
  ]) as ST_Column<TData>[];

  const handleSelectionChange = (keys: Selection) => {
    const visibleIds = new Set(getVisibleColumnIds(allColumns));
    getListedColumns(allColumns).forEach((column) => {
      const isSelected = keys === 'all' || keys.has(column.id);
      if (isSelected !== visibleIds.has(column.id)) toggleColumn(column);
    });
  };

  const isNestedColumns = allColumns.some(
    (col) => col.columnDef.columnDefType === 'group',
  );

  const hasColumnOrderChanged = useMemo(
    () =>
      columnOrder.length !== initialState.columnOrder.length ||
      !columnOrder.every(
        (column, index) => column === initialState.columnOrder[index],
      ),
    [columnOrder, initialState.columnOrder],
  );

  const [hoveredColumn, setHoveredColumn] = useState<ST_Column<TData> | null>(
    null,
  );

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
        <Subscribe source={table.atoms.columnVisibility}>
          {() => (
            // A Menu renders only collection nodes; Header carries the buttons.
            <Header className="flex justify-between p-2 pt-0">
              {enableHiding && (
                <Button
                  variant="ghost"
                  isDisabled={!getIsSomeColumnsVisible()}
                  onClick={() => handleToggleAllColumns(false)}
                >
                  {localization.hideAll}
                </Button>
              )}
              {enableColumnOrdering && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    table.setColumnOrder(
                      getDefaultColumnOrderIds(
                        {
                          ...table.options,
                          state: {
                            columnOrder: table.atoms.columnOrder.get(),
                            creatingRow: table.atoms.creatingRow.get(),
                            grouping: table.atoms.grouping.get(),
                          },
                        },
                        true,
                      ),
                    )
                  }
                  isDisabled={!hasColumnOrderChanged}
                >
                  {localization.resetOrder}
                </Button>
              )}
              {enableColumnPinning && (
                <Button
                  variant="ghost"
                  isDisabled={!getIsSomeColumnsPinned()}
                  onClick={() => table.resetColumnPinning(true)}
                >
                  {localization.unpinAll}
                </Button>
              )}
              {enableHiding && (
                <Button
                  variant="ghost"
                  isDisabled={getIsAllColumnsVisible()}
                  onClick={() => handleToggleAllColumns(true)}
                >
                  {localization.showAll}
                </Button>
              )}
            </Header>
          )}
        </Subscribe>
        <DropdownMenuSeparator />
        <Subscribe source={table.atoms.columnVisibility}>
          {() => (
            // The column rows select their columns: selected means visible.
            <DropdownMenuGroup
              aria-label={localization.showHideColumns}
              onSelectionChange={handleSelectionChange}
              selectedKeys={
                enableHiding ? getVisibleColumnIds(allColumns) : undefined
              }
              selectionMode={enableHiding ? 'multiple' : 'none'}
            >
              {allColumns.map((column, index) => (
                <ST_ShowHideColumnsMenuItems
                  allColumns={allColumns}
                  column={column}
                  hoveredColumn={hoveredColumn}
                  isNestedColumns={isNestedColumns}
                  key={`${index}-${column.id}`}
                  setHoveredColumn={setHoveredColumn}
                />
              ))}
            </DropdownMenuGroup>
          )}
        </Subscribe>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
};
