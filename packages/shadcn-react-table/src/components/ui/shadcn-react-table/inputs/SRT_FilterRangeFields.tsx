import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { SRT_FilterTextField } from './SRT_FilterTextField';

export interface SRT_FilterRangeFieldsProps<TData extends SRT_RowData>
  extends DivProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

// Note: MRT's sx is display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr'; the gap is tighter and each track keeps its input's min width so a narrow column grows to fit Min and Max side by side instead of overlapping them.
const filterRangeFieldsVariants = cva(
  'grid grid-cols-[1fr_1fr] items-start gap-2',
);

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
