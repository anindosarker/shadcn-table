import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';

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
    options: { stLinearProgressProps },
  } = table;
  const { isSaving, showProgressBars } = table.state;

  const { progressComponentProps, collapsibleProps } = {
    ...parseFromValuesOrFunc(stLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const show = showProgressBars !== false && (showProgressBars || isSaving);

  // MUI LinearProgress defaults to variant="indeterminate" (CSS keyframes, no
  // React state); a slot `value` switches it to determinate like MRT's does.
  // Base UI Progress takes `value: number | null`, null being indeterminate.
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
      <CollapsibleContent className="data-open:animate-[st-collapsible-down_200ms_ease-out] data-closed:animate-[st-collapsible-up_200ms_ease-out]">
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
  );
};
