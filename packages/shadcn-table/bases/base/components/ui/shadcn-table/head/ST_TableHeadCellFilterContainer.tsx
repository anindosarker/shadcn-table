import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  type CollapseProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui/shadcn-table/utils/column.utils';
import { ST_FilterCheckbox } from '@/components/ui/shadcn-table/inputs/ST_FilterCheckbox';
import { ST_FilterRangeFields } from '@/components/ui/shadcn-table/inputs/ST_FilterRangeFields';
import { ST_FilterRangeSlider } from '@/components/ui/shadcn-table/inputs/ST_FilterRangeSlider';
import { ST_FilterTextField } from '@/components/ui/shadcn-table/inputs/ST_FilterTextField';

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
    options: { columnFilterDisplayMode },
  } = table;
  const { showColumnFilters } = table.state;
  const { column } = header;
  const { columnDef } = column;
  const { isRangeFilter } = getColumnFilterInfo({ header, table });

  return (
    // <Collapse in={showColumnFilters || columnFilterDisplayMode === 'popover'} mountOnEnter unmountOnExit {...rest}>
    // Note: MUI Collapse replaced by ui/Collapsible; Base UI unmounts the closed panel (= mountOnEnter/unmountOnExit) and sets data-open/data-closed with --collapsible-panel-height for the keyframes in index.css.
    <Collapsible
      open={showColumnFilters || columnFilterDisplayMode === 'popover'}
      {...rest}
    >
      <CollapsibleContent className="data-open:animate-[st-collapsible-down_200ms_ease-out] data-closed:animate-[st-collapsible-up_200ms_ease-out]">
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
