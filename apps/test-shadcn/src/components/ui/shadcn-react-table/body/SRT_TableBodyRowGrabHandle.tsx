import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';

export interface SRT_TableBodyRowGrabHandleProps<TData extends SRT_RowData>
  extends ButtonProps {
  row: SRT_Row<TData>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  table: SRT_TableInstance<TData>;
}

export const SRT_TableBodyRowGrabHandle = <TData extends SRT_RowData>({
  row,
  rowRef,
  table,
  ...rest
}: SRT_TableBodyRowGrabHandleProps<TData>) => {
  const {
    options: { srtRowDragHandleProps },
  } = table;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(srtRowDragHandleProps, {
      row,
      table,
    }),
    ...rest,
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    iconButtonProps?.onDragStart?.(event);
    try {
      event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
    table.setDraggingRow(row);
  };

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    iconButtonProps?.onDragEnd?.(event);
    table.setDraggingRow(null);
    table.setHoveredRow(null);
  };

  return (
    <SRT_GrabHandleButton
      {...iconButtonProps}
      location="row"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
    />
  );
};
