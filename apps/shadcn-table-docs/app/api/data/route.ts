import { type NextRequest, NextResponse } from 'next/server';
import {
  type ST_ColumnFiltersState,
  type ST_FilterOption,
  type ST_SortingState,
} from '@/components/ui-radix/shadcn-table';

import { getData, isLessThan } from './db';

//each filter may carry the column's filter mode; without one, lastLogin keeps 'greaterThan'
type ColumnFilterWithMode = ST_ColumnFiltersState[number] & {
  mode?: ST_FilterOption;
};

//a date-only filter value ('2025-11-02') is that day's local midnight, and the
//row date is cut to its own local day, so equals matches the whole day
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const toTime = (value: unknown, dayOnly: boolean) => {
  const date = value instanceof Date ? value : new Date(value as string);
  return dayOnly
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    : date.getTime();
};

const filterTime = (value: unknown) => {
  const day = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
  return day
    ? new Date(+day[1], +day[2] - 1, +day[3]).getTime()
    : new Date(value as string).getTime();
};

const isDayOnly = (value: unknown) =>
  typeof value === 'string' && DATE_ONLY.test(value);

//compares a row date with the filter value in the column's filter mode
const matchesDate = (
  rowValue: unknown,
  filterValue: unknown,
  mode: ST_FilterOption = 'greaterThan',
): boolean => {
  if (mode === 'between' || mode === 'betweenInclusive') {
    const [min, max] = Array.isArray(filterValue) ? filterValue : [];
    const inclusive = mode === 'betweenInclusive';
    //an empty bound (undefined, null or '') leaves that side open
    return (
      (min == null ||
        min === '' ||
        matchesDate(
          rowValue,
          min,
          inclusive ? 'greaterThanOrEqualTo' : 'greaterThan',
        )) &&
      (max == null ||
        max === '' ||
        matchesDate(
          rowValue,
          max,
          inclusive ? 'lessThanOrEqualTo' : 'lessThan',
        ))
    );
  }
  const filter = filterTime(filterValue);
  const row = toTime(rowValue, isDayOnly(filterValue));
  if (Number.isNaN(filter) || Number.isNaN(row)) return true;
  switch (mode) {
    case 'equals':
      return row === filter;
    case 'notEquals':
      return row !== filter;
    case 'greaterThanOrEqualTo':
      return row >= filter;
    case 'lessThan':
      return row < filter;
    case 'lessThanOrEqualTo':
      return row <= filter;
    default:
      return row > filter;
  }
};

//This is just a simple mock of a backend API where you would do server-side pagination, filtering, and sorting
//You would most likely want way more validation and error handling than this in a real world application
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  let dbData = getData();
  const { searchParams } = request.nextUrl;
  const start = searchParams.get('start') ?? '0';
  const size = searchParams.get('size') ?? '10';
  const filters = searchParams.get('filters') ?? '[]';
  const sorting = searchParams.get('sorting') ?? '[]';
  const globalFilter = searchParams.get('globalFilter') ?? '';

  const parsedColumnFilters = JSON.parse(filters) as ColumnFilterWithMode[];
  if (parsedColumnFilters?.length) {
    parsedColumnFilters.map((filter) => {
      const { id: columnId, value: filterValue, mode } = filter;
      dbData = dbData.filter((row) => {
        if (columnId === 'lastLogin') {
          return matchesDate(row[columnId], filterValue, mode);
        }
        return row[columnId]
          ?.toString()
          ?.toLowerCase()
          ?.includes?.((filterValue as string).toLowerCase());
      });
    });
  }

  if (globalFilter) {
    dbData = dbData.filter((row) =>
      Object.keys(row).some((columnId) =>
        row[columnId]
          ?.toString()
          ?.toLowerCase()
          ?.includes?.((globalFilter as string).toLowerCase()),
      ),
    );
  }

  const parsedSorting = JSON.parse(sorting) as ST_SortingState;
  if (parsedSorting?.length) {
    const sort = parsedSorting[0];
    const { id, desc } = sort;
    dbData.sort((a, b) => {
      if (desc) {
        return isLessThan(a[id], b[id]) ? 1 : -1;
      }
      return isLessThan(b[id], a[id]) ? 1 : -1;
    });
  }

  return NextResponse.json({
    data:
      dbData?.slice(parseInt(start), parseInt(start) + parseInt(size)) ?? [],
    meta: { totalRowCount: dbData.length },
  });
}
