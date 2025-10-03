import {
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
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

  const linerProgressProps = {
    ...parseFromValuesOrFunc(srtLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const show = showProgressBars !== false && (showProgressBars || isSaving);

  // Function to calculate the progress value. You can change it as you wish.
  const [value, setValue] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!show) return;
    setValue(undefined);
    const id = setInterval(() => {
      setValue((prev) => {
        const next = typeof prev === 'number' ? prev + 10 : 10;
        return next > 100 ? 0 : next;
      });
    }, 150);
    return () => clearInterval(id);
  }, [show]);

  return (
    <Collapsible open={show}>
      <CollapsibleContent
        {...linerProgressProps}
        className={cn(
          'absolute left-0 right-0 w-full',
          isTopToolbar ? 'bottom-0' : 'top-0',
          linerProgressProps?.className,
        )}
      >
        <Progress
          value={value}
          {...linerProgressProps}
          className={cn('h-0.5', linerProgressProps?.className)}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

// TODO: srtLinearProgressProps - add props support similar to MRT's muiLinearProgressProps
// Example shape (commented for future parity):
// const linearProgressProps = parseFromValuesOrFunc(options?.srtLinearProgressProps, { isTopToolbar, table });
// <Progress value={value} className={cn('h-0.5', linearProgressProps?.className)} />
