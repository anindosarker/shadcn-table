import { ArrowDownIcon, ArrowUpDownIcon } from 'lucide-react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SRT_TableHeadCellSortLabelProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Sort label - clickable sort indicator with icon
 *
 * Barebones implementation:
 * - Arrow icon showing sort direction
 * - Click to toggle sort
 * - Badge showing sort index for multi-sort
 * - Opacity effect for inactive state
 * - ArrowUpDown icon when not sorted
 * - ArrowDown icon rotated for asc/desc
 *
 * TODO (Future enhancements):
 * - Add tooltip with sort state
 * - Add keyboard shortcuts
 * - Add custom icon support
 * - Add animation on sort change
 * - Add loading state
 */

export const SRT_TableHeadCellSortLabel = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_TableHeadCellSortLabelProps<TData>) => {
  const {
    getState,
    options: { localization },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { isLoading, showSkeletons, sorting } = getState();

  const isSorted = !!column.getIsSorted();
  const sortDirection = column.getIsSorted();

  const sortTooltip =
    isLoading || showSkeletons
      ? ''
      : sortDirection
        ? sortDirection === 'desc'
          ? localization.sortedByColumnDesc.replace(
              '{column}',
              columnDef.header,
            )
          : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortByColumnAsc.replace('{column}', columnDef.header);

  const sortIndex = column.getSortIndex();
  const showBadge = sorting.length > 1;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        header.column.getToggleSortingHandler()?.(e);
      }}
      title={sortTooltip}
      aria-label={sortTooltip}
      className={cn(
        'relative h-8 w-8 flex-none transition-opacity',
        isSorted ? 'opacity-100' : 'opacity-30',
        className,
      )}
    >
      {showBadge && isSorted && (
        <Badge
          variant="secondary"
          className="absolute -right-1 -top-1 h-4 min-w-[1rem] p-0 text-[10px]"
        >
          {sortIndex + 1}
        </Badge>
      )}
      {isSorted ? (
        <ArrowDownIcon
          className={cn(
            'h-4 w-4 transition-transform',
            sortDirection === 'asc' && 'rotate-180',
          )}
        />
      ) : (
        <ArrowUpDownIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};
