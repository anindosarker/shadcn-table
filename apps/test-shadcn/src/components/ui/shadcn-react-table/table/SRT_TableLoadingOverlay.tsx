import {
  parseFromValuesOrFunc,
  type SRT_CircularProgressProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export interface SRT_TableLoadingOverlayProps<TData extends SRT_RowData>
  extends SRT_CircularProgressProps {
  table: SRT_TableInstance<TData>;
}

const tableLoadingOverlayVariants = cva(
  'absolute inset-0 z-[3] flex max-h-screen w-full items-center justify-center bg-background/50',
);

export const SRT_TableLoadingOverlay = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_TableLoadingOverlayProps<TData>) => {
  const {
    options: {
      id,
      localization,
      // Note: mrtTheme dropped project-wide — bg-background/50 in the cva maps alpha(baseBackgroundColor, 0.5)
      // mrtTheme: { baseBackgroundColor },
      srtCircularProgressProps,
    },
  } = table;

  const circularProgressProps = {
    ...parseFromValuesOrFunc(srtCircularProgressProps, { table }),
    ...rest,
  };

  return (
    <div className={cn(tableLoadingOverlayVariants())}>
      {circularProgressProps?.Component ?? (
        // Note: LoaderCircleIcon animate-spin → ui/Spinner (own animate-spin).
        // MUI CircularProgress's 40px default drops — Spinner's size-4 wins.
        <Spinner
          aria-label={localization.noRecordsToDisplay}
          id={`srt-progress-${id}`}
          {...circularProgressProps}
        />
      )}
    </div>
  );
};
