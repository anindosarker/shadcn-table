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
} from '@/components/ui/shadcn-table/types';
import {
  getValueAndLabel,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';

export interface ST_EditCellTextFieldProps<TData extends ST_RowData>
  extends InputProps {
  cell: ST_Cell<TData>;
  /** Marks the input invalid (aria-invalid) and colors the helper text. */
  error?: boolean;
  helperText?: ReactNode;
}

export const ST_EditCellTextField = <TData extends ST_RowData>({
  cell,
  ...rest
}: ST_EditCellTextFieldProps<TData>) => {
  const table = cell.table;
  const {
    options: { createDisplayMode, editDisplayMode, stEditTextFieldProps },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { editSelectOptions, editVariant } = columnDef;
  const id = useId();

  const [value, setValue] = useState(() => cell.getValue<string>());
  const [completesComposition, setCompletesComposition] = useState(true);
  // onBlur fires only while the select menu is closed.
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

  const helper =
    helperText == null || helperText === '' ? null : error ? (
      <FieldError>{helperText}</FieldError>
    ) : (
      <FieldDescription>{helperText}</FieldDescription>
    );

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  const isSelectEdit = editVariant === 'select';

  const saveInputValueToRowCache = (newValue: string) => {
    //@ts-expect-error _valuesCache is TanStack-internal
    // eslint-disable-next-line react-hooks/immutability -- runs in saveInputValueToRowCache, not render; _valuesCache is the row's mutable row values cache
    row._valuesCache[column.id] = newValue;
    const creatingRow = table.atoms.creatingRow.get();
    const editingRow = table.atoms.editingRow.get();
    if (creatingRow?.id === row.id) {
      setCreatingRow(row);
    } else if (editingRow?.id === row.id) {
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

  return (
    <table.Subscribe
      selector={(state) => ({
        isCreating: state.creatingRow?.id === row.id,
      })}
    >
      {({ isCreating }) => {
        const isFormMode = ['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string,
        );

        const withField = (control: ReactNode) =>
          isFormMode ? (
            <Field data-invalid={error || undefined}>
              <Label htmlFor={textFieldProps.id ?? id}>
                {columnDef.header}
              </Label>
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

        if (isSelectEdit) {
          const select = (
            <Select
              name={column.id}
              onOpenChange={setOpen}
              onValueChange={(newValue) =>
                // onChange receives an event whose target is { name, value }.
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
                    editInputRefs.current[column.id] =
                      inputRef as unknown as HTMLInputElement;
                  }
                }}
                size="sm"
                {...(textFieldProps as ComponentProps<typeof SelectTrigger>)}
                aria-invalid={error || textFieldProps['aria-invalid']}
                className={cn('w-full', textFieldProps.className)}
                onBlur={(event) => {
                  if (!open) {
                    Object.defineProperty(event, 'target', {
                      writable: true,
                      value: { name: column.id, value },
                    });
                    handleBlur(
                      event as unknown as FocusEvent<HTMLInputElement>,
                    );
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  textFieldProps?.onClick?.(
                    e as unknown as MouseEvent<HTMLInputElement>,
                  );
                }}
                // No Enter-to-save here: Radix opens the select on Enter.
                onKeyDown={(e) =>
                  textFieldProps.onKeyDown?.(
                    e as unknown as KeyboardEvent<HTMLInputElement>,
                  )
                }
              >
                <SelectValue
                  placeholder={
                    !['custom', 'modal'].includes(
                      (isCreating
                        ? createDisplayMode
                        : editDisplayMode) as string,
                    )
                      ? columnDef.header
                      : undefined
                  }
                />
              </SelectTrigger>
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
            disabled={
              parseFromValuesOrFunc(columnDef.enableEditing, row) === false
            }
            id={id}
            ref={(inputRef) => {
              if (inputRef) {
                editInputRefs.current[column.id] = inputRef;
              }
            }}
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
      }}
    </table.Subscribe>
  );
};
