import { useMemo, useState } from 'react';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
  getDefaultColumnOrderIds,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SRT_ShowHideColumnsMenuItems } from './SRT_ShowHideColumnsMenuItems';

export interface SRT_ShowHideColumnsMenuProps<TData extends SRT_RowData> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (el: HTMLElement | null) => void;
  table: SRT_TableInstance<TData>;
}

/**
 * Show/Hide columns menu - header with hide-all/show-all/reset-order/unpin-all
 * actions plus the (recursive) per-column visibility rows. Port of
 * MRT_ShowHideColumnsMenu. MUI Menu -> shadcn DropdownMenu.
 */
export const SRT_ShowHideColumnsMenu = <TData extends SRT_RowData>({
  anchorEl,
  setAnchorEl,
  table,
}: SRT_ShowHideColumnsMenuProps<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
  } = table;
  const { columnOrder, columnPinning, density } = getState();

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value));
  };

  const allColumns = useMemo(() => {
    const columns = getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as SRT_Column<TData>[];

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

  const [hoveredColumn, setHoveredColumn] = useState<SRT_Column<TData> | null>(
    null,
  );

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
      <DropdownMenuContent align="start" className="min-w-[14rem]">
        <div className="flex justify-between px-2 pb-2">
          {enableHiding && (
            <Button
              variant="ghost"
              size="sm"
              disabled={!getIsSomeColumnsVisible()}
              onClick={() => handleToggleAllColumns(false)}
            >
              {localization.hideAll}
            </Button>
          )}
          {enableColumnOrdering && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                table.setColumnOrder(
                  getDefaultColumnOrderIds(table.options, true),
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
              size="sm"
              disabled={!getIsSomeColumnsPinned()}
              onClick={() => table.resetColumnPinning(true)}
            >
              {localization.unpinAll}
            </Button>
          )}
          {enableHiding && (
            <Button
              variant="ghost"
              size="sm"
              disabled={getIsAllColumnsVisible()}
              onClick={() => handleToggleAllColumns(true)}
            >
              {localization.showAll}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {allColumns.map((column, index) => (
          <SRT_ShowHideColumnsMenuItems
            allColumns={allColumns}
            column={column}
            dense={density === 'compact'}
            hoveredColumn={hoveredColumn}
            isNestedColumns={isNestedColumns}
            key={`${index}-${column.id}`}
            setHoveredColumn={setHoveredColumn}
            table={table}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
