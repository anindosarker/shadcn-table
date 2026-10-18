// Base-neutral popover API over the installed shadcn popover part. Library
// code imports this module, never `@/components/ui/popover`, so the Radix and
// Base UI builds differ only here. Base UI implementation.
import {
  type ComponentPropsWithRef,
  createContext,
  type ReactNode,
  useContext,
} from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { Popover as ShadcnPopover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type PopoverAlign = 'start' | 'center' | 'end';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

const PopoverAnchorContext = createContext<Element | null>(null);

export interface PopoverProps {
  /** Element the content positions against, in place of a trigger. */
  anchor?: Element | null;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export const Popover = ({
  anchor,
  children,
  onOpenChange,
  open,
}: PopoverProps) => (
  <PopoverAnchorContext.Provider value={anchor ?? null}>
    <ShadcnPopover
      open={open}
      onOpenChange={onOpenChange && ((next) => onOpenChange(next))}
    >
      {children}
    </ShadcnPopover>
  </PopoverAnchorContext.Provider>
);

export interface PopoverContentProps extends ComponentPropsWithRef<'div'> {
  align?: PopoverAlign;
  side?: PopoverSide;
  sideOffset?: number;
}

export const PopoverContent = ({
  align = 'center',
  className,
  side = 'bottom',
  sideOffset = 4,
  ...rest
}: PopoverContentProps) => {
  const anchor = useContext(PopoverAnchorContext);
  return (
    // The installed PopoverContent owns its Positioner and takes no anchor,
    // so this renders the same parts and classes with the anchor set.
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        anchor={anchor ?? undefined}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...rest}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
};
