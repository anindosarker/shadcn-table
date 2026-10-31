import {
  type ComponentPropsWithRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type ST_RowData } from '@/components/ui/shadcn-table/types';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

const actionMenuItemVariants = cva('items-center justify-between my-0');

export interface ST_ActionMenuItemProps
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  divider?: boolean;
  icon: ReactNode;
  label: string;
  /**
   * When set, the item shows a submenu arrow. Not called: a submenu opens
   * through `DropdownMenuSub`.
   */
  onOpenSubMenu?: MouseEventHandler<HTMLElement>;
}

export const ST_ActionMenuItem = <TData extends ST_RowData>({
  className,
  divider,
  icon,
  label,
  onOpenSubMenu,
  ...rest
}: ST_ActionMenuItemProps) => {
  const table = useSTContext<TData>();
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  return (
    <DropdownMenuItem
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
      {onOpenSubMenu && <ArrowRightIcon aria-hidden />}
    </DropdownMenuItem>
  );
};
