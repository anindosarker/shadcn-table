import * as React from 'react';
import {
  type TooltipTriggerState,
  TooltipTriggerStateContext,
} from 'react-aria-components';
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
  /** Aria only: no TooltipTrigger; the bubble positions on the child and opens from `open`; `delayDuration` and `disableHoverableContent` do not apply. */
  standalone?: boolean;
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
  standalone,
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
    disabled?: boolean;
    isDisabled?: boolean;
  }>;
  const attachRef = useST_ComposedRef(triggerRef, trigger.props.ref);

  // The library's `open` state controls the tooltip; Escape and blur override
  // it until `open` changes, and each change clears the override.
  const [dismissed, setDismissed] = React.useState<{ isOpen: boolean } | null>(
    null,
  );
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setDismissed(null);
  }
  const isOpen = open === undefined ? undefined : (dismissed?.isOpen ?? open);
  const onOpenChange =
    open === undefined
      ? undefined
      : (next: boolean) => setDismissed({ isOpen: next });

  if (disableHoverListener || (!title && title !== 0)) {
    return <>{children}</>;
  }

  // React Aria's standalone Tooltip: no TooltipTrigger and no Focusable, so a
  // control that is not a focusable element (a checkbox label, a radio group,
  // a text span) keeps its own role. The caller opens it from its own events.
  // React Aria 1.22's Tooltip positions from the TooltipTriggerStateContext
  // state even when `isOpen` is given, so the state goes in that context.
  if (standalone) {
    const state: TooltipTriggerState = {
      isOpen: isOpen ?? false,
      shouldSkipAnimation: false,
      open: () => onOpenChange?.(true),
      close: () => onOpenChange?.(false),
    };
    return (
      <>
        {React.cloneElement(trigger, { ref: attachRef })}
        <TooltipTriggerStateContext.Provider value={state}>
          <Tooltip
            triggerRef={triggerRef}
            isOpen={state.isOpen}
            onOpenChange={onOpenChange}
            placement={commonSide}
          >
            {title}
          </Tooltip>
        </TooltipTriggerStateContext.Provider>
      </>
    );
  }

  // React Aria's Focusable warns about a child that cannot take focus, so a
  // disabled control renders without the trigger and keeps the title as its name.
  if (trigger.props.disabled || trigger.props.isDisabled) {
    return React.cloneElement(trigger, { ref: attachRef });
  }

  return (
    <TooltipTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      delay={delayDuration}
      closeDelay={disableHoverableContent ? 0 : undefined}
    >
      {React.cloneElement(trigger, { ref: attachRef })}
      <Tooltip placement={commonSide}>{title}</Tooltip>
    </TooltipTrigger>
  );
};
