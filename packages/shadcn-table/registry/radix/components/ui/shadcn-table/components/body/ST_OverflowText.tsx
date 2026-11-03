import { type ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ST_OverflowTextProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** The tooltip content; `'value'` or undefined shows the children. */
  readonly tooltip?: 'value' | ReactNode;
  /** Wrapped text is never cut off: plain span, no tooltip. */
  readonly wrap?: boolean;
}

/** The one open delay for every overflow tooltip in a table body. */
export const ST_OverflowTooltipProvider = ({
  children,
}: {
  children: ReactNode;
}) => <TooltipProvider delayDuration={500}>{children}</TooltipProvider>;

/** True when the element's content is cut off sideways. */
const isCutOff = (element: HTMLElement | null) =>
  !!element && element.scrollWidth > element.clientWidth;

/**
 * Truncates its content to one line and shows a tooltip with the full text
 * only when the content is cut off. The check runs when the tooltip is about
 * to open, so no cell needs a resize observer.
 */
export const ST_OverflowText = ({
  children,
  className,
  tooltip,
  wrap,
}: ST_OverflowTextProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);

  if (wrap) return <span className={className}>{children}</span>;

  return (
    <Tooltip
      onOpenChange={(next) => setOpen(next && isCutOff(ref.current))}
      open={open}
    >
      <TooltipTrigger asChild>
        <span className={cn('block min-w-0 truncate', className)} ref={ref}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="wrap-break-word">
        {tooltip === undefined || tooltip === 'value' ? children : tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
