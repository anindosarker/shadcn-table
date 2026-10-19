// Base-neutral tooltip API over the installed shadcn tooltip part. Library
// code imports this module, never `@/components/ui/tooltip`, so the Radix and
// Base UI builds differ only here. Base UI implementation.
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
  // Base UI groups the tooltips under a provider: one closing within
  // `timeout` lets the next open instantly, like Radix's skip window. The
  // library turns it off, so it is not part of the adapter API.
  <ShadcnTooltipProvider delay={delay} timeout={0}>
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
}: TooltipProps) => {
  const tooltip = (
    <ShadcnTooltip open={open} disableHoverablePopup={!hoverable}>
      {children}
    </ShadcnTooltip>
  );
  // Base UI reads the delay from the nearest provider only; a provider of
  // its own scopes a per-tooltip delay.
  return delay === undefined ? (
    tooltip
  ) : (
    <ShadcnTooltipProvider delay={delay} timeout={0}>
      {tooltip}
    </ShadcnTooltipProvider>
  );
};

export interface TooltipTriggerProps {
  /** The element that becomes the trigger (no wrapper is rendered). */
  children: ReactElement;
  ref?: Ref<HTMLButtonElement>;
}

export const TooltipTrigger = ({ children, ref }: TooltipTriggerProps) => (
  <ShadcnTooltipTrigger render={children} ref={ref} />
);

export interface TooltipContentProps {
  children: ReactNode;
  side?: TooltipSide;
}

export const TooltipContent = ({ children, side }: TooltipContentProps) => (
  <ShadcnTooltipContent side={side}>{children}</ShadcnTooltipContent>
);
