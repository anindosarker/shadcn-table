import { type ComponentProps, type MouseEvent, useRef } from 'react';
import {
  getIsRowSelected,
  getSRT_RowSelectionHandler,
  getSRT_SelectAllHandler,
  parseSRT_HtmlProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_SelectCheckboxProps<TData extends SRT_RowData>
  extends Omit<ComponentProps<typeof Checkbox>, 'checked' | 'onCheckedChange'> {
  row?: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Select checkbox - checkbox for row selection.
 *
 * Ports MRT_SelectCheckbox: handles select-all, per-row selection, and
 * single-select "radio" mode (enableMultiRowSelection === false). Since the
 * shadcn primitive set has no Radio, single-select is rendered as a Checkbox
 * styled round (rounded-full) to preserve the visual distinction.
 */
export const SRT_SelectCheckbox = <TData extends SRT_RowData>({
  row,
  staticRowIndex,
  table,
  className,
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

  // Resolve the slot props: select-all uses the table context, per-row
  // checkboxes use the row context (matches MRT's two distinct slots).
  const slotProps = selectAll
    ? parseSRT_HtmlProps(srtSelectAllCheckboxProps, { table })
    : parseSRT_HtmlProps(srtSelectCheckboxProps, {
        row: row!,
        staticRowIndex,
        table,
      });

  const allRowsSelected = selectAll
    ? selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined;

  const isChecked = selectAll
    ? allRowsSelected
    : getIsRowSelected({ row, table });

  const onSelectionChange = row
    ? getSRT_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getSRT_SelectAllHandler({ table });

  const isIndeterminate =
    !isChecked && selectAll
      ? table.getIsSomeRowsSelected()
      : !!(row?.getIsSomeSelected() && row.getCanSelectSubRows());

  const disabled =
    isLoading || (row && !row.getCanSelect()) || row?.id === 'mrt-row-create';

  const label = selectAll
    ? localization.toggleSelectAll
    : localization.toggleSelectRow;

  const isSingleSelect = enableMultiRowSelection === false;

  // single-select cannot show indeterminate
  const checkedState: boolean | 'indeterminate' =
    isSingleSelect || !isIndeterminate ? !!isChecked : 'indeterminate';

  // Radix Checkbox's onCheckedChange omits the originating mouse event, so the
  // shiftKey needed for batch (range) row selection is lost. Capture it from
  // the click that immediately precedes the change and forward it on the
  // synthetic event the selection handler reads (event.nativeEvent.shiftKey).
  const shiftKeyRef = useRef(false);

  return (
    <SRT_Tooltip title={label} asChild>
      <span className="inline-flex">
        <Checkbox
          aria-label={label}
          checked={checkedState}
          disabled={disabled}
          {...slotProps}
          onCheckedChange={(value) => {
            const next = value === true;
            const syntheticEvent = {
              stopPropagation: () => {},
              nativeEvent: { shiftKey: shiftKeyRef.current },
              target: { checked: next },
            } as any;
            if (selectAll) {
              onSelectAllChange(syntheticEvent, next);
            } else {
              onSelectionChange!(syntheticEvent, next);
            }
            shiftKeyRef.current = false;
          }}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            shiftKeyRef.current = e.shiftKey;
            // Compose the user's slot-prop onClick after the component's logic.
            slotProps?.onClick?.(e);
          }}
          className={cn(
            density === 'compact' ? 'size-4' : 'size-5',
            isSingleSelect && 'rounded-full',
            className,
            slotProps?.className,
          )}
          {...rest}
        />
      </span>
    </SRT_Tooltip>
  );
};
