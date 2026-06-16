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
