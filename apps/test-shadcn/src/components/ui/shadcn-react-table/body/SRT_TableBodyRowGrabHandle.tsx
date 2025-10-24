import { type DragEvent, type RefObject } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';

export interface SRT_TableBodyRowGrabHandleProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table body row grab handle - drag handle for row reordering
 *
 * Barebones implementation:
 * - Drag handle button for rows
 * - Sets dragging row state
 * - Uses row element as drag image
 *
 * TODO (Future enhancements):
 * - Add srtRowDragHandleProps support
 * - Add custom drag preview
 * - Add drop zone indicators
 * - Add drag constraints (horizontal/vertical only)
 * - Add touch support
 */

export const SRT_TableBodyRowGrabHandle = <TData extends SRT_RowData>({
  row,
  rowRef,
  table,
  className,
}: SRT_TableBodyRowGrabHandleProps<TData>) => {
  // const {
  //   options: { srtRowDragHandleProps },
  // } = table;

  // TODO: Add custom props support
  // const buttonProps = parseFromValuesOrFunc(srtRowDragHandleProps, {
  //   row,
  //   table,
  // });

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    try {
      event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table.setDraggingRow(row as any);
  };

  const handleDragEnd = () => {
    table.setDraggingRow(null);
    table.setHoveredRow(null);
  };

  return (
    <SRT_GrabHandleButton
      location="row"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
      className={className}
    />
  );
};
