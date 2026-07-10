import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_ShowHideColumnsButton } from '../buttons/SRT_ShowHideColumnsButton';
import { SRT_ToggleDensePaddingButton } from '../buttons/SRT_ToggleDensePaddingButton';
import { SRT_ToggleFiltersButton } from '../buttons/SRT_ToggleFiltersButton';
import { SRT_ToggleFullScreenButton } from '../buttons/SRT_ToggleFullScreenButton';
import { SRT_ToggleGlobalFilterButton } from '../buttons/SRT_ToggleGlobalFilterButton';

export interface SRT_ToolbarInternalButtonsProps<TData extends SRT_RowData>
  extends DivProps {
  table: SRT_TableInstance<TData>;
}

// Note: base maps MRT's sx (alignItems: 'center', display: 'flex', zIndex: 3).
const toolbarInternalButtonsVariants = cva('z-[3] flex items-center');

export const SRT_ToolbarInternalButtons = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_ToolbarInternalButtonsProps<TData>) => {
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
              <SRT_ToggleGlobalFilterButton table={table} />
            )}
          {enableFilters &&
            enableColumnFilters &&
            columnFilterDisplayMode !== 'popover' && (
              <SRT_ToggleFiltersButton table={table} />
            )}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
            <SRT_ShowHideColumnsButton table={table} />
          )}
          {enableDensityToggle && (
            <SRT_ToggleDensePaddingButton table={table} />
          )}
          {enableFullScreenToggle && (
            <SRT_ToggleFullScreenButton table={table} />
          )}
        </>
      )}
    </div>
  );
};
