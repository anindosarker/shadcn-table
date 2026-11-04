import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';

export interface ST_TableHeadCellLockedOverlayProps<TData extends ST_RowData>
  extends ComponentProps<'span'> {
  column: ST_Column<TData>;
  /** A column drag is active somewhere in the table. */
  dragActive: boolean;
}

/**
 * The header of a column that takes no drop, while another column drags:
 * stripes over an opaque muted fill, a lock and "Fixed" (the lock alone on
 * display columns). Rendered last in the cell, so it paints over the label.
 */
export const ST_TableHeadCellLockedOverlay = <TData extends ST_RowData>({
  className,
  column,
  dragActive,
  ...rest
}: ST_TableHeadCellLockedOverlayProps<TData>) => {
  const {
    options: {
      icons: { LockIcon },
      localization,
    },
  } = column.table;

  return (
    <span
      aria-hidden
      {...rest}
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center gap-1 bg-[color-mix(in_srgb,var(--muted)_60%,var(--background))] bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--muted-foreground)_12%,transparent)_0_6px,transparent_6px_12px)] text-xs font-normal text-muted-foreground transition-opacity duration-150',
        dragActive ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <LockIcon className="size-3" />
      {column.columnDef.columnDefType === 'display' ? null : localization.fixed}
    </span>
  );
};
