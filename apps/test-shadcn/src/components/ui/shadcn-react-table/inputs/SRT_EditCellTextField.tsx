import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useRef,
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
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  // Tracks the radix Select popup open-state synchronously so a trigger blur can
  // tell "focus moved into the open dropdown" (do nothing) from "tabbed away
  // without opening" (exit edit) — the select variant's blur-exit path.
  const selectOpenRef = useRef(false);

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
  // no native/radix analogue exists, so that clause is dropped.
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

  // Dropped MUI TextField constructs (no native/radix analogue; styling comes
  // from the shadcn Input/Select defaults):
  //   variant="standard" size="small" margin="none"
  //   InputProps={{ disableUnderline: editDisplayMode === 'table', sx }}
  //   SelectProps={{ MenuProps: { disableScrollLock: true } }}
  //   textFieldProps.inputRef self-assignment (slot-supplied ref is not re-wired)
  //   editCellTextFieldVariants / editCellSelectVariants cva deleted — they only
  //     duplicated the shadcn Input/SelectTrigger default styling.

  if (isSelectEdit) {
    return (
      // Native <select>'s onChange (setValue + immediate save) and blur-save/
      // Enter-blur semantics map onto radix Select as follows:
      //   - onValueChange commits the selection (setValue + save) — the analogue
      //     of the native select's onChange path.
      //   - onOpenChange(false) is the analogue of the native blur: it ends the
      //     edit via setEditingCell(null). We do NOT re-save `value` here (it was
      //     already committed in onValueChange, and re-saving a stale closure
      //     value could clobber the just-committed one).
      // Note: MRT's textFieldProps.onChange/onBlur were event handlers with no
      // ChangeEvent/FocusEvent analogue for a radix Select, so the slot's
      // onChange/onBlur are not invoked for the select variant. InputProps do not
      // otherwise spread onto the radix Select root (not an input); only the
      // user className is forwarded to SelectTrigger.
      <Select
        name={column.id}
        disabled={disabled}
        value={value ?? ''}
        onValueChange={(newValue) => {
          setValue(newValue);
          saveInputValueToRowCache(newValue);
        }}
        onOpenChange={(open) => {
          selectOpenRef.current = open;
          if (!open) {
            setEditingCell(null);
          }
        }}
      >
        <SelectTrigger
          size="sm"
          // w-full: fill the edit cell (maps MRT TextField `fullWidth`);
          // layout-only, per the no-style-override ruling.
          className={cn('w-full', textFieldProps.className)}
          ref={(node) => {
            if (node && editInputRefs.current) {
              // Note: keep the `as unknown as HTMLInputElement` idiom —
              // editInputRefs is typed for inputs, but the radix trigger (a
              // button) is the focusable node for the select variant.
              editInputRefs.current[column.id] =
                node as unknown as HTMLInputElement;
            }
          }}
          onBlur={() => {
            // Note: maps MRT's handleBlur exit path for a trigger that is
            // focused but never opened (e.g. tabbed away). selectOpenRef is set
            // synchronously in onOpenChange before radix moves focus into the
            // popup, so opening the dropdown never falsely exits editing here.
            if (!selectOpenRef.current) {
              setEditingCell(null);
            }
          }}
          onClick={(event) => {
            event.stopPropagation();
            textFieldProps.onClick?.(
              event as unknown as MouseEvent<HTMLInputElement>,
            );
          }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* Note: MRT/native `textFieldProps.children` option passthrough
                cannot render inside radix SelectContent (it expects SelectItem,
                not <option>/MenuItem) — children are ignored for the select
                variant. */}
            {selectOptions?.map((option) => {
              const { label: optionLabel, value: optionValue } =
                getValueAndLabel(option);
              return (
                <SelectItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
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
