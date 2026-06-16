import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleGlobalFilterButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

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
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  const isDisabled = !!globalFilter && showGlobalFilter;

  return (
    <SRT_Tooltip title={localization.showHideSearch} disabled={isDisabled}>
      <Button
        aria-label={localization.showHideSearch}
        className={cn('h-8 w-8', className)}
        disabled={isDisabled}
        onClick={handleToggleSearch}
        size="icon"
        variant="ghost"
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
