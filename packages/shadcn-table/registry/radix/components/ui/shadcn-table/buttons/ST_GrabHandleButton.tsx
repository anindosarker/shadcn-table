import { type DragEventHandler } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

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

export interface ST_GrabHandleButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  iconButtonProps?: ButtonProps;
  location?: 'column' | 'row';
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  table: ST_TableInstance<TData>;
}

export const ST_GrabHandleButton = <TData extends ST_RowData>({
  location,
  table,
  ...rest
}: ST_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table;

  return (
    <ST_Tooltip side="top" title={rest?.title ?? localization.move}>
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
    </ST_Tooltip>
  );
};
