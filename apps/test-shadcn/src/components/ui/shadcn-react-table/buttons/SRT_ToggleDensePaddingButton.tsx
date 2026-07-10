import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const toggleDensePaddingButtonVariants = cva('h-9 w-9');

export interface SRT_ToggleDensePaddingButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_ToggleDensePaddingButton = <TData extends SRT_RowData>({
  table,
  ...rest
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
    <SRT_Tooltip title={rest?.title ?? localization.toggleDensity}>
      <Button
        aria-label={localization.toggleDensity}
        onClick={handleToggleDensePadding}
        size="icon"
        variant="ghost"
        {...rest}
        className={cn(toggleDensePaddingButtonVariants(), rest?.className)}
        title={undefined}
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
