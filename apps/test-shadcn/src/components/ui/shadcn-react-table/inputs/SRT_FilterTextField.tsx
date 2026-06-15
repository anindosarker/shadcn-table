import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getColumnFilterInfo,
  getValueAndLabel,
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  useDropdownOptions,
} from 'shadcn-react-table-core';
import { CheckIcon, FilterIcon, XIcon } from 'lucide-react';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

export interface SRT_FilterTextFieldProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  rangeFilterIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/** Simple debounce helper (shadcn has no MUI `debounce`). */
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
  return debounced;
}

/**
 * Filter text field - dispatches by columnFilterVariant.
 *
 * Ports MRT_FilterTextField. Variant mapping (MUI -> shadcn):
 * - text / range / range-text: shadcn Input (range uses two of these via
 *   SRT_FilterRangeFields, one per rangeFilterIndex)
 * - select: shadcn Select
 * - multi-select: shadcn Popover + Command (multi check list with chips)
 * - autocomplete: shadcn Popover + Command (freeSolo, faceted options)
 * - date / datetime / time: native typed Input (no shadcn DatePicker in the
 *   available primitive set — documented deviation)
 * - checkbox: handled by SRT_FilterCheckbox upstream, not here
 *
 * Includes debounced updates, clear button, and the change-filter-mode button
 * wiring to SRT_FilterOptionMenu.
 */
export const SRT_FilterTextField = <TData extends SRT_RowData>({
  header,
  rangeFilterIndex,
  table,
  className,
}: SRT_FilterTextFieldProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
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

  // Slot-prop context is shared by the text field and every picker variant.
  const slotPropsContext = { column, rangeFilterIndex, table };

  // Resolve the slot props: table-level defaults overridable per-column.
  const slotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtFilterTextFieldProps, slotPropsContext),
    parseSRT_HtmlProps(columnDef.srtFilterTextFieldProps, slotPropsContext),
  );

  // Autocomplete and the three date-flavored variants each have their own slot.
  const autocompleteSlotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtFilterAutocompleteProps, slotPropsContext),
    parseSRT_HtmlProps(columnDef.srtFilterAutocompleteProps, slotPropsContext),
  );
  const datePickerSlotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtFilterDatePickerProps, slotPropsContext),
    parseSRT_HtmlProps(columnDef.srtFilterDatePickerProps, slotPropsContext),
  );
  const dateTimePickerSlotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtFilterDateTimePickerProps, slotPropsContext),
    parseSRT_HtmlProps(
      columnDef.srtFilterDateTimePickerProps,
      slotPropsContext,
    ),
  );
  const timePickerSlotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtFilterTimePickerProps, slotPropsContext),
    parseSRT_HtmlProps(columnDef.srtFilterTimePickerProps, slotPropsContext),
  );

  // The date/datetime/time variants all render a single native typed input;
  // pick the matching slot props for whichever variant is active.
  const dateVariantSlotProps = filterVariant?.startsWith('datetime')
    ? dateTimePickerSlotProps
    : filterVariant?.startsWith('time')
      ? timePickerSlotProps
      : datePickerSlotProps;

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

  const filterChipLabel = ['empty', 'notEmpty'].includes(
    currentFilterOption as string,
  )
    ? localization[
        `filter${
          (currentFilterOption?.charAt?.(0)?.toUpperCase() ?? '') +
          (currentFilterOption?.slice(1) ?? '')
        }` as keyof typeof localization
      ]
    : '';

  const filterPlaceholder = !isRangeFilter
    ? localization.filterByColumn?.replace('{column}', String(columnDef.header))
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

  const handleChangeDebounced = useMemo(
    () =>
      debounce(
        (newValue: any) => {
          if (isRangeFilter) {
            column.setFilterValue(
              (old: Array<Date | null | number | string>) => {
                const newFilterValues = old ?? ['', ''];
                newFilterValues[rangeFilterIndex as number] =
                  newValue ?? undefined;
                return newFilterValues;
              },
            );
          } else {
            column.setFilterValue(newValue ?? undefined);
          }
        },
        isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleChange = useCallback(
    (newValue: any) => {
      setFilterValue(newValue ?? '');
      handleChangeDebounced(newValue);
    },
    [handleChangeDebounced],
  );

  const handleClear = useCallback(() => {
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
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultiSelectFilter, isRangeFilter, rangeFilterIndex]);

  const handleClearEmptyFilterChip = () => {
    setFilterValue('');
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const isMounted = useRef(false);
  const currentFilterValue = column.getFilterValue();

  useEffect(() => {
    if (isMounted.current) {
      if (currentFilterValue === undefined) {
        handleClear();
      } else if (isRangeFilter && rangeFilterIndex !== undefined) {
        setFilterValue(
          (currentFilterValue as [string, string])[rangeFilterIndex],
        );
      } else {
        setFilterValue(currentFilterValue as string);
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterValue]);

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
  };

  // Change-filter-mode button rendered before the field.
  const changeModeButton = showChangeModeButton ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={localization.changeFilterMode}
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
        >
          <FilterIcon className="size-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{localization.changeFilterMode}</TooltipContent>
    </Tooltip>
  ) : null;

  const filterModeHelperText = showChangeModeButton ? (
    <span className="block text-xs leading-tight whitespace-nowrap text-muted-foreground">
      {localization.filterMode.replace(
        '{filterType}',
        localization[
          `filter${
            (currentFilterOption?.charAt(0)?.toUpperCase() ?? '') +
            (currentFilterOption?.slice(1) ?? '')
          }` as keyof typeof localization
        ],
      )}
    </span>
  ) : null;

  const optionMenu = (
    <SRT_FilterOptionMenu
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      table={table}
    />
  );

  // Empty/notEmpty mode: show a removable chip instead of an input.
  if (filterChipLabel) {
    return (
      <div className={cn('flex w-full flex-col gap-1', className)}>
        <div className="flex items-center gap-1">
          {changeModeButton}
          <Badge variant="secondary" className="gap-1">
            {filterChipLabel}
            <button
              type="button"
              aria-label={localization.clearFilter}
              onClick={handleClearEmptyFilterChip}
              className="ml-0.5"
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        </div>
        {filterModeHelperText}
        {optionMenu}
      </div>
    );
  }

  const clearButton =
    !isAutocompleteFilter && !isDateFilter ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={localization.clearFilter}
            variant="ghost"
            size="icon"
            disabled={!filterValue?.toString()?.length}
            onClick={handleClear}
            className={cn(
              'absolute right-1 size-7',
              (filterValue?.length ?? 0) > 0 ? 'visible' : 'invisible',
            )}
          >
            <XIcon className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{localization.clearFilter}</TooltipContent>
      </Tooltip>
    ) : null;

  // ---- multi-select ----
  if (isMultiSelectFilter) {
    const selected = Array.isArray(filterValue) ? filterValue : [];
    const toggle = (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      setFilterValue(next);
      column.setFilterValue(next.length ? next : []);
    };
    return (
      <div className={cn('flex w-full flex-col gap-1', className)}>
        <div className="flex w-full items-center gap-1">
          {changeModeButton}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-full justify-start font-normal"
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
        </div>
        {filterModeHelperText}
        {optionMenu}
      </div>
    );
  }

  // ---- single select ----
  if (isSelectFilter) {
    const value = typeof filterValue === 'string' ? filterValue : '';
    return (
      <div className={cn('flex w-full flex-col gap-1', className)}>
        <div className="flex w-full items-center gap-1">
          {changeModeButton}
          <Select value={value} onValueChange={(v) => handleChange(v)}>
            <SelectTrigger className="h-9 w-full">
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
        </div>
        {filterModeHelperText}
        {optionMenu}
      </div>
    );
  }

  // ---- autocomplete (freeSolo) ----
  if (isAutocompleteFilter) {
    const value = typeof filterValue === 'string' ? filterValue : '';
    return (
      <div className={cn('flex w-full flex-col gap-1', className)}>
        <div className="flex w-full items-center gap-1">
          {changeModeButton}
          <Popover>
            <PopoverTrigger asChild>
              <Input
                autoComplete="off"
                aria-label={filterPlaceholder}
                placeholder={filterPlaceholder}
                {...autocompleteSlotProps}
                ref={setInputRef}
                value={value}
                onChange={(e) => {
                  handleChange(e.target.value);
                  autocompleteSlotProps?.onChange?.(e);
                }}
                onClick={(e) => e.stopPropagation()}
                className={cn('h-9 w-full', autocompleteSlotProps?.className)}
              />
            </PopoverTrigger>
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
                          onSelect={() => handleChange(optValue)}
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
        </div>
        {filterModeHelperText}
        {optionMenu}
      </div>
    );
  }

  // ---- date / datetime / time (native typed inputs) ----
  if (isDateFilter) {
    const inputType = filterVariant?.startsWith('datetime')
      ? 'datetime-local'
      : filterVariant?.startsWith('time')
        ? 'time'
        : 'date';
    return (
      <div className={cn('flex w-full flex-col gap-1', className)}>
        <div className="flex w-full items-center gap-1">
          {changeModeButton}
          <Input
            type={inputType}
            aria-label={filterPlaceholder}
            {...dateVariantSlotProps}
            ref={setInputRef}
            value={typeof filterValue === 'string' ? filterValue : ''}
            onChange={(e) => {
              handleChange(e.target.value);
              dateVariantSlotProps?.onChange?.(e);
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className={cn(
              'h-9 w-full min-w-[160px]',
              dateVariantSlotProps?.className,
            )}
          />
        </div>
        {filterModeHelperText}
        {optionMenu}
      </div>
    );
  }

  // ---- text / range textbox (default) ----
  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.type === 'number'
        ? event.target.valueAsNumber
        : event.target.value;
    handleChange(newValue);
    // Compose the user's slot-prop onChange after the component's own logic.
    slotProps?.onChange?.(event);
  };

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <div className="relative flex w-full items-center gap-1">
        {changeModeButton}
        <div className="relative flex-1">
          <Input
            autoComplete="off"
            aria-label={filterPlaceholder}
            placeholder={filterPlaceholder}
            title={filterPlaceholder}
            {...slotProps}
            ref={setInputRef}
            value={typeof filterValue === 'string' ? filterValue : ''}
            onChange={handleTextFieldChange}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className={cn('h-9 w-full pr-8', slotProps?.className)}
          />
          {clearButton}
        </div>
      </div>
      {filterModeHelperText}
      {optionMenu}
    </div>
  );
};
