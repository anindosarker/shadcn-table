import { type ComponentPropsWithRef } from 'react';
import { MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui-radix/checkbox';

export type ST_CheckboxProps = ComponentPropsWithRef<typeof Checkbox>;

// The indeterminate box takes the checked fill, and the part's own check is
// hidden so the dash drawn below shows instead.
const indeterminateClassName =
  'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-primary data-[state=indeterminate]:[&_[data-slot=checkbox-indicator]_svg]:hidden';

/**
 * shadcn's Checkbox with MRT's indeterminate look: a dash on the checked fill.
 * The part draws a check for every state, so the dash sits over the box,
 * centred, shows only while the part is indeterminate and lets clicks
 * through. Radix marks the state with `data-state="indeterminate"`.
 */
export const ST_Checkbox = ({ className, ...props }: ST_CheckboxProps) => (
  <span className="relative inline-flex">
    <Checkbox className={cn(indeterminateClassName, className)} {...props} />
    <MinusIcon
      aria-hidden
      className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 text-primary-foreground peer-data-disabled:opacity-50 peer-data-[state=indeterminate]:block"
    />
  </span>
);
