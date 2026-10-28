import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui-radix/button';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Column,
  type ST_ColumnPinningPosition,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/ST_Tooltip';

const columnPinningButtonsVariants = cva('min-w-[70px] text-center');

export interface ST_ColumnPinningButtonsProps<TData extends ST_RowData>
  extends DivProps {
  column: ST_Column<TData>;
}

export const ST_ColumnPinningButtons = <TData extends ST_RowData>({
  className,
  column,
  ...rest
}: ST_ColumnPinningButtonsProps<TData>) => {
  const table = column.table;
  const {
    options: {
      icons: { PushPinIcon },
      localization,
    },
  } = table;

  const handlePinColumn = (pinDirection: ST_ColumnPinningPosition) => {
    column.pin(pinDirection);
  };

  return (
    <Subscribe source={table.atoms.columnPinning}>
      {() => (
        <div
          {...rest}
          className={cn(columnPinningButtonsVariants(), className)}
        >
          {column.getIsPinned() ? (
            <ST_Tooltip title={localization.unpin}>
              <Button
                onClick={() => handlePinColumn(false)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <PushPinIcon />
              </Button>
            </ST_Tooltip>
          ) : (
            <>
              <ST_Tooltip title={localization.pinToLeft}>
                <Button
                  onClick={() => handlePinColumn('start')}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <PushPinIcon className="rotate-90" />
                </Button>
              </ST_Tooltip>
              <ST_Tooltip title={localization.pinToRight}>
                <Button
                  onClick={() => handlePinColumn('end')}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <PushPinIcon className="-rotate-90" />
                </Button>
              </ST_Tooltip>
            </>
          )}
        </div>
      )}
    </Subscribe>
  );
};
