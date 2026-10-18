import { type NextRequest, NextResponse } from 'next/server';
import { type DbRow, getData, isLessThan } from '../data/db';

//A mock REST backend with its own query format. The table does not speak this format:
//the docs' useTableQueryParams hook translates table state into it.
//  GET /api/users?page=1&limit=10&search=tex&sortBy=lastName:desc&filter=state[$contains]=tex
//Returns { data, total, page, limit }. page is 1-based.

const OPERATORS: Record<
  string,
  (cell: DbRow[string], value: string) => boolean
> = {
  contains: (cell, value) => text(cell).includes(value.toLowerCase()),
  startsWith: (cell, value) => text(cell).startsWith(value.toLowerCase()),
  endsWith: (cell, value) => text(cell).endsWith(value.toLowerCase()),
  equals: (cell, value) => text(cell) === value.toLowerCase(),
  notEquals: (cell, value) => text(cell) !== value.toLowerCase(),
  greaterThan: (cell, value) => compare(cell, value) > 0,
  lessThan: (cell, value) => compare(cell, value) < 0,
};

//built once, so lastLogin dates stay stable between requests
const db = getData();

const text = (cell: DbRow[string]) => String(cell ?? '').toLowerCase();

const compare = (cell: DbRow[string], value: string) =>
  cell instanceof Date
    ? cell.getTime() - new Date(value).getTime()
    : text(cell).localeCompare(value.toLowerCase());

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);
  const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '10') || 10);
  const search = searchParams.get('search')?.toLowerCase();

  let rows = [...db];

  //filter=field[$operator]=value, repeated
  for (const filter of searchParams.getAll('filter')) {
    const match = /^(\w+)\[\$(\w+)\]=(.*)$/.exec(filter);
    const test = match && OPERATORS[match[2]];
    if (!match || !test) {
      return NextResponse.json(
        { message: `Invalid filter: ${filter}` },
        { status: 400 },
      );
    }
    const [, field, , value] = match;
    rows = rows.filter((row) => test(row[field], value));
  }

  if (search) {
    rows = rows.filter((row) =>
      Object.values(row).some((cell) => text(cell).includes(search)),
    );
  }

  //sortBy=field:asc|desc, repeated; earlier sorts take priority
  const sorts = searchParams.getAll('sortBy').map((sort) => {
    const [field, direction] = sort.split(':');
    return { field, desc: direction === 'desc' };
  });
  if (sorts.length) {
    rows.sort((a, b) => {
      for (const { field, desc } of sorts) {
        if (isLessThan(a[field], b[field])) return desc ? 1 : -1;
        if (isLessThan(b[field], a[field])) return desc ? -1 : 1;
      }
      return 0;
    });
  }

  return NextResponse.json({
    data: rows.slice((page - 1) * limit, page * limit),
    total: rows.length,
    page,
    limit,
  });
}
