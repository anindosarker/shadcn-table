import { type MouseEvent } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SRT_ExpandButtonProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Expand button - toggle row expansion
 *
 * Barebones implementation:
 * - Chevron icon that rotates when expanded
 * - Indents based on row depth
 * - Disabled when row can't expand
 * - Smooth rotation transition
 *
 * TODO (Future enhancements):
 * - Add tooltip
 * - Add srtExpandButtonProps support
 * - Add custom icon support
 * - Add keyboard shortcuts
 * - Add loading state for async expansion
 */

export const SRT_ExpandButton = <TData extends SRT_RowData>({
  row,
  table,
  className,
}: SRT_ExpandButtonProps<TData>) => {
  const {
    getState,
    options: { localization, positionExpandColumn, renderDetailPanel },
  } = table;
  const { density } = getState();

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();
  const detailPanel = !!renderDetailPanel?.({ row, table });

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
  };

  const isDisabled = !canExpand && !detailPanel;

  // Calculate rotation based on expand state and position
  const rotation =
    !canExpand && !renderDetailPanel
      ? positionExpandColumn === 'last'
        ? 90
        : -90
      : isExpanded
        ? -180
        : 0;

  // Calculate indent based on row depth
  const indentPixels = row.depth * 16;
  const indentStyle =
    positionExpandColumn === 'last'
      ? { marginRight: `${indentPixels}px` }
      : { marginLeft: `${indentPixels}px` };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleExpand}
      disabled={isDisabled}
      title={isExpanded ? localization.collapse : localization.expand}
      aria-label={localization.expand}
      style={indentStyle}
      className={cn(
        'transition-all duration-150',
        density === 'compact' ? 'h-7 w-7' : 'h-9 w-9',
        isDisabled && 'opacity-30',
        className,
      )}
    >
      <ChevronDownIcon
        className="h-4 w-4 transition-transform duration-150"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </Button>
  );
};
