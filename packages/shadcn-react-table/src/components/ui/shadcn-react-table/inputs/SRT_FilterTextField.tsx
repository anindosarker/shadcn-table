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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
      icons: { CancelIcon, CloseIcon, ExpandMoreIcon, FilterListIcon },
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
  // const [autocompleteValue, setAutocompleteValue] = ...
  // Note: MRT reads it only as Autocomplete `value`; the Command list has no selected-value prop, so only the setter stays.
  const [, setAutocompleteValue] = useState<DropdownOption | null>(() =>
    isAutocompleteFilter
      ? ((column.getFilterValue() || null) as DropdownOption | null)
      : null,
  );
  // Note: maps MUI useAutocomplete's internal open state (opens on non-empty input).
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

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

  const handleAutocompleteInputChange = (newValue: string) => {
    setAutocompleteOpen(newValue !== '');
    handleChange(newValue);
  };

  const handleAutocompleteChange = (newValue: DropdownOption | null) => {
    setAutocompleteValue(newValue);
    handleChangeDebounced(getValueAndLabel(newValue).value);
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
              size="icon-sm"
              className="scale-90"
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
            size="icon-sm"
            className="size-7"
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

  const autocompleteOptions = isAutocompleteFilter
    ? createFilterOptions<DropdownOption>()(
        dropdownOptions?.map((option) => getValueAndLabel(option)) ?? [],
        {
          getOptionLabel: (option: DropdownOption) =>
            getValueAndLabel(option).label,
          inputValue: filterValue as string,
        },
      )
    : [];

  return (
    <>
      <div
        className={cn(
          filterTextFieldVariants(),
          isDateFilter
            ? 'min-w-[160px]'
            : enableColumnFilterModes && rangeFilterIndex === 0
              ? 'min-w-[110px]'
              : isRangeFilter
                ? 'min-w-[100px]'
                : !filterChipLabel
                  ? 'min-w-[120px]'
                  : 'min-w-auto',
          // mx: '-2px', p: 0, width: 'calc(100% + 4px)',
          // Note: bleeds MUI's standard-variant underline past the cell padding; no underline here.
        )}
      >
        <InputGroup>
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
            <Popover
              open={autocompleteOpen && autocompleteOptions.length > 0}
              onOpenChange={setAutocompleteOpen}
            >
              <PopoverTrigger asChild>
                <InputGroupInput
                  type="text"
                  {...commonTextFieldProps}
                  {...autocompleteProps}
                  className={cn(
                    commonTextFieldProps.className,
                    autocompleteProps.className,
                  )}
                  onChange={(e) =>
                    handleAutocompleteInputChange(e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                  value={(filterValue as string) ?? ''}
                />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) p-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command shouldFilter={false}>
                  <CommandList>
                    <CommandGroup>
                      {autocompleteOptions.map((option, index) => {
                        const { label, value } = getValueAndLabel(option);
                        return (
                          <CommandItem
                            key={`${index}-${value}`}
                            onSelect={() => {
                              handleAutocompleteChange(option);
                              setAutocompleteOpen(false);
                            }}
                            value={label}
                          >
                            {label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
              <SelectContent>
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
            // Note: Command items raise no ChangeEvent, so the user onChange cannot fire.
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  aria-label={filterPlaceholder}
                  className={cn(
                    'flex-1 justify-start font-normal',
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
                  variant="ghost"
                >
                  {!Array.isArray(filterValue) || filterValue.length === 0 ? (
                    <span className="opacity-50">{filterPlaceholder}</span>
                  ) : (
                    <span className="flex flex-wrap gap-0.5">
                      {filterValue.map((value) => {
                        const selectedValue = dropdownOptions?.find(
                          (option) => getValueAndLabel(option).value === value,
                        );
                        return (
                          <Badge key={value} variant="secondary">
                            {getValueAndLabel(selectedValue).label}
                          </Badge>
                        );
                      })}
                    </span>
                  )}
                  <ExpandMoreIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) p-0"
              >
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {textFieldProps.children ??
                        dropdownOptions?.map((option, index) => {
                          const { label, value } = getValueAndLabel(option);
                          return (
                            <CommandItem
                              key={`${index}-${value}`}
                              onSelect={() => {
                                // MUI SelectInput handleItemClick, multiple branch
                                const newValue = Array.isArray(filterValue)
                                  ? filterValue.slice()
                                  : [];
                                const itemIndex = newValue.indexOf(value);
                                if (itemIndex === -1) {
                                  newValue.push(value);
                                } else {
                                  newValue.splice(itemIndex, 1);
                                }
                                handleChange(newValue);
                              }}
                              value={value}
                            >
                              <Checkbox
                                checked={(
                                  (column.getFilterValue() ?? []) as string[]
                                ).includes(value)}
                                className="mr-2"
                              />
                              {label}{' '}
                              {!columnDef.filterSelectOptions &&
                                `(${facetedUniqueValues.get(value)})`}
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
