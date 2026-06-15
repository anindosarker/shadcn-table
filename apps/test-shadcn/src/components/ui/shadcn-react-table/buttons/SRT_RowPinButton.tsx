import { type MouseEvent, useState } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_RowPinButtonProps<TData extends SRT_RowData> {
  pinningPosition: 'top' | 'bottom' | false;
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Row pin button - pin/unpin rows to top or bottom.
 *
 * Ported from MRT_RowPinButton:
 * - Toggles row pinning for the given position.
 * - Icon (read from the table icon registry): CloseIcon when pinned,
 *   otherwise a rotated PushPinIcon (rotation depends on
 *   rowPinningDisplayMode / pinningPosition).
 * - Tooltip (localization.unpin / localization.pin) via SRT_Tooltip, controlled
 *   so it opens on hover/focus and closes on click (matches MRT).
 */

export const SRT_RowPinButton = <TData extends SRT_RowData>({
  pinningPosition,
  row,
  table,
  className,
}: SRT_RowPinButtonProps<TData>) => {
  const {
    options: {
      icons: { CloseIcon, PushPinIcon },
      localization,
      rowPinningDisplayMode,
    },
  } = table;

  const isPinned = row.getIsPinned();

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    setTooltipOpened(false);
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
    <SRT_Tooltip
      title={isPinned ? localization.unpin : localization.pin}
      open={tooltipOpened}
      onOpenChange={setTooltipOpened}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleTogglePin}
        onBlur={() => setTooltipOpened(false)}
        onFocus={() => setTooltipOpened(true)}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        aria-label={localization.pin}
        className={cn('h-6 w-6', className)}
      >
        {isPinned ? (
          <CloseIcon className="h-3.5 w-3.5" />
        ) : (
          <PushPinIcon
            className="h-3.5 w-3.5"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
