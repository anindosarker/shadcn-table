import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { getColumnFilterInfo } from '../utils/column.utils';
import { SRT_FilterCheckbox } from '../inputs/SRT_FilterCheckbox';
import { SRT_FilterRangeFields } from '../inputs/SRT_FilterRangeFields';
import { SRT_FilterRangeSlider } from '../inputs/SRT_FilterRangeSlider';
import { SRT_FilterTextField } from '../inputs/SRT_FilterTextField';

export interface SRT_TableHeadCellFilterContainerProps<
  TData extends SRT_RowData,
> extends React.ComponentProps<typeof Collapsible> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

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

  return (
    // <Collapse in={showColumnFilters || columnFilterDisplayMode === 'popover'} mountOnEnter unmountOnExit {...rest}>
    // Note: MUI Collapse replaced by ui/Collapsible; radix unmounts closed content (= mountOnEnter/unmountOnExit).
    <Collapsible
      open={showColumnFilters || columnFilterDisplayMode === 'popover'}
      {...rest}
    >
      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        {columnDef.filterVariant === 'checkbox' ? (
          <SRT_FilterCheckbox column={column} table={table} />
        ) : columnDef.filterVariant === 'range-slider' ? (
          <SRT_FilterRangeSlider header={header} table={table} />
        ) : isRangeFilter ? (
          <SRT_FilterRangeFields header={header} table={table} />
        ) : (
          <SRT_FilterTextField header={header} table={table} />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
