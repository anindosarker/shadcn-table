import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import {
  ST_FILTER_FIELD_MIN_WIDTHS,
  ST_FilterTextField,
} from '@/components/ui/shadcn-table/components/inputs/ST_FilterTextField';

export interface ST_FilterRangeFieldsProps<TData extends ST_RowData>
  extends DivProps {
  header: ST_Header<TData>;
  /**
   * The width in px the fields lay out in. When Min and Max at their minimum
   * width plus the gap do not fit, they stack one per row; without it they
   * sit side by side.
   */
  width?: number;
}

// gap-2 between the fields.
const RANGE_FIELDS_GAP_PX = 8;

// Each track keeps its input's min width, so a column too narrow for Min and
// Max side by side stacks them instead of overlapping them.
const filterRangeFieldsVariants = cva('grid items-start gap-2', {
  variants: {
    stacked: {
      false: 'grid-cols-[1fr_1fr]',
      true: 'grid-cols-1',
    },
  },
  defaultVariants: {
    stacked: false,
  },
});

export const ST_FilterRangeFields = <TData extends ST_RowData>({
  header,
  width,
  ...rest
}: ST_FilterRangeFieldsProps<TData>) => {
  const table = header.table;
  const {
    options: { columnFilterDisplayMode, enableColumnFilterModes, localization },
  } = table;
  const { columnDef } = header.column;
  useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.columnFilterFns);

  const { allowedColumnFilterOptions, currentFilterOption, isDateFilter } =
    getColumnFilterInfo({ header, table });

  const fieldMinWidth = isDateFilter
    ? ST_FILTER_FIELD_MIN_WIDTHS.date.px
    : ST_FILTER_FIELD_MIN_WIDTHS.range.px;
  const stacked =
    width !== undefined && width < 2 * fieldMinWidth + RANGE_FIELDS_GAP_PX;

  // The Min field carries the mode button; the caption spans both fields.
  const showFilterModeCaption = !!(
    !columnDef.Filter &&
    columnFilterDisplayMode !== 'chips' &&
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  return (
    <div {...rest} className={cn('flex flex-col', rest.className)}>
      <div className={filterRangeFieldsVariants({ stacked })}>
        {[0, 1].map((rangeFilterIndex) => (
          <ST_FilterTextField
            header={header}
            key={rangeFilterIndex}
            rangeFilterIndex={rangeFilterIndex}
          />
        ))}
      </div>
      {showFilterModeCaption ? (
        <p className="mt-0.75 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ],
          )}
        </p>
      ) : null}
    </div>
  );
};
