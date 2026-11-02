import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_Checkbox } from '@/components/ui/shadcn-table/components/inputs/ST_Checkbox';
import { Label } from '@/components/ui/label';
import {
  type CheckboxProps,
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';

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

  // The checkbox's own hover and focus open the standalone tooltip.
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // React Aria's checkbox props carry no title; a consumer's title still
  // names the tooltip.
  const checkboxTitle =
    'title' in checkboxProps && typeof checkboxProps.title === 'string'
      ? checkboxProps.title
      : undefined;

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
        <ST_Tooltip
          standalone
          open={tooltipOpen}
          title={checkboxTitle ?? filterLabel}
        >
          <Label
            className="flex h-8 items-center gap-2 text-sm font-normal text-muted-foreground"
            title={undefined}
          >
            <ST_Checkbox
              indeterminateIcon={table.options.icons.IndeterminateIcon}
              // React Aria keeps the mixed state in its own `isIndeterminate`
              // flag; `isSelected` is always a boolean.
              isSelected={column.getFilterValue() === 'true'}
              isIndeterminate={column.getFilterValue() === undefined}
              {...checkboxProps}
              onHoverStart={(e) => {
                setTooltipOpen(true);
                checkboxProps?.onHoverStart?.(e);
              }}
              onHoverEnd={(e) => {
                setTooltipOpen(false);
                checkboxProps?.onHoverEnd?.(e);
              }}
              onFocus={(e) => {
                // Keyboard focus only, as React Aria's TooltipTrigger does.
                if ((e.target as HTMLElement).matches(':focus-visible'))
                  setTooltipOpen(true);
                checkboxProps?.onFocus?.(e);
              }}
              onBlur={(e) => {
                setTooltipOpen(false);
                checkboxProps?.onBlur?.(e);
              }}
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
                // A press closes the bubble, as in React Aria's TooltipTrigger.
                setTooltipOpen(false);
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
