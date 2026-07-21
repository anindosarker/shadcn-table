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

// Note: dropped MUI sx style overrides — h-auto/w-auto (size; size="icon-sm"/size-8
// wins), p-[2px] (padding), transition-all (paired with the dropped opacity),
// hover:bg-transparent (color), hover:opacity-100 + the location opacity-50/100
// dim (opacity). The grab handle now renders at full opacity per the sweep ruling.
// Kept: my-0 -mx-[0.1rem] (layout, MUI m:'0 -0.1rem') and the grab cursor.
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
  // Note: destructured only to keep it out of the ...rest spread onto the shadcn
  // Button (would warn as an unknown DOM attr). Its former use — location-based
  // opacity dim — was dropped in the sweep, so the binding is now unused.
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
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          rest?.onClick?.(event);
        }}
        className={cn(grabHandleButtonVariants(), rest?.className)}
        title={undefined}
      >
        <DragHandleIcon />
      </Button>
    </SRT_Tooltip>
  );
};
