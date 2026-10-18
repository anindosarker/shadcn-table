import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type ST_RowData,
  type ST_TableInstance,
} from '../types';
import { ST_ShowHideColumnsButton } from '../buttons/ST_ShowHideColumnsButton';
import { ST_ToggleDensePaddingButton } from '../buttons/ST_ToggleDensePaddingButton';
import { ST_ToggleFiltersButton } from '../buttons/ST_ToggleFiltersButton';
import { ST_ToggleFullScreenButton } from '../buttons/ST_ToggleFullScreenButton';
import { ST_ToggleGlobalFilterButton } from '../buttons/ST_ToggleGlobalFilterButton';

export interface ST_ToolbarInternalButtonsProps<TData extends ST_RowData>
  extends DivProps {
  table: ST_TableInstance<TData>;
}

// Note: base maps MRT's sx (alignItems: 'center', display: 'flex', zIndex: 3).
const toolbarInternalButtonsVariants = cva('z-[3] flex items-center');

export const ST_ToolbarInternalButtons = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_ToolbarInternalButtonsProps<TData>) => {
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
