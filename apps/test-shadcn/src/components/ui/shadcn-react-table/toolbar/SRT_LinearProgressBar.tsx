import {
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
  useSRT_ProgressAnimation,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

export interface SRT_LinearProgressBarProps<TData extends SRT_RowData> {
  isTopToolbar: boolean;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_LinearProgressBar = <TData extends SRT_RowData>({
  isTopToolbar,
  table,
  ...rest
}: SRT_LinearProgressBarProps<TData>) => {
  const {
    getState,
    options: { srtLinearProgressProps },
  } = table;
  const { isSaving, showProgressBars } = getState();

  const linearProgressProps = {
    ...parseFromValuesOrFunc(srtLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const show = showProgressBars !== false && (showProgressBars || isSaving);

  const [value] = useSRT_ProgressAnimation(show, {
    strategy: 'ease-in-out',
    duration: 2000,
  });

  return (
    <Collapsible open={show}>
      <CollapsibleContent
        {...linearProgressProps}
        className={cn(
          'absolute left-0 right-0 w-full',
          isTopToolbar ? 'bottom-0' : 'top-0',
          linearProgressProps?.className,
        )}
      >
        <Progress
          value={value}
          {...linearProgressProps}
          className={cn('h-0.5', linearProgressProps?.className)}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
