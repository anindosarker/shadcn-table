import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { SRT_RowPinButton } from '../buttons/SRT_RowPinButton';
import { cn } from '@/lib/utils';

export interface SRT_TableBodyRowPinButtonProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_TableBodyRowPinButton = <TData extends SRT_RowData>({
  row,
  table,
  className,
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
    className,
  };

  if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
    return (
      <div
        className={cn(
          'flex',
          density === 'compact' ? 'flex-row' : 'flex-col',
          className,
        )}
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
