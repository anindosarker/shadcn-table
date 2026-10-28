import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Subscribe } from '@tanstack/react-table';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { stCollapsibleKeyframes } from '@/components/ui/shadcn-table/shared/utils/style.utils';

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

// MUI LinearProgress indeterminate keyframes (indeterminate1), ported so the
// loading bars animate in CSS like MUI's instead of re-rendering per frame.
// Rendered as a hoisted <style href="st-linear-progress"> whether or not the
// bar is indeterminate, so the rule exists before the class is set.
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
    <Subscribe
      selector={(state) => ({
        isSaving: state.isSaving,
        showProgressBars: state.showProgressBars,
      })}
      source={table.store}
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
            <style href="st-collapsible" precedence="low">
              {stCollapsibleKeyframes}
            </style>
            {/* React Aria keeps a collapsed panel's children mounted. */}
            <CollapsibleContent className="aria-[hidden=false]:animate-[st-collapsible-down_200ms_ease-out] aria-hidden:animate-[st-collapsible-up_200ms_ease-out]">
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
    </Subscribe>
  );
};
