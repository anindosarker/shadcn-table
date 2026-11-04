import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui-aria/shadcn-table/types';
import { applyColumnReorder } from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import { isColumnDragCancelled } from '@/components/ui-aria/shadcn-table/shared/utils/drag.utils';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui-aria/shadcn-table/components/buttons/ST_GrabHandleButton';
import { getST_ColumnFlipPositions } from '@/components/ui-aria/shadcn-table/hooks/useST_ColumnFlip';

export interface ST_TableHeadCellGrabHandleProps<TData extends ST_RowData>
  extends ButtonProps {
  column: ST_Column<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

/**
 * The column drag source handlers, shared by the header cell and its grip:
 * the start marks the dragging column with the header cell as the drag image;
 * the end groups on a drop-zone drop, reorders on any other accepted drop
 * (handing the layout offsets to the column slide first) and ignores a
 * cancelled drag.
 */
export const getST_ColumnDragHandlers = <TData extends ST_RowData>(
  column: ST_Column<TData>,
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>,
) => {
  const table = column.table;

  const onDragStart = (event: DragEvent<HTMLElement>) => {
    table.setDraggingColumn(column);
    const dragImage = tableHeadCellRef.current;
    if (dragImage && event.dataTransfer) {
      try {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(dragImage, 0, 0);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onDragEnd = (event: DragEvent<HTMLElement>) => {
    const draggingColumn = table.atoms.draggingColumn.get();
    const hoveredColumn = table.atoms.hoveredColumn.get();
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      table.options.enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn.id !== draggingColumn?.id &&
      !isColumnDragCancelled(event)
    ) {
      table.setColumnFlipPending({
        dragDrop: true,
        movedId: column.id,
        positions: getST_ColumnFlipPositions(table),
      });
      applyColumnReorder(column, hoveredColumn as ST_Column<TData>, table);
    }
    table.setDraggingColumn(null);
    table.setHoveredColumn(null);
  };

  return { onDragEnd, onDragStart };
};

export const ST_TableHeadCellGrabHandle = <TData extends ST_RowData>({
  column,
  tableHeadCellRef,
  ...rest
}: ST_TableHeadCellGrabHandleProps<TData>) => {
  const table = column.table;
  const {
    stColumnDragHandleProps,
  }: Pick<ST_TableOptions<TData>, 'stColumnDragHandleProps'> = table.options;
  const { columnDef } = column;
  const {
    stColumnDragHandleProps: columnColumnDragHandleProps,
  }: Pick<ST_ColumnDef<TData>, 'stColumnDragHandleProps'> = columnDef;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stColumnDragHandleProps, { column, table }),
    ...parseFromValuesOrFunc(columnColumnDragHandleProps, {
      column,
      table,
    }),
    ...rest,
  };

  const { onDragEnd, onDragStart } = getST_ColumnDragHandlers(
    column,
    tableHeadCellRef,
  );

  // The grip sits inside the draggable header cell, so its drag events stop
  // here instead of running the cell's handlers a second time.
  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    iconButtonProps?.onDragStart?.(event);
    onDragStart(event);
  };

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    iconButtonProps?.onDragEnd?.(event);
    onDragEnd(event);
  };

  return (
    <ST_GrabHandleButton
      {...iconButtonProps}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    />
  );
};
