import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  getColumnFilterInfo,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_FilterCheckbox } from '../inputs/SRT_FilterCheckbox';
import { SRT_FilterRangeFields } from '../inputs/SRT_FilterRangeFields';
import { SRT_FilterRangeSlider } from '../inputs/SRT_FilterRangeSlider';
import { SRT_FilterTextField } from '../inputs/SRT_FilterTextField';

export interface SRT_TableHeadCellFilterContainerProps<
  TData extends SRT_RowData,
> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_TableHeadCellFilterContainer = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_TableHeadCellFilterContainerProps<TData>) => {
  const {
    getState,
    options: { columnFilterDisplayMode },
  } = table;
  const { showColumnFilters } = getState();
  const { column } = header;
  const { columnDef } = column;
  const { isRangeFilter } = getColumnFilterInfo({ header, table });

  const shouldShow = showColumnFilters || columnFilterDisplayMode === 'popover';

  if (!shouldShow) return null;

  return (
    <div
      className={cn('animate-in slide-in-from-top-2 duration-200', className)}
    >
      {columnDef.filterVariant === 'checkbox' ? (
        <SRT_FilterCheckbox column={column} table={table} />
      ) : columnDef.filterVariant === 'range-slider' ? (
        <SRT_FilterRangeSlider header={header} table={table} />
      ) : isRangeFilter ? (
        <SRT_FilterRangeFields header={header} table={table} />
      ) : (
        <SRT_FilterTextField header={header} table={table} />
      )}
    </div>
  );
};
