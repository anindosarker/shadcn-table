import { Subscribe } from '@tanstack/react-table';
import { Button } from '@/components/ui-radix/button';
import { type ButtonProps } from '@/components/ui-radix/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';

export type ST_ToggleDensePaddingButtonProps = ButtonProps;

export const ST_ToggleDensePaddingButton = ({
  ...rest
}: ST_ToggleDensePaddingButtonProps) => {
  const table = useSTContext();
  const {
    options: {
      icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon },
      localization,
    },
    setDensity,
  } = table;

  const handleToggleDensePadding = () => {
    const density = table.atoms.density.get();
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable';
    setDensity(nextDensity);
  };

  return (
    <ST_Tooltip title={rest?.title ?? localization.toggleDensity}>
      <Button
        aria-label={localization.toggleDensity}
        onClick={handleToggleDensePadding}
        size="icon"
        type="button"
        variant="ghost"
        {...rest}
        title={undefined}
      >
        <Subscribe source={table.atoms.density}>
          {(density) =>
            density === 'compact' ? (
              <DensitySmallIcon />
            ) : density === 'comfortable' ? (
              <DensityMediumIcon />
            ) : (
              <DensityLargeIcon />
            )
          }
        </Subscribe>
      </Button>
    </ST_Tooltip>
  );
};
