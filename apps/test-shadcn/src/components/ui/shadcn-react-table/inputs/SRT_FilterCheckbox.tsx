import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  type CheckboxProps,
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { parseFromValuesOrFunc } from '../utils/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const filterCheckboxVariants = cva('', {
  variants: {
    color: {
      default:
        'data-[state=indeterminate]:border-muted-foreground data-[state=indeterminate]:bg-muted-foreground dark:data-[state=indeterminate]:bg-muted-foreground',
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

export interface SRT_FilterCheckboxProps<TData extends SRT_RowData>
  extends CheckboxProps {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_FilterCheckbox = <TData extends SRT_RowData>({
  column,
  table,
  ...rest
}: SRT_FilterCheckboxProps<TData>) => {
  const {
    getState,
    options: { localization, srtFilterCheckboxProps },
  } = table;
  const { density } = getState();
  const { columnDef } = column;

  const checkboxProps = {
    ...parseFromValuesOrFunc(srtFilterCheckboxProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.srtFilterCheckboxProps, {
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
    <SRT_Tooltip title={checkboxProps?.title ?? filterLabel}>
      <Label
        className="-mt-1 font-normal text-muted-foreground"
        title={undefined}
      >
        <Checkbox
          checked={
            column.getFilterValue() === undefined
              ? 'indeterminate'
              : column.getFilterValue() === 'true'
          }
          // color={column.getFilterValue() === undefined ? 'default' : 'primary'}
          // size={density === 'compact' ? 'small' : 'medium'}
          // Note: MUI color/size are the cva variants on className below.
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
          // sx={{ height: '2.5rem', width: '2.5rem' }}
          // Note: MUI sized the padded hit area, not the visible box.
          className={cn(
            filterCheckboxVariants({
              color:
                column.getFilterValue() === undefined ? 'default' : 'primary',
              density,
            }),
            checkboxProps?.className,
          )}
        />
        {/* disableTypography */}
        {/* Note: shadcn Label renders the text directly. */}
        {checkboxProps.title ?? filterLabel}
      </Label>
    </SRT_Tooltip>
  );
};
