import { type MouseEvent } from 'react';
import { PinIcon, XIcon } from 'lucide-react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SRT_RowPinButtonProps<TData extends SRT_RowData> {
  pinningPosition: 'top' | 'bottom' | false;
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Row pin button - pin/unpin rows to top or bottom
 *
 * Barebones implementation:
 * - Toggle row pinning
 * - Pin icon with rotation based on position
 * - Unpin with X icon when pinned
 *
 * TODO (Future enhancements):
 * - Add tooltip
 * - Add pin animation
 * - Add custom icon support
 * - Add keyboard shortcuts
 */

export const SRT_RowPinButton = <TData extends SRT_RowData>({
  pinningPosition,
  row,
  table,
  className,
}: SRT_RowPinButtonProps<TData>) => {
  const {
    options: { localization, rowPinningDisplayMode },
  } = table;

  const isPinned = row.getIsPinned();

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.pin(isPinned ? false : pinningPosition);
  };

  const rotation =
    rowPinningDisplayMode === 'sticky'
      ? 135
      : pinningPosition === 'top'
        ? 180
        : 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleTogglePin}
      title={isPinned ? localization.unpin : localization.pin}
      aria-label={localization.pin}
      className={cn('h-6 w-6', className)}
    >
      {isPinned ? (
        <XIcon className="h-3.5 w-3.5" />
      ) : (
        <PinIcon
          className="h-3.5 w-3.5"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      )}
    </Button>
  );
};
