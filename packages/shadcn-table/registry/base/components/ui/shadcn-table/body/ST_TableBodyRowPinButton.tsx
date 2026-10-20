import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_RowPinButton } from '@/components/ui/shadcn-table/buttons/ST_RowPinButton';

export interface ST_TableBodyRowPinButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  row: ST_Row<TData>;
  table: ST_TableInstance<TData>;
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
  table,
  ...rest
}: ST_TableBodyRowPinButtonProps<TData>) => {
  const {
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table;
  const { density } = table.state;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canPin = parseFromValuesOrFunc(enableRowPinning, row as any);

  if (!canPin) return null;

  const rowPinButtonProps = {
    row,
    table,
    ...rest,
  };

  if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
    return (
      <div
        className={rowPinWrapperVariants({
          density: density === 'compact' ? 'compact' : 'other',
        })}
      >
        <ST_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
        <ST_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
      </div>
    );
  }

  return (
    <ST_RowPinButton
      pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
      {...rowPinButtonProps}
    />
  );
};
