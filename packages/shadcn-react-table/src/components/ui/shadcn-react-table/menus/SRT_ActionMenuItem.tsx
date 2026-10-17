import { type ComponentPropsWithRef, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type SRT_RowData, type SRT_TableInstance } from '../types';

// min-w-[120px] py-1.5
// Note: DropdownMenuItem defaults govern padding; Content governs width.
const actionMenuItemVariants = cva('items-center justify-between my-0');

export interface SRT_ActionMenuItemProps<TData extends SRT_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  divider?: boolean;
  icon: ReactNode;
  label: string;
  onOpenSubMenu?:
    | ComponentPropsWithRef<typeof DropdownMenuItem>['onClick']
    | ComponentPropsWithRef<typeof DropdownMenuItem>['onMouseEnter'];
  table: SRT_TableInstance<TData>;
}

export const SRT_ActionMenuItem = <TData extends SRT_RowData>({
  className,
  divider,
  icon,
  label,
  onOpenSubMenu,
  table,
  ...rest
}: SRT_ActionMenuItemProps<TData>) => {
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  return (
    <DropdownMenuItem
      tabIndex={0}
      {...rest}
      className={cn(
        actionMenuItemVariants(),
        divider && 'border-b bg-clip-padding',
        className,
      )}
    >
      <div className="flex items-center">
        <span className="inline-flex min-w-9 shrink-0">{icon}</span>
        {label}
      </div>
      {onOpenSubMenu && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={onOpenSubMenu as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseEnter={onOpenSubMenu as any}
        >
          <ArrowRightIcon />
        </Button>
      )}
    </DropdownMenuItem>
  );
};
