import { type ComponentPropsWithRef, type ReactNode } from 'react';
import {
  Popover as ShadcnPopover,
  PopoverAnchor as ShadcnPopoverAnchor,
  PopoverContent as ShadcnPopoverContent,
} from '@/components/ui/popover';

export type PopoverAlign = 'start' | 'center' | 'end';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export interface PopoverProps {
  /** Element the content positions against, in place of a trigger. */
  anchor?: Element | null;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export const Popover = ({ anchor, children, ...rest }: PopoverProps) => (
  <ShadcnPopover {...rest}>
    {anchor && <ShadcnPopoverAnchor virtualRef={{ current: anchor }} />}
    {children}
  </ShadcnPopover>
);

export interface PopoverContentProps extends ComponentPropsWithRef<'div'> {
  align?: PopoverAlign;
  side?: PopoverSide;
  sideOffset?: number;
}

export const PopoverContent = (props: PopoverContentProps) => (
  <ShadcnPopoverContent {...props} />
);
