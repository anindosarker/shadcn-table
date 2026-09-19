import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleFiltersButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_ToggleFiltersButton = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_ToggleFiltersButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { FilterListIcon, FilterListOffIcon },
      localization,
    },
    setShowColumnFilters,
  } = table;
  const { showColumnFilters } = getState();

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters);
  };

  return (
    <SRT_Tooltip title={rest?.title ?? localization.showHideFilters}>
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
    </SRT_Tooltip>
  );
};
