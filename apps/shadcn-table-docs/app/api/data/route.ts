import { type NextRequest, NextResponse } from 'next/server';
import {
  type ST_ColumnFiltersState,
  type ST_SortingState,
} from '@/components/ui/shadcn-table';

import { getData, isLessThan } from './db';

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

  const parsedColumnFilters = JSON.parse(filters) as ST_ColumnFiltersState;
  if (parsedColumnFilters?.length) {
    parsedColumnFilters.map((filter) => {
      const { id: columnId, value: filterValue } = filter;
      dbData = dbData.filter((row) => {
        if (columnId === 'lastLogin') {
          const rowDateValue = new Date(row[columnId]);
          const filterDateValue = new Date(filterValue as string);
          return rowDateValue > filterDateValue;
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
