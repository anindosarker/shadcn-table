import {
  type ComponentPropsWithRef,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from '@/components/ui-base/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { applyColumnReorder } from '@/components/ui-base/shadcn-table/shared/utils/column.utils';
import { isColumnDragCancelled } from '@/components/ui-base/shadcn-table/shared/utils/drag.utils';
import { ST_ColumnPinningButtons } from '@/components/ui-base/shadcn-table/components/buttons/ST_ColumnPinningButtons';
import { ST_GrabHandleButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_GrabHandleButton';
import { ST_ColumnIcon } from '@/components/ui-base/shadcn-table/components/toolbar/ST_ColumnPicker';

const showHideColumnsMenuItemVariants = cva(
  'items-center justify-start my-0 -outline-offset-2',
);

export interface ST_ShowHideColumnsMenuItemsProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  allColumns: ST_Column<TData>[];
  column: ST_Column<TData>;
  hoveredColumn: ST_Column<TData> | null;
  isNestedColumns: boolean;
  setHoveredColumn: Dispatch<SetStateAction<ST_Column<TData> | null>>;
}

export const ST_ShowHideColumnsMenuItems = <TData extends ST_RowData>({
  allColumns,
  className,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  style,
  ...rest
}: ST_ShowHideColumnsMenuItemsProps<TData>) => {
  const table = column.table;
  const {
    options: { enableColumnOrdering, enableColumnPinning, enableHiding },
  } = table;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const handleToggleColumnHidden = (column: ST_Column<TData>) => {
    if (columnDefType === 'group') {
      const switchChecked = column.getIsVisible();
      column?.columns?.forEach?.((childColumn: ST_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  };

  const rowRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    try {
      e.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    setHoveredColumn(null);
    if (hoveredColumn && !isColumnDragCancelled(e)) {
      // The column slide reads where every header sat before the reorder.
      const positions = new Map<string, number>();
      Object.entries(table.refs.tableHeadCellRefs.current ?? {}).forEach(
        ([id, cell]) => {
          if (cell?.isConnected) {
            positions.set(id, cell.getBoundingClientRect().left);
          }
        },
      );
      table.setColumnFlipPending({
        dragDrop: false,
        movedId: column.id,
        positions,
      });
      applyColumnReorder(column, hoveredColumn, table);
    }
  };

  const handleDragEnter = () => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  // Accepting the drop over a row keeps its dragend from reading as cancelled.
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect =
        columnDef.enableColumnOrdering !== false ? 'move' : 'none';
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  const label = (
    <span
      className={cn(
        'flex items-center gap-2',
        columnDefType === 'display' && 'opacity-50',
        !column.getCanHide() && 'text-muted-foreground',
      )}
    >
      <ST_ColumnIcon column={column} />
      {columnDef.header}
    </span>
  );

  return (
    <>
      {/* The drag handle and pin buttons sit beside the menu item, not in it. */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-md',
          isDragging &&
            'opacity-50 outline-2 outline-dashed outline-muted-foreground',
          !isDragging &&
            hoveredColumn?.id === column.id &&
            'outline-2 outline-dashed outline-primary',
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        ref={rowRef}
        style={{ paddingLeft: `${(column.depth + 0.5) * 2}rem` }}
      >
        {columnDefType !== 'group' &&
          enableColumnOrdering &&
          !isNestedColumns &&
          (columnDef.enableColumnOrdering !== false ? (
            <ST_GrabHandleButton
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            />
          ) : (
            <div className="w-7" />
          ))}
        {enableColumnPinning &&
          (column.getCanPin() ? (
            <ST_ColumnPinningButtons column={column} />
          ) : (
            <div className="w-17.5" />
          ))}
        {enableHiding ? (
          <Subscribe source={table.atoms.columnVisibility}>
            {() => (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                // Toggling a column keeps the menu open: Base UI closes on an item
                // click only when closeOnClick is true.
                closeOnClick={false}
                disabled={!column.getCanHide()}
                onCheckedChange={() => handleToggleColumnHidden(column)}
                {...rest}
                className={cn(
                  showHideColumnsMenuItemVariants(),
                  'flex-1',
                  className,
                )}
                style={style}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )}
          </Subscribe>
        ) : (
          <DropdownMenuItem
            {...rest}
            className={cn(
              showHideColumnsMenuItemVariants(),
              'flex-1',
              className,
            )}
            style={style}
          >
            {label}
          </DropdownMenuItem>
        )}
      </div>
      {column.columns?.map((c: ST_Column<TData>, i) => (
        <ST_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
        />
      ))}
    </>
  );
};
