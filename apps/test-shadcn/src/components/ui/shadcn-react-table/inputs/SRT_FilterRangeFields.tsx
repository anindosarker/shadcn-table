import {
  type DivProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_FilterTextField } from './SRT_FilterTextField';

export interface SRT_FilterRangeFieldsProps<TData extends SRT_RowData>
  extends DivProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

// Note: base maps MRT's sx (display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr').
const filterRangeFieldsVariants = cva('grid grid-cols-2 gap-4');

export const SRT_FilterRangeFields = <TData extends SRT_RowData>({
  header,
  table,
  ...rest
}: SRT_FilterRangeFieldsProps<TData>) => {
  return (
    <div
      {...rest}
      className={cn(filterRangeFieldsVariants({ className: rest.className }))}
    >
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
