import { useState } from 'react';
import {
  type SRT_ColumnDef,
  type SRT_ColumnFilterFnsState,
  type SRT_ColumnFiltersState,
  type SRT_PaginationState,
  type SRT_RowData,
  type SRT_SortingState,
  type SRT_Updater,
} from '@/components/ui/shadcn-react-table';
import type { UsersQueryParams } from '../lib/users.service';

//filter values can be strings, numbers or Dates (date filters)
const toParam = (value: unknown) =>
  value instanceof Date ? value.toISOString() : String(value);

export function useTableQueryParams<TData extends SRT_RowData>({
  columns,
  pageSize = 10,
}: {
  columns: SRT_ColumnDef<TData>[];
  pageSize?: number;
}) {
  const [pagination, setPagination] = useState<SRT_PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<SRT_ColumnFiltersState>(
    [],
  );
  //one filter mode per column, from the column's filterFn or 'contains'
  const [columnFilterFns, setColumnFilterFns] =
    useState<SRT_ColumnFilterFnsState>(() =>
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
    onSortingChange: (updater: SRT_Updater<SRT_SortingState>) => {
      setSorting(updater);
      resetPageIndex();
    },
    onColumnFiltersChange: (updater: SRT_Updater<SRT_ColumnFiltersState>) => {
      setColumnFilters(updater);
      resetPageIndex();
    },
    onColumnFilterFnsChange: (
      updater: SRT_Updater<SRT_ColumnFilterFnsState>,
    ) => {
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
