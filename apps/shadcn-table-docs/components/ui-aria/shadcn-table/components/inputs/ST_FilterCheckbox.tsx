import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ST_Checkbox } from '@/components/ui-aria/shadcn-table/components/inputs/ST_Checkbox';
import { Label } from '@/components/ui-aria/label';
import {
  type CheckboxProps,
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-aria/shadcn-table/components/buttons/ST_Tooltip';

const filterCheckboxVariants = cva('', {
  variants: {
    color: {
      // React Aria marks the mixed state with data-indeterminate.
      default:
        'data-indeterminate:border-muted-foreground data-indeterminate:bg-muted-foreground dark:data-indeterminate:bg-muted-foreground',
      primary: '',
    },
    density: {
      comfortable: 'size-5',
      compact: 'size-4',
      spacious: 'size-5',
    },
  },
  defaultVariants: {
    color: 'primary',
    density: 'comfortable',
  },
});

export interface ST_FilterCheckboxProps<TData extends ST_RowData>
  extends CheckboxProps {
  column: ST_Column<TData>;
}

export const ST_FilterCheckbox = <TData extends ST_RowData>({
  column,
  ...rest
}: ST_FilterCheckboxProps<TData>) => {
  const table = column.table;
  const {
    options: { localization },
  } = table;
  const { columnDef } = column;
  const {
    stFilterCheckboxProps,
  }: Pick<ST_TableOptions<TData>, 'stFilterCheckboxProps'> = table.options;
  const {
    stFilterCheckboxProps: columnFilterCheckboxProps,
  }: Pick<ST_ColumnDef<TData>, 'stFilterCheckboxProps'> = columnDef;

  const checkboxProps = {
    ...parseFromValuesOrFunc(stFilterCheckboxProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnFilterCheckboxProps, {
      column,
      table,
    }),
    ...rest,
  };

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    columnDef.header,
  );

  return (
    <table.Subscribe
      selector={(state) => ({
        density: state.density,
        filterValue: column.getFilterValue(),
      })}
    >
      {({ density }) => (
        <ST_Tooltip title={filterLabel}>
          <Label
            className="flex h-8 items-center gap-2 text-sm font-normal text-muted-foreground"
            title={undefined}
          >
            <ST_Checkbox
              // React Aria keeps the mixed state in its own `isIndeterminate`
              // flag; `isSelected` is always a boolean.
              isSelected={column.getFilterValue() === 'true'}
              isIndeterminate={column.getFilterValue() === undefined}
              {...checkboxProps}
              onChange={(isSelected) => {
                column.setFilterValue(
                  column.getFilterValue() === undefined
                    ? 'true'
                    : column.getFilterValue() === 'true'
                      ? 'false'
                      : undefined,
                );
                checkboxProps?.onChange?.(isSelected);
              }}
              onClick={(e) => {
                e.stopPropagation();
                checkboxProps?.onClick?.(e);
              }}
              className={cn(
                filterCheckboxVariants({
                  color:
                    column.getFilterValue() === undefined
                      ? 'default'
                      : 'primary',
                  density,
                }),
                checkboxProps?.className,
              )}
            />
            {filterLabel}
          </Label>
        </ST_Tooltip>
      )}
    </table.Subscribe>
  );
};
