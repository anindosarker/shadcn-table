import { Subscribe } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-store';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  type CollapseProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { ST_FilterCheckbox } from '@/components/ui/shadcn-table/components/inputs/ST_FilterCheckbox';
import { ST_FilterRangeFields } from '@/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields';
import { ST_FilterRangeSlider } from '@/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider';
import { ST_FilterTextField } from '@/components/ui/shadcn-table/components/inputs/ST_FilterTextField';

// The subheader filter's inline padding, the label row's in ST_TableHeadCell
// per density.
const subheaderPadding = {
  comfortable: 'px-3',
  compact: 'px-2',
  spacious: 'px-4',
} as const;

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
  const density = useSelector(table.atoms.density);
  const isSubheader = columnFilterDisplayMode === 'subheader';

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
        <Collapsible
          open={showColumnFilters || columnFilterDisplayMode === 'popover'}
          {...rest}
        >
          <CollapsibleContent
            className={cn(
              // The focus ring's room: a negative margin and the same padding
              // in a popover, the inline padding in the subheader, which also
              // keeps the inputs off the cell's bottom edge. In the subheader
              // the filter adds no width to the th (contain-inline-size): the
              // column keeps its size and clips what is wider (D61).
              isSubheader
                ? cn(
                    'contain-inline-size pt-0.75 -mt-0.75 pb-2',
                    subheaderPadding[density],
                  )
                : '-m-0.75 p-0.75',
              'h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none',
            )}
          >
            {filterInput}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Subscribe>
  );
};
