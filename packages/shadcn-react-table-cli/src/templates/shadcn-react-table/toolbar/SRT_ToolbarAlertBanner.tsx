import { Fragment, useMemo } from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

export interface SRT_ToolbarAlertBannerProps<TData extends SRT_RowData> {
  stackAlertBanner?: boolean; // TODO: Use for responsive layout
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toolbar alert banner - shows selection state, grouping info, and custom alerts
 *
 * Barebones implementation:
 * - Shows selected row count
 * - Shows grouped columns with remove buttons
 * - Basic collapse animation
 *
 * TODO (Future enhancements):
 * - Add srtToolbarAlertBannerProps to core package types
 * - Add srtToolbarAlertBannerChipProps for customizing chips
 * - Add renderToolbarAlertBannerContent custom render prop
 * - Improve collapse/expand animation
 * - Add support for custom alert content
 * - Add MRT_SelectCheckbox for head-overlay position
 */

export const SRT_ToolbarAlertBanner = <TData extends SRT_RowData>({
  // stackAlertBanner, // TODO: Use for responsive layout
  table,
  className,
}: SRT_ToolbarAlertBannerProps<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    getState,
    options: {
      enableRowSelection,
      // enableSelectAll, // TODO: Add when implementing select all
      localization,
      manualPagination,
      // positionToolbarAlertBanner, // TODO: Add position support
      // renderToolbarAlertBannerContent, // TODO: Add custom render support
      rowCount,
    },
    // refs: { tableLayoutRef }, // TODO: Add ref support for width calculation
  } = table;

  const {
    // density, // TODO: Add density support for padding
    grouping,
    rowSelection,
    showAlertBanner,
  } = getState();

  const totalRowCount = rowCount ?? getCoreRowModel().rows.length;
  const filteredRowCount = getFilteredSelectedRowModel().rows.length;

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : filteredRowCount,
    [rowSelection, manualPagination, filteredRowCount],
  );

  const selectedAlert =
    enableRowSelection && selectedRowCount > 0 ? (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {localization.selectedCountOfRowCountRowsSelected
            ?.replace(
              '{selectedCount}',
              selectedRowCount.toLocaleString(localization.language),
            )
            ?.replace(
              '{rowCount}',
              totalRowCount.toLocaleString(localization.language),
            )}
        </span>
        <Button
          onClick={() => {
            // TODO: Implement getMRT_SelectAllHandler utility
            // For now, just clear selection manually
            table.resetRowSelection();
          }}
          size="sm"
          variant="ghost"
          className="h-6 px-2"
        >
          {localization.clearSelection}
        </Button>
      </div>
    ) : null;

  const groupedAlert =
    grouping.length > 0 ? (
      <span className="flex items-center gap-2 text-sm">
        {localization.groupedBy}{' '}
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 && (
              <span className="text-muted-foreground">
                {localization.thenBy}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold">
              {table.getColumn(columnId)?.columnDef.header}
              <button
                onClick={() => table.getColumn(columnId)?.toggleGrouping()}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          </Fragment>
        ))}
      </span>
    ) : null;

  const shouldShow = showAlertBanner || !!selectedAlert || !!groupedAlert;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden transition-all duration-200',
        shouldShow ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0',
        className,
      )}
    >
      <div className="border-b bg-muted/50 px-4 py-2">
        <div className="flex flex-col gap-2">
          {selectedAlert}
          {selectedAlert && groupedAlert && <div className="h-1" />}
          {groupedAlert}
        </div>
      </div>
    </div>
  );
};

// TODO: Add these features in future iterations:
// 1. Support for custom alert content via renderToolbarAlertBannerContent
// 2. Support for alert title
// 3. Support for different positions (top, bottom, head-overlay)
// 4. Support for MRT_SelectCheckbox in head-overlay mode
// 5. Better animation with Radix UI Collapsible component
// 6. Width calculation based on table container ref
// 7. Support for srtToolbarAlertBannerProps and srtToolbarAlertBannerChipProps
