import { type DragEvent, type RefObject } from 'react';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
  reorderColumn,
} from 'shadcn-react-table-core';
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton';

export interface SRT_TableHeadCellGrabHandleProps<TData extends SRT_RowData> {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
  className?: string;
}

export const SRT_TableHeadCellGrabHandle = <TData extends SRT_RowData>({
  column,
  table,
  tableHeadCellRef,
  className,
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

  const tableDragHandleProps = parseSRT_HtmlProps(srtColumnDragHandleProps, {
    column,
    table,
  });
  const columnDragHandleProps = parseSRT_HtmlProps(
    columnDef.srtColumnDragHandleProps,
    { column, table },
  );
  const userDragHandleProps = mergeSRT_HtmlProps(
    tableDragHandleProps,
    columnDragHandleProps,
  );

  const baseDragHandleProps = {
    className,
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
  };
  const mergedDragHandleProps = mergeSRT_HtmlProps(
    baseDragHandleProps,
    userDragHandleProps,
  );

  return (
    <SRT_GrabHandleButton
      location="column"
      table={table}
      {...mergedDragHandleProps}
    />
  );
};
