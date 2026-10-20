import { type ComponentPropsWithRef, useMemo, useRef, useState } from 'react';
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
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getDefaultColumnOrderIds } from '@/components/ui/shadcn-table/utils/displayColumn.utils';
import { ST_ShowHideColumnsMenuItems } from '@/components/ui/shadcn-table/menus/ST_ShowHideColumnsMenuItems';

export interface ST_ShowHideColumnsMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: ST_TableInstance<TData>;
}

export const ST_ShowHideColumnsMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  setAnchorEl,
  table,
  ...rest
}: ST_ShowHideColumnsMenuProps<TData>) => {
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
      // Note: mrtTheme.menuBackgroundColor dropped project-wide — DropdownMenuContent's bg-popover themes via shadcn CSS vars
    },
  } = table;
  const { columnOrder, columnPinning } = table.state;

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
        ...getStartLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getEndLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getStartLeafColumns(),
    getEndLeafColumns(),
  ]) as ST_Column<TData>[];
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

  const [hoveredColumn, setHoveredColumn] = useState<ST_Column<TData> | null>(
    null,
  );

  // Base UI reads the popup's finalFocus when the menu closes, after this
  // component re-rendered with anchorEl cleared; the ref keeps the element
  // from the last open render.
  const anchorRef = useRef<HTMLElement | null>(null);
  if (anchorEl) anchorRef.current = anchorEl;

  const rect = anchorEl?.getBoundingClientRect();

  return (
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
      {/* Note: MRT disableScrollLock dropped — Base UI Menu owns scroll-lock behavior */}
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
        <DropdownMenuSeparator />
        {allColumns.map((column, index) => (
          <ST_ShowHideColumnsMenuItems
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
