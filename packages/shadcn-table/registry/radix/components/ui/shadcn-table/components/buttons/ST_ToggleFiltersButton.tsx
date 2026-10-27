import { Subscribe } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToggleFiltersButtonProps extends ButtonProps {
  /**
   * Transition, part 01 phase 03: ignored, the table comes from the context.
   * Goes in the integration step, once no caller passes it.
   */
  table?: unknown;
}

export const ST_ToggleFiltersButton = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition: kept off the DOM until the callers drop it
  table: _table,
  ...rest
}: ST_ToggleFiltersButtonProps) => {
  const table = useSTContext();
  const {
    options: {
      icons: { FilterListIcon, FilterListOffIcon },
      localization,
    },
    setShowColumnFilters,
  } = table;

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!table.atoms.showColumnFilters.get());
  };

  return (
    <ST_Tooltip title={rest?.title ?? localization.showHideFilters}>
      <Button
        aria-label={localization.showHideFilters}
        onClick={handleToggleShowFilters}
        size="icon"
        type="button"
        variant="ghost"
        {...rest}
        title={undefined}
      >
        <Subscribe source={table.atoms.showColumnFilters}>
          {(showColumnFilters) =>
            showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />
          }
        </Subscribe>
      </Button>
    </ST_Tooltip>
  );
};
