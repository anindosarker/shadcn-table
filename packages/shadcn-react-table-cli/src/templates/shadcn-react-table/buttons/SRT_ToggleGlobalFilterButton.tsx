import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SearchIcon, SearchXIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SRT_ToggleGlobalFilterButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle global filter button - shows/hides global search input
 *
 * Barebones implementation:
 * - Toggles global filter visibility
 * - Shows appropriate icon (Search/SearchOff)
 * - Auto-focuses search input when shown
 * - Disabled when filter is active and visible
 *
 * TODO (Future enhancements):
 * - Add Tooltip component from shadcn
 * - Add custom icon support via table.options.icons
 * - Add srtToggleGlobalFilterButtonProps to core package types
 * - Add animation on toggle
 * - Add keyboard shortcut (e.g., Cmd+K or Ctrl+K)
 */

export const SRT_ToggleGlobalFilterButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      // icons, // TODO: Add custom icon support
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
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleSearch}
      disabled={isDisabled}
      aria-label={localization.showHideSearch}
      title={localization.showHideSearch}
      className={cn('h-8 w-8', className)}
    >
      {showGlobalFilter ? (
        <SearchXIcon className="h-4 w-4" />
      ) : (
        <SearchIcon className="h-4 w-4" />
      )}
    </Button>
  );
};

// TODO: Add these features in future iterations:
// 1. Shadcn Tooltip component for better UX
// 2. Custom icons via table.options.icons
// 3. Keyboard shortcut support (Cmd+K / Ctrl+K)
// 4. Animation on toggle
// 5. Support for srtToggleGlobalFilterButtonProps
// 6. Badge showing number of filtered results
