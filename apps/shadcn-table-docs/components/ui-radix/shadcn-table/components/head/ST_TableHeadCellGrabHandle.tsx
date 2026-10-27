import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type ST_Column,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-radix/shadcn-table/types';
import { reorderColumn } from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_GrabHandleButton';

export interface ST_TableHeadCellGrabHandleProps<TData extends ST_RowData>
  extends ButtonProps {
  column: ST_Column<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

export const ST_TableHeadCellGrabHandle = <TData extends ST_RowData>({
  column,
  tableHeadCellRef,
  ...rest
}: ST_TableHeadCellGrabHandleProps<TData>) => {
  // The core table behind the column; the ST wrapper types re-type its
  // getters, so TypeScript cannot relate the two without the cast.
  const table = column.table as unknown as ST_TableInstance<TData>;
  const {
    options: { enableColumnOrdering, stColumnDragHandleProps },
    setColumnOrder,
    setColumnPinning,
    setDraggingColumn,
    setHoveredColumn,
  } = table;
  const { columnDef } = column;

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
    const draggingColumn = table.atoms.draggingColumn.get();
    const hoveredColumn = table.atoms.hoveredColumn.get();
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
        table.atoms.columnOrder.get(),
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
    />
  );
};
