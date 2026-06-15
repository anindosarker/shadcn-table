import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleGlobalFilterButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle global filter button - shows/hides the global search input.
 *
 * Ported from MRT_ToggleGlobalFilterButton:
 * - Toggles global filter visibility and focuses the search input when shown.
 * - Icon (read from the table icon registry) reflects state:
 *   SearchOffIcon when the search is shown, SearchIcon otherwise.
 * - Disabled while a global filter value is active and visible; the tooltip is
 *   suppressed in that disabled state (matches MRT).
 * - Tooltip (localization.showHideSearch) via SRT_Tooltip.
 */

export const SRT_ToggleGlobalFilterButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter);
    // Focus the search input after it's shown
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  const isDisabled = !!globalFilter && showGlobalFilter;

  return (
    <SRT_Tooltip title={localization.showHideSearch} disabled={isDisabled}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleSearch}
        disabled={isDisabled}
        aria-label={localization.showHideSearch}
        className={cn('h-8 w-8', className)}
      >
        {showGlobalFilter ? (
          <SearchOffIcon className="h-4 w-4" />
        ) : (
          <SearchIcon className="h-4 w-4" />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
