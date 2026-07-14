import { type MouseEvent } from 'react';
import {
  type ButtonProps,
  parseFromValuesOrFunc,
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Checkbox } from '@/components/ui/checkbox';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: MRT sizes the Checkbox via `size={density === 'compact' ? 'small' :
// 'medium'}` (the padded MUI hit area; visible glyph ~18px). Dropped — the
// radix Checkbox Root IS the visible box and its shadcn default (size-4)
// already matches, so nothing to style here (no cva, render bare).

export interface SRT_FilterCheckboxProps<TData extends SRT_RowData>
  extends ButtonProps {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_FilterCheckbox = <TData extends SRT_RowData>({
  column,
  table,
  ...rest
}: SRT_FilterCheckboxProps<TData>) => {
  const {
    options: { localization, srtFilterCheckboxProps },
  } = table;
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

  const filterValue = column.getFilterValue();

  // MRT's separate `checked` (=== 'true') + `indeterminate` (=== undefined)
  // collapse into radix's single tri-state `checked` prop.
  const checked: boolean | 'indeterminate' =
    filterValue === undefined ? 'indeterminate' : filterValue === 'true';

  return (
    <SRT_Tooltip title={checkboxProps?.title ?? filterLabel} asChild>
      {/* MUI FormControlLabel → native <label> wrapping the control + text so
          clicking the text still toggles the checkbox. */}
      <label className="mt-[-4px] flex items-center gap-2 font-normal text-muted-foreground text-sm">
        <Checkbox
          checked={checked}
          // color={filterValue === undefined ? 'default' : 'primary'}
          // Note: MUI `color` dropped — radix checked/indeterminate state
          // styling already differentiates unset vs. active filter.
          {...checkboxProps}
          onCheckedChange={() => {
            column.setFilterValue(
              filterValue === undefined
                ? 'true'
                : filterValue === 'true'
                  ? 'false'
                  : undefined,
            );
          }}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            checkboxProps?.onClick?.(event);
          }}
          title={undefined}
        />
        {checkboxProps.title ?? filterLabel}
      </label>
    </SRT_Tooltip>
  );
};
