import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { ST_ShowHideColumnsButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_ShowHideColumnsButton';
import { ST_ToggleDensePaddingButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_ToggleDensePaddingButton';
import { ST_ToggleFiltersButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_ToggleFiltersButton';
import { ST_ToggleFullScreenButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_ToggleFullScreenButton';
import { ST_ToggleGlobalFilterButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_ToggleGlobalFilterButton';
import { ST_FilterPickerButton } from '@/components/ui-base/shadcn-table/components/toolbar/ST_FilterChips';
import { ST_SortPopover } from '@/components/ui-base/shadcn-table/components/toolbar/ST_SortPopover';
import { ST_ViewSettingsButton } from '@/components/ui-base/shadcn-table/components/toolbar/ST_ViewSettingsButton';
import { ST_ViewSettingsItems } from '@/components/ui-base/shadcn-table/components/toolbar/ST_ViewSettingsItems';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export type ST_ToolbarInternalButtonsProps = DivProps;

const toolbarInternalButtonsVariants = cva(
  'z-3 flex h-9 shrink-0 items-center gap-0.5 self-start',
);

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
      enableSortPopover,
      enableSorting,
      enableViewSettings,
      initialState,
      renderToolbarInternalActions,
    },
  } = table;
  const hasColumnFilters = enableFilters && enableColumnFilters;

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
          {hasColumnFilters && columnFilterDisplayMode === 'chips' && (
            <ST_FilterPickerButton table={table} />
          )}
          {hasColumnFilters && columnFilterDisplayMode === 'subheader' && (
            <ST_ToggleFiltersButton />
          )}
          {enableSorting && enableSortPopover === true && (
            <ST_SortPopover table={table} />
          )}
          {enableViewSettings === true ? (
            <ST_ViewSettingsItems table={table} />
          ) : (
            <>
              {(enableHiding ||
                enableColumnOrdering ||
                enableColumnPinning) && <ST_ShowHideColumnsButton />}
              {enableDensityToggle && <ST_ToggleDensePaddingButton />}
            </>
          )}
          {enableFullScreenToggle && <ST_ToggleFullScreenButton />}
          {enableViewSettings === true && (
            <ST_ViewSettingsButton table={table} />
          )}
        </>
      )}
    </div>
  );
};
