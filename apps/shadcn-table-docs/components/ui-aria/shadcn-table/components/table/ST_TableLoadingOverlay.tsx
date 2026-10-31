import { cva } from 'class-variance-authority';
import { Spinner } from '@/components/ui-aria/spinner';
import { cn } from '@/lib/utils';
import { type ST_CircularProgressProps } from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';

export type ST_TableLoadingOverlayProps = ST_CircularProgressProps;

const tableLoadingOverlayVariants = cva(
  'absolute inset-0 z-3 flex max-h-screen w-full items-center justify-center bg-background/50',
);

export const ST_TableLoadingOverlay = ({
  ...rest
}: ST_TableLoadingOverlayProps) => {
  const table = useSTContext();
  const {
    options: { id, localization, stCircularProgressProps },
  } = table;

  const circularProgressProps = {
    ...parseFromValuesOrFunc(stCircularProgressProps, { table }),
    ...rest,
  };

  return (
    <div className={cn(tableLoadingOverlayVariants())}>
      {circularProgressProps?.Component ?? (
        <Spinner
          aria-label={localization.noRecordsToDisplay}
          id={`st-progress-${id}`}
          {...circularProgressProps}
        />
      )}
    </div>
  );
};
