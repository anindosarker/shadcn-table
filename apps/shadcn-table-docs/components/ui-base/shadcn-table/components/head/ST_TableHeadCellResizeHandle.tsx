import { type ComponentProps, type MouseEvent, type TouchEvent } from 'react';
import { cn } from '@/lib/utils';
import {
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';

export interface ST_TableHeadCellResizeHandleProps<TData extends ST_RowData>
  extends ComponentProps<'div'> {
  header: ST_Header<TData>;
}

/**
 * A full-height hairline on the column's trailing edge: invisible at rest,
 * lit while the pointer is over the header cell, primary while resizing;
 * double-click resets the width.
 */
export const ST_TableHeadCellResizeHandle = <TData extends ST_RowData>({
  className,
  header,
  ...rest
}: ST_TableHeadCellResizeHandleProps<TData>) => {
  const table = header.table;
  const {
    options: { columnResizeDirection, columnResizeMode },
    setColumnResizing,
  } = table;
  const { column } = header;

  const handler = header.getResizeHandler();

  // The header cell is draggable: without preventDefault a resize gesture
  // starts a column drag and swallows the mouseup.
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    handler(event);
  };
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    handler(event);
  };

  // Only the handle being dragged follows the drag offset.
  return (
    <table.Subscribe
      selector={(state) => {
        const isResizing = state.columnResizing.isResizingColumn === column.id;
        return {
          deltaOffset: isResizing ? state.columnResizing.deltaOffset : null,
          isResizing,
        };
      }}
    >
      {({ deltaOffset, isResizing }) => (
        <div
          aria-hidden
          {...rest}
          className={cn(
            'absolute top-0 z-10 flex h-full w-2 cursor-col-resize touch-none justify-center select-none',
            header.headerGroup?.headers.at(-1)?.id === header.id
              ? 'inset-e-0'
              : '-inset-e-1',
            className,
          )}
          onDoubleClick={() => {
            setColumnResizing((old) => ({
              ...old,
              isResizingColumn: false,
            }));
            column.resetSize();
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            transform:
              isResizing && columnResizeMode === 'onEnd'
                ? `translateX(${
                    (columnResizeDirection === 'rtl' ? -1 : 1) *
                    (deltaOffset ?? 0)
                  }px)`
                : undefined,
            ...rest.style,
          }}
        >
          <span
            className={cn(
              'h-full w-px bg-transparent transition-colors group-hover/th:bg-foreground/15',
              isResizing && 'bg-primary group-hover/th:bg-primary',
            )}
          />
        </div>
      )}
    </table.Subscribe>
  );
};
