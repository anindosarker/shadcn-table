import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { getColumnFilterInfo } from '@/components/ui-base/shadcn-table/shared/utils/column.utils';
import { ST_FilterTextField } from '@/components/ui-base/shadcn-table/components/inputs/ST_FilterTextField';

export interface ST_FilterRangeFieldsProps<TData extends ST_RowData>
  extends DivProps {
  header: ST_Header<TData>;
}

// Min and Max stay side by side at every column size (D61), each track
// keeping its input's min width; a narrower column clips them.
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

  const { allowedColumnFilterOptions, currentFilterOption } =
    getColumnFilterInfo({ header, table });

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
      <div className={filterRangeFieldsVariants()}>
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
