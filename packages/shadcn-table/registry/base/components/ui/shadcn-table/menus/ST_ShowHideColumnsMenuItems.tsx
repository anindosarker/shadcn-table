import {
  type ComponentPropsWithRef,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { reorderColumn } from '@/components/ui/shadcn-table/utils/column.utils';
import { ST_ColumnPinningButtons } from '@/components/ui/shadcn-table/buttons/ST_ColumnPinningButtons';
import { ST_GrabHandleButton } from '@/components/ui/shadcn-table/buttons/ST_GrabHandleButton';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

// Note: MRT MenuItem sx py:'6px' dropped — shadcn DropdownMenuItem padding wins.
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
  table: ST_TableInstance<TData>;
}

export const ST_ShowHideColumnsMenuItems = <TData extends ST_RowData>({
  allColumns,
  className,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  style,
  table,
  ...rest
}: ST_ShowHideColumnsMenuItemsProps<TData>) => {
  const {
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
      // Note: mrtTheme.draggingBorderColor dropped project-wide — the hovered
      // outline maps to `outline-primary`.
    },
    setColumnOrder,
    setColumnPinning,
  } = table;
  const { columnOrder } = table.state;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const switchChecked = column.getIsVisible();

  const handleToggleColumnHidden = (column: ST_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: ST_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  };

  const menuItemRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    try {
      e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0);
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
        columnOrder,
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

  return (
    <>
      {/* Note: disableRipple dropped — no MUI ripple in shadcn. */}
      <DropdownMenuItem
        onDragEnter={handleDragEnter}
        // Toggling a column keeps the menu open: Base UI closes on an item
        // click only when closeOnClick is true.
        closeOnClick={false}
        ref={menuItemRef}
        {...rest}
        className={cn(
          showHideColumnsMenuItemVariants(),
          isDragging &&
            'opacity-50 outline-2 outline-dashed outline-muted-foreground',
          !isDragging &&
            hoveredColumn?.id === column.id &&
            'outline-2 outline-dashed outline-primary',
          className,
        )}
        style={{
          paddingLeft: `${(column.depth + 0.5) * 2}rem`,
          ...style,
        }}
      >
        <div className="flex flex-nowrap gap-2">
          {columnDefType !== 'group' &&
            enableColumnOrdering &&
            !isNestedColumns &&
            (columnDef.enableColumnOrdering !== false ? (
              <ST_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                table={table}
              />
            ) : (
              <div className="w-7" />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <ST_ColumnPinningButtons column={column} table={table} />
            ) : (
              <div className="w-[70px]" />
            ))}
          {enableHiding ? (
            <Label>
              <ST_Tooltip title={localization.toggleVisibility}>
                <span className="inline-flex">
                  <Switch
                    checked={switchChecked}
                    disabled={!column.getCanHide()}
                    onCheckedChange={() => handleToggleColumnHidden(column)}
                  />
                </span>
              </ST_Tooltip>
              <span
                className={cn(
                  columnDefType === 'display' && 'opacity-50',
                  !column.getCanHide() && 'text-muted-foreground',
                )}
              >
                {columnDef.header}
              </span>
            </Label>
          ) : (
            <p className="self-center">{columnDef.header}</p>
          )}
        </div>
      </DropdownMenuItem>
      {column.columns?.map((c: ST_Column<TData>, i) => (
        <ST_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </>
  );
};
