import { Fragment, useMemo } from 'react';
import {
  getSRT_SelectAllHandler,
  parseSRT_HtmlProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';

export interface SRT_ToolbarAlertBannerProps<TData extends SRT_RowData> {
  stackAlertBanner?: boolean;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toolbar alert banner - shows selection state, grouping info, and custom alerts.
 *
 * Ports MRT_ToolbarAlertBanner:
 * - Selected row count with a clear-selection button
 * - Grouped columns rendered as removable chips
 * - head-overlay position renders the select-all checkbox inline
 * - renderToolbarAlertBannerContent custom render slot
 * - srtToolbarAlertBannerProps / srtToolbarAlertBannerChipProps DOM props
 * - density-driven padding and collapse animation
 */
export const SRT_ToolbarAlertBanner = <TData extends SRT_RowData>({
  stackAlertBanner,
  table,
  className,
}: SRT_ToolbarAlertBannerProps<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    getState,
    options: {
      enableRowSelection,
      enableSelectAll,
      localization,
      manualPagination,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
      srtToolbarAlertBannerChipProps,
      srtToolbarAlertBannerProps,
    },
  } = table;

  const { density, grouping, rowSelection, showAlertBanner } = getState();

  const alertProps = parseSRT_HtmlProps(srtToolbarAlertBannerProps, { table });
  const chipProps = parseSRT_HtmlProps(srtToolbarAlertBannerChipProps, {
    table,
  });

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
          onClick={(event) =>
            getSRT_SelectAllHandler({ table })(event, false, true)
          }
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
            <span
              {...chipProps}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold',
                chipProps?.className,
              )}
            >
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

  // Density-driven padding parity with MRT. The non-head-overlay banner uses a
  // fixed 0.5rem/1rem inset; head-overlay tightens with density.
  const contentPadding =
    positionToolbarAlertBanner !== 'head-overlay'
      ? 'px-4 py-2'
      : density === 'spacious'
        ? 'px-5 py-3'
        : density === 'comfortable'
          ? 'px-3 py-2'
          : 'px-2 py-1';

  const content = renderToolbarAlertBannerContent?.({
    groupedAlert,
    selectedAlert,
    table,
  }) ?? (
    <div className={cn('flex flex-col gap-2', contentPadding)}>
      <div className="flex items-center gap-2">
        {enableRowSelection &&
          enableSelectAll &&
          positionToolbarAlertBanner === 'head-overlay' && (
            <SRT_SelectCheckbox table={table} />
          )}
        {selectedAlert}
      </div>
      {selectedAlert && groupedAlert && <div className="h-1" />}
      {groupedAlert}
    </div>
  );

  return (
    <div
      {...alertProps}
      className={cn(
        'relative z-[2] w-full overflow-hidden transition-all duration-200',
        // When stacked, the banner pushes content; otherwise the collapse still
        // animates height. The transition timing mirrors MRT's Collapse.
        shouldShow ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
        !stackAlertBanner && positionToolbarAlertBanner === 'bottom' && '-mb-4',
        className,
        alertProps?.className,
      )}
    >
      <div
        className={cn(
          'bg-muted/50',
          positionToolbarAlertBanner !== 'head-overlay' && 'border-b',
        )}
      >
        {content}
      </div>
    </div>
  );
};
