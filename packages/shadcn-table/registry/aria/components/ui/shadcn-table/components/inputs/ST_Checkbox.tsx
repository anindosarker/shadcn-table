import { type ComponentPropsWithRef, type ComponentType } from 'react';
import { ST_Default_Icons } from '@/components/ui/shadcn-table/icons';
import type { ST_IconProps } from '@/components/ui/shadcn-table/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export type ST_CheckboxProps = ComponentPropsWithRef<typeof Checkbox> & {
  /** The indeterminate dash; the table passes its `icons.IndeterminateIcon`. */
  indeterminateIcon?: ComponentType<ST_IconProps>;
};

// The indeterminate box takes the checked fill, and the part's own check is
// hidden so the dash drawn below shows instead.
const indeterminateClassName =
  'data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground dark:data-indeterminate:bg-primary data-indeterminate:[&_[data-slot=checkbox-indicator]_svg]:hidden';

/**
 * shadcn's Checkbox with an indeterminate dash on the checked fill.
 * The part draws a check for every state, so the dash sits over the box,
 * centred, shows only while the part is indeterminate and lets clicks
 * through. React Aria marks the state with `data-indeterminate`.
 */
export const ST_Checkbox = ({
  className,
  indeterminateIcon: IndeterminateIcon = ST_Default_Icons.IndeterminateIcon,
  ...props
}: ST_CheckboxProps) => (
  <span className="relative inline-flex">
    <Checkbox className={cn(indeterminateClassName, className)} {...props} />
    <IndeterminateIcon
      aria-hidden
      className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 text-primary-foreground peer-data-disabled:opacity-50 peer-data-indeterminate:block"
    />
  </span>
);
