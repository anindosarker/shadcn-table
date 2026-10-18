// Base-neutral checkbox and radio API over the installed shadcn checkbox and
// radio-group parts. Library code imports this module, never
// `@/components/ui/checkbox` or `@/components/ui/radio-group`, so the Radix
// and Base UI builds differ only here. Radix implementation.
import { type ComponentPropsWithRef } from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '@/components/ui/radio-group';

/**
 * Props of the library's checkbox (the `st*CheckboxProps` table options). The
 * mixed state is its own `indeterminate` flag, never a `checked` value.
 */
export type CheckboxProps = Omit<
  ComponentPropsWithRef<'button'>,
  'checked' | 'defaultChecked' | 'onChange' | 'value'
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  value?: string;
};

export const Checkbox = ({
  checked,
  indeterminate,
  onCheckedChange,
  ...rest
}: CheckboxProps) => (
  // Radix folds the mixed state into `checked`; `indeterminate` wins over
  // `checked` like MUI's did.
  <ShadcnCheckbox
    checked={indeterminate ? 'indeterminate' : checked}
    onCheckedChange={
      onCheckedChange && ((next) => onCheckedChange(next === true))
    }
    {...rest}
  />
);

export interface RadioGroupProps
  extends Omit<ComponentPropsWithRef<'div'>, 'dir'> {
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  value?: string | null;
}

export const RadioGroup = (props: RadioGroupProps) => (
  <ShadcnRadioGroup {...props} />
);

/** Props of the library's radio (single-selection `stSelectCheckboxProps`). */
export type RadioProps = Omit<
  ComponentPropsWithRef<'button'>,
  'onChange' | 'value'
> & {
  required?: boolean;
  value: string;
};

export const RadioGroupItem = (props: RadioProps) => (
  <ShadcnRadioGroupItem {...props} />
);
