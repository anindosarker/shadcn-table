import { PinIcon } from 'lucide-react';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SRT_ColumnPinningButtonsProps<TData extends SRT_RowData> {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Column pinning buttons - pin columns to left or right
 *
 * Barebones implementation:
 * - Pin to left button
 * - Pin to right button
 * - Unpin button when pinned
 * - Pin icon with rotation for direction
 *
 * TODO (Future enhancements):
 * - Add tooltips
 * - Add animation
 * - Add keyboard shortcuts
 * - Add custom icon support
 */

export const SRT_ColumnPinningButtons = <TData extends SRT_RowData>({
  column,
  table,
  className,
}: SRT_ColumnPinningButtonsProps<TData>) => {
  const {
    options: { localization },
  } = table;

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
  };

  const isPinned = column.getIsPinned();

  return (
    <div className={cn('flex min-w-[70px] justify-center gap-1', className)}>
      {isPinned ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePinColumn(false)}
          title={localization.unpin}
          className="h-8 w-8"
        >
          <PinIcon className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePinColumn('left')}
            title={localization.pinToLeft}
            className="h-8 w-8"
          >
            <PinIcon
              className="h-4 w-4"
              style={{ transform: 'rotate(90deg)' }}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePinColumn('right')}
            title={localization.pinToRight}
            className="h-8 w-8"
          >
            <PinIcon
              className="h-4 w-4"
              style={{ transform: 'rotate(-90deg)' }}
            />
          </Button>
        </>
      )}
    </div>
  );
};
