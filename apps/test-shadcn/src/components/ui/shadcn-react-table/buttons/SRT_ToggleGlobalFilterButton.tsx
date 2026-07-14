import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: empty toggleGlobalFilterButtonVariants cva deleted (shadcn Button, no
// SRT-owned element/layout). Icon h-4 w-4 dropped (Button auto-sizes svg).

export interface SRT_ToggleGlobalFilterButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_ToggleGlobalFilterButton = <TData extends SRT_RowData>({
  table,
  ...rest
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

  return (
    <SRT_Tooltip title={rest?.title ?? localization.showHideSearch}>
      <Button
        aria-label={rest?.title ?? localization.showHideSearch}
        disabled={!!globalFilter && showGlobalFilter}
        onClick={handleToggleSearch}
        size="icon"
        variant="ghost"
        {...rest}
        className={rest?.className}
        title={undefined}
      >
        {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
      </Button>
    </SRT_Tooltip>
  );
};
