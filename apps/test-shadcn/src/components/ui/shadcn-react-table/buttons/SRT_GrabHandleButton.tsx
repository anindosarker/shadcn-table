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
        aria-label={title ?? localization.move}
        draggable="true"
        size="icon"
        variant="ghost"
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
