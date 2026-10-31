import { Collapsible, CollapsibleContent } from '@/components/ui-radix/collapsible';
import { Progress } from '@/components/ui-radix/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';

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
      {({ isSaving, showProgressBars }) => (
        <Collapsible
          {...collapsibleProps}
          open={showProgressBars !== false && (showProgressBars || isSaving)}
          className={cn(
            linearProgressWrapperVariants({ isTopToolbar }),
            collapsibleProps?.className,
          )}
        >
          <style href="st-linear-progress" precedence="low">
            {linearProgressKeyframes}
          </style>
          <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <Progress
              aria-busy="true"
              {...progressComponentProps}
              className={cn(
                isIndeterminate && 'st-progress-indeterminate',
                progressComponentProps?.className,
              )}
              value={progressComponentProps?.value ?? undefined}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </table.Subscribe>
  );
};
