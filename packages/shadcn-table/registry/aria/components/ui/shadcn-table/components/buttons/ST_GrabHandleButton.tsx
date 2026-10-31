import { type DragEventHandler } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

const grabHandleButtonVariants = cva(
  'my-0 mx-[-0.1rem] cursor-grab transition-all duration-150 ease-in-out hover:bg-transparent hover:opacity-100 active:cursor-grabbing dark:hover:bg-transparent',
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

export interface ST_GrabHandleButtonProps extends ButtonProps {
  iconButtonProps?: ButtonProps;
  location?: 'column' | 'row';
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
}

export const ST_GrabHandleButton = ({
  draggable = 'true',
  location,
  onDragEnd,
  onDragStart,
  ...rest
}: ST_GrabHandleButtonProps) => {
  const table = useSTContext();
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
        size="icon-sm"
        type="button"
        variant="ghost"
        {...rest}
        onClick={(e) => {
          e.stopPropagation();
          rest?.onClick?.(e);
        }}
        className={cn(grabHandleButtonVariants({ location }), rest?.className)}
        // React Aria's Button drops drag attributes; its render prop puts
        // them on the <button>.
        render={(props) => (
          <button
            {...props}
            draggable={draggable}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        )}
      >
        <DragHandleIcon />
      </Button>
    </ST_Tooltip>
  );
};
