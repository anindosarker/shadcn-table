import {
  type ComponentPropsWithRef,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
  reorderColumn,
} from 'shadcn-react-table-core';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SRT_ColumnPinningButtons } from '../buttons/SRT_ColumnPinningButtons';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: MRT's MenuItem sx py:'6px' (→ py-1.5) dropped — porting MUI's padding
// onto the shadcn DropdownMenuItem is a look override; its default padding wins
// per the shadcn-default-variants ruling. Kept: flex placement + my-0 (layout)
// and -outline-offset-2, which insets the conditional drag-drop outline below
// (functional draggingBorderColor map, not decorative).
const showHideColumnsMenuItemVariants = cva(
  'items-center justify-start my-0 -outline-offset-2',
);

export interface SRT_ShowHideColumnsMenuItemsProps<TData extends SRT_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  allColumns: SRT_Column<TData>[];
  column: SRT_Column<TData>;
  hoveredColumn: SRT_Column<TData> | null;
  isNestedColumns: boolean;
  setHoveredColumn: Dispatch<SetStateAction<SRT_Column<TData> | null>>;
  table: SRT_TableInstance<TData>;
}

export const SRT_ShowHideColumnsMenuItems = <TData extends SRT_RowData>({
  allColumns,
  className,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  style,
  table,
  ...rest
}: SRT_ShowHideColumnsMenuItemsProps<TData>) => {
  const {
    getState,
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
  const { columnOrder } = getState();
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const switchChecked = column.getIsVisible();

  const handleToggleColumnHidden = (column: SRT_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: SRT_Column<TData>) => {
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
      setColumnPinning(({ left = [], right = [] }) => ({
        left: reorderedColumns.filter((header) => left.includes(header)),
        right: reorderedColumns.filter((header) => right.includes(header)),
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
      {/* Note: onSelect preventDefault keeps the menu OPEN on toggle — radix
          auto-closes on item select where MUI does not; this preserves MRT
          behavior. */}
      <DropdownMenuItem
        onDragEnter={handleDragEnter}
        onSelect={(event) => event.preventDefault()}
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
              <SRT_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                table={table}
              />
            ) : (
              <span className="w-7" />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <SRT_ColumnPinningButtons column={column} table={table} />
            ) : (
              <span className="w-[70px]" />
            ))}
          {enableHiding ? (
            <label className="flex items-center gap-2">
              <SRT_Tooltip title={localization.toggleVisibility}>
                <Switch
                  checked={switchChecked}
                  disabled={!column.getCanHide()}
                  onCheckedChange={() => handleToggleColumnHidden(column)}
                />
              </SRT_Tooltip>
              <span className={cn(columnDefType === 'display' && 'opacity-50')}>
                {columnDef.header}
              </span>
            </label>
          ) : (
            <span className="self-center">{columnDef.header}</span>
          )}
        </div>
      </DropdownMenuItem>
      {column.columns?.map((c: SRT_Column<TData>, i) => (
        <SRT_ShowHideColumnsMenuItems
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
