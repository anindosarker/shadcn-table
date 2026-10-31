import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

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

  // Base UI Progress takes `value: number | null`, null being indeterminate.
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
          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
            <Progress
              aria-busy="true"
              {...progressComponentProps}
              className={cn(
                isIndeterminate && 'st-progress-indeterminate',
                progressComponentProps?.className,
              )}
              value={progressComponentProps?.value ?? null}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </table.Subscribe>
  );
};
