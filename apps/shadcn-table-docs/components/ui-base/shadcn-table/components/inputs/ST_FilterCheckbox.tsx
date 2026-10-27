import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui-base/checkbox';
import { Label } from '@/components/ui-base/label';
import {
  type CheckboxProps,
  type ST_Column,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-base/shadcn-table/ST_Tooltip';

const filterCheckboxVariants = cva('', {
  variants: {
    color: {
      // Base UI marks the mixed state with data-indeterminate.
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
  // The column carries the core table; the ST wrapper types re-type its getters.
  const table = column.table as unknown as ST_TableInstance<TData>;
  const {
    options: { localization, stFilterCheckboxProps },
  } = table;
  const { columnDef } = column;

  const checkboxProps = {
    ...parseFromValuesOrFunc(stFilterCheckboxProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.stFilterCheckboxProps, {
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
            <Checkbox
              // Base UI keeps the mixed state in its own `indeterminate` flag;
              // `checked` is always a boolean.
              checked={column.getFilterValue() === 'true'}
              indeterminate={column.getFilterValue() === undefined}
              // color={column.getFilterValue() === undefined ? 'default' : 'primary'}
              // size={density === 'compact' ? 'small' : 'medium'}
              // Note: MUI color/size are the cva variants on className below.
              {...checkboxProps}
              onCheckedChange={(checked, details) => {
                column.setFilterValue(
                  column.getFilterValue() === undefined
                    ? 'true'
                    : column.getFilterValue() === 'true'
                      ? 'false'
                      : undefined,
                );
                checkboxProps?.onCheckedChange?.(checked, details);
              }}
              onClick={(e) => {
                e.stopPropagation();
                checkboxProps?.onClick?.(e);
              }}
              // sx={{ height: '2.5rem', width: '2.5rem' }}
              // Note: MUI sized the padded hit area, not the visible box.
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
            {/* disableTypography */}
            {/* Note: shadcn Label renders the text directly. */}
            {checkboxProps.title ?? filterLabel}
          </Label>
        </ST_Tooltip>
      )}
    </Subscribe>
  );
};
