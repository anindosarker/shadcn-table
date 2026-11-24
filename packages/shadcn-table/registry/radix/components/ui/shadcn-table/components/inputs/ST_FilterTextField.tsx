import {
  type ChangeEvent,
  type FocusEvent,
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
import { DatePicker } from '@/components/date-picker/date-picker';
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
  ComboboxTrigger,
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
  type ST_ColumnFiltersState,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import {
  getColumnFilterInfo,
  getDefaultColumnFilterFn,
  isNumberColumn,
  useDropdownOptions,
} from '@/components/ui/shadcn-table/shared/utils/column.utils';
import {
  createFilterOptions,
  getValueAndLabel,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useST_DebouncedCallback } from '@/components/ui/shadcn-table/hooks/useST_DebouncedCallback';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

const filterTextFieldVariants = cva(
  'relative inline-flex w-full min-w-0 flex-col align-top',
);

// The range picker's own parts sit in the filter box, which draws the
// border, the background and the focus ring.
const rangePickerClassName =
  '[&>button]:h-full [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none dark:[&>button]:bg-transparent [&>button]:aria-expanded:bg-transparent **:data-[slot=input-group]:h-full **:data-[slot=input-group]:border-0 **:data-[slot=input-group]:bg-transparent **:data-[slot=input-group]:shadow-none **:data-[slot=input-group]:ring-0! dark:**:data-[slot=input-group]:bg-transparent';

// The time range keeps a box per end: side by side, named for screen readers.
const timeRangeClassName =
  'h-full flex-row gap-0 *:data-[slot=field]:gap-0 *:data-[slot=field]:not-first:border-s **:data-[slot=field-label]:sr-only';

/** Every value the filter inputs hand to the column filter. */
type FilterInputValue = Date | number | string | string[] | null;

const toRangeValue = (value: unknown): [string, string] =>
  Array.isArray(value)
    ? [(value[0] as string) || '', (value[1] as string) || '']
    : ['', ''];

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

  // A date-like range is one range picker for the pair (D183); a consumer's
  // props functions see it as the first end.
  const isDateRange =
    isDateFilter && isRangeFilter && rangeFilterIndex === undefined;

  const args = {
    column,
    rangeFilterIndex: isDateRange ? 0 : rangeFilterIndex,
    table,
  };

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

  const filterPlaceholder =
    !isRangeFilter || isDateRange
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
      : isDateRange
        ? toRangeValue(column.getFilterValue())
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
    if (isDateRange) {
      column.setFilterValue(
        toRangeValue(newValue).map((end) => end || undefined),
      );
    } else if (isRangeFilter) {
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
  // digit, so a typed value applies on Enter or blur only. The typed date not
  // applied yet; an unmount without a blur applies it.
  const [typedDate, setTypedDate] = useState<{
    guard: ReturnType<typeof getCommitGuard>;
    value: string | string[];
  } | null>(null);
  const commitTypedDateOnUnmount = useRef(() => {});
  useLayoutEffect(() => {
    commitTypedDateOnUnmount.current = () => {
      if (typedDate && isCommitGuardHeld(typedDate.guard)) {
        commitFilterValue(typedDate.value || null);
      }
    };
  });
  const dateBlurCommit = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const commit = commitTypedDateOnUnmount;
    return () => {
      clearTimeout(dateBlurCommit.current);
      commit.current();
    };
  }, []);

  const commitTypedValue = () => {
    if (typedDate) {
      setTypedDate(null);
      if (isCommitGuardHeld(typedDate.guard)) {
        handlePick(typedDate.value || null);
      }
    } else {
      debouncedCommit.flush();
    }
  };

  const filterInputKey = `${column.id}-${rangeFilterIndex ?? 0}`;
  const datePickerRef = useRef<HTMLDivElement>(null);

  // A change while the date picker's input has focus is typed, unless a
  // click on one of its buttons made it after the last key press.
  const isDatePickerButtonClick = useRef(false);
  // The range picker's end inputs live in its popup, outside the box.
  const focusedRangeInput = useRef<HTMLInputElement | null>(null);
  const handleDateChange = (newValue: string | string[]) => {
    const active = document.activeElement;
    if (
      active instanceof HTMLInputElement &&
      (datePickerRef.current?.contains(active) ||
        (isDateRange && active === focusedRangeInput.current)) &&
      !isDatePickerButtonClick.current
    ) {
      setFilterValue(newValue);
      setTypedDate({ guard: getCommitGuard(), value: newValue });
    } else {
      setTypedDate(null);
      handlePick(newValue || null);
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
      [header.id]:
        allowedColumnFilterOptions?.[0] ?? getDefaultColumnFilterFn(columnDef),
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
      filterInputRefs.current[filterInputKey] = inputRef as HTMLInputElement;
    },
    title: filterPlaceholder,
    ...textFieldProps,
    className: cn('text-ellipsis', filterChipLabel && 'w-0'),
    onBlur: (e) => {
      commitTypedValue();
      textFieldProps.onBlur?.(e);
    },
    onKeyDown: (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') commitTypedValue();
      textFieldProps.onKeyDown?.(e);
    },
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

  // Shared by both comboboxes and the date picker: the inner shadcn part
  // brings its own border and focus ring, which the surrounding InputGroup
  // already draws.
  const nestedGroupClassName =
    'h-auto min-h-0 flex-1 rounded-none border-0 bg-transparent shadow-none dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-0! has-[[data-slot=input-group-control]:focus-visible]:ring-0! focus-within:ring-0!';

  const dateBoxProps = {
    ...textFieldProps,
    ...(filterVariant?.startsWith('time')
      ? timePickerProps
      : filterVariant?.startsWith('datetime')
        ? dateTimePickerProps
        : datePickerProps),
  };

  const datePickerStep =
    dateBoxProps.step === undefined ? undefined : Number(dateBoxProps.step);

  const datePickerTypeProps = filterVariant?.startsWith('time')
    ? ({ step: datePickerStep, type: 'time' } as const)
    : filterVariant?.startsWith('datetime')
      ? ({ step: datePickerStep, type: 'datetime' } as const)
      : ({ type: 'date' } as const);

  const datePickerBoxProps = {
    'aria-label': filterPlaceholder,
    ...Object.fromEntries(
      Object.entries(dateBoxProps).filter(
        ([key]) => key.startsWith('aria-') || key.startsWith('data-'),
      ),
    ),
    className: cn(
      nestedGroupClassName,
      '*:data-[align=inline-end]:py-0',
      isDateRange && rangePickerClassName,
      isDateRange && datePickerTypeProps.type === 'time' && timeRangeClassName,
      filterChipLabel && 'hidden',
    ),
    disabled: dateBoxProps.disabled ?? !!filterChipLabel,
    id: dateBoxProps.id,
    max: dateBoxProps.max === undefined ? undefined : String(dateBoxProps.max),
    min: dateBoxProps.min === undefined ? undefined : String(dateBoxProps.min),
    onBlur: (e: FocusEvent<HTMLDivElement>) => {
      // A typed end of the range picker applies when its input loses focus.
      if (isDateRange && e.target instanceof HTMLInputElement) {
        commitTypedValue();
      } else if (!e.relatedTarget) {
        // Focus going to another element may be going to the popup, which
        // React counts as inside: its focus event cancels the commit.
        commitTypedValue();
      } else if (!e.currentTarget.contains(e.relatedTarget)) {
        // A focus move inside the popup can arrive twice: one pending commit.
        clearTimeout(dateBlurCommit.current);
        dateBlurCommit.current = setTimeout(commitTypedValue);
      }
      dateBoxProps.onBlur?.(e as unknown as FocusEvent<HTMLInputElement>);
    },
    onChange: handleDateChange,
    onClickCapture: (e: MouseEvent<HTMLDivElement>) => {
      isDatePickerButtonClick.current = !(e.target instanceof HTMLInputElement);
      // A calendar day equal to the typed date fires no onChange: the click applies it.
      if ((e.target as Element).closest('[data-day]')) commitTypedValue();
    },
    onFocus: (e: FocusEvent<HTMLDivElement>) => {
      clearTimeout(dateBlurCommit.current);
      if (e.target instanceof HTMLInputElement) {
        focusedRangeInput.current = e.target;
      }
      dateBoxProps.onFocus?.(e as unknown as FocusEvent<HTMLInputElement>);
    },
    // A React Aria button stops its click from bubbling: a key press resets.
    onKeyDownCapture: () => {
      isDatePickerButtonClick.current = false;
    },
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      const isBoxInput =
        e.target instanceof HTMLInputElement &&
        (isDateRange || e.currentTarget.contains(e.target));
      // An Escape on one of the box's buttons goes on to close the editor.
      if (
        e.key !== 'Escape' ||
        isBoxInput ||
        !e.currentTarget.contains(e.target as Node)
      ) {
        e.stopPropagation();
      }
      if (e.key === 'Enter' && isBoxInput) commitTypedValue();
      dateBoxProps.onKeyDown?.(e as unknown as KeyboardEvent<HTMLInputElement>);
    },
    // The picker mounts a new input when it is cleared: read on every render.
    ref: (root: HTMLDivElement | null) => {
      datePickerRef.current = root;
      // A time range holds its end inputs in the box; a date range holds them
      // in its popup, so the box has none to focus.
      const inputs = Array.from(root?.querySelectorAll('input') ?? []);
      const keys = isDateRange
        ? [`${column.id}-0`, `${column.id}-1`]
        : [filterInputKey];
      keys.forEach((key, index) => {
        filterInputRefs.current[key] = inputs[index] as HTMLInputElement;
      });
    },
    style: dateBoxProps.style,
    title: filterPlaceholder,
    value: (filterValue as string) || '',
  };

  return (
    <>
      <div
        className={cn(
          filterTextFieldVariants(),
          // A date box holds its input, a clear button and the popup button;
          // a date range box takes the width of the two boxes it replaced.
          isDateRange
            ? 'min-w-72'
            : isDateFilter
              ? 'min-w-35'
              : isMultiSelectFilter
                ? 'min-w-30'
                : isRangeFilter
                  ? 'min-w-18'
                  : !filterChipLabel
                    ? 'min-w-24'
                    : 'min-w-auto',
          // The consumer's class sizes the whole box, so its controls stay inside (D184).
          isDateFilter ? dateBoxProps.className : textFieldProps.className,
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
          {isDateRange ? (
            <DatePicker
              {...datePickerBoxProps}
              {...datePickerTypeProps}
              labels={{ from: localization.min, to: localization.max }}
              range
              value={toRangeValue(filterValue)}
            />
          ) : isDateFilter ? (
            <DatePicker {...datePickerBoxProps} {...datePickerTypeProps} />
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
        {showChangeModeButton &&
        rangeFilterIndex === undefined &&
        !isDateRange ? (
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
