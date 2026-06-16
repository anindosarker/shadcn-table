import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleDensePaddingButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_ToggleDensePaddingButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleDensePaddingButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon },
      localization,
    },
    setDensity,
  } = table;
  const { density } = getState();

  const handleToggleDensePadding = () => {
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable';
    setDensity(nextDensity);
  };

  return (
    <SRT_Tooltip title={localization.toggleDensity}>
      <Button
        aria-label={localization.toggleDensity}
        className={cn('h-8 w-8', className)}
        onClick={handleToggleDensePadding}
        size="icon"
        variant="ghost"
      >
        {density === 'compact' ? (
          <DensitySmallIcon className="h-4 w-4" />
        ) : density === 'comfortable' ? (
          <DensityMediumIcon className="h-4 w-4" />
        ) : (
          <DensityLargeIcon className="h-4 w-4" />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
