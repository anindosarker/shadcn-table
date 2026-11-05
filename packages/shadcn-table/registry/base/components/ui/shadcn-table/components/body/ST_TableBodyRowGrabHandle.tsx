import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui/shadcn-table/components/buttons/ST_GrabHandleButton';
import { getST_RowFlipPositions } from '@/components/ui/shadcn-table/hooks/useST_RowFlip';

export interface ST_TableBodyRowGrabHandleProps<TData extends ST_RowData>
  extends ButtonProps {
  row: ST_Row<TData>;
  rowRef: RefObject<HTMLTableRowElement | null>;
}

export const ST_TableBodyRowGrabHandle = <TData extends ST_RowData>({
  row,
  rowRef,
  ...rest
}: ST_TableBodyRowGrabHandleProps<TData>) => {
  const table = row.table;
  const {
    stRowDragHandleProps,
  }: Pick<ST_TableOptions<TData>, 'stRowDragHandleProps'> = table.options;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stRowDragHandleProps, {
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
    // A drop on a row: measured before the consumer's handler reorders the
    // data, so the rows can slide from where they sat.
    if (table.atoms.hoveredRow.get()) {
      table.setRowFlipPending({
        movedRow: row.original,
        positions: getST_RowFlipPositions(table),
      });
    }
    iconButtonProps?.onDragEnd?.(event);
    table.setDraggingRow(null);
    table.setHoveredRow(null);
    // A drop that left the order as it was hands over nothing.
    setTimeout(() => {
      if (table.atoms.rowFlipPending.get()) table.setRowFlipPending(null);
    });
  };

  return (
    <ST_GrabHandleButton
      {...iconButtonProps}
      location="row"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    />
  );
};
