import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ColumnPinningButtonsProps<TData extends SRT_RowData> {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Column pinning buttons - pin columns to left or right.
 *
 * Ported from MRT_ColumnPinningButtons:
 * - Pin-to-left / pin-to-right buttons (rotated PushPin icon) when unpinned.
 * - Unpin button when pinned.
 * - Each button is wrapped in a tooltip (localization.pinToLeft / pinToRight /
 *   unpin) via SRT_Tooltip.
 * - The pin icon is read from the table's icon registry (PushPinIcon).
 */

export const SRT_ColumnPinningButtons = <TData extends SRT_RowData>({
  column,
  table,
  className,
}: SRT_ColumnPinningButtonsProps<TData>) => {
  const {
    options: {
      icons: { PushPinIcon },
      localization,
    },
  } = table;

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
  };

  return (
    <div className={cn('flex min-w-[70px] justify-center gap-1', className)}>
      {column.getIsPinned() ? (
        <SRT_Tooltip title={localization.unpin}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePinColumn(false)}
            aria-label={localization.unpin}
            className="h-8 w-8"
          >
            <PushPinIcon className="h-4 w-4" />
          </Button>
        </SRT_Tooltip>
      ) : (
        <>
          <SRT_Tooltip title={localization.pinToLeft}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePinColumn('left')}
              aria-label={localization.pinToLeft}
              className="h-8 w-8"
            >
              <PushPinIcon
                className="h-4 w-4"
                style={{ transform: 'rotate(90deg)' }}
              />
            </Button>
          </SRT_Tooltip>
          <SRT_Tooltip title={localization.pinToRight}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePinColumn('right')}
              aria-label={localization.pinToRight}
              className="h-8 w-8"
            >
              <PushPinIcon
                className="h-4 w-4"
                style={{ transform: 'rotate(-90deg)' }}
              />
            </Button>
          </SRT_Tooltip>
        </>
      )}
    </div>
  );
};
