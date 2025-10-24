import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_FilterRangeFieldsProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter range fields - min/max inputs for range filtering
 * TODO: Full implementation needed
 */

export const SRT_FilterRangeFields = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_FilterRangeFieldsProps<TData>) => {
  return <div className={className}>TODO: SRT_FilterRangeFields</div>;
};
