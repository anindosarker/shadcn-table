import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { ST_FilterTextField } from '@/components/ui/shadcn-table/components/inputs/ST_FilterTextField';

export interface ST_FilterRangeFieldsProps<TData extends ST_RowData>
  extends DivProps {
  header: ST_Header<TData>;
}

// Min and Max stay side by side at every column size (D61), each track
// keeping its input's min width; a narrower column clips them. A date, date
// and time or time range is one range picker in one track (D183).
const filterRangeFieldsVariants = cva(
  'grid grid-cols-[1fr_1fr] items-start gap-2',
);

export const ST_FilterRangeFields = <TData extends ST_RowData>({
  header,
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
  const isDateRange = isDateFilter && !columnDef.Filter;

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
      <div
        className={cn(
          filterRangeFieldsVariants(),
          isDateRange && 'grid-cols-1',
        )}
      >
        {isDateRange ? (
          <ST_FilterTextField header={header} />
        ) : (
          [0, 1].map((rangeFilterIndex) => (
            <ST_FilterTextField
              header={header}
              key={rangeFilterIndex}
              rangeFilterIndex={rangeFilterIndex}
            />
          ))
        )}
      </div>
      {showFilterModeCaption ? (
        <p className="mt-1.5 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
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
