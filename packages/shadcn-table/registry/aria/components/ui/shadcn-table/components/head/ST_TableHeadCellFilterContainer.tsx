import { Subscribe } from '@tanstack/react-table';
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

/**
 * The Collapsible part's props under the names every base exposes: `open`,
 * `defaultOpen` and `onOpenChange` map to the React Aria Disclosure's
 * `isExpanded`, `defaultExpanded` and `onExpandedChange`.
 */
export interface ST_TableHeadCellFilterContainerProps<TData extends ST_RowData>
  extends Omit<
    CollapseProps,
    'defaultExpanded' | 'isExpanded' | 'onExpandedChange'
  > {
  defaultOpen?: boolean;
  header: ST_Header<TData>;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export const ST_TableHeadCellFilterContainer = <TData extends ST_RowData>({
  defaultOpen,
  header,
  onOpenChange,
  open,
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
        <Collapsible
          defaultExpanded={defaultOpen}
          isExpanded={
            open ?? (showColumnFilters || columnFilterDisplayMode === 'popover')
          }
          onExpandedChange={onOpenChange}
          {...rest}
        >
          <CollapsibleContent className="h-(--disclosure-panel-height) overflow-hidden transition-[height] duration-200 ease-out motion-reduce:transition-none">
            {filterInput}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Subscribe>
  );
};
