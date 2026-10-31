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
} from '@/components/ui-radix/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import { reorderColumn } from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import { ST_ColumnPinningButtons } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ColumnPinningButtons';
import { ST_GrabHandleButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_GrabHandleButton';

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
    setColumnOrder,
    setColumnPinning,
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

  const handleDragEnd = () => {
    setIsDragging(false);
    setHoveredColumn(null);
    if (hoveredColumn) {
      const reorderedColumns = reorderColumn(
        column,
        hoveredColumn,
        table.atoms.columnOrder.get(),
      );
      setColumnOrder(reorderedColumns);
      setColumnPinning(({ start = [], end = [] }) => ({
        start: reorderedColumns.filter((header) => start.includes(header)),
        end: reorderedColumns.filter((header) => end.includes(header)),
      }));
    }
  };

  const handleDragEnter = () => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  const label = (
    <span
      className={cn(
        columnDefType === 'display' && 'opacity-50',
        !column.getCanHide() && 'text-muted-foreground',
      )}
    >
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
        // Radix menus swallow Tab; the controls beside the item take it.
        onKeyDown={(event) => {
          if (event.key === 'Tab') event.stopPropagation();
        }}
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
                // Toggling a column keeps the menu open.
                onSelect={(event) => event.preventDefault()}
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
