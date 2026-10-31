import {
  type ComponentPropsWithRef,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
import { composeRenderProps } from 'react-aria-components';
import { DropdownMenuItem } from '@/components/ui-aria/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { reorderColumn } from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import { ST_ColumnPinningButtons } from '@/components/ui-aria/shadcn-table/components/buttons/ST_ColumnPinningButtons';
import { ST_GrabHandleButton } from '@/components/ui-aria/shadcn-table/components/buttons/ST_GrabHandleButton';

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
    options: { enableColumnOrdering, enableColumnPinning },
    setColumnOrder,
    setColumnPinning,
  } = table;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    try {
      // The part's MenuItem takes no ref, so the drag image is found from the handle.
      e.dataTransfer.setDragImage(
        e.currentTarget.closest('[data-st-show-hide-row]') as HTMLElement,
        0,
        0,
      );
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

  return (
    <>
      <DropdownMenuItem
        id={column.id}
        isDisabled={!column.getCanHide()}
        // MenuItem passes no drag handlers through, and a menu renders only
        // collection nodes, so the row wraps the item element: the drag
        // handle and pin buttons sit beside the item, not in it.
        render={(props) =>
          'href' in props ? (
            <a {...props} />
          ) : (
            <div
              className={cn(
                'flex items-center gap-2 rounded-md',
                isDragging &&
                  'opacity-50 outline-2 outline-dashed outline-muted-foreground',
                !isDragging &&
                  hoveredColumn?.id === column.id &&
                  'outline-2 outline-dashed outline-primary',
              )}
              data-st-show-hide-row=""
              onDragEnter={handleDragEnter}
              role="none"
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
              <div {...props} />
            </div>
          )
        }
        shouldCloseOnSelect={false}
        textValue={String(columnDef.header)}
        {...rest}
        className={composeRenderProps(className, (className) =>
          cn(showHideColumnsMenuItemVariants(), 'flex-1', className),
        )}
        style={style}
      >
        <span className={cn(columnDefType === 'display' && 'opacity-50')}>
          {columnDef.header}
        </span>
      </DropdownMenuItem>
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
