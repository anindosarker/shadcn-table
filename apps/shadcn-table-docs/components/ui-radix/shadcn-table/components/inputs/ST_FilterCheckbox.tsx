import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ST_Checkbox } from '@/components/ui-radix/shadcn-table/ST_Checkbox';
import { Label } from '@/components/ui-radix/label';
import {
  type CheckboxProps,
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/ST_Tooltip';

const filterCheckboxVariants = cva('', {
  variants: {
    color: {
      // Radix marks the mixed state as data-state, Base UI as data-indeterminate.
      default:
        'data-[state=indeterminate]:border-muted-foreground data-[state=indeterminate]:bg-muted-foreground dark:data-[state=indeterminate]:bg-muted-foreground data-indeterminate:border-muted-foreground data-indeterminate:bg-muted-foreground dark:data-indeterminate:bg-muted-foreground',
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
  // table.options and the column def hold the part props tree-neutral
  // (ST_NeutralPartPropTypes); the options as written (ST_TableOptions,
  // ST_ColumnDef) type them for this tree's Checkbox.
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
    <Subscribe
      selector={(state) => ({
        density: state.density,
        filterValue: column.getFilterValue(),
      })}
      source={table.store}
    >
      {({ density }) => (
        <ST_Tooltip title={checkboxProps?.title ?? filterLabel}>
          <Label
            className="flex h-8 items-center gap-2 text-sm font-normal text-muted-foreground"
            title={undefined}
          >
            <ST_Checkbox
              checked={
                column.getFilterValue() === undefined
                  ? 'indeterminate'
                  : column.getFilterValue() === 'true'
              }
              {...checkboxProps}
              onCheckedChange={(checked) => {
                column.setFilterValue(
                  column.getFilterValue() === undefined
                    ? 'true'
                    : column.getFilterValue() === 'true'
                      ? 'false'
                      : undefined,
                );
                checkboxProps?.onCheckedChange?.(checked);
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
            {checkboxProps.title ?? filterLabel}
          </Label>
        </ST_Tooltip>
      )}
    </Subscribe>
  );
};
