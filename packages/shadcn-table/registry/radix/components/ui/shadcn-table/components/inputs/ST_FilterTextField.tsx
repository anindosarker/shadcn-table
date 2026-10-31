import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useMemo,
  useState,
} from 'react';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type DropdownOption,
  type InputProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import {
  getColumnFilterInfo,
  isNumberColumn,
  useDropdownOptions,
} from '@/components/ui/shadcn-table/shared/utils/column.utils';
import {
  createFilterOptions,
  debounce,
  getValueAndLabel,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu';

const filterTextFieldVariants = cva(
  'relative inline-flex w-full min-w-0 flex-col align-top',
);

/** Every value the filter inputs hand to the column filter. */
type FilterInputValue = Date | number | string | string[] | null;
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
      enableColumnFilterModes,
      icons: { CancelIcon, CloseIcon, FilterListIcon },
      localization,
      manualFiltering,
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
  useSelector(table.atoms.columnFilters);
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
    isTextboxFilter,
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

  const showChangeModeButton = !!(
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !rangeFilterIndex &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
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

  const handleChangeDebounced = useMemo(
    () =>
      debounce(
        (newValue: FilterInputValue) => {
          if (isRangeFilter) {
            column.setFilterValue(
              (old: Array<FilterInputValue | undefined>) => {
                const next = Array.isArray(old) ? [...old] : ['', ''];
                next[rangeFilterIndex as number] = newValue ?? undefined;
                return next;
              },
            );
          } else {
            column.setFilterValue(newValue ?? undefined);
          }
        },
        isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one debounced function per mount; a new one drops the pending call
    [],
  );

  const handleChange = (newValue: FilterInputValue) => {
    setFilterValue((newValue ?? '') as string | string[]);
    handleChangeDebounced(newValue);
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
      handleChange('');
      return;
    }
    setFilterValue(optionLabel(newValue));
    handleChangeDebounced(newValue);
  };

  const handleClear = () => {
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
    setFilterValue('');
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // An outside change to the column filter resets the local value; the
  // store is not written here.
  const columnFilterValue = column.getFilterValue();
  const [prevColumnFilterValue, setPrevColumnFilterValue] =
    useState(columnFilterValue);
  if (columnFilterValue !== prevColumnFilterValue) {
    setPrevColumnFilterValue(columnFilterValue);
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
          hasFilterValue ? 'visible' : 'invisible',
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
          <button type="button" onClick={handleClearEmptyFilterChip}>
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
    onKeyDown: (e) => {
      e.stopPropagation();
      textFieldProps.onKeyDown?.(e);
    },
  };

  const commonDatePickerProps = {
    // Tighter inset so the native placeholder fits at the date minimum width.
    className: cn('px-1.5', commonTextFieldProps.className),
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event.target.value);
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
            <Select onValueChange={handleChange} value={filterValue as string}>
              <SelectTrigger
                aria-label={filterPlaceholder}
                className={cn(
                  'w-full flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent',
                  // Keeps the chevron clear of the overlaid clear button.
                  hasFilterValue && 'pe-9',
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
              disabled={!!filterChipLabel || textFieldProps.disabled}
              items={multiSelectItems}
              itemToStringLabel={optionLabel}
              multiple
              onValueChange={(values) => handleChange(values)}
              value={Array.isArray(filterValue) ? filterValue : []}
            >
              <ComboboxChips
                className={cn(
                  nestedGroupClassName,
                  'px-1.5 py-0.5',
                  textFieldProps.className,
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <ComboboxValue>
                  {(values: string[]) => (
                    <>
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
                    </>
                  )}
                </ComboboxValue>
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
        {showChangeModeButton ? (
          <label className="mt-0.75 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
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
