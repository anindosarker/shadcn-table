import { type ComponentPropsWithRef, useMemo, useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
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
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
}

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

  const { focusAnchor, onOpenChange, spanProps } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });

  return (
    <DropdownMenu open={!!anchorEl} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <span {...spanProps} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          focusAnchor();
        }}
        className={cn('w-max', className)}
        {...rest}
      >
        <Subscribe source={table.atoms.columnVisibility}>
          {() => (
            <div className="flex justify-between p-2 pt-0">
              {enableHiding && (
                <Button
                  variant="ghost"
                  disabled={!getIsSomeColumnsVisible()}
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
                  disabled={!hasColumnOrderChanged}
                >
                  {localization.resetOrder}
                </Button>
              )}
              {enableColumnPinning && (
                <Button
                  variant="ghost"
                  disabled={!getIsSomeColumnsPinned()}
                  onClick={() => table.resetColumnPinning(true)}
                >
                  {localization.unpinAll}
                </Button>
              )}
              {enableHiding && (
                <Button
                  variant="ghost"
                  disabled={getIsAllColumnsVisible()}
                  onClick={() => handleToggleAllColumns(true)}
                >
                  {localization.showAll}
                </Button>
              )}
            </div>
          )}
        </Subscribe>
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
