import { Subscribe } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToggleDensePaddingButtonProps extends ButtonProps {
  /**
   * Transition, part 01 phase 03: ignored, the table comes from the context.
   * Goes in the integration step, once no caller passes it.
   */
  table?: unknown;
}

export const ST_ToggleDensePaddingButton = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition: kept off the DOM until the callers drop it
  table: _table,
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
