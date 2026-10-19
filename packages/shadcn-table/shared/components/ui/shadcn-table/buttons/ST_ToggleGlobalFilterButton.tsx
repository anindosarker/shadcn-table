import { Button } from '@/components/ui/button';
import {
  type ButtonProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

export interface ST_ToggleGlobalFilterButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  table: ST_TableInstance<TData>;
}

export const ST_ToggleGlobalFilterButton = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = table.state;

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter);
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  return (
    <ST_Tooltip title={rest?.title ?? localization.showHideSearch}>
      <Button
        aria-label={rest?.title ?? localization.showHideSearch}
        disabled={!!globalFilter && showGlobalFilter}
        onClick={handleToggleSearch}
        size="icon"
        type="button"
        variant="ghost"
        {...rest}
        title={undefined}
      >
        {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
      </Button>
    </ST_Tooltip>
  );
};
