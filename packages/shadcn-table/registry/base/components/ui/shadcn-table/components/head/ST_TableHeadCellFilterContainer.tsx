import { Subscribe } from '@tanstack/react-table';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  type CollapseProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { ST_FilterCheckbox } from '@/components/ui/shadcn-table/components/inputs/ST_FilterCheckbox';
import { ST_FilterRangeFields } from '@/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields';
import { ST_FilterRangeSlider } from '@/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider';
import { ST_FilterTextField } from '@/components/ui/shadcn-table/components/inputs/ST_FilterTextField';

export interface ST_TableHeadCellFilterContainerProps<TData extends ST_RowData>
  extends CollapseProps {
  header: ST_Header<TData>;
}

export const ST_TableHeadCellFilterContainer = <TData extends ST_RowData>({
  header,
  ...rest
}: ST_TableHeadCellFilterContainerProps<TData>) => {
  // The core table behind the header; the ST wrapper types re-type its
  // getters, so TypeScript cannot relate the two without the cast.
  const table = header.table as unknown as ST_TableInstance<TData>;
  const {
    options: { columnFilterDisplayMode },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { isRangeFilter } = getColumnFilterInfo({ header, table });

  // The filter input subscribes to its own value, so it is created outside
  // the open state subscription.
  const filterInput =
    columnDef.filterVariant === 'checkbox' ? (
      <ST_FilterCheckbox column={column} />
    ) : columnDef.filterVariant === 'range-slider' ? (
      <ST_FilterRangeSlider header={header} />
    ) : isRangeFilter ? (
      <ST_FilterRangeFields header={header} />
    ) : (
      <ST_FilterTextField header={header} />
    );

  return (
    <Subscribe source={table.atoms.showColumnFilters}>
      {(showColumnFilters) => (
        // <Collapse in={showColumnFilters || columnFilterDisplayMode === 'popover'} mountOnEnter unmountOnExit {...rest}>
        // Note: MUI Collapse replaced by ui/Collapsible; Base UI unmounts the closed panel (= mountOnEnter/unmountOnExit) and sets data-open/data-closed with --collapsible-panel-height for the keyframes in index.css.
        <Collapsible
          open={showColumnFilters || columnFilterDisplayMode === 'popover'}
          {...rest}
        >
          <CollapsibleContent className="data-open:animate-[st-collapsible-down_200ms_ease-out] data-closed:animate-[st-collapsible-up_200ms_ease-out]">
            {filterInput}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Subscribe>
  );
};
