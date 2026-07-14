import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: toggleDensePaddingButtonVariants cva deleted — only carried h-9 w-9 to
// restyle the shadcn Button (matches size="icon" size-9 anyway). Icon h-4 w-4
// dropped (Button auto-sizes svg to size-4).

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
        className={rest?.className}
        title={undefined}
      >
        {density === 'compact' ? (
          <DensitySmallIcon />
        ) : density === 'comfortable' ? (
          <DensityMediumIcon />
        ) : (
          <DensityLargeIcon />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
