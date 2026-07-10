import { type DragEventHandler, type MouseEvent } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const grabHandleButtonVariants = cva(
  'm-0 -mx-[0.1rem] h-auto w-auto cursor-grab p-[2px] transition-all duration-150 ease-in-out hover:bg-transparent hover:opacity-100 active:cursor-grabbing',
);

export interface SRT_GrabHandleButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  iconButtonProps?: ButtonProps;
  location?: 'column' | 'row';
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  table: SRT_TableInstance<TData>;
}

export const SRT_GrabHandleButton = <TData extends SRT_RowData>({
  location,
  table,
  ...rest
}: SRT_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table;

  return (
    <SRT_Tooltip side="top" title={rest?.title ?? localization.move}>
      <Button
        aria-label={rest.title ?? localization.move}
        // disableRipple  // Note: shadcn Button has no ripple effect
        draggable="true"
        size="icon"
        variant="ghost"
        {...rest}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          rest?.onClick?.(event);
        }}
        className={cn(
          grabHandleButtonVariants(),
          location === 'row' ? 'opacity-100' : 'opacity-50',
          rest?.className,
        )}
        title={undefined}
      >
        <DragHandleIcon className="h-4 w-4" />
      </Button>
    </SRT_Tooltip>
  );
};
