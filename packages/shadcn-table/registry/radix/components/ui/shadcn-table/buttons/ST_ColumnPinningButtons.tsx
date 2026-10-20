import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Column,
  type ST_ColumnPinningPosition,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

const columnPinningButtonsVariants = cva('min-w-[70px] text-center');

export interface ST_ColumnPinningButtonsProps<TData extends ST_RowData>
  extends DivProps {
  column: ST_Column<TData>;
  table: ST_TableInstance<TData>;
}

export const ST_ColumnPinningButtons = <TData extends ST_RowData>({
  className,
  column,
  table,
  ...rest
}: ST_ColumnPinningButtonsProps<TData>) => {
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
    <div {...rest} className={cn(columnPinningButtonsVariants(), className)}>
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
  );
};
