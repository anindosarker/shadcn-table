import { type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';

export interface ST_OverflowTextProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** The tooltip content; `'value'` or undefined shows the children. */
  readonly tooltip?: 'value' | ReactNode;
  /** Wrapped text is never cut off: plain span, no tooltip. */
  readonly wrap?: boolean;
}

/** The open delay of every overflow tooltip. */
const OPEN_DELAY = 500;

/**
 * React Aria needs no provider: each overflow tooltip runs its own delay, so
 * the body's provider renders its children as they are.
 */
export const ST_OverflowTooltipProvider = ({
  children,
}: {
  children: ReactNode;
}) => <>{children}</>;

/** True when the element's content is cut off sideways. */
const isCutOff = (element: HTMLElement | null) =>
  !!element && element.scrollWidth > element.clientWidth;

/**
 * Truncates its content to one line and shows a tooltip with the full text
 * only when the content is cut off. The check runs when the tooltip is about
 * to open, so no cell needs a resize observer. The tooltip is standalone: the
 * span keeps its own role and opens it from its pointer events.
 */
export const ST_OverflowText = ({
  children,
  className,
  tooltip,
  wrap,
}: ST_OverflowTextProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (wrap) return <span className={className}>{children}</span>;

  return (
    <ST_Tooltip
      open={open}
      side="top"
      standalone
      title={tooltip === undefined || tooltip === 'value' ? children : tooltip}
    >
      <span
        className={cn('block min-w-0 truncate', className)}
        onPointerEnter={() => {
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(
            () => setOpen(isCutOff(ref.current)),
            OPEN_DELAY,
          );
        }}
        onPointerLeave={() => {
          clearTimeout(timerRef.current);
          setOpen(false);
        }}
        ref={ref}
      >
        {children}
      </span>
    </ST_Tooltip>
  );
};
