import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui-radix/tooltip';
import { getCommonTooltipProps } from '@/components/ui-radix/shadcn-table/utils/style.utils';

export interface ST_TooltipProps
  extends Pick<
    React.ComponentProps<typeof Tooltip>,
    'delayDuration' | 'disableHoverableContent'
  > {
  title?: React.ReactNode;
  children: React.ReactElement;
  side?: React.ComponentProps<typeof TooltipContent>['side'];
  disableHoverListener?: boolean;
  open?: boolean;
}

/** Trigger nodes whose aria-label this component wrote, so a title change updates it. */
const labelledByTooltip = new WeakSet<Element>();

const LABEL_TARGET_SELECTOR =
  'button, a[href], input, select, textarea, [role="button"], [role="switch"], [role="checkbox"]';

/**
 * MUI Tooltip set `aria-label` on an unnamed child; Radix does not. Give the
 * trigger (or the control it wraps) the title string as its accessible name
 * when it has no text content and no label of its own.
 */
const applyTooltipLabel = (node: HTMLElement | null, title: unknown) => {
  if (!node || typeof title !== 'string' || !title) return;
  const target = node.matches(LABEL_TARGET_SELECTOR)
    ? node
    : (node.querySelector<HTMLElement>(LABEL_TARGET_SELECTOR) ?? node);
  if (!labelledByTooltip.has(target)) {
    if (
      target.hasAttribute('aria-label') ||
      target.hasAttribute('aria-labelledby') ||
      target.textContent?.trim()
    ) {
      return;
    }
    labelledByTooltip.add(target);
  }
  target.setAttribute('aria-label', title);
};

export const ST_Tooltip = ({
  title,
  children,
  side = 'bottom',
  disableHoverListener,
  open,
  ...rest
}: ST_TooltipProps) => {
  const {
    delayDuration,
    disableHoverableContent,
    side: commonSide,
  } = { ...getCommonTooltipProps(side), ...rest };
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => applyTooltipLabel(triggerRef.current, title));

  if (disableHoverListener || (!title && title !== 0)) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      open={open}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipTrigger asChild ref={triggerRef}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={commonSide}>{title}</TooltipContent>
    </Tooltip>
  );
};
