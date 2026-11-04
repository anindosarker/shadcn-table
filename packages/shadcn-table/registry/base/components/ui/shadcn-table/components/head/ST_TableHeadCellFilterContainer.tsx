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
// per density, in px for the range fields' layout.
const subheaderPadding = {
  comfortable: { className: 'px-3', px: 12 },
  compact: { className: 'px-2', px: 8 },
  spacious: { className: 'px-4', px: 16 },
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
  useSelector(table.atoms.columnSizing);
  const isSubheader = columnFilterDisplayMode === 'subheader';
  const padding = subheaderPadding[density];

  // The filter input subscribes to its own value, so it is created outside
  // the open state subscription.
  const filterInput =
    columnDef.filterVariant === 'checkbox' ? (
      <ST_FilterCheckbox column={column} />
    ) : columnDef.filterVariant === 'range-slider' ? (
      <ST_FilterRangeSlider header={header} />
    ) : isRangeFilter ? (
      <ST_FilterRangeFields
        header={header}
        width={isSubheader ? column.getSize() - 2 * padding.px : undefined}
      />
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
              // keeps the inputs off the cell's bottom edge.
              isSubheader
                ? cn('-mt-0.75 pt-0.75 pb-2', padding.className)
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
