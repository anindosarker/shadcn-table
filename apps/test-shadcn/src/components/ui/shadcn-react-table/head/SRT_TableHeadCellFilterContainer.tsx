import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
// import { SRT_FilterCheckbox } from '../inputs/SRT_FilterCheckbox';
// import { SRT_FilterRangeFields } from '../inputs/SRT_FilterRangeFields';
// import { SRT_FilterRangeSlider } from '../inputs/SRT_FilterRangeSlider';
// import { SRT_FilterTextField } from '../inputs/SRT_FilterTextField';

export interface SRT_TableHeadCellFilterContainerProps<
  TData extends SRT_RowData,
> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter container - wrapper for column filter inputs
 *
 * Barebones implementation:
 * - Container with collapse animation
 * - Routes to appropriate filter component based on variant
 * - Checkbox, range slider, range fields, or text field
 *
 * TODO (Future enhancements):
 * - Add SRT_FilterCheckbox component
 * - Add SRT_FilterRangeFields component
 * - Add SRT_FilterRangeSlider component
 * - Add SRT_FilterTextField component
 * - Add better animations
 * - Add filter validation
 */

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

  // TODO: Get filter info utility
  // const { isRangeFilter } = getColumnFilterInfo({ header, table });

  const shouldShow = showColumnFilters || columnFilterDisplayMode === 'popover';

  if (!shouldShow) return null;

  // TODO: Implement filter components
  return (
    <div
      className={cn('animate-in slide-in-from-top-2 duration-200', className)}
    >
      {columnDef.filterVariant === 'checkbox' ? (
        <div>TODO: SRT_FilterCheckbox</div>
      ) : columnDef.filterVariant === 'range-slider' ? (
        <div>TODO: SRT_FilterRangeSlider</div>
      ) : columnDef.filterVariant?.includes('range') ? (
        <div>TODO: SRT_FilterRangeFields</div>
      ) : (
        <div>TODO: SRT_FilterTextField</div>
      )}
    </div>
  );
};
