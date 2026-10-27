import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useId,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { Field, FieldDescription, FieldError } from '@/components/ui/field';
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
  type ST_Cell,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import {
  getValueAndLabel,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/utils/utils';

export interface ST_EditCellTextFieldProps<TData extends ST_RowData>
  extends InputProps {
  cell: ST_Cell<TData>;
  /** MUI TextField `error`: marks the input invalid (aria-invalid) and colors the helper text. */
  error?: boolean;
  /** MUI TextField `helperText`: validation or hint text rendered under the input. */
  helperText?: ReactNode;
  table: ST_TableInstance<TData>;
}

export const ST_EditCellTextField = <TData extends ST_RowData>({
  cell,
  table,
  ...rest
}: ST_EditCellTextFieldProps<TData>) => {
  const {
    options: { createDisplayMode, editDisplayMode, stEditTextFieldProps },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = table.state;
  const { editSelectOptions, editVariant } = columnDef;
  // MUI TextField useId(idOverride): one id links label and input.
  const id = useId();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());
  const [completesComposition, setCompletesComposition] = useState(true);
  // MUI SelectInput openState: its handleBlur fires onBlur only while the menu is closed.
  const [open, setOpen] = useState(false);

  const {
    error,
    helperText,
    ...textFieldProps
  }: InputProps & { error?: boolean; helperText?: ReactNode } = {
    ...parseFromValuesOrFunc(stEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.stEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  const isFormMode = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  // MUI FormHelperText under the input; red (FieldError) when `error` is set.
  const helper =
    helperText == null || helperText === '' ? null : error ? (
      <FieldError>{helperText}</FieldError>
    ) : (
      <FieldDescription>{helperText}</FieldDescription>
    );

  // Label + input in modal/custom mode (MUI TextField label); otherwise only
  // wrap when there is helper text to place under the input.
  const withField = (control: ReactNode) =>
    isFormMode ? (
      <Field data-invalid={error || undefined}>
        <Label htmlFor={textFieldProps.id ?? id}>{columnDef.header}</Label>
        {control}
        {helper}
      </Field>
    ) : helper ? (
      <Field className="gap-1" data-invalid={error || undefined}>
        {control}
        {helper}
      </Field>
    ) : (
      control
    );

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
    const select = (
      <Select
        // `items` gives the trigger the option label; Base UI's SelectValue
        // shows the raw value otherwise. Custom children fall back to the value.
        items={
          textFieldProps.children
            ? undefined
            : Object.fromEntries(
                selectOptions?.map((option) => {
                  const { label, value } = getValueAndLabel(option);
                  return [value, label];
                }) ?? [],
              )
        }
        name={column.id}
        onOpenChange={setOpen}
        onValueChange={(newValue: string | null) =>
          // MUI SelectInput handleItemClick: onChange gets an event whose target is { name, value }.
          // Base UI reports null when a null-valued item is chosen; none here.
          handleChange({
            target: { name: column.id, value: newValue ?? '' },
          } as ChangeEvent<HTMLInputElement>)
        }
        // Stays controlled for an undefined cell value; Base UI shows the
        // placeholder for null, never for "".
        value={value || null}
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
          aria-invalid={error || textFieldProps['aria-invalid']}
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
          // Note: MRT's Enter blur hits MUI Select's hidden input (no-op); Base UI opens on Enter.
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
        {/* Note: Base UI Select locks scroll while modal (the default). */}
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
    );
    return withField(select);
  }

  const input = (
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
      aria-invalid={error || textFieldProps['aria-invalid']}
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
  );
  return withField(input);
};
