import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_ShowHideColumnsButton } from '@/components/ui/shadcn-table/components/buttons/ST_ShowHideColumnsButton';
import { ST_ToggleDensePaddingButton } from '@/components/ui/shadcn-table/components/buttons/ST_ToggleDensePaddingButton';
import { ST_ToggleFiltersButton } from '@/components/ui/shadcn-table/components/buttons/ST_ToggleFiltersButton';
import { ST_ToggleFullScreenButton } from '@/components/ui/shadcn-table/components/buttons/ST_ToggleFullScreenButton';
import { ST_ToggleGlobalFilterButton } from '@/components/ui/shadcn-table/components/buttons/ST_ToggleGlobalFilterButton';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToolbarInternalButtonsProps<TData extends ST_RowData>
  extends DivProps {
  table?: ST_TableInstance<TData>;
}

// Note: base maps MRT's sx (alignItems: 'center', display: 'flex', zIndex: 3).
const toolbarInternalButtonsVariants = cva('z-[3] flex items-center');

export const ST_ToolbarInternalButtons = <TData extends ST_RowData>({
  table: tableProp,
  ...rest
}: ST_ToolbarInternalButtonsProps<TData>) => {
  const context = useSTContext<TData>();
  const table = tableProp ?? context;
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      initialState,
      renderToolbarInternalActions,
    },
  } = table;

  return (
    <div
      {...rest}
      className={cn(
        toolbarInternalButtonsVariants({ className: rest.className }),
      )}
    >
      {renderToolbarInternalActions?.({
        table,
      }) ?? (
        <>
          {enableFilters &&
            enableGlobalFilter &&
            !initialState?.showGlobalFilter && (
              <ST_ToggleGlobalFilterButton table={table} />
            )}
          {enableFilters &&
            enableColumnFilters &&
            columnFilterDisplayMode !== 'popover' && (
              <ST_ToggleFiltersButton table={table} />
            )}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
            <ST_ShowHideColumnsButton table={table} />
          )}
          {enableDensityToggle && <ST_ToggleDensePaddingButton table={table} />}
          {enableFullScreenToggle && (
            <ST_ToggleFullScreenButton table={table} />
          )}
        </>
      )}
    </div>
  );
};
