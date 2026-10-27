import { Button } from '@/components/ui/button';
import {
  type ButtonProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToggleFiltersButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  table?: ST_TableInstance<TData>;
}

export const ST_ToggleFiltersButton = <TData extends ST_RowData>({
  table: tableProp,
  ...rest
}: ST_ToggleFiltersButtonProps<TData>) => {
  const context = useSTContext<TData>();
  const table = tableProp ?? context;
  const {
    options: {
      icons: { FilterListIcon, FilterListOffIcon },
      localization,
    },
    setShowColumnFilters,
  } = table;
  const { showColumnFilters } = table.state;

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters);
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
        {showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />}
      </Button>
    </ST_Tooltip>
  );
};
