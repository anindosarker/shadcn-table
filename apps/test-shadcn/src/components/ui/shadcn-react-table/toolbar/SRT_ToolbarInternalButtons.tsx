import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_ShowHideColumnsButton } from '../buttons/SRT_ShowHideColumnsButton';
import { SRT_ToggleDensePaddingButton } from '../buttons/SRT_ToggleDensePaddingButton';
import { SRT_ToggleFiltersButton } from '../buttons/SRT_ToggleFiltersButton';
import { SRT_ToggleFullScreenButton } from '../buttons/SRT_ToggleFullScreenButton';
import { SRT_ToggleGlobalFilterButton } from '../buttons/SRT_ToggleGlobalFilterButton';

export interface SRT_ToolbarInternalButtonsProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_ToolbarInternalButtons = <TData extends SRT_RowData>({
  table,
  className,
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
    <div className={cn('z-[3] flex items-center gap-1', className)}>
      {renderToolbarInternalActions?.({ table }) ?? (
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
