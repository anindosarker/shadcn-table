import * as React from 'react';
import { getCommonTooltipProps } from 'shadcn-react-table-core';
import type { SRT_TooltipSide } from 'shadcn-react-table-core';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SRT_TooltipProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  side?: SRT_TooltipSide;
  sideOffset?: number;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  asChild?: boolean;
}

export const SRT_Tooltip = ({
  title,
  children,
  side,
  sideOffset,
  disabled,
  open,
  onOpenChange,
  className,
  asChild = true,
}: SRT_TooltipProps) => {
  const { delayDuration, side: commonSide } = getCommonTooltipProps(side);

  if (disabled || title == null || title === '') {
    return <>{children}</>;
  }

  // Note: delayDuration goes directly to the Tooltip (Radix Root) rather than a
  // wrapping provider. A single TooltipProvider is mounted once at the SRT root
  // (ShadcnReactTable) — the latest shadcn tooltip no longer self-wraps, and
  // Radix Root would throw without a provider ancestor. Radix resolves delay
  // from the nearest provider, but the Root's own delayDuration overrides it, so
  // each tooltip keeps its per-instance delay regardless of the shared provider.
  // Note: disableHoverableContent maps MUI's disableInteractive — the tooltip
  // dismisses when the pointer moves onto its content rather than staying hoverable.
  return (
    <Tooltip
      open={open}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent
    >
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent
        side={commonSide}
        sideOffset={sideOffset}
        className={className}
      >
        {title}
      </TooltipContent>
    </Tooltip>
  );
};
