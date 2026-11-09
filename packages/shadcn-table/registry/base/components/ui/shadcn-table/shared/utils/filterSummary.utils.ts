import {
  type ST_Column,
  type ST_InternalFilterOption,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { getValueAndLabel } from '@/components/ui/shadcn-table/shared/utils/utils';
import {
  isFilterModeForVariant,
  stFilterOptions,
} from '@/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu';

/** The filter modes that take no value; core drops an empty value, so they hold a space. */
export const ST_EMPTY_FILTER_MODES: readonly string[] = ['empty', 'notEmpty'];

/** The text the chrome names a column by: its string header, else its id. */
export const getColumnLabel = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): string =>
  typeof column.columnDef.header === 'string' && column.columnDef.header
    ? column.columnDef.header
    : column.id;

const RANGE_MODES: readonly string[] = [
  'between',
  'betweenInclusive',
  'inNumberRange',
];
const RANGE_VARIANTS: readonly string[] = [
  'date-range',
  'datetime-range',
  'range',
  'range-slider',
];

/**
 * The filter modes the column's editor offers. The column's
 * `enableColumnFilterModes` and `columnFilterModeOptions` win over the
 * table's, and no list offers every mode. A range variant offers only the
 * range modes the column's or table's list names (every range mode when
 * neither sets a list). A checkbox or range slider offers none, as in the
 * subheader.
 */
export const getFilterModeOptions = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): ST_InternalFilterOption[] => {
  const { columnDef, table } = column;
  const { filterVariant } = columnDef;
  const enabled =
    columnDef.enableColumnFilterModes ?? table.options.enableColumnFilterModes;
  if (
    !enabled ||
    filterVariant === 'checkbox' ||
    filterVariant === 'range-slider'
  ) {
    return [];
  }
  const list =
    columnDef.columnFilterModeOptions ?? table.options.columnFilterModeOptions;
  if (list === null) return [];
  let allowed: readonly string[] | undefined = list;
  if (RANGE_VARIANTS.includes(filterVariant as string)) {
    allowed = (allowed ?? RANGE_MODES).filter((mode) =>
      RANGE_MODES.includes(mode),
    );
  }
  const options = stFilterOptions(table.options.localization).filter((option) =>
    isFilterModeForVariant(option.option, filterVariant),
  );
  if (!allowed) return options;
  return allowed.flatMap(
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

/**
 * Puts a column with a mode picker back on its initial mode, or on its first
 * mode when the picker does not offer the initial one.
 */
export const resetFilterMode = <TData extends ST_RowData>(
  column: ST_Column<TData>,
) => {
  const options = getFilterModeOptions(column);
  const initial = column.table.initialState.columnFilterFns?.[column.id];
  const target =
    options.find((option) => option.option === initial) ?? options[0];
  if (!target || getColumnFilterFnName(column.columnDef) === target.option) {
    return;
  }
  column.table.setColumnFilterFns((current) => ({
    ...current,
    [column.id]: target.option,
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
      RANGE_MODES.includes(getColumnFilterFnName(column.columnDef));
    if (isRange) {
      const [min, max] = value as unknown[];
      if (!isBlank(min) && !isBlank(max)) {
        return localization.rangeSummary
          .replace('{min}', formatValue(min))
          .replace('{max}', formatValue(max));
      }
      if (!isBlank(min)) return `${localization.min} ${formatValue(min)}`;
      if (!isBlank(max)) return `${localization.max} ${formatValue(max)}`;
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
