import { type MouseEvent, useState } from 'react';
import {
  type ButtonProps,
  type RowPinningPosition,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

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
        size="icon-sm"
        type="button"
        variant="ghost"
        {...rest}
        // sx={{ height: '24px', width: '24px' }}
        // Note: 24px box dropped; size="icon-sm" per the MUI-small icon-button ruling.
      >
        {isPinned ? (
          <CloseIcon />
        ) : (
          <PushPinIcon
            className={
              rowPinningDisplayMode === 'sticky'
                ? 'rotate-[135deg]'
                : pinningPosition === 'top'
                  ? 'rotate-180'
                  : ''
            }
          />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
