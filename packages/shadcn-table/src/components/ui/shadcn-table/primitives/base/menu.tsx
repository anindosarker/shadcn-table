// Base-neutral dropdown menu API over the installed shadcn dropdown-menu part.
// Library code imports this module, never `@/components/ui/dropdown-menu`, so
// the Radix and Base UI builds differ only here. Base UI implementation.
import {
  type ComponentPropsWithRef,
  createContext,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useContext,
  useRef,
  useState,
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

/**
 * The popup's `finalFocus` runs the content's `onClose` when the menu
 * closes. The content keeps the callback from its last open render, so a
 * handler that closed over the anchor element still has it after the caller
 * cleared the anchor on close (the same timing Radix's onCloseAutoFocus has).
 */
interface MenuCloseContextValue {
  onCloseRef: RefObject<(() => void) | undefined>;
  open: boolean;
}

const MenuCloseContext = createContext<MenuCloseContextValue | null>(null);

export interface MenuProps {
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export const Menu = ({ children, onOpenChange, open }: MenuProps) => {
  const onCloseRef = useRef<(() => void) | undefined>(undefined);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;
  return (
    <MenuCloseContext.Provider value={{ onCloseRef, open: isOpen }}>
      <DropdownMenu
        open={open}
        onOpenChange={(next) => {
          setUncontrolledOpen(next);
          onOpenChange?.(next);
        }}
      >
        {children}
      </DropdownMenu>
    </MenuCloseContext.Provider>
  );
};

export interface MenuTriggerProps {
  /** The element that becomes the trigger (no wrapper is rendered). */
  children: ReactElement;
}

export const MenuTrigger = ({ children }: MenuTriggerProps) => (
  <DropdownMenuTrigger
    render={children}
    // The library anchors its menus to an invisible span, not a button.
    nativeButton={
      typeof children.type === 'string' ? children.type === 'button' : undefined
    }
  />
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

export const MenuContent = ({ onClose, ...rest }: MenuContentProps) => {
  const close = useContext(MenuCloseContext);
  if (close?.open) close.onCloseRef.current = onClose;
  return (
    <DropdownMenuContent
      finalFocus={
        onClose &&
        (() => {
          close?.onCloseRef.current?.();
          // The handler placed focus; keep Base UI off the trigger.
          return false;
        })
      }
      {...rest}
    />
  );
};

export interface MenuItemProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  /** Whether choosing the item closes the menu (default true). */
  closeOnSelect?: boolean;
  disabled?: boolean;
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

export const MenuItem = ({ closeOnSelect, ...rest }: MenuItemProps) => (
  // Explicit on every item: Base UI's checkbox and radio items default to
  // staying open, plain items to closing; the library expects Radix's
  // close-on-select everywhere unless it opts out.
  <DropdownMenuItem closeOnClick={closeOnSelect !== false} {...rest} />
);

export type MenuSeparatorProps = ComponentPropsWithRef<'div'>;

export const MenuSeparator = (props: MenuSeparatorProps) => (
  <DropdownMenuSeparator {...props} />
);
