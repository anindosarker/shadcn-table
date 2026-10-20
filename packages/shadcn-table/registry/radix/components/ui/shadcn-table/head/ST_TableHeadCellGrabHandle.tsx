import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type ST_Column,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { reorderColumn } from '@/components/ui/shadcn-table/utils/column.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui/shadcn-table/buttons/ST_GrabHandleButton';

export interface ST_TableHeadCellGrabHandleProps<TData extends ST_RowData>
  extends ButtonProps {
  column: ST_Column<TData>;
  table: ST_TableInstance<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

export const ST_TableHeadCellGrabHandle = <TData extends ST_RowData>({
  column,
  table,
  tableHeadCellRef,
  ...rest
}: ST_TableHeadCellGrabHandleProps<TData>) => {
  const {
    options: { enableColumnOrdering, stColumnDragHandleProps },
    setColumnOrder,
    setColumnPinning,
    setDraggingColumn,
    setHoveredColumn,
  } = table;
  const { columnDef } = column;
  const { columnOrder, draggingColumn, hoveredColumn } = table.state;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stColumnDragHandleProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.stColumnDragHandleProps, {
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
        hoveredColumn as ST_Column<TData>,
        columnOrder,
      );
      setColumnOrder(reorderedColumns);
      setColumnPinning(({ start = [], end = [] }) => ({
        start: reorderedColumns.filter((header) => start.includes(header)),
        end: reorderedColumns.filter((header) => end.includes(header)),
      }));
    }
    setDraggingColumn(null);
    setHoveredColumn(null);
  };

  return (
    <ST_GrabHandleButton
      {...iconButtonProps}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      table={table}
    />
  );
};
