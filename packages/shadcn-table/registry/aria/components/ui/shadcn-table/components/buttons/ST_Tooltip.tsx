import * as React from 'react';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { getCommonTooltipProps } from '@/components/ui/shadcn-table/shared/utils/style.utils';
import { useST_ComposedRef } from '@/components/ui/shadcn-table/hooks/useST_ComposedRef';

export interface ST_TooltipProps {
  title?: React.ReactNode;
  children: React.ReactElement;
  side?: React.ComponentProps<typeof Tooltip>['placement'];
  /** Open delay in ms. Maps to React Aria TooltipTrigger `delay`. */
  delayDuration?: number;
  /** React Aria tooltips are never hoverable; `true` closes on pointer leave without the close delay. */
  disableHoverableContent?: boolean;
  disableHoverListener?: boolean;
  open?: boolean;
}

/** Trigger nodes whose aria-label this component wrote, so a title change updates it. */
const labelledByTooltip = new WeakSet<Element>();

const LABEL_TARGET_SELECTOR =
  'button, a[href], input, select, textarea, [role="button"], [role="switch"], [role="checkbox"]';

/**
 * React Aria Tooltip does not set `aria-label` on an unnamed child. Give the
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
  const triggerRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => applyTooltipLabel(triggerRef.current, title));

  // TooltipTrigger takes no ref, so the child's own ref is merged with the
  // trigger ref.
  const trigger = children as React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
  }>;
  const attachRef = useST_ComposedRef(triggerRef, trigger.props.ref);

  if (disableHoverListener || (!title && title !== 0)) {
    return <>{children}</>;
  }

  return (
    <TooltipTrigger
      isOpen={open}
      delay={delayDuration}
      closeDelay={disableHoverableContent ? 0 : undefined}
    >
      {React.cloneElement(trigger, { ref: attachRef })}
      <Tooltip placement={commonSide}>{title}</Tooltip>
    </TooltipTrigger>
  );
};
