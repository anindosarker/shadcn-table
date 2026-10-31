import { type Ref } from 'react';
import { type DropdownOption } from '@/components/ui-aria/shadcn-table/types';

export const parseFromValuesOrFunc = <T, U>(
  fn: ((arg: U) => T) | T | undefined,
  arg: U,
): T | undefined => (fn instanceof Function ? fn(arg) : fn);

/**
 * Hands a DOM node to a user `ref` prop, a callback ref or a ref object, from
 * the library's own ref callback. Returns what a callback ref returns: under
 * React 19 that can be a cleanup, which the caller runs in place of handing
 * the ref `null`.
 */
export const assignRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === 'function') {
    return ref(node);
  }
  if (ref) {
    ref.current = node;
  }
};

type NavigatorWithUAData = Navigator & {
  userAgentData?: { platform: string };
};

/** Lower-cased OS name; `navigator.userAgentData.platform` first. */
export const getPlatform = (): string =>
  (
    (navigator as NavigatorWithUAData).userAgentData?.platform ??
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- userAgentData is Chromium only; Firefox and Safari need the fallback
    navigator.platform
  ).toLowerCase();

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

export interface Cancelable {
  clear(): void;
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait = 166,
): T & Cancelable {
  let timeout: ReturnType<typeof setTimeout>;
  function debounced(...args: Parameters<T>) {
    const later = () => {
      // @ts-expect-error -- `this` is untyped here
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
