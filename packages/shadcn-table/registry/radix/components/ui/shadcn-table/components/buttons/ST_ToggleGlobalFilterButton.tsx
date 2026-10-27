import { Subscribe } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToggleGlobalFilterButtonProps extends ButtonProps {
  /**
   * Transition, part 01 phase 03: ignored, the table comes from the context.
   * Goes in the integration step, once no caller passes it.
   */
  table?: unknown;
}

export const ST_ToggleGlobalFilterButton = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition: kept off the DOM until the callers drop it
  table: _table,
  ...rest
}: ST_ToggleGlobalFilterButtonProps) => {
  const table = useSTContext();
  const {
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table;

  const handleToggleSearch = () => {
    setShowGlobalFilter(!table.atoms.showGlobalFilter.get());
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  return (
    <Subscribe
      selector={(state) => ({
        globalFilter: state.globalFilter,
        showGlobalFilter: state.showGlobalFilter,
      })}
      source={table.store}
    >
      {({ globalFilter, showGlobalFilter }) => (
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
      )}
    </Subscribe>
  );
};
