import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
// import { debounce } from '@mui/material/utils'; // Note: replaced by June's local setTimeout debounce below (keeps the package MUI-free).
import {
  type DropdownOption,
  getColumnFilterInfo,
  getValueAndLabel,
  type InputProps,
  parseFromValuesOrFunc,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  useDropdownOptions,
} from 'shadcn-react-table-core';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
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
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

// Note: h-9 dropped (redundant sizing on shadcn Input/SelectTrigger, which are
// already h-9); w-full is fill-parent layout for the filter control.
const filterTextFieldVariants = cva('w-full');

// Note: MUI's `debounce` from `@mui/material/utils` → June's local
// setTimeout-based debounce (matches SRT_GlobalFilterTextField).
function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: TArgs) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

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
  const [autocompleteValue, setAutocompleteValue] =
    useState<DropdownOption | null>(() =>
      isAutocompleteFilter
        ? ((column.getFilterValue() || null) as DropdownOption | null)
        : null,
    );

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
        setFilterValue((filterValue as [string, string])[rangeFilterIndex]);
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

  const setInputRef = (inputRef: HTMLInputElement | null) => {
    if (inputRef && filterInputRefs.current) {
      filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
        inputRef;
    }
    // Note: MRT also forwards `textFieldProps.inputRef` here — user input-ref
    // forwarding deferred (same as SRT_GlobalFilterTextField).
  };

  const inputType = filterVariant?.startsWith('datetime')
    ? 'datetime-local'
    : filterVariant?.startsWith('time')
      ? 'time'
      : 'date';

  const dateFieldProps = filterVariant?.startsWith('datetime')
    ? dateTimePickerProps
    : filterVariant?.startsWith('time')
      ? timePickerProps
      : datePickerProps;

  // commonInputProps mirrors MRT's commonTextFieldProps intent. Note: MRT's
  // `mx:-2px; p:0; width:calc(100%+4px)` standard-underline hack dropped — it
  // targets the MUI TextField root, not a native <input>; shadcn Input keeps
  // its own bordered padding (SRT_GlobalFilterTextField precedent). minWidth
  // map + width:0 chip hack preserved.
  const commonInputProps: InputProps = {
    'aria-label': filterPlaceholder,
    autoComplete: 'off',
    disabled: !!filterChipLabel,
    placeholder:
      filterChipLabel || isSelectFilter || isMultiSelectFilter
        ? undefined
        : filterPlaceholder,
    title: filterPlaceholder,
    ...textFieldProps,
    onKeyDown: (e) => {
      e.stopPropagation();
      textFieldProps.onKeyDown?.(e);
    },
    style: {
      minWidth: isDateFilter
        ? '160px'
        : enableColumnFilterModes && rangeFilterIndex === 0
          ? '110px'
          : isRangeFilter
            ? '100px'
            : !filterChipLabel
              ? '120px'
              : 'auto',
      width: filterChipLabel ? 0 : undefined,
      ...textFieldProps.style,
    },
  };

  // Variant fork (Note): MRT hosted the mode/clear adornments inside the MUI
  // TextField for every variant, but radix Select/Popover controls cannot host
  // InputGroup addons — so text + autocomplete use an InputGroup (mode =
  // inline-start addon, clear = inline-end addon) while select/multiselect/date
  // keep the sibling mode button + absolute clear.
  const isTextVariant =
    !isDateFilter &&
    !isAutocompleteFilter &&
    !isSelectFilter &&
    !isMultiSelectFilter;
  const usesInputGroup = isTextVariant || isAutocompleteFilter;

  // Chip block: mirrors the banner grouping chip — shadcn Badge asChild
  // rendering a single <button>. Deviation: MUI Chip's label is inert and only
  // the delete icon fires onDelete — here the WHOLE chip is clickable and
  // clears the filter value (user-accepted, banner precedent 2026-07-15).
  // CancelIcon (MUI Chip onDelete parity = circle-X) auto-sized by the badge
  // base cva (`[&>svg]:size-3`). Accessible name is the chip label text. Shared
  // between both mode-button renderings so it travels with the mode button in
  // either layout.
  const filterChip = filterChipLabel ? (
    <Badge variant="secondary" asChild>
      <button type="button" onClick={handleClearEmptyFilterChip}>
        {filterChipLabel}
        <CancelIcon data-icon="inline-end" />
      </button>
    </Badge>
  ) : null;

  // Sibling mode button for the non-InputGroup variants (select/multiselect/date).
  // Note: MRT's size-7 button + size-3.5 icon classNames dropped — shadcn
  // size="icon" default wins (no style-override className).
  const startAdornment = showChangeModeButton ? (
    <div className="flex items-center gap-1">
      <SRT_Tooltip title={localization.changeFilterMode}>
        <Button
          type="button"
          aria-label={localization.changeFilterMode}
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleFilterMenuOpen}
        >
          <FilterListIcon />
        </Button>
      </SRT_Tooltip>
      {filterChip}
    </div>
  ) : null;

  // InputGroup inline-start addon for the text/autocomplete variants — same mode
  // button + chip, expressed as an InputGroupButton.
  const startGroupAddon = showChangeModeButton ? (
    <InputGroupAddon align="inline-start">
      <SRT_Tooltip title={localization.changeFilterMode}>
        <InputGroupButton
          size="icon-xs"
          aria-label={localization.changeFilterMode}
          onClick={handleFilterMenuOpen}
        >
          <FilterListIcon />
        </InputGroupButton>
      </SRT_Tooltip>
      {filterChip}
    </InputGroupAddon>
  ) : null;

  // Absolute clear button for the non-InputGroup variants (select/multiselect).
  // Note: MRT's size-8 + scale-90 button classNames and size-3.5 icon class
  // dropped — shadcn size="icon" default wins.
  const clearButton =
    !isAutocompleteFilter && !isDateFilter && !filterChipLabel ? (
      <SRT_Tooltip side="right" title={localization.clearFilter ?? ''}>
        <span
          className={cn(
            'absolute top-1/2 right-1 -translate-y-1/2',
            (isSelectFilter || isMultiSelectFilter) && 'right-7',
            (filterValue?.length ?? 0) > 0 ? 'visible' : 'invisible',
          )}
        >
          <Button
            type="button"
            aria-label={localization.clearFilter}
            variant="ghost"
            size="icon"
            disabled={!filterValue?.toString()?.length}
            onClick={handleClear}
          >
            <CloseIcon />
          </Button>
        </span>
      </SRT_Tooltip>
    ) : null;

  // InputGroup inline-end clear addon for the text variant (autocomplete keeps no
  // clear per the !isAutocompleteFilter condition; when a filter chip is shown the
  // input collapses and the clear is hidden, mirroring clearButton's
  // !filterChipLabel condition).
  const clearGroupAddon =
    isTextVariant && !filterChipLabel ? (
      <InputGroupAddon align="inline-end">
        <SRT_Tooltip side="right" title={localization.clearFilter ?? ''}>
          <span
            className={cn(
              (filterValue?.length ?? 0) > 0 ? 'visible' : 'invisible',
            )}
          >
            <InputGroupButton
              size="icon-xs"
              aria-label={localization.clearFilter}
              disabled={!filterValue?.toString()?.length}
              onClick={handleClear}
            >
              <CloseIcon />
            </InputGroupButton>
          </span>
        </SRT_Tooltip>
      </InputGroupAddon>
    ) : null;

  const filterModeHelperText = showChangeModeButton ? (
    <label className="block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
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
  ) : null;

  const optionMenu = (
    <SRT_FilterOptionMenu
      anchorEl={anchorEl}
      header={header}
      setAnchorEl={setAnchorEl}
      setFilterValue={setFilterValue}
      table={table}
    />
  );

  const selectedAutocompleteValue = getValueAndLabel(autocompleteValue).value;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative flex w-full items-center gap-1">
        {!usesInputGroup && startAdornment}
        <div className="relative flex-1">
          {filterVariant?.startsWith('time') ||
          filterVariant?.startsWith('datetime') ||
          filterVariant?.startsWith('date') ? (
            // Note: MUI picker field.clearable/onClear dropped — native date
            // inputs provide browser-native clearing, so the shared clear
            // button is excluded for date filters (via !isDateFilter above),
            // matching MRT's endAdornment condition.
            <Input
              {...commonInputProps}
              {...dateFieldProps}
              type={inputType}
              ref={setInputRef}
              value={typeof filterValue === 'string' ? filterValue : ''}
              onChange={(e) => {
                handleChange(e.target.value);
                dateFieldProps?.onChange?.(e);
              }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                filterTextFieldVariants(),
                dateFieldProps?.className,
                textFieldProps.className,
              )}
            />
          ) : isAutocompleteFilter ? (
            <InputGroup>
              {startGroupAddon}
              <Popover>
                <PopoverTrigger asChild>
                  <InputGroupInput
                    {...commonInputProps}
                    {...autocompleteProps}
                    ref={setInputRef}
                    value={typeof filterValue === 'string' ? filterValue : ''}
                    onChange={(e) =>
                      handleAutocompleteInputChange(e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      autocompleteProps.className,
                      textFieldProps.className,
                    )}
                  />
                </PopoverTrigger>
                {/* Note: w-[--radix-popover-trigger-width] is layout (match
                    trigger width); p-0 is shadcn's own official Combobox
                    pattern (Popover hosting a Command list renders padless so
                    the Command owns its spacing) — kept as the canonical
                    pattern, not a decorative override. */}
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandList>
                      <CommandEmpty>—</CommandEmpty>
                      <CommandGroup>
                        {dropdownOptions?.map((option, index) => {
                          const { label, value: optValue } =
                            getValueAndLabel(option);
                          return (
                            <CommandItem
                              key={`${index}-${optValue}`}
                              value={label}
                              onSelect={() => handleAutocompleteChange(option)}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 size-4',
                                  optValue === selectedAutocompleteValue
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {label}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </InputGroup>
          ) : isSelectFilter ? (
            <Select
              value={typeof filterValue === 'string' ? filterValue : ''}
              onValueChange={(v) => handleChange(v)}
            >
              <SelectTrigger
                className={cn(
                  filterTextFieldVariants(),
                  textFieldProps.className,
                )}
              >
                <SelectValue placeholder={filterPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions?.map((option, index) => {
                  const { label, value: optValue } = getValueAndLabel(option);
                  return (
                    <SelectItem key={`${index}-${optValue}`} value={optValue}>
                      {label}{' '}
                      {!columnDef.filterSelectOptions &&
                        `(${facetedUniqueValues.get(optValue)})`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ) : isMultiSelectFilter ? (
            (() => {
              const selected = Array.isArray(filterValue) ? filterValue : [];
              const toggle = (value: string) => {
                const next = selected.includes(value)
                  ? selected.filter((v) => v !== value)
                  : [...selected, value];
                setFilterValue(next);
                column.setFilterValue(next.length ? next : []);
              };
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      // Note: MRT's font-normal (typography) + redundant h-9
                      // dropped — Button defaults win; w-full/justify-start are
                      // layout only.
                      className={cn(
                        'w-full justify-start',
                        textFieldProps.className,
                      )}
                    >
                      {selected.length === 0 ? (
                        <span className="text-muted-foreground">
                          {filterPlaceholder}
                        </span>
                      ) : (
                        <span className="flex flex-wrap gap-0.5">
                          {selected.map((value) => {
                            const opt = dropdownOptions?.find(
                              (o) => getValueAndLabel(o).value === value,
                            );
                            return (
                              <Badge key={value} variant="secondary">
                                {getValueAndLabel(opt ?? value).label}
                              </Badge>
                            );
                          })}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  {/* Note: w-[--radix-popover-trigger-width] is layout (match
                      trigger width); p-0 is shadcn's own official Combobox
                      pattern (Popover hosting a Command list renders padless so
                      the Command owns its spacing) — kept as the canonical
                      pattern, not a decorative override. */}
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder={filterPlaceholder} />
                      <CommandList>
                        <CommandEmpty>—</CommandEmpty>
                        <CommandGroup>
                          {dropdownOptions?.map((option, index) => {
                            const { label, value } = getValueAndLabel(option);
                            const isSel = selected.includes(value);
                            return (
                              <CommandItem
                                key={`${index}-${value}`}
                                value={value}
                                onSelect={() => toggle(value)}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 size-4',
                                    isSel ? 'opacity-100' : 'opacity-0',
                                  )}
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
              );
            })()
          ) : (
            <InputGroup>
              {startGroupAddon}
              <InputGroupInput
                {...commonInputProps}
                ref={setInputRef}
                // Accept numbers too: type='number' filters set numeric values
                // via valueAsNumber; a string-only guard would blank them.
                value={
                  typeof filterValue === 'string' ||
                  typeof filterValue === 'number'
                    ? filterValue
                    : ''
                }
                onChange={handleTextFieldChange}
                onClick={(e) => e.stopPropagation()}
              />
              {clearGroupAddon}
            </InputGroup>
          )}
          {!usesInputGroup && clearButton}
        </div>
      </div>
      {filterModeHelperText}
      {optionMenu}
    </div>
  );
};
