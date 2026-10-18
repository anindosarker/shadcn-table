// Base-neutral "render as the child element" helper: merges its props onto
// the single child element (class names joined, handlers composed, refs
// merged). Stands in for the shadcn parts' `asChild` (Radix) / `render`
// (Base UI) prop wherever library code needs it. Base UI implementation.
import { type HTMLAttributes, type ReactElement, type Ref } from 'react';
import { useRender } from '@base-ui/react/use-render';

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactElement;
  ref?: Ref<HTMLElement>;
}

export const Slot = ({ children, ref, ...props }: SlotProps) =>
  useRender({ props, ref, render: children });
