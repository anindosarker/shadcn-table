import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import { ST_ShowHideColumnsButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ShowHideColumnsButton';
import { ST_ToggleDensePaddingButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ToggleDensePaddingButton';
import { ST_ToggleFiltersButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ToggleFiltersButton';
import { ST_ToggleFullScreenButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ToggleFullScreenButton';
import { ST_ToggleGlobalFilterButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ToggleGlobalFilterButton';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';

export type ST_ToolbarInternalButtonsProps = DivProps;

const toolbarInternalButtonsVariants = cva('z-3 flex items-center');

export const ST_ToolbarInternalButtons = <TData extends ST_RowData>({
  ...rest
}: ST_ToolbarInternalButtonsProps) => {
  const table = useSTContext<TData>();
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
            !initialState?.showGlobalFilter && <ST_ToggleGlobalFilterButton />}
          {enableFilters &&
            enableColumnFilters &&
            columnFilterDisplayMode !== 'popover' && <ST_ToggleFiltersButton />}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
            <ST_ShowHideColumnsButton />
          )}
          {enableDensityToggle && <ST_ToggleDensePaddingButton />}
          {enableFullScreenToggle && <ST_ToggleFullScreenButton />}
        </>
      )}
    </div>
  );
};
