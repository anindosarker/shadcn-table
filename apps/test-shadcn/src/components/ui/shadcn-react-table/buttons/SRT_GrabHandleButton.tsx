import { type DragEventHandler } from 'react';
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
  'my-0 -mx-[0.1rem] cursor-grab active:cursor-grabbing',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        variant="ghost"
        {...rest}
        onClick={(e) => {
          e.stopPropagation();
          rest?.onClick?.(e);
        }}
        // sx={{ p: '2px', opacity: location === 'row' ? 1 : 0.5, transition: 'all 150ms ease-in-out', '&:hover': { backgroundColor: 'transparent', opacity: 1 } }}
        // Note: dropped per sweep ruling — size="icon-sm" + full opacity.
        className={cn(grabHandleButtonVariants(), rest?.className)}
        title={undefined}
      >
        <DragHandleIcon />
      </Button>
    </SRT_Tooltip>
  );
};
