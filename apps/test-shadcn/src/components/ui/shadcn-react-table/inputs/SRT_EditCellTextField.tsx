import {
  type ChangeEvent,
  type ComponentProps,
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
    } else if (editDisplayMode === 'cell' || editDisplayMode === 'table') {
      onEditingCellSave?.({ cell, row, table, value: newValue });
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

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
    textFieldProps.onClick?.(event);
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  const isModalOrCustom = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  // const label = isModalOrCustom ? columnDef.header : undefined;
  // Note: SRT_EditRowModal owns modal field labels.
  const placeholder = !isModalOrCustom ? columnDef.header : undefined;

  const disabled =
    parseFromValuesOrFunc(columnDef.enableEditing, row) === false;

  if (isSelectEdit) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      children: _children,
      onChange: _onChange,
      onBlur: _onBlur,
      className: triggerClassName,
      onClick: _onClick,
      onKeyDown: _onKeyDown,
      ...triggerRest
    } = textFieldProps;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return (
      <Select
        name={column.id}
        disabled={disabled}
        value={value ?? ''}
        // Note: slot onChange/onBlur have no radix Select event analogue.
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
          {...(triggerRest as ComponentProps<typeof SelectTrigger>)}
          className={cn('w-full', triggerClassName)}
          ref={(node) => {
            if (node && editInputRefs.current) {
              editInputRefs.current[column.id] =
                node as unknown as HTMLInputElement;
            }
          }}
          onBlur={() => {
            // Note: MRT handleBlur exit path for a trigger focused but never opened.
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
          onKeyDown={(event) =>
            textFieldProps.onKeyDown?.(
              event as unknown as KeyboardEvent<HTMLInputElement>,
            )
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* Note: MRT's `textFieldProps.children` option passthrough has no radix SelectContent analogue. */}
          {selectOptions?.map((option) => {
            const { label: optionLabel, value: optionValue } =
              getValueAndLabel(option);
            return (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            );
          })}
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
      value={value ?? ''}
      ref={(node) => {
        if (node && editInputRefs.current) {
          editInputRefs.current[column.id] = node;
        }
      }}
      {...textFieldProps}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={handleClick}
      onCompositionEnd={() => setCompletesComposition(true)}
      onCompositionStart={() => setCompletesComposition(false)}
      onKeyDown={handleEnterKeyDown}
    />
  );
};
