import { Collapsible, CollapsibleContent } from '@/components/ui-aria/collapsible';
import { Progress } from '@/components/ui-aria/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';
import { stCollapsibleKeyframes } from '@/components/ui-aria/shadcn-table/shared/utils/style.utils';

export interface ST_LinearProgressBarProps extends ST_LinearProgressProps {
  isTopToolbar: boolean;
}

const linearProgressWrapperVariants = cva('absolute w-full', {
  variants: {
    isTopToolbar: {
      false: 'top-0',
      true: 'bottom-0',
    },
  },
});

// Hoisted as <style href="st-linear-progress"> so the rule exists before
// the class is set.
const linearProgressKeyframes = `@keyframes st-linear-progress-indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}

.st-progress-indeterminate [data-slot='progress-indicator'] {
  position: absolute;
  top: 0;
  bottom: 0;
  width: auto;
  transform: none;
  transition: none;
  animation: st-linear-progress-indeterminate 2.1s
    cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
`;

export const ST_LinearProgressBar = <TData extends ST_RowData>({
  isTopToolbar,
  ...rest
}: ST_LinearProgressBarProps) => {
  const table = useSTContext<TData>();
  const {
    options: { stLinearProgressProps },
  } = table;

  const { progressComponentProps, collapsibleProps } = {
    ...parseFromValuesOrFunc(stLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const isIndeterminate = progressComponentProps?.value == null;

  return (
    <table.Subscribe
      selector={(state) => ({
        isSaving: state.isSaving,
        showProgressBars: state.showProgressBars,
      })}
    >
      {({ isSaving, showProgressBars }) => {
        const isExpanded =
          showProgressBars !== false && (showProgressBars || isSaving);

        return (
          <Collapsible
            {...collapsibleProps}
            isExpanded={isExpanded}
            className={cn(
              linearProgressWrapperVariants({ isTopToolbar }),
              collapsibleProps?.className,
            )}
          >
            <style href="st-linear-progress" precedence="low">
              {linearProgressKeyframes}
            </style>
            <style href="st-aria-collapsible" precedence="low">
              {stCollapsibleKeyframes}
            </style>
            {/* React Aria keeps a collapsed panel's children mounted. */}
            <CollapsibleContent className="aria-[hidden=false]:animate-[st-aria-collapsible-down_200ms_ease-out] aria-hidden:animate-[st-aria-collapsible-up_200ms_ease-out]">
              {isExpanded && (
                <Progress
                  aria-busy="true"
                  {...progressComponentProps}
                  className={cn(
                    isIndeterminate && 'st-progress-indeterminate',
                    progressComponentProps?.className,
                  )}
                  isIndeterminate={isIndeterminate}
                  value={progressComponentProps?.value ?? undefined}
                />
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      }}
    </table.Subscribe>
  );
};
