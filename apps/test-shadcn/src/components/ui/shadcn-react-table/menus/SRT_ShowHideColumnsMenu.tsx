import { type ComponentPropsWithRef, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
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
import { cn } from '@/lib/utils';
import { SRT_ShowHideColumnsMenuItems } from './SRT_ShowHideColumnsMenuItems';

const showHideColumnsMenuContentVariants = cva('', {
  variants: {
    // Note: MRT MenuListProps.dense (density === 'compact') stays menu-level, tightening item padding
    dense: {
      false: '',
      true: '[&>*]:py-1',
    },
  },
});

export interface SRT_ShowHideColumnsMenuProps<TData extends SRT_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: SRT_TableInstance<TData>;
}

export const SRT_ShowHideColumnsMenu = <TData extends SRT_RowData>({
  anchorEl,
  className,
  setAnchorEl,
  table,
  ...rest
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
      // Note: mrtTheme.menuBackgroundColor dropped project-wide — DropdownMenuContent's bg-popover themes via shadcn CSS vars
    },
  } = table;
  const { columnOrder, columnPinning, density } = getState();

  const handleToggleAllColumns = (value?: boolean) => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(value));
  };

  /* eslint-disable react-hooks/exhaustive-deps */
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
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as SRT_Column<TData>[];
  /* eslint-enable react-hooks/exhaustive-deps */

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
      {/* Note: MRT disableScrollLock dropped — Radix DropdownMenu owns scroll-lock behavior */}
      <DropdownMenuContent
        align="start"
        {...rest}
        className={cn(
          showHideColumnsMenuContentVariants({
            dense: density === 'compact',
          }),
          className,
        )}
      >
        <div className="flex justify-between p-2 pt-0">
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
