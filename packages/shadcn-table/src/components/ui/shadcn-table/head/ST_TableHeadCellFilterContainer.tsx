import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  type CollapseProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '../types';
import { getColumnFilterInfo } from '../utils/column.utils';
import { ST_FilterCheckbox } from '../inputs/ST_FilterCheckbox';
import { ST_FilterRangeFields } from '../inputs/ST_FilterRangeFields';
import { ST_FilterRangeSlider } from '../inputs/ST_FilterRangeSlider';
import { ST_FilterTextField } from '../inputs/ST_FilterTextField';

export interface ST_TableHeadCellFilterContainerProps<TData extends ST_RowData>
  extends CollapseProps {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}

export const ST_TableHeadCellFilterContainer = <TData extends ST_RowData>({
  header,
  table,
  ...rest
}: ST_TableHeadCellFilterContainerProps<TData>) => {
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
          <ST_FilterCheckbox column={column} table={table} />
        ) : columnDef.filterVariant === 'range-slider' ? (
          <ST_FilterRangeSlider header={header} table={table} />
        ) : isRangeFilter ? (
          <ST_FilterRangeFields header={header} table={table} />
        ) : (
          <ST_FilterTextField header={header} table={table} />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
