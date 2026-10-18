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

export const Select = (props: SelectRootProps) => <ShadcnSelect {...props} />;

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
    position={alignWithTrigger === false ? 'popper' : undefined}
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
