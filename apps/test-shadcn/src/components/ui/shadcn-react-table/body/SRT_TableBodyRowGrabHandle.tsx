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

export const SRT_TableBodyRowGrabHandle = <TData extends SRT_RowData>({
  row,
  rowRef,
  table,
  className,
}: SRT_TableBodyRowGrabHandleProps<TData>) => {
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
