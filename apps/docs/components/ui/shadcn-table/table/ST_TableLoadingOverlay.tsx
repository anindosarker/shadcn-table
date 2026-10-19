import { cva } from 'class-variance-authority';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import {
  type ST_CircularProgressProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';

export interface ST_TableLoadingOverlayProps<TData extends ST_RowData>
  extends ST_CircularProgressProps {
  table: ST_TableInstance<TData>;
}

const tableLoadingOverlayVariants = cva(
  'absolute inset-0 z-[3] flex max-h-screen w-full items-center justify-center bg-background/50',
);

export const ST_TableLoadingOverlay = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_TableLoadingOverlayProps<TData>) => {
  const {
    options: {
      id,
      localization,
      // Note: mrtTheme dropped project-wide — bg-background/50 in the cva maps alpha(baseBackgroundColor, 0.5)
      // mrtTheme: { baseBackgroundColor },
      stCircularProgressProps,
    },
  } = table;

  const circularProgressProps = {
    ...parseFromValuesOrFunc(stCircularProgressProps, { table }),
    ...rest,
  };

  return (
    <div className={cn(tableLoadingOverlayVariants())}>
      {circularProgressProps?.Component ?? (
        // Note: LoaderCircleIcon animate-spin → ui/Spinner (own animate-spin).
        // MUI CircularProgress's 40px default drops — Spinner's size-4 wins.
        <Spinner
          aria-label={localization.noRecordsToDisplay}
          id={`st-progress-${id}`}
          {...circularProgressProps}
        />
      )}
    </div>
  );
};
