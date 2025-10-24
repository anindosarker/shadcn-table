import { FilterIcon, FilterXIcon } from 'lucide-react';
import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SRT_ToggleFiltersButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle filters button - show/hide column filters
 *
 * Barebones implementation:
 * - Toggles column filter visibility
 * - Filter icon changes based on state
 * - Filter icon = filters off, FilterX icon = filters on
 *
 * TODO (Future enhancements):
 * - Add tooltip
 * - Add filter count badge
 * - Add keyboard shortcuts
 * - Add animation on toggle
 * - Add clear all filters functionality
 */

export const SRT_ToggleFiltersButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleFiltersButtonProps<TData>) => {
  const {
    getState,
    options: { localization },
    setShowColumnFilters,
  } = table;
  const { showColumnFilters } = getState();

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleShowFilters}
      title={localization.showHideFilters}
      aria-label={localization.showHideFilters}
      className={cn('h-9 w-9', className)}
    >
      {showColumnFilters ? (
        <FilterXIcon className="h-4 w-4" />
      ) : (
        <FilterIcon className="h-4 w-4" />
      )}
    </Button>
  );
};
