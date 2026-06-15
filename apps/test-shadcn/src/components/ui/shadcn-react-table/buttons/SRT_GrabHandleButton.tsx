import type { ComponentProps, MouseEvent } from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_GrabHandleButtonProps<TData extends SRT_RowData>
  extends Omit<ComponentProps<'button'>, 'color' | 'size'> {
  location?: 'row' | 'column';
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Grab handle button for drag and drop functionality.
 *
 * Ported 1:1 from MRT_GrabHandleButton:
 * - Draggable grip icon button with a `move` tooltip.
 * - Icon comes from the icon registry (`table.options.icons.DragHandleIcon`).
 * - Row handles render at full opacity; column handles at 0.5 (raised to 1 on
 *   hover), matching MRT's `opacity` rule.
 * - `onClick` stops propagation, then the caller's `onClick` runs.
 * - Extra DOM props (from `srt*DragHandleProps`) are spread last; `className`
 *   composes over the defaults via `cn()`.
 */

export const SRT_GrabHandleButton = <TData extends SRT_RowData>({
  location = 'row',
  table,
  className,
  onClick,
  title,
  ...rest
}: SRT_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table;

  return (
    <SRT_Tooltip title={title ?? localization.move} side="top">
      <Button
        aria-label={localization.move}
        variant="ghost"
        size="icon"
        draggable="true"
        {...rest}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        className={cn(
          'h-8 w-8 cursor-grab transition-opacity active:cursor-grabbing',
          'hover:bg-transparent hover:opacity-100',
          location === 'row' ? 'opacity-100' : 'opacity-50',
          className,
        )}
      >
        <DragHandleIcon className="h-4 w-4" />
      </Button>
    </SRT_Tooltip>
  );
};
