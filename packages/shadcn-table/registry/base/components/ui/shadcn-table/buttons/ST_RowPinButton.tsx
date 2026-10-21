import { type MouseEvent, useState } from 'react';
import { type RowPinningPosition } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  type ButtonProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

export interface ST_RowPinButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  pinningPosition: RowPinningPosition;
  row: ST_Row<TData>;
  table: ST_TableInstance<TData>;
}

export const ST_RowPinButton = <TData extends ST_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
}: ST_RowPinButtonProps<TData>) => {
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
    <ST_Tooltip
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
    </ST_Tooltip>
  );
};
