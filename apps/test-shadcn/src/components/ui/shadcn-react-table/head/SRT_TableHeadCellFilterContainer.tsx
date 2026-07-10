import {
  getColumnFilterInfo,
  type DivProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_FilterCheckbox } from '../inputs/SRT_FilterCheckbox';
import { SRT_FilterRangeFields } from '../inputs/SRT_FilterRangeFields';
import { SRT_FilterRangeSlider } from '../inputs/SRT_FilterRangeSlider';
import { SRT_FilterTextField } from '../inputs/SRT_FilterTextField';

export interface SRT_TableHeadCellFilterContainerProps<
  TData extends SRT_RowData,
> extends DivProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

const filterContainerVariants = cva('');

export const SRT_TableHeadCellFilterContainer = <TData extends SRT_RowData>({
  header,
  table,
  ...rest
}: SRT_TableHeadCellFilterContainerProps<TData>) => {
  const {
    getState,
    options: { columnFilterDisplayMode },
  } = table;
  const { showColumnFilters } = getState();
  const { column } = header;
  const { columnDef } = column;
  const { isRangeFilter } = getColumnFilterInfo({ header, table });

  // <Collapse in={showColumnFilters || columnFilterDisplayMode === 'popover'} mountOnEnter unmountOnExit {...rest}>
  // Note: MUI Collapse transition dropped — conditional render keeps mountOnEnter/unmountOnExit semantics
  if (!(showColumnFilters || columnFilterDisplayMode === 'popover')) {
    return null;
  }

  return (
    <div {...rest} className={cn(filterContainerVariants(), rest.className)}>
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
