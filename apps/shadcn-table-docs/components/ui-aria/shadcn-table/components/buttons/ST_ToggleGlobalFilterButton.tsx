import { Button } from '@/components/ui-aria/button';
import { type ButtonProps } from '@/components/ui-aria/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui-aria/shadcn-table/components/buttons/ST_Tooltip';
import { useSTContext } from '@/components/ui-aria/shadcn-table/context/ST_TableContext';

export type ST_ToggleGlobalFilterButtonProps = ButtonProps;

export const ST_ToggleGlobalFilterButton = ({
  ...rest
}: ST_ToggleGlobalFilterButtonProps) => {
  const table = useSTContext();
  const {
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    setGlobalFilter,
    setShowGlobalFilter,
  } = table;

  // Closed, a click opens the field, which focuses itself; open, one click
  // clears the search and closes the field.
  const handleToggleSearch = () => {
    if (table.atoms.showGlobalFilter.get()) {
      setGlobalFilter(undefined);
      setShowGlobalFilter(false);
    } else {
      setShowGlobalFilter(true);
    }
  };

  return (
    <table.Subscribe selector={(state) => state.showGlobalFilter}>
      {(showGlobalFilter) => (
        <ST_Tooltip title={rest?.title ?? localization.showHideSearch}>
          <Button
            aria-label={rest?.title ?? localization.showHideSearch}
            onClick={handleToggleSearch}
            size="icon"
            type="button"
            variant="ghost"
            {...rest}
          >
            {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
          </Button>
        </ST_Tooltip>
      )}
    </table.Subscribe>
  );
};
