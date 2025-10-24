import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_ToggleFullScreenButton } from '../buttons/SRT_ToggleFullScreenButton';
import { SRT_ToggleDensePaddingButton } from '../buttons/SRT_ToggleDensePaddingButton';
import { SRT_ToggleGlobalFilterButton } from '../buttons/SRT_ToggleGlobalFilterButton';

export interface SRT_ToolbarInternalButtonsProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toolbar internal buttons - renders built-in toolbar action buttons
 *
 * Barebones implementation:
 * - Placeholder for future button components
 * - Proper layout structure
 *
 * TODO: Scaffold these button components (in buttons/ folder):
 * - SRT_ToggleGlobalFilterButton
 * - SRT_ToggleFiltersButton
 * - SRT_ShowHideColumnsButton
 * - SRT_ToggleDensePaddingButton
 * - SRT_ToggleFullScreenButton
 *
 * TODO (Future enhancements):
 * - Add renderToolbarInternalActions custom render prop
 * - Add srtToolbarInternalButtonsProps to core package types
 * - Support button ordering/customization
 * - Add tooltips to buttons
 * - Add keyboard shortcuts
 */

export const SRT_ToolbarInternalButtons = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToolbarInternalButtonsProps<TData>) => {
  const {
    options: {
      // columnFilterDisplayMode, // TODO: Uncomment when SRT_ToggleFiltersButton is created
      // enableColumnFilters, // TODO: Uncomment when SRT_ToggleFiltersButton is created
      // enableColumnOrdering, // TODO: Uncomment when SRT_ShowHideColumnsButton is created
      // enableColumnPinning, // TODO: Uncomment when SRT_ShowHideColumnsButton is created
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      // enableHiding, // TODO: Uncomment when SRT_ShowHideColumnsButton is created
      initialState,
      // renderToolbarInternalActions, // TODO: Add custom render support
    },
  } = table;

  return (
    <div className={cn('flex items-center gap-1 z-[3]', className)}>
      {/* Global Filter Toggle */}
      {enableFilters &&
        enableGlobalFilter &&
        !initialState?.showGlobalFilter && (
          <SRT_ToggleGlobalFilterButton table={table} />
        )}

      {/* Column Filters Toggle - TODO: Create SRT_ToggleFiltersButton */}
      {/* {enableFilters &&
        enableColumnFilters &&
        columnFilterDisplayMode !== 'popover' && (
          <SRT_ToggleFiltersButton table={table} />
        )} */}

      {/* Show/Hide Columns Button - TODO: Create SRT_ShowHideColumnsButton */}
      {/* {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
        <SRT_ShowHideColumnsButton table={table} />
      )} */}

      {/* Density Toggle */}
      {enableDensityToggle && <SRT_ToggleDensePaddingButton table={table} />}

      {/* Fullscreen Toggle */}
      {enableFullScreenToggle && <SRT_ToggleFullScreenButton table={table} />}
    </div>
  );
};

// TODO: Create these button components in the buttons/ folder:
// 1. SRT_ToggleGlobalFilterButton - Toggle global search visibility
// 2. SRT_ToggleFiltersButton - Toggle column filters visibility
// 3. SRT_ShowHideColumnsButton - Open column visibility menu
// 4. SRT_ToggleDensePaddingButton - Cycle through density options
// 5. SRT_ToggleFullScreenButton - Toggle fullscreen mode
//
// After creating buttons, update this component to import and render them
