import { Subscribe } from '@tanstack/react-table';
import { Button } from '@/components/ui-aria/button';
import { type ButtonProps } from '@/components/ui-aria/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui-aria/shadcn-table/components/buttons/ST_Tooltip';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';

export type ST_ToggleFiltersButtonProps = ButtonProps;

export const ST_ToggleFiltersButton = ({
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
