import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

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
        type="button"
        variant="ghost"
        {...rest}
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
