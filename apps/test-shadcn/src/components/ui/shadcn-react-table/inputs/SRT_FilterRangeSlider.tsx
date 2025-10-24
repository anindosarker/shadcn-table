import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_FilterRangeSliderProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter range slider - slider input for range filtering
 * TODO: Full implementation needed
 */

export const SRT_FilterRangeSlider = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_FilterRangeSliderProps<TData>) => {
  return <div className={className}>TODO: SRT_FilterRangeSlider</div>;
};
