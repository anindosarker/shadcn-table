import { type MouseEvent } from 'react';
import { type BaseUIEvent } from '@base-ui/react/types';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  type CheckboxProps,
  type RadioProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '../types';
import {
  getIsRowSelected,
  getST_RowSelectionHandler,
  getST_SelectAllHandler,
} from '../utils/row.utils';
import { parseFromValuesOrFunc } from '../utils/utils';
import { ST_Tooltip } from '../ST_Tooltip';

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

export interface ST_SelectCheckboxProps<TData extends ST_RowData>
  extends CheckboxProps {
  row?: ST_Row<TData>;
  staticRowIndex?: number;
  table: ST_TableInstance<TData>;
}

export const ST_SelectCheckbox = <TData extends ST_RowData>({
  row,
  staticRowIndex,
  table,
  ...rest
}: ST_SelectCheckboxProps<TData>) => {
  const {
    getState,
    options: {
      enableMultiRowSelection,
      localization,
      selectAllMode,
      stSelectAllCheckboxProps,
      stSelectCheckboxProps,
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
      ? parseFromValuesOrFunc(stSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(stSelectCheckboxProps, {
          row,
          staticRowIndex,
          table,
        })),
    ...rest,
  };

  const onSelectionChange = row
    ? getST_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getST_SelectAllHandler({ table });

  const commonProps = {
    'aria-label': selectAll
      ? localization.toggleSelectAll
      : localization.toggleSelectRow,
    checked: isChecked,
    disabled:
      isLoading || (row && !row.getCanSelect()) || row?.id === 'st-row-create',
    // inputProps: { 'aria-label': ... },
    // Note: Base UI renders a span with role="checkbox" plus a hidden input; `aria-label` above lands on the root span.
    // onChange: (event) => { event.stopPropagation(); selectAll ? onSelectAllChange(event) : onSelectionChange!(event); },
    // Note: Base UI change callbacks carry the DOM event only inside eventDetails; selection runs in onClick below, where shiftKey is read directly.
    // size: (density === 'compact' ? 'small' : 'medium') as 'medium' | 'small',
    // Note: the density variant on className below.
    ...checkboxProps,
    onClick: (e: BaseUIEvent<MouseEvent<HTMLSpanElement>>) => {
      e.stopPropagation();
      // Note: MUI Radio fires no change once checked; same guard here.
      if (!(enableMultiRowSelection === false && isChecked)) {
        // Base UI roots are spans; the handlers read only target and shiftKey.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event = e as any;
        if (selectAll) onSelectAllChange(event);
        else onSelectionChange!(event);
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
  } satisfies CheckboxProps | RadioProps;

  return (
    <ST_Tooltip
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
            <RadioGroupItem
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...(commonProps as any)}
              value="on"
            />
          </RadioGroup>
        ) : (
          <Checkbox
            {...commonProps}
            // Note: Base UI keeps MUI `indeterminate` as its own flag beside `checked`; it lands after the spread.
            indeterminate={
              !isChecked && selectAll
                ? table.getIsSomeRowsSelected()
                : row?.getIsSomeSelected() && row.getCanSelectSubRows()
            }
          />
        )}
      </span>
    </ST_Tooltip>
  );
};
