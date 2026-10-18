import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { getColumnFilterInfo, useDropdownOptions } from '../utils/column.utils';
import {
  createFilterOptions,
  debounce,
  getValueAndLabel,
  parseFromValuesOrFunc,
} from '../utils/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

const filterTextFieldVariants = cva(
  'relative inline-flex w-full min-w-0 flex-col align-top',
);

export interface SRT_FilterTextFieldProps<TData extends SRT_RowData>
  extends InputProps {
  header: SRT_Header<TData>;
  rangeFilterIndex?: number;
  table: SRT_TableInstance<TData>;
}

export const SRT_FilterTextField = <TData extends SRT_RowData>({
  header,
  rangeFilterIndex,
  table,
  ...rest
}: SRT_FilterTextFieldProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
      icons: { CancelIcon, CloseIcon, FilterListIcon },
      localization,
      manualFiltering,
      srtFilterAutocompleteProps,
      srtFilterDatePickerProps,
      srtFilterDateTimePickerProps,
      srtFilterTextFieldProps,
      srtFilterTimePickerProps,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { filterVariant } = columnDef;

  const args = { column, rangeFilterIndex, table };

  const textFieldProps = {
    ...parseFromValuesOrFunc(srtFilterTextFieldProps, args),
    ...parseFromValuesOrFunc(columnDef.srtFilterTextFieldProps, args),
    ...rest,
  };

  const autocompleteProps = {
    ...parseFromValuesOrFunc(srtFilterAutocompleteProps, args),
    ...parseFromValuesOrFunc(columnDef.srtFilterAutocompleteProps, args),
  };

  const datePickerProps = {
    ...parseFromValuesOrFunc(srtFilterDatePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.srtFilterDatePickerProps, args),
  };

  const dateTimePickerProps = {
    ...parseFromValuesOrFunc(srtFilterDateTimePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.srtFilterDateTimePickerProps, args),
  };

  const timePickerProps = {
    ...parseFromValuesOrFunc(srtFilterTimePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.srtFilterTimePickerProps, args),
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
  // The option chosen from the autocomplete list (MUI Autocomplete `value`);
  // the typed text lives in filterValue.
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>(
    () =>
      isAutocompleteFilter && typeof column.getFilterValue() === 'string'
        ? (column.getFilterValue() as string)
        : null,
  );
  // The popup anchors to the whole input group so it spans the filter cell.
  const comboboxAnchor = useComboboxAnchor();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounced = useCallback(
    debounce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newValue: any) => {
        if (isRangeFilter) {
          column.setFilterValue((old: Array<Date | null | number | string>) => {
            const newFilterValues = old ?? ['', ''];
            newFilterValues[rangeFilterIndex as number] = newValue ?? undefined;
            return newFilterValues;
          });
        } else {
          column.setFilterValue(newValue ?? undefined);
        }
      },
      isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
    ),
    [],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (newValue: any) => {
    setFilterValue(newValue ?? '');
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
        const newFilterValues = (Array.isArray(old) && old) || ['', ''];
        newFilterValues[rangeFilterIndex as number] = undefined;
        return newFilterValues;
      });
    } else if (isAutocompleteFilter) {
      setAutocompleteValue(null);
      setFilterValue('');
      // when using 'autocomplete' this function is called only inside effect and only if the filterValue === undefined
      // so the following call is excessive; should be uncommented if the handleClear becomes part of the Autocomplete component callbacks
      // column.setFilterValue(undefined)
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

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const filterValue = column.getFilterValue();
      if (filterValue === undefined) {
        handleClear();
      } else if (isRangeFilter && rangeFilterIndex !== undefined) {
        setFilterValue(
          (filterValue as [string, string])[rangeFilterIndex] ?? '',
        );
      } else {
        setFilterValue(filterValue as string);
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFilterValue()]);

  if (columnDef.Filter) {
    return (
      <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
    );
  }

  const endAdornment =
    !isAutocompleteFilter && !isDateFilter && !filterChipLabel ? (
      <InputGroupAddon
        align="inline-end"
        className={cn(
          // mr: isSelectFilter || isMultiSelectFilter ? '20px' : undefined,
          // Note: clears MUI Select's absolute arrow; shadcn's chevron sits in flow inside the trigger.
          (filterValue?.length ?? 0) > 0 ? 'visible' : 'invisible',
        )}
      >
        <SRT_Tooltip side="right" title={localization.clearFilter ?? ''}>
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
        </SRT_Tooltip>
      </InputGroupAddon>
    ) : null;

  const startAdornment = showChangeModeButton ? (
    <InputGroupAddon align="inline-start">
      <SRT_Tooltip title={localization.changeFilterMode}>
        <span>
          <InputGroupButton
            aria-label={localization.changeFilterMode}
            onClick={handleFilterMenuOpen}
            size="icon-xs"
          >
            <FilterListIcon />
          </InputGroupButton>
        </span>
      </SRT_Tooltip>
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
    // fullWidth: true, helperText, margin: 'none', variant: 'standard',
    // Note: TextField root props; w-full sits in filterTextFieldVariants and the helper text renders under the InputGroup.
    'aria-label': filterPlaceholder,
    autoComplete: 'off',
    disabled: !!filterChipLabel,
    placeholder:
      filterChipLabel || isSelectFilter || isMultiSelectFilter
        ? undefined
        : filterPlaceholder,
    ref: (inputRef) => {
      filterInputRefs.current![`${column.id}-${rangeFilterIndex ?? 0}`] =
        inputRef as HTMLInputElement;
      // if (textFieldProps.inputRef) { textFieldProps.inputRef = inputRef; }
      // Note: no-op in MRT too; a user ref already wins through the spread below.
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
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event.target.value);
    },
    value: filterValue || '',
  };

  // Option values offered by the autocomplete list, already narrowed by the
  // typed text (MUI createFilterOptions), so the combobox filters nothing.
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
          isDateFilter
            ? 'min-w-[140px]'
            : isRangeFilter
              ? 'min-w-[64px]'
              : !filterChipLabel
                ? 'min-w-[96px]'
                : 'min-w-auto',
          // mx: '-2px', p: 0, width: 'calc(100% + 4px)',
          // Note: bleeds MUI's standard-variant underline past the cell padding; no underline here.
        )}
      >
        <InputGroup
          className={cn(
            'h-8 text-sm [&>[data-align=inline-end]]:py-0 [&>[data-align=inline-start]]:py-0',
            // Chips wrap onto new lines, so the group may grow past its fixed height.
            isMultiSelectFilter && 'h-auto min-h-8',
          )}
          ref={comboboxAnchor}
        >
          {startAdornment}
          {filterVariant?.startsWith('time') ? (
            // slotProps.field: { clearable: true, onClear: () => handleClear() }
            // Note: native time/date inputs clear themselves.
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
            // onChange={handleTextFieldChange}
            // Note: radix Select raises no ChangeEvent, so the user onChange cannot fire.
            <Select onValueChange={handleChange} value={filterValue as string}>
              <SelectTrigger
                aria-label={filterPlaceholder}
                className={cn(
                  'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent',
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
              {/* slotProps.select: { MenuProps: { disableScrollLock: true }, displayEmpty: true } */}
              {/* Note: radix Select always locks scroll; SelectValue shows the placeholder. */}
              <SelectContent position="popper">
                {/* <MenuItem disabled divider hidden key="p" value="">{filterPlaceholder}</MenuItem> */}
                {/* Note: radix items cannot carry value ""; the placeholder lives on SelectValue. */}
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
            // onChange={handleTextFieldChange}
            // Note: combobox items raise no ChangeEvent, so the user onChange cannot fire.
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
                        <ComboboxChip key={value}>
                          {optionLabel(value)}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        aria-label={filterPlaceholder}
                        className="min-w-8"
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
              {...commonTextFieldProps}
              onChange={handleTextFieldChange}
              onClick={(e) => e.stopPropagation()}
              value={filterValue ?? ''}
            />
          )}
          {endAdornment}
        </InputGroup>
        {showChangeModeButton ? (
          <label className="mt-[3px] block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
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
      <SRT_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={setFilterValue}
        table={table}
      />
    </>
  );
};
