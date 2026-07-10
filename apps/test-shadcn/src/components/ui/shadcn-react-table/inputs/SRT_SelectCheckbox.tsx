import { type ChangeEvent, type MouseEvent, useRef } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  getIsRowSelected,
  getSRT_RowSelectionHandler,
  getSRT_SelectAllHandler,
  parseFromValuesOrFunc,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: MRT's density rem values (1.75rem/2.5rem) are the padded MUI IconButton
// hit area, not the visible glyph; radix Checkbox Root IS the visible box, so
// they map to June browser-verified visible-box sizes (size-4/size-5).
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

  // Radix onCheckedChange carries no DOM event, but the core handlers read
  // `nativeEvent.shiftKey` (range select) and `target.checked`. onClick fires
  // before onCheckedChange, so capture shiftKey there and rebuild a synthetic
  // event for the handler. June browser-verified bridge — do not redesign.
  const shiftKeyRef = useRef(false);

  const isSingleSelect = enableMultiRowSelection === false;

  const indeterminate =
    !isChecked &&
    (selectAll
      ? table.getIsSomeRowsSelected()
      : row?.getIsSomeSelected() && row.getCanSelectSubRows());

  // Note: MUI Radio (single-select) dropped — locked June deviation renders the
  // same shadcn Checkbox with `rounded-full`, so `indeterminate` never applies.
  const checked: boolean | 'indeterminate' =
    !isSingleSelect && indeterminate ? 'indeterminate' : !!isChecked;

  const label = selectAll
    ? localization.toggleSelectAll
    : localization.toggleSelectRow;

  const commonProps = {
    'aria-label': label,
    checked,
    disabled:
      isLoading || (row && !row.getCanSelect()) || row?.id === 'mrt-row-create',
    // Note: MUI `inputProps.aria-label` duplication dropped — single aria-label
    // on the control (radix Checkbox has no hidden input to label separately).
    onCheckedChange: (value: boolean | 'indeterminate') => {
      const next = value === true;
      const event = {
        nativeEvent: { shiftKey: shiftKeyRef.current },
        stopPropagation: () => {},
        target: { checked: next },
      } as unknown as ChangeEvent<HTMLInputElement>;
      if (selectAll) {
        onSelectAllChange(event, next);
      } else {
        onSelectionChange!(event, next);
      }
      shiftKeyRef.current = false;
    },
    // Note: MUI `size` (small/medium) prop dropped — cva density classes size it.
    ...checkboxProps,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      shiftKeyRef.current = event.shiftKey;
      checkboxProps?.onClick?.(event);
    },
    className: cn(
      selectCheckboxVariants({ density }),
      isSingleSelect && 'rounded-full',
      checkboxProps?.className,
    ),
    title: undefined,
  };

  return (
    <SRT_Tooltip title={checkboxProps?.title ?? label} asChild>
      <Checkbox {...commonProps} />
    </SRT_Tooltip>
  );
};
