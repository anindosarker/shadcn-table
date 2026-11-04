import {
  type ST_Column,
  type ST_InternalFilterOption,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import { getValueAndLabel } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { stFilterOptions } from '@/components/ui-radix/shadcn-table/components/menus/ST_FilterOptionMenu';

/** The filter modes that take no value; core drops an empty value, so they hold a space. */
export const ST_EMPTY_FILTER_MODES: readonly string[] = ['empty', 'notEmpty'];

/** The text the chrome names a column by: its string header, else its id. */
export const getColumnLabel = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): string =>
  typeof column.columnDef.header === 'string' && column.columnDef.header
    ? column.columnDef.header
    : column.id;

/**
 * The filter modes the column's editor offers, in the order of
 * `columnFilterModeOptions`; none unless the column sets both
 * `enableColumnFilterModes` and `columnFilterModeOptions`.
 */
export const getFilterModeOptions = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): ST_InternalFilterOption[] => {
  const { columnFilterModeOptions, enableColumnFilterModes } = column.columnDef;
  if (!enableColumnFilterModes || !columnFilterModeOptions?.length) return [];
  const options = stFilterOptions(column.table.options.localization);
  return columnFilterModeOptions.flatMap(
    (mode) => options.find((option) => option.option === mode) ?? [],
  );
};

/** True while the column filters by a mode that takes no value. */
export const isEmptyFilterMode = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): boolean =>
  ST_EMPTY_FILTER_MODES.includes(getColumnFilterFnName(column.columnDef));

/**
 * Switches the column's filter mode: an empty mode sets the space value so
 * the filter stays active, and leaving one clears the value.
 */
export const setFilterMode = <TData extends ST_RowData>(
  column: ST_Column<TData>,
  mode: string,
) => {
  const previous = getColumnFilterFnName(column.columnDef);
  if (mode === previous) return;
  column.table.setColumnFilterFns((current) => ({
    ...current,
    [column.id]: mode,
  }));
  if (ST_EMPTY_FILTER_MODES.includes(mode)) {
    if (!ST_EMPTY_FILTER_MODES.includes(previous)) column.setFilterValue(' ');
  } else if (ST_EMPTY_FILTER_MODES.includes(previous)) {
    column.setFilterValue(undefined);
  }
};

/** Puts a column with a mode picker back on its first mode. */
export const resetFilterMode = <TData extends ST_RowData>(
  column: ST_Column<TData>,
) => {
  const [first] = getFilterModeOptions(column);
  if (!first || getColumnFilterFnName(column.columnDef) === first.option) {
    return;
  }
  column.table.setColumnFilterFns((current) => ({
    ...current,
    [column.id]: first.option,
  }));
};

/**
 * The column's mode as chip text, "contains" or "is empty"; empty for a
 * column without a mode picker.
 */
export const describeFilterMode = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): string => {
  const current = getColumnFilterFnName(column.columnDef);
  const option = getFilterModeOptions(column).find(
    (candidate) => candidate.option === current,
  );
  if (!option) return '';
  const { localization } = column.table.options;
  if (current === 'empty') return localization.isEmpty;
  if (current === 'notEmpty') return localization.isNotEmpty;
  return option.label.toLowerCase();
};

const isBlank = (value: unknown) =>
  value === undefined || value === null || value === '';

const formatValue = (value: unknown): string =>
  value instanceof Date ? value.toLocaleDateString() : String(value);

/**
 * The column filter value as chip text: "Done", "5 to 20", "Bug, Docs +1";
 * empty while the column has no value or filters by an empty mode.
 */
export const summarizeFilterValue = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): string => {
  const value = column.getFilterValue();
  if (isBlank(value) || isEmptyFilterMode(column)) return '';
  const { localization } = column.table.options;
  const { filterSelectOptions, filterVariant } = column.columnDef;
  const label = (item: unknown) => {
    const option = filterSelectOptions?.find(
      (candidate) => getValueAndLabel(candidate).value === item,
    );
    return option === undefined
      ? formatValue(item)
      : getValueAndLabel(option).label;
  };
  if (Array.isArray(value)) {
    const isRange =
      filterVariant?.includes('range') ||
      ['between', 'betweenInclusive', 'inNumberRange'].includes(
        getColumnFilterFnName(column.columnDef),
      );
    if (isRange) {
      const [min, max] = value as unknown[];
      if (!isBlank(min) && !isBlank(max)) {
        return localization.rangeSummary
          .replace('{min}', formatValue(min))
          .replace('{max}', formatValue(max));
      }
      if (!isBlank(min)) return `≥ ${formatValue(min)}`;
      if (!isBlank(max)) return `≤ ${formatValue(max)}`;
      return '';
    }
    const labels = value.filter((item) => !isBlank(item)).map(label);
    return labels.length > 2
      ? `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`
      : labels.join(', ');
  }
  if (filterVariant === 'checkbox') {
    return String(value) === 'true' ? localization.yes : localization.no;
  }
  if (filterVariant?.startsWith('date') || filterVariant?.startsWith('time')) {
    const mode = getColumnFilterFnName(column.columnDef);
    if (mode.startsWith('greaterThan')) {
      return localization.afterValue.replace('{value}', formatValue(value));
    }
    if (mode.startsWith('lessThan')) {
      return localization.beforeValue.replace('{value}', formatValue(value));
    }
  }
  return label(value);
};
