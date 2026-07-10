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
import { cn } from '@/lib/utils';

const actionMenuItemVariants = cva(
  'items-center justify-between min-w-[120px] my-0 py-1.5',
);

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
          <button
            type="button"
            onClick={onOpenSubMenu}
            onMouseEnter={onOpenSubMenu}
            // Note: MUI IconButton size="small" has no shadcn equivalent; dropped
            className="p-0"
          >
            <ArrowRightIcon />
          </button>
        )}
      </DropdownMenuItem>
      {divider && <DropdownMenuSeparator />}
    </>
  );
};
