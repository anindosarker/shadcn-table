import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

export interface SRT_TableHeadCellResizeHandleProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Resize handle - drag handle for column resizing
 *
 * Barebones implementation:
 * - Vertical divider that's draggable
 * - Double-click to reset size
 * - Visual feedback on resize
 * - Positioned absolutely on column edge
 *
 * TODO (Future enhancements):
 * - Add smooth animation
 * - Add resize preview line
 * - Add keyboard resize support
 * - Add touch support
 * - Better RTL support
 */

export const SRT_TableHeadCellResizeHandle = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_TableHeadCellResizeHandleProps<TData>) => {
  const {
    getState,
    options: { columnResizeDirection, columnResizeMode },
    setColumnSizingInfo,
  } = table;
  const { density } = getState();
  const { column } = header;

  const handler = header.getResizeHandler();

  const isResizing = column.getIsResizing();

  // Calculate margin based on density
  const marginOffset =
    density === 'compact' ? -8 : density === 'comfortable' ? -16 : -24;

  const leftRight = column.columnDef.columnDefType === 'display' ? 4 : 0;

  const transform =
    isResizing && columnResizeMode === 'onEnd'
      ? `translateX(${
          (columnResizeDirection === 'rtl' ? -1 : 1) *
          (getState().columnSizingInfo.deltaOffset ?? 0)
        }px)`
      : undefined;

  return (
    <div
      onDoubleClick={() => {
        setColumnSizingInfo((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform,
        cursor: 'col-resize',
        position: 'absolute',
        [columnResizeDirection === 'rtl' ? 'left' : 'right']: `${leftRight}px`,
        [columnResizeDirection === 'rtl' ? 'marginLeft' : 'marginRight']:
          `${marginOffset}px`,
      }}
      className={cn('flex items-center px-1', className)}
    >
      <div
        className={cn(
          'h-6 w-0.5 rounded-sm border-2 transition-all',
          'border-border',
          'hover:border-primary active:border-primary',
          isResizing && 'border-primary',
        )}
        style={{
          touchAction: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
};
