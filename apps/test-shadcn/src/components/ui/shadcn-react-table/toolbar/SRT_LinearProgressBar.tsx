import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  parseFromValuesOrFunc,
  type SRT_LinearProgressProps,
  type SRT_RowData,
  type SRT_TableInstance,
  useSRT_ProgressAnimation,
} from 'shadcn-react-table-core';

export interface SRT_LinearProgressBarProps<TData extends SRT_RowData>
  extends SRT_LinearProgressProps {
  isTopToolbar: boolean;
  table: SRT_TableInstance<TData>;
}

const linearProgressWrapperVariants = cva('absolute w-full', {
  variants: {
    isTopToolbar: {
      false: 'top-0',
      true: 'bottom-0',
    },
  },
});

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

  const { progressComponentProps, collapsibleProps } = {
    ...parseFromValuesOrFunc(srtLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const show = showProgressBars !== false && (showProgressBars || isSaving);

  const [value] = useSRT_ProgressAnimation(show, {
    duration: 2000,
    strategy: 'ease-in-out',
  });

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
        <Progress value={value ?? 0} {...progressComponentProps} />
      </CollapsibleContent>
    </Collapsible>
  );
};
