import {
  type ComponentPropsWithRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Note: dropped MUI sx min-w-[120px] (sizing — DropdownMenuContent governs
// width) and py-1.5 (padding — DropdownMenuItem default padding wins). Kept the
// flex layout (justify-between pins the submenu arrow to the end) + my-0 margin.
const actionMenuItemVariants = cva('items-center justify-between my-0');

export interface SRT_ActionMenuItemProps<TData extends SRT_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuItem> {
  // Note: mirrors MUI MenuItemProps.divider — renders a trailing separator
  divider?: boolean;
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: MouseEventHandler<HTMLButtonElement>;
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
    <>
      <DropdownMenuItem
        tabIndex={0}
        {...rest}
        className={cn(actionMenuItemVariants(), className)}
      >
        <div className="flex items-center">
          {/* Note: MUI ListItemIcon defaults to ~36px min-width inside a MenuItem; mapped visually to a fixed-width slot */}
          <span className="mr-2 inline-flex w-6 items-center">{icon}</span>
          {label}
        </div>
        {onOpenSubMenu && (
          // Note: MUI IconButton size="small" p:0 → Button ghost/icon; the tight
          // p:0 sizing drops, shadcn size="icon" (size-9) default wins.
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onOpenSubMenu}
            onMouseEnter={onOpenSubMenu}
          >
            <ArrowRightIcon />
          </Button>
        )}
      </DropdownMenuItem>
      {divider && <DropdownMenuSeparator />}
    </>
  );
};
