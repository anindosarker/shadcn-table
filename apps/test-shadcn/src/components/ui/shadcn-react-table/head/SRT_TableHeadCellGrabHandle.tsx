import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
  reorderColumn,
} from 'shadcn-react-table-core';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';

export interface SRT_TableHeadCellGrabHandleProps<TData extends SRT_RowData>
  extends ButtonProps {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

export const SRT_TableHeadCellGrabHandle = <TData extends SRT_RowData>({
  column,
  table,
  tableHeadCellRef,
  ...rest
}: SRT_TableHeadCellGrabHandleProps<TData>) => {
  const {
    getState,
    options: { enableColumnOrdering, srtColumnDragHandleProps },
    setColumnOrder,
    setColumnPinning,
    setDraggingColumn,
    setHoveredColumn,
  } = table;
  const { columnDef } = column;
  const { columnOrder, draggingColumn, hoveredColumn } = getState();

  const iconButtonProps = {
    ...parseFromValuesOrFunc(srtColumnDragHandleProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.srtColumnDragHandleProps, {
      column,
      table,
    }),
    ...rest,
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    iconButtonProps?.onDragStart?.(event);
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

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    iconButtonProps?.onDragEnd?.(event);
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn?.id !== draggingColumn?.id
    ) {
      const reorderedColumns = reorderColumn(
        column,
        hoveredColumn as SRT_Column<TData>,
        columnOrder,
      );
      setColumnOrder(reorderedColumns);
      setColumnPinning(({ left = [], right = [] }) => ({
        left: reorderedColumns.filter((header) => left.includes(header)),
        right: reorderedColumns.filter((header) => right.includes(header)),
      }));
    }
    setDraggingColumn(null);
    setHoveredColumn(null);
  };

  return (
    <SRT_GrabHandleButton
      {...iconButtonProps}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
    />
  );
};
