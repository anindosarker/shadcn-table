import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  useState,
} from 'react';
import {
  getValueAndLabel,
  mergeSRT_HtmlProps,
  parseFromValuesOrFunc,
  parseSRT_HtmlProps,
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SRT_EditCellTextFieldProps<TData extends SRT_RowData>
  extends Omit<ComponentProps<typeof Input>, 'onChange'> {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Edit cell text field - inline text / select editor for cells.
 *
 * Ports MRT_EditCellTextField: text via shadcn Input, select via shadcn
 * Select (editVariant === 'select' or editSelectOptions present). Writes to
 * the row value cache on change/blur, and blurs on Enter.
 */
export const SRT_EditCellTextField = <TData extends SRT_RowData>({
  cell,
  table,
  className,
  ...rest
}: SRT_EditCellTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      onEditingCellSave,
      srtEditTextFieldProps,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;

  // Resolve the slot props: table-level defaults overridable per-column.
  const slotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtEditTextFieldProps, { cell, column, row, table }),
    parseSRT_HtmlProps(columnDef.srtEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
  );
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  const isSelectEdit = editVariant === 'select';

  const isModalOrCustom = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  const disabled =
    parseFromValuesOrFunc(columnDef.enableEditing, row) === false;

  const saveInputValueToRowCache = (newValue: string) => {
    // @ts-expect-error - _valuesCache is internal to TanStack rows
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    } else if (editDisplayMode === 'cell' || editDisplayMode === 'table') {
      // Cell/table modes have no Save button — commit the edit here so the
      // value can be persisted to the user's data source.
      onEditingCellSave?.({ cell, row, table, value: newValue });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    // Compose the user's slot-prop onChange after the component's own logic so
    // cell-edit changes can also be observed via props.
    slotProps?.onChange?.(event);
  };

  const handleSelectChange = (newValue: string) => {
    setValue(newValue);
    saveInputValueToRowCache(newValue);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    rest.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
    // Compose the user's slot-prop onBlur last so cell-edit persistence can be
    // hooked via props (complements the onEditingCellSave option).
    slotProps?.onBlur?.(event);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      editInputRefs.current?.[column.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  const label = isModalOrCustom ? columnDef.header : undefined;
  const placeholder = !isModalOrCustom ? columnDef.header : undefined;

  if (isSelectEdit) {
    return (
      <div className={cn('flex w-full flex-col gap-1', className)}>
        {label ? <Label>{label}</Label> : null}
        <Select
          disabled={disabled}
          value={value ?? ''}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions?.map((option) => {
              const { label: optLabel, value: optValue } =
                getValueAndLabel(option);
              return (
                <SelectItem key={optValue} value={optValue}>
                  {optLabel}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      {label ? <Label htmlFor={column.id}>{label}</Label> : null}
      <Input
        autoComplete="off"
        disabled={disabled}
        id={column.id}
        name={column.id}
        placeholder={placeholder}
        {...rest}
        {...slotProps}
        ref={(inputRef) => {
          if (inputRef && editInputRefs.current) {
            editInputRefs.current[column.id] = inputRef;
          }
        }}
        className={cn(slotProps?.className)}
        value={value ?? ''}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleEnterKeyDown}
      />
    </div>
  );
};
