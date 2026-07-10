import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useState,
} from 'react';
import {
  getValueAndLabel,
  type InputProps,
  parseFromValuesOrFunc,
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const editCellTextFieldVariants = cva(
  cn(
    'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  ),
);

const editCellSelectVariants = cva(
  cn(
    'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  ),
);

export interface SRT_EditCellTextFieldProps<TData extends SRT_RowData>
  extends InputProps {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_EditCellTextField = <TData extends SRT_RowData>({
  cell,
  table,
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
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());
  const [completesComposition, setCompletesComposition] = useState(true);

  const textFieldProps: InputProps = {
    ...parseFromValuesOrFunc(srtEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.srtEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  // Note: MRT also OR-ed `textFieldProps?.select` (a MUI TextField-only prop);
  // no native <input> analogue exists, so that clause is dropped.
  const isSelectEdit = editVariant === 'select';

  const saveInputValueToRowCache = (newValue: string) => {
    //@ts-expect-error _valuesCache is TanStack-internal
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    } else if (editDisplayMode === 'cell' || editDisplayMode === 'table') {
      onEditingCellSave?.({ cell, row, table, value: newValue });
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    textFieldProps.onChange?.(event as ChangeEvent<HTMLInputElement>);
    setValue(event.target.value);
    if (isSelectEdit) {
      saveInputValueToRowCache(event.target.value);
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    textFieldProps.onBlur?.(event as FocusEvent<HTMLInputElement>);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    textFieldProps.onKeyDown?.(event as KeyboardEvent<HTMLInputElement>);
    if (event.key === 'Enter' && !event.shiftKey && completesComposition) {
      editInputRefs.current?.[column.id]?.blur();
    }
  };

  const handleClick = (
    event: MouseEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    event.stopPropagation();
    textFieldProps.onClick?.(event as MouseEvent<HTMLInputElement>);
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  const isModalOrCustom = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  // Note: MRT rendered `label` for modal/custom edit display; SRT_EditRowModal
  // owns modal field labels, so the label construct is dropped here.
  // const label = isModalOrCustom ? columnDef.header : undefined;
  const placeholder = !isModalOrCustom ? columnDef.header : undefined;

  const disabled =
    parseFromValuesOrFunc(columnDef.enableEditing, row) === false;

  // Dropped MUI TextField constructs (no native analogue; styling via cva):
  //   variant="standard" size="small" margin="none"
  //   InputProps={{ disableUnderline: editDisplayMode === 'table', sx }}
  //   SelectProps={{ MenuProps: { disableScrollLock: true } }} (native <select>
  //     uses the browser popup)
  //   textFieldProps.inputRef self-assignment (slot-supplied ref is not re-wired)

  if (isSelectEdit) {
    return (
      <select
        autoComplete="off"
        disabled={disabled}
        name={column.id}
        // native <select> has no placeholder attr; expressed as a leading option
        // Note: MRT unwrapped MUI's `inputRef.node` for selects; the native
        // <select> IS the node, so no unwrap is needed.
        {...(textFieldProps as ComponentProps<'select'>)}
        ref={(node) => {
          if (node && editInputRefs.current) {
            editInputRefs.current[column.id] =
              node as unknown as HTMLInputElement;
          }
        }}
        className={cn(editCellSelectVariants(), textFieldProps.className)}
        // Note: deliberate reorder vs MRT — `value` is placed AFTER the spread
        // so the controlled value always wins over a slot-supplied `value`
        // (MRT's before-spread ordering could break the controlled input).
        value={value ?? ''}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={handleClick}
        onCompositionEnd={() => setCompletesComposition(true)}
        onCompositionStart={() => setCompletesComposition(false)}
        onKeyDown={handleEnterKeyDown}
      >
        {placeholder !== undefined ? (
          <option disabled hidden value="">
            {placeholder}
          </option>
        ) : null}
        {textFieldProps.children ??
          selectOptions?.map((option) => {
            // MenuItem is a dropped MUI construct; native <option> replaces it.
            const { label: optionLabel, value: optionValue } =
              getValueAndLabel(option);
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
      </select>
    );
  }

  return (
    <input
      autoComplete="off"
      disabled={disabled}
      name={column.id}
      placeholder={placeholder}
      {...textFieldProps}
      ref={(node) => {
        if (node && editInputRefs.current) {
          editInputRefs.current[column.id] = node;
        }
      }}
      className={cn(editCellTextFieldVariants(), textFieldProps.className)}
      // Note: deliberate reorder vs MRT — `value` is placed AFTER the spread
      // so the controlled value always wins over a slot-supplied `value`
      // (MRT's before-spread ordering could break the controlled input).
      value={value ?? ''}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={handleClick}
      onCompositionEnd={() => setCompletesComposition(true)}
      onCompositionStart={() => setCompletesComposition(false)}
      onKeyDown={handleEnterKeyDown}
    />
  );
};
