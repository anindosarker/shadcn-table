import { ChevronsDownIcon } from 'lucide-react';
import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SRT_ExpandAllButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Expand all button - toggle expansion of all rows
 *
 * Barebones implementation:
 * - Double chevron icon with rotation animation
 * - Expands/collapses all expandable rows
 * - Disabled when loading or no expandable rows
 * - Shows partial state (some expanded)
 *
 * TODO (Future enhancements):
 * - Add tooltip
 * - Add srtExpandAllButtonProps support
 * - Add custom icon support
 * - Add loading spinner
 * - Add keyboard shortcuts
 */

export const SRT_ExpandAllButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: { localization, renderDetailPanel },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const isAllRowsExpanded = getIsAllRowsExpanded();
  const isSomeRowsExpanded = getIsSomeRowsExpanded();

  const isDisabled =
    isLoading || (!renderDetailPanel && !getCanSomeRowsExpand());

  // Rotation: 0deg = collapsed, -90deg = some expanded, -180deg = all expanded
  const rotation = isAllRowsExpanded ? -180 : isSomeRowsExpanded ? -90 : 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
      disabled={isDisabled}
      title={
        isAllRowsExpanded ? localization.collapseAll : localization.expandAll
      }
      aria-label={localization.expandAll}
      className={cn(
        'transition-all',
        density === 'compact' ? 'h-7 w-7' : 'h-9 w-9',
        density !== 'compact' && '-mt-1',
        className,
      )}
    >
      <ChevronsDownIcon
        className="h-4 w-4 transition-transform duration-150"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </Button>
  );
};
