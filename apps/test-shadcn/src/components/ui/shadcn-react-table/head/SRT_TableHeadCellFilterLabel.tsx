import { type MouseEvent, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer';

export interface SRT_TableHeadCellFilterLabelProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter label - filter indicator icon/chip in column header
 *
 * Barebones implementation:
 * - Filter icon button
 * - Shows when filter is active
 * - Click to focus filter input
 * - Opacity indicates active state
 * - Slide in animation
 *
 * TODO (Future enhancements):
 * - Add popover mode for filters
 * - Add tooltip showing filter details
 * - Add filter value display
 * - Add custom filter label formatting
 * - Add SRT_TableHeadCellFilterContainer integration
 */

export const SRT_TableHeadCellFilterLabel = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_TableHeadCellFilterLabelProps<TData>) => {
  const {
    options: { columnFilterDisplayMode, localization },
    refs: { filterInputRefs },
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const filterValue = column.getFilterValue() as [string, string] | string;

  const [_anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Check if filter is active
  const isFilterActive =
    (Array.isArray(filterValue) && filterValue.some(Boolean)) ||
    (!!filterValue && !Array.isArray(filterValue));

  // Determine if we should show the icon
  const shouldShow = columnFilterDisplayMode === 'popover' || isFilterActive;

  if (!shouldShow) return null;

  const filterTooltip =
    columnFilterDisplayMode === 'popover' && !isFilterActive
      ? localization.filterByColumn?.replace(
          '{column}',
          String(columnDef.header),
        )
      : localization.filteringByColumn?.replace(
          '{column}',
          String(columnDef.header),
        );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (columnFilterDisplayMode === 'popover') {
          setAnchorEl(event.currentTarget);
        } else {
          setShowColumnFilters(true);
        }
        queueMicrotask(() => {
          filterInputRefs.current?.[`${column.id}-0`]?.focus?.();
          filterInputRefs.current?.[`${column.id}-0`]?.select?.();
        });
        event.stopPropagation();
      }}
      title={filterTooltip}
      className={cn(
        'ml-1 h-4 w-4 scale-75 p-2 transition-all',
        isFilterActive ? 'opacity-100' : 'opacity-30',
        'animate-in zoom-in-50 duration-200',
        className,
      )}
    >
      <FilterIcon className="h-4 w-4" />
    </Button>
    // TODO: Add popover mode
    // {columnFilterDisplayMode === 'popover' && anchorEl && (
    //   <Popover>
    //     <SRT_TableHeadCellFilterContainer header={header} table={table} />
    //   </Popover>
    // )}
  );
};
