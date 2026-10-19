// Base-neutral "render as the child element" helper: merges its props onto
// the single child element (class names joined, handlers composed, refs
// merged). Stands in for the shadcn parts' `asChild` (Radix) / `render`
// (Base UI) prop wherever library code needs it. Radix implementation.
import { Slot as SlotPrimitive } from 'radix-ui';

export const Slot = SlotPrimitive.Root;
