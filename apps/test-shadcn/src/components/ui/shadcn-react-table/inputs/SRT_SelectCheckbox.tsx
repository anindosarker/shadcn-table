import { type MouseEvent } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  type ButtonProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import {
  getIsRowSelected,
  getSRT_RowSelectionHandler,
  getSRT_SelectAllHandler,
} from '../utils/row.utils';
import { parseFromValuesOrFunc } from '../utils/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const selectCheckboxVariants = cva('z-0', {
  variants: {
    density: {
      comfortable: 'size-5',
      compact: 'size-4',
      spacious: 'size-5',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export interface SRT_SelectCheckboxProps<TData extends SRT_RowData>
  extends ButtonProps {
  row?: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
}

export const SRT_SelectCheckbox = <TData extends SRT_RowData>({
  row,
  staticRowIndex,
  table,
  ...rest
}: SRT_SelectCheckboxProps<TData>) => {
  const {
    getState,
    options: {
      enableMultiRowSelection,
      localization,
      selectAllMode,
      srtSelectAllCheckboxProps,
      srtSelectCheckboxProps,
    },
  } = table;
  const { density, isLoading } = getState();

  const selectAll = !row;

  const allRowsSelected = selectAll
    ? selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined;

  const isChecked = selectAll
    ? allRowsSelected
    : getIsRowSelected({ row, table });

  const checkboxProps = {
    ...(selectAll
      ? parseFromValuesOrFunc(srtSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(srtSelectCheckboxProps, {
          row,
          staticRowIndex,
          table,
        })),
    ...rest,
  };

  const onSelectionChange = row
    ? getSRT_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getSRT_SelectAllHandler({ table });

  const commonProps = {
    'aria-label': selectAll
      ? localization.toggleSelectAll
      : localization.toggleSelectRow,
    checked: isChecked,
    disabled:
      isLoading || (row && !row.getCanSelect()) || row?.id === 'srt-row-create',
    // inputProps: { 'aria-label': ... },
    // Note: radix renders no input; `aria-label` above lands on the root button.
    // onChange: (event) => { event.stopPropagation(); selectAll ? onSelectAllChange(event) : onSelectionChange!(event); },
    // Note: radix change callbacks carry no DOM event (shiftKey); selection runs in onClick below.
    // size: (density === 'compact' ? 'small' : 'medium') as 'medium' | 'small',
    // Note: the density variant on className below.
    ...checkboxProps,
    onClick: (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // Note: MUI Radio fires no change once checked; same guard here.
      if (!(enableMultiRowSelection === false && isChecked)) {
        if (selectAll) onSelectAllChange(e);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        else onSelectionChange!(e as any);
      }
      checkboxProps?.onClick?.(e);
    },
    // sx: (theme) => ({ height, m, width, zIndex: 0, ...parseFromValuesOrFunc(checkboxProps?.sx, theme) }),
    // Note: MUI sized the padded hit area; the density variant sizes the visible box.
    className: cn(
      selectCheckboxVariants({ density }),
      checkboxProps?.className,
    ),
    title: undefined,
  };

  return (
    <SRT_Tooltip
      title={
        checkboxProps?.title ??
        (selectAll
          ? localization.toggleSelectAll
          : localization.toggleSelectRow)
      }
    >
      <span className="inline-flex">
        {enableMultiRowSelection === false ? (
          // <Radio {...(commonProps as any)} />
          // Note: shadcn RadioGroupItem needs its RadioGroup; one group per row stands in for MUI's standalone Radio.
          <RadioGroup value={isChecked ? 'on' : null}>
            <RadioGroupItem {...commonProps} value="on" />
          </RadioGroup>
        ) : (
          <Checkbox
            {...commonProps}
            // indeterminate={...}
            // Note: radix folds MUI `indeterminate` into `checked`, so it lands after the spread.
            checked={
              (
                !isChecked && selectAll
                  ? table.getIsSomeRowsSelected()
                  : row?.getIsSomeSelected() && row.getCanSelectSubRows()
              )
                ? 'indeterminate'
                : commonProps.checked
            }
          />
        )}
      </span>
    </SRT_Tooltip>
  );
};
