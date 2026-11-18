import {
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import {
  type ButtonProps,
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui-radix/shadcn-table/types';
import { applyColumnReorder } from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import { isColumnDragCancelled } from '@/components/ui-radix/shadcn-table/shared/utils/drag.utils';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_GrabHandleButton';
import { getST_ColumnFlipPositions } from '@/components/ui-radix/shadcn-table/hooks/useST_ColumnFlip';
import {
  type ST_TouchDragEvent,
  useST_TouchDrag,
} from '@/components/ui-radix/shadcn-table/hooks/useST_TouchDrag';

export interface ST_TableHeadCellGrabHandleProps<TData extends ST_RowData>
  extends ButtonProps {
  column: ST_Column<TData>;
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

/**
 * The column drag source handlers, shared by the header cell and its grip,
 * for the mouse and the touch path: the start marks the dragging column with
 * the header cell as the drag image; the end groups on a drop-zone drop,
 * reorders on any other accepted drop (handing the layout offsets to the
 * column slide first) and ignores a cancelled drag. A mouse drag reads the
 * cancel from its `dataTransfer`, a touch drag passes it.
 */
export const getST_ColumnDragHandlers = <TData extends ST_RowData>(
  column: ST_Column<TData>,
  tableHeadCellRef: RefObject<HTMLTableCellElement | null>,
) => {
  const table = column.table;

  const onDragStart = (event: DragEvent<HTMLElement> | ST_TouchDragEvent) => {
    table.setDraggingColumn(column);
    const dragImage = tableHeadCellRef.current;
    if (dragImage && 'dataTransfer' in event && event.dataTransfer) {
      try {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(dragImage, 0, 0);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onDragEnd = (
    event: DragEvent<HTMLElement> | ST_TouchDragEvent,
    cancelled = 'dataTransfer' in event && isColumnDragCancelled(event),
  ) => {
    const draggingColumn = table.atoms.draggingColumn.get();
    const hoveredColumn = table.atoms.hoveredColumn.get();
    if (hoveredColumn?.id === 'drop-zone') {
      column.toggleGrouping();
    } else if (
      table.options.enableColumnOrdering &&
      hoveredColumn &&
      hoveredColumn.id !== draggingColumn?.id &&
      !cancelled
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

  // Built per event: the handlers read the header cell ref, never in render.
  const dragHandlers = () => getST_ColumnDragHandlers(column, tableHeadCellRef);

  // The grip sits inside the draggable header cell, so its drag events stop
  // here instead of running the cell's handlers a second time.
  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    iconButtonProps?.onDragStart?.(event);
    dragHandlers().onDragStart(event);
  };

  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    iconButtonProps?.onDragEnd?.(event);
    dragHandlers().onDragEnd(event);
  };

  // A finger drags the grip at once; the app's drag handlers get the pointer
  // event of the moment.
  const touchDrag = useST_TouchDrag({
    getGhostSource: () => tableHeadCellRef.current,
    onEnd: (event, cancelled) => {
      iconButtonProps?.onDragEnd?.(
        event as unknown as DragEvent<HTMLButtonElement>,
      );
      dragHandlers().onDragEnd(event, cancelled);
    },
    onStart: (event) => {
      iconButtonProps?.onDragStart?.(
        event as unknown as DragEvent<HTMLButtonElement>,
      );
      dragHandlers().onDragStart(event);
    },
  });

  // The header cell's own touch hold must not start under the grip.
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    iconButtonProps?.onPointerDown?.(event);
    if (event.pointerType === 'touch') event.stopPropagation();
    touchDrag.onPointerDown(event);
  };

  return (
    <ST_GrabHandleButton
      {...iconButtonProps}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
    />
  );
};
