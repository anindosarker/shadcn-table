import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const columnPinningButtonsVariants = cva('min-w-[70px] text-center');

export interface SRT_ColumnPinningButtonsProps<TData extends SRT_RowData>
  extends DivProps {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_ColumnPinningButtons = <TData extends SRT_RowData>({
  className,
  column,
  table,
  ...rest
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
    <div {...rest} className={cn(columnPinningButtonsVariants(), className)}>
      {column.getIsPinned() ? (
        <SRT_Tooltip title={localization.unpin}>
          <Button
            className="h-8 w-8"
            onClick={() => handlePinColumn(false)}
            size="icon"
            variant="ghost"
          >
            <PushPinIcon className="h-4 w-4" />
          </Button>
        </SRT_Tooltip>
      ) : (
        <>
          <SRT_Tooltip title={localization.pinToLeft}>
            <Button
              className="h-8 w-8"
              onClick={() => handlePinColumn('left')}
              size="icon"
              variant="ghost"
            >
              <PushPinIcon className="h-4 w-4 rotate-90" />
            </Button>
          </SRT_Tooltip>
          <SRT_Tooltip title={localization.pinToRight}>
            <Button
              className="h-8 w-8"
              onClick={() => handlePinColumn('right')}
              size="icon"
              variant="ghost"
            >
              <PushPinIcon className="h-4 w-4 -rotate-90" />
            </Button>
          </SRT_Tooltip>
        </>
      )}
    </div>
  );
};
