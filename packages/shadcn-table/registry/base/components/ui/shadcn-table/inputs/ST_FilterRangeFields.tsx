import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_FilterTextField } from '@/components/ui/shadcn-table/inputs/ST_FilterTextField';

export interface ST_FilterRangeFieldsProps<TData extends ST_RowData>
  extends DivProps {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}

// Note: MRT's sx is display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr'; the gap is tighter and each track keeps its input's min width so a narrow column grows to fit Min and Max side by side instead of overlapping them.
const filterRangeFieldsVariants = cva(
  'grid grid-cols-[1fr_1fr] items-start gap-2',
);

export const ST_FilterRangeFields = <TData extends ST_RowData>({
  header,
  table,
  ...rest
}: ST_FilterRangeFieldsProps<TData>) => {
  return (
    <div
      {...rest}
      className={cn(filterRangeFieldsVariants({ className: rest.className }))}
    >
      {[0, 1].map((rangeFilterIndex) => (
        <ST_FilterTextField
          header={header}
          key={rangeFilterIndex}
          rangeFilterIndex={rangeFilterIndex}
          table={table}
        />
      ))}
    </div>
  );
};
