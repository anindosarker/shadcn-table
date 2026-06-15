import {
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
  reorderColumn,
} from 'shadcn-react-table-core';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SRT_ColumnPinningButtons } from '../buttons/SRT_ColumnPinningButtons';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';
import { cn } from '@/lib/utils';

export interface SRT_ShowHideColumnsMenuItemsProps<TData extends SRT_RowData> {
  allColumns: SRT_Column<TData>[];
  column: SRT_Column<TData>;
  // Compact density renders tighter row padding, mirroring MRT's
  // `MenuListProps.dense` (set when table density is 'compact').
  dense?: boolean;
  hoveredColumn: SRT_Column<TData> | null;
  isNestedColumns: boolean;
  setHoveredColumn: Dispatch<SetStateAction<SRT_Column<TData> | null>>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Show/Hide columns menu items - recursive rows for column visibility.
 * Port of MRT_ShowHideColumnsMenuItems.
 *
 * MUI MenuItem + Switch + FormControlLabel -> a flex row with a shadcn Checkbox.
 * Preserves nested-column recursion, drag-to-reorder (native DnD), pinning
 * buttons, and visibility toggling (group columns toggle all children).
 */
export const SRT_ShowHideColumnsMenuItems = <TData extends SRT_RowData>({
  allColumns,
  column,
  dense,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  table,
  className,
}: SRT_ShowHideColumnsMenuItemsProps<TData>) => {
  const {
    getState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
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

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
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

  const handleDragEnter = (_e: DragEvent) => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  const isHovered = hoveredColumn?.id === column.id;

  return (
    <>
      <div
        onDragEnter={handleDragEnter}
        ref={menuItemRef}
        style={{
          opacity: isDragging ? 0.5 : 1,
          outline: isDragging
            ? '2px dashed hsl(var(--muted-foreground))'
            : isHovered
              ? '2px dashed hsl(var(--primary))'
              : 'none',
          outlineOffset: '-2px',
          paddingLeft: `${(column.depth + 0.5) * 1}rem`,
        }}
        className={cn(
          'flex items-center justify-start px-2 text-sm',
          dense ? 'py-1' : 'py-1.5',
          className,
        )}
      >
        <div className="flex flex-nowrap items-center gap-2">
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
            <label
              className={cn(
                'flex cursor-pointer items-center gap-2',
                columnDefType === 'display' && 'opacity-50',
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center">
                      <Checkbox
                        checked={switchChecked}
                        disabled={!column.getCanHide()}
                        onCheckedChange={() => handleToggleColumnHidden(column)}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {localization.toggleVisibility}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {columnDef.header}
            </label>
          ) : (
            <span className="self-center">{columnDef.header}</span>
          )}
        </div>
      </div>
      {column.columns?.map((c: SRT_Column<TData>, i) => (
        <SRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          dense={dense}
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
