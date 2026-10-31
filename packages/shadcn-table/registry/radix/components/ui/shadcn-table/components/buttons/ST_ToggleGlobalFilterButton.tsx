import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

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
    setShowGlobalFilter,
  } = table;

  const handleToggleSearch = () => {
    setShowGlobalFilter(!table.atoms.showGlobalFilter.get());
  };

  return (
    <table.Subscribe
      selector={(state) => ({
        globalFilter: state.globalFilter,
        showGlobalFilter: state.showGlobalFilter,
      })}
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
    </table.Subscribe>
  );
};
