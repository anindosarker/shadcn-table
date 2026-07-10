import {
  parseFromValuesOrFunc,
  type SRT_LinearProgressProps,
  type SRT_RowData,
  type SRT_TableInstance,
  useSRT_ProgressAnimation,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

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

const linearProgressRootVariants = cva(
  'relative h-1 w-full overflow-hidden bg-primary/20',
);

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

  const { progressRoot, wrapper } = {
    ...parseFromValuesOrFunc(srtLinearProgressProps, { isTopToolbar, table }),
    ...rest,
  };

  const show = showProgressBars !== false && (showProgressBars || isSaving);

  // Note: MUI <Collapse in={...} mountOnEnter unmountOnExit> dropped — a plain
  // conditional render gives the same mount/unmount; shadcn has no Collapse and
  // its open/close transition is not part of the progress spec.
  //
  // June deviation preserved: the indeterminate bar is driven by the JS
  // useSRT_ProgressAnimation rAF hook (a determinate value looping 0→100), not
  // a CSS keyframe slide — a keyframe animation would require Tailwind config,
  // which the package must not ship. The plan's `w-1/3` sliding child is
  // therefore replaced by a value-driven inline width.
  const [value] = useSRT_ProgressAnimation(show, {
    duration: 2000,
    strategy: 'ease-in-out',
  });

  if (!show) return null;

  return (
    <div
      {...wrapper}
      className={cn(
        linearProgressWrapperVariants({
          className: wrapper?.className,
          isTopToolbar,
        }),
      )}
    >
      <div
        aria-busy="true"
        aria-label="Loading"
        {...progressRoot}
        className={cn(
          linearProgressRootVariants({ className: progressRoot?.className }),
        )}
      >
        <div
          className="h-full bg-primary"
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </div>
  );
};
