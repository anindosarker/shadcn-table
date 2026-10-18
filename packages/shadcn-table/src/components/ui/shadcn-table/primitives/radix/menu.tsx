// Base-neutral dropdown menu API over the installed shadcn dropdown-menu part.
// Library code imports this module, never `@/components/ui/dropdown-menu`, so
// the Radix and Base UI builds differ only here. Radix implementation.
import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type MenuAlign = 'start' | 'center' | 'end';

export type MenuSide = 'top' | 'right' | 'bottom' | 'left';

export interface MenuProps {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export const Menu = ({ children, onOpenChange, open }: MenuProps) => (
  <DropdownMenu open={open} onOpenChange={onOpenChange}>
    {children}
  </DropdownMenu>
);

export interface MenuTriggerProps {
  /** The element that becomes the trigger (no wrapper is rendered). */
  children: ReactElement;
}

export const MenuTrigger = ({ children }: MenuTriggerProps) => (
  <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
);

export interface MenuContentProps extends ComponentPropsWithRef<'div'> {
  align?: MenuAlign;
  alignOffset?: number;
  /**
   * Runs when the menu closes, in place of the default focus return to the
   * trigger. The library's menus anchor to an invisible trigger and move
   * focus back to the real anchor element here.
   */
  onClose?: () => void;
  side?: MenuSide;
  sideOffset?: number;
}

export const MenuContent = ({ onClose, ...rest }: MenuContentProps) => (
  <DropdownMenuContent
    onCloseAutoFocus={
      onClose &&
      ((event) => {
        event.preventDefault();
        onClose();
      })
    }
    {...rest}
  />
);

export interface MenuItemProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  /** Whether choosing the item closes the menu (default true). */
  closeOnSelect?: boolean;
  disabled?: boolean;
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

export const MenuItem = ({ closeOnSelect, ...rest }: MenuItemProps) => (
  <DropdownMenuItem
    onSelect={
      closeOnSelect === false ? (event) => event.preventDefault() : undefined
    }
    {...rest}
  />
);

export type MenuSeparatorProps = ComponentPropsWithRef<'div'>;

export const MenuSeparator = (props: MenuSeparatorProps) => (
  <DropdownMenuSeparator {...props} />
);
