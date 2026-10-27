import { Collapsible, CollapsibleContent } from '@/components/ui-base/collapsible';
import { Progress } from '@/components/ui-base/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Subscribe } from '@tanstack/react-table';
import {
  type ST_LinearProgressProps,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

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

  // MUI LinearProgress defaults to variant="indeterminate" (CSS keyframes, no
  // React state); a slot `value` switches it to determinate like MRT's does.
  // Base UI Progress takes `value: number | null`, null being indeterminate.
  const isIndeterminate = progressComponentProps?.value == null;

  return (
    <Subscribe
      selector={(state) => ({
        isSaving: state.isSaving,
        showProgressBars: state.showProgressBars,
      })}
      source={table.store}
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
          <CollapsibleContent className="data-open:animate-[st-base-collapsible-down_200ms_ease-out] data-closed:animate-[st-base-collapsible-up_200ms_ease-out]">
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
    </Subscribe>
  );
};
