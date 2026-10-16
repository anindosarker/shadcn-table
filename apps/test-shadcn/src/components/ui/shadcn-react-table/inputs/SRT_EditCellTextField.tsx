import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useId,
  useState,
} from 'react';
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
import {
  type InputProps,
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { getValueAndLabel, parseFromValuesOrFunc } from '../utils/utils';

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
    options: { createDisplayMode, editDisplayMode, srtEditTextFieldProps },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;
  // MUI TextField useId(idOverride): one id links label and input.
  const id = useId();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());
  const [completesComposition, setCompletesComposition] = useState(true);
  // MUI SelectInput openState: its handleBlur fires onBlur only while the menu is closed.
  const [open, setOpen] = useState(false);

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

  // const isSelectEdit = editVariant === 'select' || textFieldProps?.select;
  // Note: MUI TextField-only `select` prop has no radix analogue.
  const isSelectEdit = editVariant === 'select';

  const saveInputValueToRowCache = (newValue: string) => {
    //@ts-expect-error _valuesCache is TanStack-internal
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    textFieldProps.onChange?.(event);
    setValue(event.target.value);
    if (isSelectEdit) {
      saveInputValueToRowCache(event.target.value);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textFieldProps.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key === 'Enter' && !event.shiftKey && completesComposition) {
      editInputRefs.current?.[column.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  if (isSelectEdit) {
    return (
      <>
        {['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string,
        ) && (
          <Label htmlFor={textFieldProps.id ?? id}>{columnDef.header}</Label>
        )}
        <Select
          name={column.id}
          onOpenChange={setOpen}
          onValueChange={(newValue) =>
            // MUI SelectInput handleItemClick: onChange gets an event whose target is { name, value }.
            handleChange({
              target: { name: column.id, value: newValue },
            } as ChangeEvent<HTMLInputElement>)
          }
          value={value ?? ''}
        >
          <SelectTrigger
            disabled={
              parseFromValuesOrFunc(columnDef.enableEditing, row) === false
            }
            id={id}
            ref={(inputRef) => {
              if (inputRef) {
                editInputRefs.current![column.id] =
                  inputRef as unknown as HTMLInputElement;
              }
            }}
            size="sm"
            {...(textFieldProps as ComponentProps<typeof SelectTrigger>)}
            className={cn('w-full', textFieldProps.className)}
            onBlur={(event) => {
              // MUI SelectInput handleBlur: only while closed, with target { name, value }.
              if (!open) {
                Object.defineProperty(event, 'target', {
                  writable: true,
                  value: { name: column.id, value },
                });
                handleBlur(event as unknown as FocusEvent<HTMLInputElement>);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              textFieldProps?.onClick?.(
                e as unknown as MouseEvent<HTMLInputElement>,
              );
            }}
            // onKeyDown={handleEnterKeyDown}
            // Note: MRT's Enter blur hits MUI Select's hidden input (no-op); radix opens on Enter.
            onKeyDown={(e) =>
              textFieldProps.onKeyDown?.(
                e as unknown as KeyboardEvent<HTMLInputElement>,
              )
            }
          >
            <SelectValue
              placeholder={
                !['custom', 'modal'].includes(
                  (isCreating ? createDisplayMode : editDisplayMode) as string,
                )
                  ? columnDef.header
                  : undefined
              }
            />
          </SelectTrigger>
          {/* SelectProps={{ MenuProps: { disableScrollLock: true } }} */}
          {/* Note: radix Select always locks scroll. */}
          <SelectContent>
            {textFieldProps.children ??
              selectOptions?.map((option) => {
                const { label, value } = getValueAndLabel(option);
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </>
    );
  }

  return (
    <>
      {['custom', 'modal'].includes(
        (isCreating ? createDisplayMode : editDisplayMode) as string,
      ) && <Label htmlFor={textFieldProps.id ?? id}>{columnDef.header}</Label>}
      <Input
        disabled={parseFromValuesOrFunc(columnDef.enableEditing, row) === false}
        id={id}
        ref={(inputRef) => {
          if (inputRef) {
            editInputRefs.current![column.id] = inputRef;
            // if (textFieldProps.inputRef) textFieldProps.inputRef = inputRef;
            // Note: no-op in MRT too; a user ref already wins through the spread below.
          }
        }}
        // fullWidth, margin="none", select, size="small", variant="standard", InputProps
        // Note: MUI TextField root props; shadcn Input is w-full with one variant and no underline.
        name={column.id}
        placeholder={
          !['custom', 'modal'].includes(
            (isCreating ? createDisplayMode : editDisplayMode) as string,
          )
            ? columnDef.header
            : undefined
        }
        value={value ?? ''}
        autoComplete="off"
        {...textFieldProps}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={(e) => {
          e.stopPropagation();
          textFieldProps?.onClick?.(e);
        }}
        onKeyDown={handleEnterKeyDown}
        onCompositionStart={() => setCompletesComposition(false)}
        onCompositionEnd={() => setCompletesComposition(true)}
      />
    </>
  );
};
