import { type DragEvent, type RefObject } from 'react';
import {
  type ButtonProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_GrabHandleButton } from '@/components/ui/shadcn-table/components/buttons/ST_GrabHandleButton';

export interface ST_TableBodyRowGrabHandleProps<TData extends ST_RowData>
  extends ButtonProps {
  row: ST_Row<TData>;
  rowRef: RefObject<HTMLTableRowElement | null>;
  /**
   * Transition, part 01 phase 03: ignored, the table comes from `row`. The
   * display column outside this cluster still passes it; the integration
   * step removes it.
   */
  table?: unknown;
}

export const ST_TableBodyRowGrabHandle = <TData extends ST_RowData>({
  row,
  rowRef,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition prop, kept off the button
  table: _table,
  ...rest
}: ST_TableBodyRowGrabHandleProps<TData>) => {
  // The row carries the core table; the ST wrapper types re-type its getters.
  const table = row.table as unknown as ST_TableInstance<TData>;
  const {
    options: { stRowDragHandleProps },
  } = table;

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
    iconButtonProps?.onDragEnd?.(event);
    table.setDraggingRow(null);
    table.setHoveredRow(null);
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
