import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_ColumnFilterFnsState,
  type ST_ColumnFiltersState,
  type ST_PaginationState,
  type ST_RowData,
  type ST_SortingState,
  type ST_Updater,
} from '@/components/ui/shadcn-table';
import type { UsersQueryParams } from '../lib/users.service';

//filter values can be strings, numbers or Dates (date filters)
const toParam = (value: unknown) =>
  value instanceof Date ? value.toISOString() : String(value);

export function useTableQueryParams<TData extends ST_RowData>({
  columns,
  pageSize = 10,
}: {
  columns: ST_ColumnDef<TData>[];
  pageSize?: number;
}) {
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  //one filter mode per column, from the column's filterFn or 'contains'
  const [columnFilterFns, setColumnFilterFns] =
    useState<ST_ColumnFilterFnsState>(() =>
      Object.fromEntries(
        columns.map((column) => [
          column.id ?? String(column.accessorKey),
          typeof column.filterFn === 'string' ? column.filterFn : 'contains',
        ]),
      ),
    );

  //new search, sort or filter: the old page number means nothing, go back to page 1
  const resetPageIndex = () =>
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

  const handlers = {
    onPaginationChange: setPagination,
    onGlobalFilterChange: (value: string | undefined) => {
      setSearch(value ?? '');
      resetPageIndex();
    },
    onSortingChange: (updater: ST_Updater<ST_SortingState>) => {
      setSorting(updater);
      resetPageIndex();
    },
    onColumnFiltersChange: (updater: ST_Updater<ST_ColumnFiltersState>) => {
      setColumnFilters(updater);
      resetPageIndex();
    },
    onColumnFilterFnsChange: (updater: ST_Updater<ST_ColumnFilterFnsState>) => {
      setColumnFilterFns(updater);
      resetPageIndex();
    },
  };

  //translate table state into the params YOUR server accepts
  const params: UsersQueryParams = {
    page: pagination.pageIndex + 1, //table is 0-based, server is 1-based
    limit: pagination.pageSize,
    search: search || undefined,
    sortBy: sorting.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`),
    filter: columnFilters.map(
      ({ id, value }) =>
        `${id}[$${columnFilterFns[id] ?? 'contains'}]=${toParam(value)}`,
    ),
  };

  return {
    params,
    handlers,
    state: {
      pagination,
      globalFilter: search,
      sorting,
      columnFilters,
      columnFilterFns,
    },
  };
}
