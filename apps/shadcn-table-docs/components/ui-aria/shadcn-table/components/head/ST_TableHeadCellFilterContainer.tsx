import { Subscribe } from '@tanstack/react-table';
import { Collapsible, CollapsibleContent } from '@/components/ui-aria/collapsible';
import {
  type CollapseProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import { ST_FilterCheckbox } from '@/components/ui-aria/shadcn-table/components/inputs/ST_FilterCheckbox';
import { ST_FilterRangeFields } from '@/components/ui-aria/shadcn-table/components/inputs/ST_FilterRangeFields';
import { ST_FilterRangeSlider } from '@/components/ui-aria/shadcn-table/components/inputs/ST_FilterRangeSlider';
import { ST_FilterTextField } from '@/components/ui-aria/shadcn-table/components/inputs/ST_FilterTextField';
import { stCollapsibleKeyframes } from '@/components/ui-aria/shadcn-table/shared/utils/style.utils';

export interface ST_TableHeadCellFilterContainerProps<TData extends ST_RowData>
  extends CollapseProps {
  header: ST_Header<TData>;
}

export const ST_TableHeadCellFilterContainer = <TData extends ST_RowData>({
  header,
  ...rest
}: ST_TableHeadCellFilterContainerProps<TData>) => {
  const table = header.table;
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
        // React Aria sets --disclosure-panel-height, which the st-aria-collapsible-* keyframes read;
        // the panel marks its state only through aria-hidden.
        <Collapsible
          isExpanded={
            showColumnFilters || columnFilterDisplayMode === 'popover'
          }
          {...rest}
        >
          <style href="st-aria-collapsible" precedence="low">
            {stCollapsibleKeyframes}
          </style>
          <CollapsibleContent className="aria-[hidden=false]:animate-[st-aria-collapsible-down_200ms_ease-out] aria-hidden:animate-[st-aria-collapsible-up_200ms_ease-out]">
            {filterInput}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Subscribe>
  );
};
