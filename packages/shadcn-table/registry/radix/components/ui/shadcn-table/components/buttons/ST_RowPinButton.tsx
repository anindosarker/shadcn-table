import { type MouseEvent, useState } from 'react';
import { type RowPinningPosition, Subscribe } from '@tanstack/react-table';
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
  /**
   * Transition, part 01 phase 03: ignored, the table comes from the row. Goes
   * in the integration step, once no caller passes it.
   */
  table?: unknown;
}

export const ST_RowPinButton = <TData extends ST_RowData>({
  pinningPosition,
  row,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition: kept off the DOM until the callers drop it
  table: _table,
  ...rest
}: ST_RowPinButtonProps<TData>) => {
  // The row carries the core table, which holds the ST options, atoms, refs
  // and setters; the ST wrapper types do not re-type it.
  const table = row.table as unknown as ST_TableInstance<TData>;
  const {
    options: {
      icons: { CloseIcon, PushPinIcon },
      localization,
      rowPinningDisplayMode,
    },
  } = table;

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    setTooltipOpened(false);
    event.stopPropagation();
    row.pin(row.getIsPinned() ? false : pinningPosition);
  };

  return (
    <Subscribe source={table.atoms.rowPinning}>
      {() => {
        const isPinned = row.getIsPinned();

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
      }}
    </Subscribe>
  );
};
