import {
  parseFromValuesOrFunc,
  type SRT_LinearProgressProps,
  type SRT_RowData,
  type SRT_TableInstance,
  useSRT_ProgressAnimation,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { Progress } from '@/components/ui/progress';
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

// Note: linearProgressRootVariants cva deleted — the hand-rolled bar (h-1
// rounded-none bg-primary/20 + inner filled div) is replaced by <Progress>.
// shadcn's default look (h-2, rounded-full, bg-primary/20, bg-primary
// indicator) wins; the MRT/June h-1 track height is dropped.

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
  // which the package must not ship. The looping value now feeds Progress's
  // determinate `value` (its indicator translateX tracks it).
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
      {/* aria-busy="true" aria-label="Loading" */}
      {/* Note: Progress (radix root) supplies role="progressbar" +
          aria-valuenow/valuemin/valuemax; the manual aria-busy/aria-label are
          dropped. progressRoot slot (DivProps) spreads onto Progress. */}
      <Progress value={value ?? 0} {...progressRoot} />
    </div>
  );
};
