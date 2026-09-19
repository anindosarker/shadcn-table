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
  disabled?: boolean;
  open?: boolean;
  className?: string;
  asChild?: boolean;
}

export const SRT_Tooltip = ({
  title,
  children,
  side = 'bottom',
  disabled,
  open,
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
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={commonSide} className={className}>
        {title}
      </TooltipContent>
    </Tooltip>
  );
};
