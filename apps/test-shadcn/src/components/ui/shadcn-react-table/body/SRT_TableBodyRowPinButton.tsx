import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { SRT_RowPinButton } from '../buttons/SRT_RowPinButton';

export interface SRT_TableBodyRowPinButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
}

const rowPinWrapperVariants = cva('flex', {
  variants: {
    density: {
      compact: 'flex-row',
      other: 'flex-col',
    },
  },
});

export const SRT_TableBodyRowPinButton = <TData extends SRT_RowData>({
  row,
  table,
  ...rest
}: SRT_TableBodyRowPinButtonProps<TData>) => {
  const {
    getState,
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table;
  const { density } = getState();

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
        <SRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
        <SRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
      </div>
    );
  }

  return (
    <SRT_RowPinButton
      pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
      {...rowPinButtonProps}
    />
  );
};
