import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { reorderColumn } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui/shadcn-table/components/buttons/ST_GrabHandleButton';

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
  const table = column.table;
  const {
    options: { enableColumnOrdering },
    setColumnOrder,
    setColumnPinning,
    setDraggingColumn,
    setHoveredColumn,
  } = table;
  // table.options and the column def hold the part props tree-neutral
  // (ST_NeutralPartPropTypes); the options as written (ST_TableOptions,
  // ST_ColumnDef) type them for this tree's Button.
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
