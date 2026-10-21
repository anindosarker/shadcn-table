import { type DropdownOption } from '@/components/ui/shadcn-table/types';

export const parseFromValuesOrFunc = <T, U>(
  fn: ((arg: U) => T) | T | undefined,
  arg: U,
): T | undefined => (fn instanceof Function ? fn(arg) : fn);

export const getValueAndLabel = (
  option?: DropdownOption | null,
): { label: string; value: string } => {
  let label: string = '';
  let value: string = '';
  if (option) {
    if (typeof option !== 'object') {
      label = option;
      value = option;
    } else {
      label = option.label ?? option.value;
      value = option.value ?? label;
    }
  }
  return { label, value };
};

// Note: @mui/utils debounce, verbatim; MRT imports it from '@mui/material/utils'.
export interface Cancelable {
  clear(): void;
}

// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 166,
): T & Cancelable {
  let timeout: ReturnType<typeof setTimeout>;
  function debounced(...args: Parameters<T>) {
    const later = () => {
      // @ts-expect-error -- MUI keeps `this` untyped here (its source has @ts-ignore)
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  debounced.clear = () => {
    clearTimeout(timeout);
  };
  return debounced as T & Cancelable;
}

// Note: @mui/material useAutocomplete createFilterOptions, verbatim; MUI Autocomplete's default filterOptions.
export interface CreateFilterOptionsConfig<Value> {
  ignoreAccents?: boolean;
  ignoreCase?: boolean;
  limit?: number;
  matchFrom?: 'any' | 'start';
  stringify?: (option: Value) => string;
  trim?: boolean;
}

export interface FilterOptionsState<Value> {
  inputValue: string;
  getOptionLabel: (option: Value) => string;
}

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
function stripDiacritics(string: string) {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function createFilterOptions<Value>(
  config: CreateFilterOptionsConfig<Value> = {},
) {
  const {
    ignoreAccents = true,
    ignoreCase = true,
    limit,
    matchFrom = 'any',
    stringify,
    trim = false,
  } = config;
  return (
    options: Value[],
    { inputValue, getOptionLabel }: FilterOptionsState<Value>,
  ): Value[] => {
    let input = trim ? inputValue.trim() : inputValue;
    if (ignoreCase) {
      input = input.toLowerCase();
    }
    if (ignoreAccents) {
      input = stripDiacritics(input);
    }
    const filteredOptions = !input
      ? options
      : options.filter((option) => {
          let candidate = (stringify || getOptionLabel)(option);
          if (ignoreCase) {
            candidate = candidate.toLowerCase();
          }
          if (ignoreAccents) {
            candidate = stripDiacritics(candidate);
          }
          return matchFrom === 'start'
            ? candidate.startsWith(input)
            : candidate.includes(input);
        });
    return typeof limit === 'number'
      ? filteredOptions.slice(0, limit)
      : filteredOptions;
  };
}
