import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleDensePaddingButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle density button - cycles through table density options.
 *
 * Ported from MRT_ToggleDensePaddingButton:
 * - Cycles comfortable -> compact -> spacious -> comfortable.
 * - Icon (read from the table icon registry) reflects current density:
 *   DensitySmallIcon (compact), DensityMediumIcon (comfortable),
 *   DensityLargeIcon (spacious).
 * - Tooltip (localization.toggleDensity) via SRT_Tooltip.
 */

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
        variant="ghost"
        size="icon"
        onClick={handleToggleDensePadding}
        aria-label={localization.toggleDensity}
        className={cn('h-8 w-8', className)}
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
