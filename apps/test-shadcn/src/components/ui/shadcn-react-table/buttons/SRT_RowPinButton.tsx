import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type RowPinningPosition,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const rowPinButtonVariants = cva('h-6 w-6');

export interface SRT_RowPinButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  pinningPosition: RowPinningPosition;
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_RowPinButton = <TData extends SRT_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
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

  return (
    <SRT_Tooltip
      open={tooltipOpened}
      title={isPinned ? localization.unpin : localization.pin}
    >
      <Button
        aria-label={localization.pin}
        onBlur={() => setTooltipOpened(false)}
        onClick={handleTogglePin}
        onFocus={() => setTooltipOpened(true)}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        size="icon"
        variant="ghost"
        {...rest}
        className={cn(rowPinButtonVariants(), rest?.className)}
      >
        {isPinned ? (
          <CloseIcon className="h-4 w-4" />
        ) : (
          <PushPinIcon
            className={cn(
              'h-4 w-4',
              rowPinningDisplayMode === 'sticky'
                ? 'rotate-[135deg]'
                : pinningPosition === 'top'
                  ? 'rotate-180'
                  : '',
            )}
          />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
