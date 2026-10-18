import { type ReactElement, type ReactNode, type Ref } from 'react';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  TooltipTrigger as ShadcnTooltipTrigger,
} from '@/components/ui/tooltip';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProviderProps {
  children: ReactNode;
  /** Open delay in ms for every tooltip under the provider. */
  delay?: number;
}

export const TooltipProvider = ({ children, delay }: TooltipProviderProps) => (
  // Radix keeps a skip window on the provider (skipDelayDuration): a tooltip
  // opened within it after another closed skips the delay. The library turns
  // it off; Base UI has no equivalent, so it is not part of the adapter API.
  <ShadcnTooltipProvider delayDuration={delay} skipDelayDuration={0}>
    {children}
  </ShadcnTooltipProvider>
);

export interface TooltipProps {
  children: ReactNode;
  /** Open delay in ms. */
  delay?: number;
  /** Whether the pointer can move onto the tooltip without closing it. */
  hoverable?: boolean;
  open?: boolean;
}

export const Tooltip = ({
  children,
  delay,
  hoverable = true,
  open,
}: TooltipProps) => (
  <ShadcnTooltip
    open={open}
    delayDuration={delay}
    disableHoverableContent={!hoverable}
  >
    {children}
  </ShadcnTooltip>
);

export interface TooltipTriggerProps {
  /** The element that becomes the trigger (no wrapper is rendered). */
  children: ReactElement;
  ref?: Ref<HTMLButtonElement>;
}

export const TooltipTrigger = ({ children, ref }: TooltipTriggerProps) => (
  <ShadcnTooltipTrigger asChild ref={ref}>
    {children}
  </ShadcnTooltipTrigger>
);

export interface TooltipContentProps {
  children: ReactNode;
  side?: TooltipSide;
}

export const TooltipContent = ({ children, side }: TooltipContentProps) => (
  <ShadcnTooltipContent side={side}>{children}</ShadcnTooltipContent>
);
