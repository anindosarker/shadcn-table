import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui-radix/badge';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui-radix/combobox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui-radix/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-radix/select';
import {
  type DropdownOption,
  type InputProps,
  type ST_ColumnFiltersState,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import {
  getColumnFilterInfo,
  isNumberColumn,
  useDropdownOptions,
} from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import {
  createFilterOptions,
  getValueAndLabel,
  parseFromValuesOrFunc,
} from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui-radix/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useST_DebouncedCallback } from '@/components/ui-radix/shadcn-table/hooks/useST_DebouncedCallback';
import { useST_MenuAnchor } from '@/components/ui-radix/shadcn-table/hooks/useST_MenuAnchor';

const filterTextFieldVariants = cva(
  'relative inline-flex w-full min-w-0 flex-col align-top',
);

/** Every value the filter inputs hand to the column filter. */
type FilterInputValue = Date | number | string | string[] | null;

const isSameFilterValue = (a: unknown, b: unknown): boolean =>
  Object.is(a, b) ||
  (a instanceof Date && b instanceof Date && a.getTime() === b.getTime()) ||
  (Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => isSameFilterValue(value, b[index])));

/** Compares by content: a controlled parent may pass an equal new array. */
const isSameColumnFilters = (
  a: ST_ColumnFiltersState,
  b: ST_ColumnFiltersState,
) =>
  a.length === b.length &&
  a.every(
    (filter, index) =>
      filter.id === b[index]?.id &&
      isSameFilterValue(filter.value, b[index]?.value),
  );
export interface ST_FilterTextFieldProps<TData extends ST_RowData>
  extends InputProps {
  header: ST_Header<TData>;
  rangeFilterIndex?: number;
}

export const ST_FilterTextField = <TData extends ST_RowData>({
  header,
  rangeFilterIndex,
  ...rest
}: ST_FilterTextFieldProps<TData>) => {
  const table = header.table;
  const {
    options: {
      columnFilterDebounceMs,
      columnFilterDisplayMode,
      enableColumnFilterModes,
      icons: { CancelIcon, CloseIcon, FilterListIcon },
      localization,
      stFilterAutocompleteProps,
      stFilterDatePickerProps,
      stFilterDateTimePickerProps,
      stFilterTextFieldProps,
      stFilterTimePickerProps,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { filterVariant } = columnDef;
  const columnFilters = useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.globalFilter);

  const args = { column, rangeFilterIndex, table };

  const textFieldProps = {
    ...parseFromValuesOrFunc(stFilterTextFieldProps, args),
    ...parseFromValuesOrFunc(columnDef.stFilterTextFieldProps, args),
    ...rest,
  };

  const autocompleteProps = {
    ...parseFromValuesOrFunc(stFilterAutocompleteProps, args),
    ...parseFromValuesOrFunc(columnDef.stFilterAutocompleteProps, args),
  };

  const datePickerProps = {
    ...parseFromValuesOrFunc(stFilterDatePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.stFilterDatePickerProps, args),
  };

  const dateTimePickerProps = {
    ...parseFromValuesOrFunc(stFilterDateTimePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.stFilterDateTimePickerProps, args),
  };

  const timePickerProps = {
    ...parseFromValuesOrFunc(stFilterTimePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.stFilterTimePickerProps, args),
  };

  const {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table });

  const dropdownOptions = useDropdownOptions({ header, table });

  const optionLabel = (value: string) => {
    const option = dropdownOptions?.find(
      (option) => getValueAndLabel(option).value === value,
    );
    return option === undefined ? value : getValueAndLabel(option).label;
  };

  const optionCount = (value: string) =>
    columnDef.filterSelectOptions ? '' : ` (${facetedUniqueValues.get(value)})`;

  const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
    ? localization[
        `filter${
          currentFilterOption?.charAt?.(0)?.toUpperCase() +
          currentFilterOption?.slice(1)
        }` as keyof typeof localization
      ]
    : '';

  const filterPlaceholder = !isRangeFilter
    ? (textFieldProps?.placeholder ??
      localization.filterByColumn?.replace(
        '{column}',
        String(columnDef.header),
      ))
    : rangeFilterIndex === 0
      ? localization.min
      : rangeFilterIndex === 1
        ? localization.max
        : '';

  // In chips mode the filter editor's top line carries the mode picker.
  const showChangeModeButton = !!(
    columnFilterDisplayMode !== 'chips' &&
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !rangeFilterIndex &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openerProps, toggle } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });
  const [filterValue, setFilterValue] = useState<string | string[]>(() =>
    isMultiSelectFilter
      ? (column.getFilterValue() as string[]) || []
      : isRangeFilter
        ? (column.getFilterValue() as [string, string])?.[
            rangeFilterIndex as number
          ] || ''
        : isAutocompleteFilter
          ? typeof column.getFilterValue() === 'string'
            ? (column.getFilterValue() as string)
            : ''
          : ((column.getFilterValue() as string) ?? ''),
  );
  // The option chosen from the autocomplete list;
  // the typed text lives in filterValue.
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>(
    () =>
      isAutocompleteFilter && typeof column.getFilterValue() === 'string'
        ? (column.getFilterValue() as string)
        : null,
  );
  // The popup anchors to the whole input group so it spans the filter cell.
  const comboboxAnchor = useComboboxAnchor();

  const commitFilterValue = (newValue: FilterInputValue) => {
    if (isRangeFilter) {
      column.setFilterValue((old: Array<FilterInputValue | undefined>) => {
        const next = Array.isArray(old) ? [...old] : ['', ''];
        next[rangeFilterIndex as number] = newValue ?? undefined;
        return next;
      });
    } else {
      column.setFilterValue(newValue ?? undefined);
    }
  };

  // A pending value is dropped when the column filters or the column's chip
  // changed since the last key (stored view, Clear filters, Remove filter).
  const getCommitGuard = () => ({
    columnFilters: table.atoms.columnFilters.get(),
    hasChip: table.atoms.filterChips.get().columnIds.includes(column.id),
  });

  const isCommitGuardHeld = (guard: ReturnType<typeof getCommitGuard>) => {
    const now = getCommitGuard();
    return (
      isSameColumnFilters(now.columnFilters, guard.columnFilters) &&
      (now.hasChip || !guard.hasChip)
    );
  };

  const debouncedCommit = useST_DebouncedCallback(
    (newValue: FilterInputValue, guard: ReturnType<typeof getCommitGuard>) => {
      if (isCommitGuardHeld(guard)) commitFilterValue(newValue);
    },
    columnDef.filterDebounceMs ?? columnFilterDebounceMs ?? 500,
  );

  // Typed values wait for the debounce; picked values apply at once.
  const handleChange = (newValue: FilterInputValue) => {
    setFilterValue((newValue ?? '') as string | string[]);
    debouncedCommit.run(newValue, getCommitGuard());
  };

  const handlePick = (newValue: FilterInputValue) => {
    setFilterValue((newValue ?? '') as string | string[]);
    debouncedCommit.cancel();
    commitFilterValue(newValue);
  };

  // A date, datetime or time input holds a valid value after each typed
  // digit, so a typed value applies on Enter or blur only; a change with no
  // key press since the last commit is a pick in the native picker.
  const [isDateTyped, setIsDateTyped] = useState(false);
  // The typed date not applied yet; an unmount without a blur applies it.
  const [typedDate, setTypedDate] = useState<{
    guard: ReturnType<typeof getCommitGuard>;
    value: string;
  } | null>(null);
  const commitTypedDateOnUnmount = useRef(() => {});
  useLayoutEffect(() => {
    commitTypedDateOnUnmount.current = () => {
      if (typedDate && isCommitGuardHeld(typedDate.guard)) {
        commitFilterValue(typedDate.value || null);
      }
    };
  });
  useEffect(() => {
    const commit = commitTypedDateOnUnmount;
    return () => commit.current();
  }, []);

  const commitTypedValue = () => {
    if (isDateFilter && isDateTyped) {
      setIsDateTyped(false);
      setTypedDate(null);
      handlePick((filterValue as string) || null);
    } else {
      debouncedCommit.flush();
    }
  };

  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      textFieldProps.type === 'date'
        ? event.target.valueAsDate
        : textFieldProps.type === 'number'
          ? event.target.valueAsNumber
          : event.target.value;
    handleChange(newValue);
    textFieldProps?.onChange?.(event);
  };

  const handleAutocompleteInputChange = (newValue: string, reason: string) => {
    // Choosing an item fills the input with its label; handleAutocompleteChange
    // owns that case so the filter gets the option value.
    if (reason === 'item-press') return;
    handleChange(newValue);
  };

  const handleAutocompleteChange = (newValue: string | null) => {
    setAutocompleteValue(newValue);
    if (newValue === null) {
      handlePick('');
      return;
    }
    setFilterValue(optionLabel(newValue));
    debouncedCommit.cancel();
    commitFilterValue(newValue);
  };

  const handleClear = () => {
    debouncedCommit.cancel();
    setTypedDate(null);
    if (isMultiSelectFilter) {
      setFilterValue([]);
      column.setFilterValue([]);
    } else if (isRangeFilter) {
      setFilterValue('');
      column.setFilterValue((old: [string | undefined, string | undefined]) => {
        const next = Array.isArray(old) ? [...old] : ['', ''];
        next[rangeFilterIndex as number] = undefined;
        return next;
      });
    } else if (isAutocompleteFilter) {
      setAutocompleteValue(null);
      setFilterValue('');
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
  };

  const handleClearEmptyFilterChip = () => {
    debouncedCommit.cancel();
    setTypedDate(null);
    setFilterValue('');
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    toggle(event.currentTarget);
  };

  // An outside write to the column filters drops the pending call and resets
  // the local value; the store is not written here.
  const columnFilterValue = column.getFilterValue();
  const [prevColumnFilters, setPrevColumnFilters] = useState(columnFilters);
  const [prevColumnFilterValue, setPrevColumnFilterValue] =
    useState(columnFilterValue);
  const columnFiltersChanged = !isSameColumnFilters(
    columnFilters,
    prevColumnFilters,
  );
  if (columnFiltersChanged) {
    setPrevColumnFilters(columnFilters);
    setPrevColumnFilterValue(columnFilterValue);
  }
  if (
    columnFiltersChanged &&
    (debouncedCommit.isPending() ||
      !isSameFilterValue(columnFilterValue, prevColumnFilterValue))
  ) {
    debouncedCommit.cancel();
    if (columnFilterValue === undefined) {
      if (isAutocompleteFilter) setAutocompleteValue(null);
      setFilterValue(isMultiSelectFilter ? [] : '');
    } else if (isRangeFilter && rangeFilterIndex !== undefined) {
      setFilterValue(
        (columnFilterValue as [string, string])[rangeFilterIndex] ?? '',
      );
    } else {
      setFilterValue(columnFilterValue as string);
    }
  }

  if (columnDef.Filter) {
    return (
      <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
    );
  }

  const hasFilterValue = (filterValue?.length ?? 0) > 0;

  const endAdornment =
    !isAutocompleteFilter &&
    !isDateFilter &&
    !filterChipLabel &&
    // Range fields are narrow, so the clear button takes no room until there
    // is something to clear; the other fields reserve its width to avoid a
    // layout shift when the value appears.
    (!isRangeFilter || hasFilterValue) ? (
      <InputGroupAddon
        align="inline-end"
        className={cn(
          // The select addon overlays the trigger so the trigger spans the whole
          // group and the popper (sized from the trigger) matches the field.
          isSelectFilter && 'absolute inset-y-0 inset-e-0',
          // The multi-select field carries its own chevron, so the empty clear
          // slot takes no room there.
          hasFilterValue
            ? 'visible'
            : isMultiSelectFilter
              ? 'hidden'
              : 'invisible',
        )}
      >
        <ST_Tooltip side="right" title={localization.clearFilter ?? ''}>
          <span>
            <InputGroupButton
              aria-label={localization.clearFilter}
              disabled={!filterValue?.toString()?.length}
              onClick={handleClear}
              size="icon-xs"
            >
              <CloseIcon />
            </InputGroupButton>
          </span>
        </ST_Tooltip>
      </InputGroupAddon>
    ) : null;

  const startAdornment = showChangeModeButton ? (
    <InputGroupAddon align="inline-start">
      <ST_Tooltip title={localization.changeFilterMode}>
        <span>
          <InputGroupButton
            aria-label={localization.changeFilterMode}
            {...openerProps}
            onClick={handleFilterMenuOpen}
            size="icon-xs"
          >
            <FilterListIcon />
          </InputGroupButton>
        </span>
      </ST_Tooltip>
      {filterChipLabel && (
        <Badge variant="secondary">
          {filterChipLabel}
          <button
            aria-label={localization.clearFilter}
            onClick={handleClearEmptyFilterChip}
            type="button"
          >
            <CancelIcon className="size-3" />
          </button>
        </Badge>
      )}
    </InputGroupAddon>
  ) : null;

  const commonTextFieldProps: InputProps = {
    'aria-label': filterPlaceholder,
    autoComplete: 'off',
    disabled: !!filterChipLabel,
    placeholder:
      filterChipLabel || isSelectFilter || isMultiSelectFilter
        ? undefined
        : filterPlaceholder,
    ref: (inputRef) => {
      // eslint-disable-next-line react-hooks/immutability -- runs in the ref callback, not render; filterInputRefs is the table's mutable ref bag
      filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
        inputRef as HTMLInputElement;
    },
    title: filterPlaceholder,
    ...textFieldProps,
    className: cn(
      'text-ellipsis',
      filterChipLabel && 'w-0',
      textFieldProps.className,
    ),
    onBlur: (e) => {
      commitTypedValue();
      textFieldProps.onBlur?.(e);
    },
    onKeyDown: (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        commitTypedValue();
      } else if (
        isDateFilter &&
        // Space, F4 and Alt+ArrowDown open the native picker: not typing.
        !(e.altKey && ['ArrowDown', 'ArrowUp'].includes(e.key)) &&
        ![' ', 'ArrowLeft', 'ArrowRight', 'Escape', 'F4', 'Tab'].includes(
          e.key,
        ) &&
        !['Alt', 'Control', 'Meta', 'Shift'].includes(e.key)
      ) {
        setIsDateTyped(true);
      }
      textFieldProps.onKeyDown?.(e);
    },
  };

  const commonDatePickerProps = {
    // Tighter inset so the native placeholder fits at the date minimum width.
    className: cn('px-1.5', commonTextFieldProps.className),
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      if (isDateTyped) {
        setFilterValue(event.target.value);
        setTypedDate({ guard: getCommitGuard(), value: event.target.value });
      } else {
        handlePick(event.target.value || null);
      }
    },

    value: filterValue || '',
  };

  // Option values offered by the autocomplete list, already narrowed by the
  // typed text (createFilterOptions), so the combobox filters nothing.
  const autocompleteItems = isAutocompleteFilter
    ? createFilterOptions<DropdownOption>()(
        dropdownOptions?.map((option) => getValueAndLabel(option)) ?? [],
        {
          getOptionLabel: (option: DropdownOption) =>
            getValueAndLabel(option).label,
          inputValue: filterValue as string,
        },
      ).map((option) => getValueAndLabel(option).value)
    : [];

  const multiSelectItems = isMultiSelectFilter
    ? (dropdownOptions?.map((option) => getValueAndLabel(option).value) ?? [])
    : [];

  // Shared by both comboboxes: the inner shadcn part brings its own border and
  // focus ring, which the surrounding InputGroup already draws.
  const nestedGroupClassName =
    'h-auto min-h-0 flex-1 rounded-none border-0 bg-transparent shadow-none dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-0! has-[[data-slot=input-group-control]:focus-visible]:ring-0! focus-within:ring-0!';

  return (
    <>
      <div
        className={cn(
          filterTextFieldVariants(),
          // Chromium's date input needs 126px of content for its placeholder.
          isDateFilter
            ? 'min-w-35'
            : isMultiSelectFilter
              ? 'min-w-30'
              : isRangeFilter
                ? 'min-w-18'
                : !filterChipLabel
                  ? 'min-w-24'
                  : 'min-w-auto',
        )}
      >
        <InputGroup
          className={cn(
            'h-8 text-sm *:data-[align=inline-end]:py-0 *:data-[align=inline-start]:py-0',
            // Chips wrap onto new lines, so the group may grow past its fixed height.
            isMultiSelectFilter && 'h-auto min-h-8',
          )}
          ref={comboboxAnchor}
        >
          {startAdornment}
          {filterVariant?.startsWith('time') ? (
            <InputGroupInput
              {...commonTextFieldProps}
              {...commonDatePickerProps}
              {...timePickerProps}
              type="time"
            />
          ) : filterVariant?.startsWith('datetime') ? (
            <InputGroupInput
              {...commonTextFieldProps}
              {...commonDatePickerProps}
              {...dateTimePickerProps}
              type="datetime-local"
            />
          ) : filterVariant?.startsWith('date') ? (
            <InputGroupInput
              {...commonTextFieldProps}
              {...commonDatePickerProps}
              {...datePickerProps}
              type="date"
            />
          ) : isAutocompleteFilter ? (
            // The input is the filter text field: typing filters right away,
            // choosing an option sets the filter to that option's value.
            <Combobox
              filter={null}
              inputValue={(filterValue as string) ?? ''}
              items={autocompleteItems}
              itemToStringLabel={optionLabel}
              onInputValueChange={(value, { reason }) =>
                handleAutocompleteInputChange(value, reason)
              }
              onValueChange={handleAutocompleteChange}
              value={autocompleteValue}
            >
              <ComboboxInput
                type="text"
                {...commonTextFieldProps}
                {...autocompleteProps}
                className={cn(
                  nestedGroupClassName,
                  commonTextFieldProps.className,
                  autocompleteProps.className,
                )}
                onClick={(e) => e.stopPropagation()}
                showClear
              />
              <ComboboxContent anchor={comboboxAnchor}>
                <ComboboxEmpty>{localization.noResultsFound}</ComboboxEmpty>
                <ComboboxList>
                  {(value: string) => (
                    <ComboboxItem key={value} value={value}>
                      {optionLabel(value)}
                      {optionCount(value)}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          ) : isSelectFilter ? (
            // Radix Select raises no ChangeEvent, so a user onChange cannot fire.
            <Select onValueChange={handlePick} value={filterValue as string}>
              <SelectTrigger
                aria-label={filterPlaceholder}
                className={cn(
                  'w-full flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent',
                  // Keeps the chevron clear of the overlaid clear button.
                  hasFilterValue && 'ltr:pr-9 rtl:pl-9',
                  textFieldProps.className,
                )}
                disabled={!!filterChipLabel || textFieldProps.disabled}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  textFieldProps.onKeyDown?.(
                    e as unknown as KeyboardEvent<HTMLInputElement>,
                  );
                }}
                title={filterPlaceholder}
              >
                <SelectValue placeholder={filterPlaceholder} />
              </SelectTrigger>
              <SelectContent position="popper">
                {/* Radix items cannot carry value "": the placeholder lives on SelectValue. */}
                {textFieldProps.children ??
                  dropdownOptions?.map((option, index) => {
                    const { label, value } = getValueAndLabel(option);
                    return (
                      <SelectItem key={`${index}-${value}`} value={value}>
                        {label}{' '}
                        {!columnDef.filterSelectOptions &&
                          `(${facetedUniqueValues.get(value)})`}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          ) : isMultiSelectFilter ? (
            // Combobox items raise no ChangeEvent, so a user onChange cannot fire.
            <Combobox
              autoHighlight
              disabled={!!filterChipLabel || textFieldProps.disabled}
              items={multiSelectItems}
              itemToStringLabel={optionLabel}
              multiple
              onValueChange={(values) => handlePick(values)}
              value={Array.isArray(filterValue) ? filterValue : []}
            >
              <ComboboxChips
                className={cn(
                  nestedGroupClassName,
                  'flex-nowrap px-1.5 py-0.5',
                  textFieldProps.className,
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <ComboboxValue>
                  {(values: string[]) => (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                      {values.map((value) => (
                        <ComboboxChip className="h-5 text-xs" key={value}>
                          {optionLabel(value)}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        aria-label={filterPlaceholder}
                        className="min-w-4"
                        ref={commonTextFieldProps.ref}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          textFieldProps.onKeyDown?.(e);
                        }}
                        placeholder={values.length ? '' : filterPlaceholder}
                        title={filterPlaceholder}
                      />
                    </div>
                  )}
                </ComboboxValue>
                <ComboboxTrigger className="ms-auto shrink-0 self-center" />
              </ComboboxChips>
              <ComboboxContent anchor={comboboxAnchor}>
                <ComboboxEmpty>{localization.noResultsFound}</ComboboxEmpty>
                <ComboboxList>
                  {textFieldProps.children ??
                    ((value: string) => (
                      <ComboboxItem key={value} value={value}>
                        {optionLabel(value)}
                        {optionCount(value)}
                      </ComboboxItem>
                    ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          ) : (
            <InputGroupInput
              {...(isNumberColumn(column, table)
                ? { inputMode: 'decimal', type: 'number' }
                : undefined)}
              {...commonTextFieldProps}
              onChange={handleTextFieldChange}
              onClick={(e) => e.stopPropagation()}
              value={filterValue ?? ''}
            />
          )}
          {endAdornment}
        </InputGroup>
        {/* A range field's caption spans the whole range group, in
            ST_FilterRangeFields. */}
        {showChangeModeButton && rangeFilterIndex === undefined ? (
          <label className="mt-1.5 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
            {localization.filterMode.replace(
              '{filterType}',
              localization[
                `filter${
                  currentFilterOption?.charAt(0)?.toUpperCase() +
                  currentFilterOption?.slice(1)
                }` as keyof typeof localization
              ],
            )}
          </label>
        ) : null}
      </div>
      <ST_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={setFilterValue}
      />
    </>
  );
};
