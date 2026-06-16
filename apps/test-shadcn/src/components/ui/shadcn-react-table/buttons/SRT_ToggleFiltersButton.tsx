import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleFiltersButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_ToggleFiltersButton = <TData extends SRT_RowData>({
  table,
  className,
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
    <SRT_Tooltip title={localization.showHideFilters}>
      <Button
        aria-label={localization.showHideFilters}
        className={cn('h-9 w-9', className)}
        onClick={handleToggleShowFilters}
        size="icon"
        variant="ghost"
      >
        {showColumnFilters ? (
          <FilterListOffIcon className="h-4 w-4" />
        ) : (
          <FilterListIcon className="h-4 w-4" />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
