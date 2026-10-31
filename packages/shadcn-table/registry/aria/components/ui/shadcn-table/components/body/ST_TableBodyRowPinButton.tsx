import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type ST_Row,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_RowPinButton } from '@/components/ui/shadcn-table/components/buttons/ST_RowPinButton';

export interface ST_TableBodyRowPinButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  row: ST_Row<TData>;
}

const rowPinWrapperVariants = cva('flex', {
  variants: {
    density: {
      compact: 'flex-row',
      other: 'flex-col',
    },
  },
});

export const ST_TableBodyRowPinButton = <TData extends ST_RowData>({
  row,
  ...rest
}: ST_TableBodyRowPinButtonProps<TData>) => {
  const table = row.table;
  const {
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canPin = parseFromValuesOrFunc(enableRowPinning, row as any);

  if (!canPin) return null;

  const rowPinButtonProps = {
    row,
    ...rest,
  };

  return (
    <table.Subscribe
      selector={(state) => ({
        density: state.density,
        rowPinning: state.rowPinning,
      })}
    >
      {({ density }) =>
        rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned() ? (
          <div
            className={rowPinWrapperVariants({
              density: density === 'compact' ? 'compact' : 'other',
            })}
          >
            <ST_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
            <ST_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
          </div>
        ) : (
          <ST_RowPinButton
            pinningPosition={
              rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'
            }
            {...rowPinButtonProps}
          />
        )
      }
    </table.Subscribe>
  );
};
