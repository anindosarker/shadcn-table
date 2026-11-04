import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';

export type ST_TooltipButtonProps = ButtonProps & { tooltip: string };

/**
 * An icon button inside a tooltip, for use as a menu trigger: the trigger
 * merges its props into this element, so they reach the button inside the
 * tooltip.
 */
export const ST_TooltipButton = ({
  tooltip,
  ...props
}: ST_TooltipButtonProps) => (
  <ST_Tooltip title={tooltip}>
    <Button {...props} />
  </ST_Tooltip>
);
