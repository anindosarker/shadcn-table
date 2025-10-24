import { type DragEvent, type RefObject } from 'react';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';

export interface SRT_TableHeadCellGrabHandleProps<TData extends SRT_RowData> {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
  className?: string;
}

/**
 * Column grab handle - drag handle for column reordering
 *
 * Barebones implementation:
 * - Drag handle for columns
 * - Reorders columns on drop
 * - Updates column pinning after reorder
 * - Supports column grouping drop zone
 *
 * TODO (Future enhancements):
 * - Add srtColumnDragHandleProps support
 * - Add drag preview
 * - Add drop indicators
 * - Add keyboard accessibility
 * - Add animation
 */

export const SRT_TableHeadCellGrabHandle = <TData extends SRT_RowData>({
  column,
  table,
  tableHeadCellRef,
  className,
}: SRT_TableHeadCellGrabHandleProps<TData>) => {
  const {
    getState,
    options: { enableColumnOrdering },
    // setColumnOrder,
    // setColumnPinning,
    setDraggingColumn,
    setHoveredColumn,
  } = table;
  const { /* columnOrder, */ draggingColumn, hoveredColumn } = getState();

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    setDraggingColumn(column);
    try {
      event.dataTransfer.setDragImage(
        tableHeadCellRef.current as HTMLElement,
        0,
        0,
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = () => {
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn?.id !== draggingColumn?.id
    ) {
      // TODO: Import reorderColumn utility from core package
      // const reorderedColumns = reorderColumn(
      //   column,
      //   hoveredColumn as SRT_Column<TData>,
      //   columnOrder,
      // );
      // setColumnOrder(reorderedColumns);
      // setColumnPinning(({ left = [], right = [] }) => ({
      //   left: reorderedColumns.filter((header) => left.includes(header)),
      //   right: reorderedColumns.filter((header) => right.includes(header)),
      // }));
    }
    setDraggingColumn(null);
    setHoveredColumn(null);
  };

  return (
    <SRT_GrabHandleButton
      location="column"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
      className={className}
    />
  );
};
