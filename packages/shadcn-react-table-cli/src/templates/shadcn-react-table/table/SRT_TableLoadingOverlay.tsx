import { LoaderCircleIcon } from 'lucide-react';
import {
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

export interface SRT_TableLoadingOverlayProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_TableLoadingOverlay = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_TableLoadingOverlayProps<TData>) => {
  const {
    options: { id, localization, srtCircularProgressProps },
  } = table;

  const circularProgressProps = {
    ...parseFromValuesOrFunc(srtCircularProgressProps, { table }),
    ...rest,
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-[3] flex items-center justify-center',
        'bg-background/50 max-h-screen w-full',
        circularProgressProps?.className,
      )}
    >
      {circularProgressProps?.Component ?? (
        <LoaderCircleIcon
          aria-label={localization.noRecordsToDisplay}
          id={`srt-progress-${id}`}
          className={cn('animate-spin', circularProgressProps?.className)}
          size={40}
          {...circularProgressProps}
        />
      )}
    </div>
  );
};

// TODO: Future enhancements:
// 1. Add srtSpinnerProps to SRT_TableOptions in core package types
// 2. Support custom spinner component via Component prop
// 3. Add theme integration for background color (currently using bg-background/50)
// 4. Add size variants for spinner
// 5. Consider adding spinner variants (circle, circle-filled, ring, etc.) from shadcn.io
