import * as React from 'react';
import { getCommonTooltipProps } from 'shadcn-react-table-core';
import type { SRT_TooltipSide } from 'shadcn-react-table-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SRT_TooltipProps {
  /** Tooltip body. When empty/undefined the trigger is rendered without a tooltip. */
  title?: React.ReactNode;
  /** The element the tooltip is attached to. Must accept a ref / be a single child. */
  children: React.ReactNode;
  /** Radix placement. Defaults to the shared `getCommonTooltipProps` config. */
  side?: SRT_TooltipSide;
  sideOffset?: number;
  /** When true, suppress the tooltip entirely (e.g. disabled buttons in MRT). */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Extra className for the tooltip content. */
  className?: string;
  /** Render the trigger as its child (Radix `asChild`). Defaults to true. */
  asChild?: boolean;
}

/**
 * Shared tooltip wrapper for shadcn-react-table.
 *
 * Replaces material-react-table's MUI `<Tooltip>` + `getCommonTooltipProps`
 * downgrades (and the various native `title=` fallbacks) with a single shadcn /
 * Radix-based wrapper so every cluster renders tooltips consistently:
 * - applies the shared `getCommonTooltipProps` (1000ms open delay, placement)
 * - `disabled` short-circuits to render the child alone (matches MRT hiding the
 *   tooltip on disabled buttons / when there is no title)
 * - supports controlled `open` / `onOpenChange`
 *
 * Phase B components should use this instead of importing the shadcn Tooltip
 * primitives directly.
 */
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

  // Mirror MRT: no tooltip when disabled or when there is nothing to show.
  if (disabled || title == null || title === '') {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          side={commonSide}
          sideOffset={sideOffset}
          className={className}
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
