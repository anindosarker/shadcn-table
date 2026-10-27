import { type ComponentPropsWithRef, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';

// min-w-[120px] py-1.5
// Note: DropdownMenuItem defaults govern padding; Content governs width.
const actionMenuItemVariants = cva('items-center justify-between my-0');

export interface ST_ActionMenuItemProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  divider?: boolean;
  icon: ReactNode;
  label: string;
  onOpenSubMenu?:
    | ComponentPropsWithRef<typeof DropdownMenuItem>['onClick']
    | ComponentPropsWithRef<typeof DropdownMenuItem>['onMouseEnter'];
  table: ST_TableInstance<TData>;
}

export const ST_ActionMenuItem = <TData extends ST_RowData>({
  className,
  divider,
  icon,
  label,
  onOpenSubMenu,
  table,
  ...rest
}: ST_ActionMenuItemProps<TData>) => {
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  return (
    <DropdownMenuItem
      tabIndex={0}
      // Base UI closes the menu on a plain item's click by default but keeps
      // it open for checkbox and radio items; explicit so every library item
      // closes unless the caller opts out.
      closeOnClick
      {...rest}
      className={cn(
        actionMenuItemVariants(),
        divider && 'border-b bg-clip-padding',
        className,
      )}
    >
      <div className="flex items-center whitespace-nowrap">
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
