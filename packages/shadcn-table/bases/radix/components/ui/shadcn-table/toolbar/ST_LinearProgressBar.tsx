import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
  type ST_TableInstance,
} from '../types';
import { parseFromValuesOrFunc } from '../utils/utils';

export interface ST_LinearProgressBarProps<TData extends ST_RowData>
  extends ST_LinearProgressProps {
  isTopToolbar: boolean;
  table: ST_TableInstance<TData>;
}

const linearProgressWrapperVariants = cva('absolute w-full', {
  variants: {
    isTopToolbar: {
      false: 'top-0',
      true: 'bottom-0',
    },
  },
});

export const ST_LinearProgressBar = <TData extends ST_RowData>({
  isTopToolbar,
  table,
  ...rest
}: ST_LinearProgressBarProps<TData>) => {
  const {
    getState,
    options: { stLinearProgressProps },
  } = table;
  const { isSaving, showProgressBars } = getState();

  const { progressComponentProps, collapsibleProps } = {
    ...parseFromValuesOrFunc(stLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const show = showProgressBars !== false && (showProgressBars || isSaving);

  // MUI LinearProgress defaults to variant="indeterminate" (CSS keyframes, no
  // React state); a slot `value` switches it to determinate like MRT's does.
  const isIndeterminate = progressComponentProps?.value == null;

  return (
    <Collapsible
      {...collapsibleProps}
      open={show}
      className={cn(
        linearProgressWrapperVariants({ isTopToolbar }),
        collapsibleProps?.className,
      )}
    >
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
  );
};
