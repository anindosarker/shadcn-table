import { type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface SRT_ActionMenuItemProps<TData extends SRT_RowData>
  extends Omit<ComponentProps<typeof DropdownMenuItem>, 'onSelect'> {
  divider?: boolean;
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: (event: MouseEvent<HTMLElement>) => void;
  selected?: boolean;
  table: SRT_TableInstance<TData>;
  value?: string;
}

/**
 * Action menu item - shared dropdown menu item with icon + label + optional
 * submenu arrow and trailing divider. Port of MRT_ActionMenuItem.
 *
 * MUI MenuItem -> shadcn DropdownMenuItem.
 * - `icon` rendered before the label.
 * - `onOpenSubMenu` renders a trailing arrow that opens a submenu.
 * - `divider` renders a DropdownMenuSeparator after the item.
 * - `selected` highlights the item (filter-mode menu uses this).
 */
export const SRT_ActionMenuItem = <TData extends SRT_RowData>({
  className,
  divider,
  icon,
  label,
  onOpenSubMenu,
  selected,
  table: _table,
  value,
  onClick,
  ...rest
}: SRT_ActionMenuItemProps<TData>) => {
  return (
    <>
      <DropdownMenuItem
        data-value={value}
        // Radix closes the menu on select by default (matching MUI's
        // close-on-click). When this item only opens a submenu, keep the parent
        // menu open so the submenu isn't immediately unmounted.
        onSelect={(event) => {
          if (onOpenSubMenu) event.preventDefault();
        }}
        onClick={onClick}
        className={cn(
          'flex min-w-[120px] items-center justify-between gap-2 py-1.5',
          selected && 'bg-accent text-accent-foreground',
          className,
        )}
        {...rest}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
            {icon}
          </span>
          {label}
        </div>
        {onOpenSubMenu && (
          <button
            type="button"
            onClick={onOpenSubMenu}
            onMouseEnter={onOpenSubMenu}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm p-0 hover:bg-accent"
            tabIndex={-1}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
      </DropdownMenuItem>
      {divider && <DropdownMenuSeparator />}
    </>
  );
};
