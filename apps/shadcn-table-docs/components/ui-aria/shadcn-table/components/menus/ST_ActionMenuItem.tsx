import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { DropdownMenuItem } from '@/components/ui-aria/dropdown-menu';
import { Button } from '@/components/ui-aria/button';
import { cn } from '@/lib/utils';
import { type ST_RowData } from '@/components/ui-aria/shadcn-table/types';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';

const actionMenuItemVariants = cva('items-center justify-between my-0');

export interface ST_ActionMenuItemProps
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  divider?: boolean;
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: ComponentProps<typeof Button>['onClick'];
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
      textValue={label}
      {...rest}
      className={cn(
        actionMenuItemVariants(),
        divider && 'border-b bg-clip-padding',
        className,
      )}
    >
      {({ hasSubmenu }) => (
        <>
          <div className="flex items-center whitespace-nowrap">
            <span className="inline-flex min-w-9 shrink-0">{icon}</span>
            {label}
          </div>
          {onOpenSubMenu ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onOpenSubMenu}
              onMouseEnter={onOpenSubMenu}
            >
              <ArrowRightIcon />
            </Button>
          ) : (
            // Inside a DropdownMenuSub the whole item opens the submenu, so
            // the arrow is a marker, not a button that would swallow the press.
            hasSubmenu && (
              <span className="inline-flex size-6 items-center justify-center">
                <ArrowRightIcon className="size-3" />
              </span>
            )
          )}
        </>
      )}
    </DropdownMenuItem>
  );
};
