import { type ComponentProps } from 'react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_FilterTextField } from './SRT_FilterTextField';

export interface SRT_FilterRangeFieldsProps<TData extends SRT_RowData>
  extends ComponentProps<'div'> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_FilterRangeFields = <TData extends SRT_RowData>({
  header,
  table,
  className,
  ...rest
}: SRT_FilterRangeFieldsProps<TData>) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)} {...rest}>
      {[0, 1].map((rangeFilterIndex) => (
        <SRT_FilterTextField
          header={header}
          key={rangeFilterIndex}
          rangeFilterIndex={rangeFilterIndex}
          table={table}
        />
      ))}
    </div>
  );
};
