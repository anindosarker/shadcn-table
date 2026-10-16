import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getCommonTooltipProps } from './utils/style.utils';

export interface SRT_TooltipProps
  extends Pick<
    React.ComponentProps<typeof Tooltip>,
    'delayDuration' | 'disableHoverableContent'
  > {
  title?: React.ReactNode;
  children: React.ReactElement;
  side?: React.ComponentProps<typeof TooltipContent>['side'];
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
  ...rest
}: SRT_TooltipProps) => {
  const {
    delayDuration,
    disableHoverableContent,
    side: commonSide,
  } = { ...getCommonTooltipProps(side), ...rest };
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
