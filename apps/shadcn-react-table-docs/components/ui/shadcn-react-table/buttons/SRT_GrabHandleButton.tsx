import { type DragEventHandler } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { SRT_Tooltip } from '../SRT_Tooltip';

const grabHandleButtonVariants = cva(
  'my-0 -mx-[0.1rem] cursor-grab transition-all duration-150 ease-in-out hover:bg-transparent hover:opacity-100 active:cursor-grabbing dark:hover:bg-transparent',
  {
    variants: {
      location: {
        column: 'opacity-50',
        row: 'opacity-100',
      },
    },
    defaultVariants: {
      location: 'column',
    },
  },
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
        size="icon-sm"
        type="button"
        variant="ghost"
        {...rest}
        onClick={(e) => {
          e.stopPropagation();
          rest?.onClick?.(e);
        }}
        className={cn(grabHandleButtonVariants({ location }), rest?.className)}
        title={undefined}
      >
        <DragHandleIcon />
      </Button>
    </SRT_Tooltip>
  );
};
