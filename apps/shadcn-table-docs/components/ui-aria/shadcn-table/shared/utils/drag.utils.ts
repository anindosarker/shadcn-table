import { type DragEvent } from 'react';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';

/** Marks every head and body cell of a column for the column slide. */
export const ST_FLIP_COLUMN_ATTR = 'data-flip-column';
/** Set on the table while a column slide runs. */
export const ST_FLIP_SLIDING_ATTR = 'data-flip-sliding';
/** Marks an element the column slide moves as one layer. */
export const ST_FLIP_LAYER_ATTR = 'data-flip-layer';
/** Marks the header's column menu button, the filter editor's focus return. */
export const ST_COLUMN_ACTIONS_ATTR = 'data-st-column-actions';

/** Whether a dragged column may land on `column`. */
const getIsColumnDroppable = <TData extends ST_RowData>(
  column: ST_Column<TData>,
) =>
  column.table.options.enableColumnOrdering !== false &&
  column.columnDef.enableColumnOrdering !== false;

/**
 * The drag handlers that make an element a drop target for column dragging:
 * entering marks the column as hovered, or clears the hover over a locked
 * column, and every dragover is accepted with `dropEffect` `move` or `none`,
 * so a drop over a locked column reads as cancelled.
 */
export const getST_ColumnDropTargetProps = <TData extends ST_RowData>(
  column: ST_Column<TData>,
) => ({
  onDragEnter: () => {
    if (!column.table.atoms.draggingColumn.get()) return;
    column.table.setHoveredColumn(getIsColumnDroppable(column) ? column : null);
  },
  onDragOver: (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = getIsColumnDroppable(column)
        ? 'move'
        : 'none';
    }
  },
});

/**
 * True when a column drag ended without a drop: Escape, or a drop outside
 * every drop target. A drag event without a `dataTransfer` counts as dropped.
 */
export const isColumnDragCancelled = (event: {
  dataTransfer: DataTransfer | null;
}): boolean => !!event.dataTransfer && event.dataTransfer.dropEffect === 'none';

const lockedOverlayClassName =
  "relative after:pointer-events-none after:absolute after:inset-0 after:bg-muted/60 after:bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--muted-foreground)_12%,transparent)_0_6px,transparent_6px_12px)] after:transition-opacity after:duration-200 after:content-['']";

/** The stripes a locked body cell shows while another column drags. */
export const lockedCellClassName = (dragActive: boolean) =>
  cn(
    lockedOverlayClassName,
    dragActive ? 'after:opacity-100' : 'after:opacity-0',
  );

/** The stripes a locked header cell shows while another column drags. */
export const lockedHeaderClassName = (dragActive: boolean) =>
  cn(
    lockedOverlayClassName,
    dragActive ? 'cursor-not-allowed after:opacity-100' : 'after:opacity-0',
  );
