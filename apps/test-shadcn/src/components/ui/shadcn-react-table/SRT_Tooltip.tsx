import * as React from 'react';
import {
  getCommonTooltipProps,
  type SRT_TooltipSide,
} from 'shadcn-react-table-core';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SRT_TooltipProps {
  title?: React.ReactNode;
  children: React.ReactElement;
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
  side = 'bottom',
  sideOffset,
  disabled,
  open,
  onOpenChange,
  className,
  asChild = true,
}: SRT_TooltipProps) => {
  const {
    delayDuration,
    disableHoverableContent,
    side: commonSide,
  } = getCommonTooltipProps(side);
  if (disabled || (!title && title !== 0)) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      open={open}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
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
