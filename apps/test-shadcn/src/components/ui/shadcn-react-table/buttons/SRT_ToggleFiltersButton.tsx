import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const toggleFiltersButtonVariants = cva('');

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
        variant="ghost"
        {...rest}
        className={cn(toggleFiltersButtonVariants(), rest?.className)}
        title={undefined}
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
