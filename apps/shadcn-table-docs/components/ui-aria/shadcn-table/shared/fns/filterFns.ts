import {
  type RankingInfo,
  rankItem,
  rankings,
} from '@tanstack/match-sorter-utils';
import {
  type Row,
  type RowData,
  type TableFeatures,
  filterFn_arrHas,
  filterFn_arrIncludes,
  filterFn_arrIncludesAll,
  filterFn_equalsString,
  filterFn_equalsStringSensitive,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_weakEquals,
} from '@tanstack/react-table';

const emptyRangeValues: ReadonlyArray<unknown> = ['', undefined];

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_OF_DAY_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const ISO_DATE_TIME_ROW_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/**
 * A row value read as a date: a `Date`, or a string holding a full ISO date
 * and time ('2025-11-02T14:15:00.000Z'); a date-only string stays text.
 */
const getRowDate = (rowValue: unknown): Date | undefined => {
  const date =
    rowValue instanceof Date
      ? rowValue
      : typeof rowValue === 'string' &&
          ISO_DATE_TIME_ROW_PATTERN.test(rowValue.trim())
        ? new Date(rowValue.trim())
        : undefined;
  return date && !isNaN(date.getTime()) ? date : undefined;
};

/**
 * The [row, filter] numbers to compare when the row value is a valid `Date`
 * or ISO date-time string and the filter value a date ('YYYY-MM-DD', local
 * midnight, compared by day), a time of day ('HH:mm', or to the second with
 * 'HH:mm:ss'), a local date and time ('YYYY-MM-DDTHH:mm' to the minute, with
 * ':ss' to the second) or a `Date`; `undefined` for any other pair, which
 * keeps the text and number comparison.
 */
const getDateComparablePair = (
  rowDateValue: unknown,
  filterValue: unknown,
): [number, number] | undefined => {
  const rowValue = getRowDate(rowDateValue);
  if (!rowValue) return;
  if (filterValue instanceof Date) {
    return isNaN(filterValue.getTime())
      ? undefined
      : [rowValue.getTime(), filterValue.getTime()];
  }
  if (typeof filterValue !== 'string') return;
  const value = filterValue.trim();
  const date = DATE_ONLY_PATTERN.exec(value);
  if (date) {
    return [
      new Date(
        rowValue.getFullYear(),
        rowValue.getMonth(),
        rowValue.getDate(),
      ).getTime(),
      new Date(+date[1], +date[2] - 1, +date[3]).getTime(),
    ];
  }
  const time = TIME_OF_DAY_PATTERN.exec(value);
  if (time) {
    const withSeconds = time[3] !== undefined;
    const rowMinutes = rowValue.getHours() * 60 + rowValue.getMinutes();
    const filterMinutes = +time[1] * 60 + +time[2];
    return withSeconds
      ? [rowMinutes * 60 + rowValue.getSeconds(), filterMinutes * 60 + +time[3]]
      : [rowMinutes, filterMinutes];
  }
  const dateTime = DATE_TIME_PATTERN.exec(value);
  if (dateTime) {
    const withSeconds = dateTime[6] !== undefined;
    return [
      new Date(
        rowValue.getFullYear(),
        rowValue.getMonth(),
        rowValue.getDate(),
        rowValue.getHours(),
        rowValue.getMinutes(),
        withSeconds ? rowValue.getSeconds() : 0,
      ).getTime(),
      new Date(
        +dateTime[1],
        +dateTime[2] - 1,
        +dateTime[3],
        +dateTime[4],
        +dateTime[5],
        withSeconds ? +dateTime[6] : 0,
      ).getTime(),
    ];
  }
};

const fuzzy = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  columnId: string,
  filterValue: number | string,
  addMeta?: (item: RankingInfo) => void,
): boolean => {
  const itemRank = rankItem(
    row.getValue<string | number | null>(columnId),
    filterValue as string,
    {
      threshold: rankings.MATCHES,
    },
  );
  addMeta?.(itemRank);
  return itemRank.passed;
};

fuzzy.autoRemove = (val: unknown) => !val;

const contains = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .includes(filterValue.toString().toLowerCase().trim());

contains.autoRemove = (val: unknown) => !val;

const startsWith = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: unknown) => !val;

const endsWith = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean =>
  !!row
    .getValue<number | string | null>(id)
    ?.toString()
    .toLowerCase()
    .trim()
    .endsWith(filterValue.toString().toLowerCase().trim());

endsWith.autoRemove = (val: unknown) => !val;

const equals = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => {
  const datePair = getDateComparablePair(row.getValue(id), filterValue);
  if (datePair) return datePair[0] === datePair[1];
  return (
    row
      .getValue<number | string | null>(id)
      ?.toString()
      .toLowerCase()
      .trim() === filterValue.toString().toLowerCase().trim()
  );
};

equals.autoRemove = (val: unknown) => !val;

const notEquals = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => {
  const datePair = getDateComparablePair(row.getValue(id), filterValue);
  if (datePair) return datePair[0] !== datePair[1];
  return (
    row
      .getValue<number | string | null>(id)
      ?.toString()
      .toLowerCase()
      .trim() !== filterValue.toString().toLowerCase().trim()
  );
};

notEquals.autoRemove = (val: unknown) => !val;

const greaterThan = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => {
  const datePair = getDateComparablePair(row.getValue(id), filterValue);
  if (datePair) return datePair[0] > datePair[1];
  return !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<number | string | null>(id) ?? 0) > +filterValue
    : (row.getValue<number | string | null>(id) ?? '')
        ?.toString()
        .toLowerCase()
        .trim() > filterValue.toString().toLowerCase().trim();
};

greaterThan.autoRemove = (val: unknown) => !val;

const greaterThanOrEqualTo = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || greaterThan(row, id, filterValue);

greaterThanOrEqualTo.autoRemove = (val: unknown) => !val;

const lessThan = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => {
  const datePair = getDateComparablePair(row.getValue(id), filterValue);
  if (datePair) return datePair[0] < datePair[1];
  return !isNaN(+filterValue) && !isNaN(+row.getValue<number | string>(id))
    ? +(row.getValue<number | string | null>(id) ?? 0) < +filterValue
    : (row.getValue<number | string | null>(id) ?? '')
        ?.toString()
        .toLowerCase()
        .trim() < filterValue.toString().toLowerCase().trim();
};

lessThan.autoRemove = (val: unknown) => !val;

const lessThanOrEqualTo = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValue: number | string,
): boolean => equals(row, id, filterValue) || lessThan(row, id, filterValue);

lessThanOrEqualTo.autoRemove = (val: unknown) => !val;

const between = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  (emptyRangeValues.includes(filterValues[0]) ||
    greaterThan(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    emptyRangeValues.includes(filterValues[1]) ||
    lessThan(row, id, filterValues[1]));

between.autoRemove = (val: unknown) => !val;

const betweenInclusive = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValues: [number | string, number | string],
): boolean =>
  (emptyRangeValues.includes(filterValues[0]) ||
    greaterThanOrEqualTo(row, id, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    emptyRangeValues.includes(filterValues[1]) ||
    lessThanOrEqualTo(row, id, filterValues[1]));

betweenInclusive.autoRemove = (val: unknown) => !val;

const empty = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
): boolean => !row.getValue<number | string | null>(id)?.toString().trim();

empty.autoRemove = (val: unknown) => !val;

const notEmpty = <TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  id: string,
): boolean => !!row.getValue<number | string | null>(id)?.toString().trim();

notEmpty.autoRemove = (val: unknown) => !val;

// Registered as `arrIncludesSome` (the `multi-select` default, so its mode label
// resolves): any overlap for an array row value, membership for a scalar one,
// and every row for an empty selection.
const arrIncludesSomeOrValue = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValues: ReadonlyArray<unknown>,
): boolean => {
  if (!filterValues?.length) return true;
  const value = row.getValue<unknown>(id);
  return Array.isArray(value)
    ? filterValues.some((filterValue) => value.includes(filterValue))
    : filterValues.includes(value);
};

arrIncludesSomeOrValue.autoRemove = (val: unknown) =>
  !(val as ReadonlyArray<unknown> | undefined)?.length;

// The `multi-select` "Excludes" mode: no overlap for an array row value, no
// membership for a scalar one, and every row for an empty selection.
const arrIncludesNone = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  id: string,
  filterValues: ReadonlyArray<unknown>,
): boolean => {
  if (!filterValues?.length) return true;
  const value = row.getValue<unknown>(id);
  return Array.isArray(value)
    ? !filterValues.some((filterValue) => value.includes(filterValue))
    : !filterValues.includes(value);
};

arrIncludesNone.autoRemove = arrIncludesSomeOrValue.autoRemove;

export const ST_FilterFns = {
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrHas: filterFn_arrHas,
  arrIncludesSome: arrIncludesSomeOrValue,
  arrIncludesNone,
  between,
  betweenInclusive,
  empty,
  endsWith,
  equals,
  equalsString: filterFn_equalsString,
  equalsStringSensitive: filterFn_equalsStringSensitive,
  inDateRange: filterFn_inDateRange,
  inNumberRange: filterFn_inNumberRange,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  notEmpty,
  startsWith,
  weakEquals: filterFn_weakEquals,
  contains,
  fuzzy,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  notEquals,
};
