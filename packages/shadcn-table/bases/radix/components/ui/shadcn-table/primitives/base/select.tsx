// Base-neutral select API over the installed shadcn select part. Library code
// imports this module, never `@/components/ui/select`, so the Radix and Base
// UI builds differ only here. Base UI implementation.
import { type ComponentPropsWithRef, type ReactNode } from 'react';
import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from '@/components/ui/select';

export interface SelectRootProps {
  children: ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  /** Base UI can report `null` (no selection); Radix never does. */
  onValueChange?: (value: string | null) => void;
  value?: string;
}

export const Select = ({
  onOpenChange,
  onValueChange,
  value,
  ...rest
}: SelectRootProps) => (
  <ShadcnSelect
    {...rest}
    // Radix shows the placeholder for ""; Base UI only for null.
    value={value === '' ? null : value}
    onOpenChange={onOpenChange && ((open) => onOpenChange(open))}
    onValueChange={
      onValueChange && ((next) => onValueChange(next as string | null))
    }
  />
);

export interface SelectTriggerProps extends ComponentPropsWithRef<'button'> {
  size?: 'sm' | 'default';
}

export const SelectTrigger = (props: SelectTriggerProps) => (
  <ShadcnSelectTrigger {...props} />
);

export interface SelectValueProps {
  placeholder?: ReactNode;
}

export const SelectValue = (props: SelectValueProps) => (
  <ShadcnSelectValue {...props} />
);

export interface SelectContentProps {
  /**
   * Whether the popup aligns the selected item with the trigger (default
   * true). `false` positions the popup below the trigger like a popover.
   */
  alignWithTrigger?: boolean;
  children?: ReactNode;
  className?: string;
}

export const SelectContent = ({
  alignWithTrigger,
  ...rest
}: SelectContentProps) => (
  <ShadcnSelectContent
    alignItemWithTrigger={alignWithTrigger !== false}
    {...rest}
  />
);

export interface SelectItemProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  value: string;
}

export const SelectItem = (props: SelectItemProps) => (
  <ShadcnSelectItem {...props} />
);
