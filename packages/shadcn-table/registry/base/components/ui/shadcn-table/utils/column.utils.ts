import { useMemo } from 'react';
import { constructAggregationFn } from '@tanstack/react-table';
import {
  type DropdownOption,
  type ST_Column,
  type ST_ColumnDef,
  type ST_ColumnOrderState,
  type ST_DefinedColumnDef,
  type ST_DefinedTableOptions,
  type ST_FilterOption,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';

export const getColumnId = <TData extends ST_RowData>(
  columnDef: ST_ColumnDef<TData>,
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header;

export const getAllLeafColumnDefs = <TData extends ST_RowData>(
  columns: ST_ColumnDef<TData>[],
): ST_ColumnDef<TData>[] => {
  const allLeafColumnDefs: ST_ColumnDef<TData>[] = [];
  const getLeafColumns = (cols: ST_ColumnDef<TData>[]) => {
    cols.forEach((col) => {
      if (col.columns) {
        getLeafColumns(col.columns);
      } else {
        allLeafColumnDefs.push(col);
      }
    });
  };
  getLeafColumns(columns);
  return allLeafColumnDefs;
};

export const prepareColumns = <TData extends ST_RowData>({
  columnDefs,
  tableOptions,
}: {
  columnDefs: ST_ColumnDef<TData>[];
  tableOptions: ST_DefinedTableOptions<TData>;
}): ST_DefinedColumnDef<TData>[] => {
  const {
    aggregationFns = {},
    defaultDisplayColumn,
    filterFns = {},
    sortFns = {},
    state: { columnFilterFns = {} } = {},
  } = tableOptions;
  return columnDefs.map((columnDef) => {
    //assign columnId
    if (!columnDef.id) columnDef.id = getColumnId(columnDef);
    //assign columnDefType
    if (!columnDef.columnDefType) columnDef.columnDefType = 'data';
    if (columnDef.columns?.length) {
      columnDef.columnDefType = 'group';
      //recursively prepare columns if this is a group column
      columnDef.columns = prepareColumns({
        columnDefs: columnDef.columns,
        tableOptions,
      });
    } else if (columnDef.columnDefType === 'data') {
      //assign aggregationFns by name, including the custom ones from the
      //table option (v9 only resolves names against the static registry)
      if (
        typeof columnDef.aggregationFn === 'string' &&
        Object.keys(aggregationFns).includes(columnDef.aggregationFn)
      ) {
        columnDef.aggregationFn = aggregationFns[columnDef.aggregationFn];
      }
      //assign aggregationFns if multiple aggregationFns are provided
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as string[];
        columnDef.aggregationFn = constructAggregationFn({
          aggregate: (context) =>
            aggFns.map((fn) => aggregationFns[fn]?.aggregate(context)),
        });
      }

      //assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
        columnDef.filterFn =
          filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy;
        (columnDef as ST_DefinedColumnDef<TData>)._filterFn =
          columnFilterFns[columnDef.id];
      }

      //assign sortFns
      if (Object.keys(sortFns).includes(columnDef.sortFn as string)) {
        columnDef.sortFn = sortFns[columnDef.sortFn as string];
      }
    } else if (columnDef.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as ST_ColumnDef<TData>),
        ...columnDef,
      };
    }
    return columnDef;
  }) as ST_DefinedColumnDef<TData>[];
};

export const reorderColumn = <TData extends ST_RowData>(
  draggedColumn: ST_Column<TData>,
  targetColumn: ST_Column<TData>,
  columnOrder: ST_ColumnOrderState,
): ST_ColumnOrderState => {
  if (draggedColumn.getCanPin()) {
    draggedColumn.pin(targetColumn.getIsPinned());
  }
  const newColumnOrder = [...columnOrder];
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumn.id),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0],
  );
  return newColumnOrder;
};

export const getDefaultColumnFilterFn = <TData extends ST_RowData>(
  columnDef: ST_ColumnDef<TData>,
): ST_FilterOption => {
  const { filterVariant } = columnDef;
  if (filterVariant === 'multi-select') return 'arrIncludesSome';
  if (filterVariant?.includes('range')) return 'betweenInclusive';
  if (filterVariant === 'select' || filterVariant === 'checkbox')
    return 'equals';
  return 'fuzzy';
};

const emptyFacetedUniqueValues = new Map<any, number>();

export const getColumnFilterInfo = <TData extends ST_RowData>({
  header,
  table,
}: {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}) => {
  const {
    options: { columnFilterModeOptions, enableFacetedValues },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { filterVariant } = columnDef;

  const isDateFilter = !!(
    filterVariant?.startsWith('date') || filterVariant?.startsWith('time')
  );
  const isAutocompleteFilter = filterVariant === 'autocomplete';
  const isRangeFilter =
    filterVariant?.includes('range') ||
    ['between', 'betweenInclusive', 'inNumberRange'].includes(
      columnDef._filterFn,
    );
  const isSelectFilter = filterVariant === 'select';
  const isMultiSelectFilter = filterVariant === 'multi-select';
  const isTextboxFilter =
    ['autocomplete', 'text'].includes(filterVariant!) ||
    (!isSelectFilter && !isMultiSelectFilter);
  const currentFilterOption = columnDef._filterFn;

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  // v9 computes facets as soon as the row model is registered; the option
  // keeps v8's "empty until enabled" behaviour
  const facetedUniqueValues = enableFacetedValues
    ? column.getFacetedUniqueValues()
    : emptyFacetedUniqueValues;

  return {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
    isTextboxFilter,
  } as const;
};

export const useDropdownOptions = <TData extends ST_RowData>({
  header,
  table,
}: {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}): DropdownOption[] | undefined => {
  const { column } = header;
  const { columnDef } = column;
  const {
    facetedUniqueValues,
    isAutocompleteFilter,
    isMultiSelectFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table });

  return useMemo<DropdownOption[] | undefined>(
    () =>
      columnDef.filterSelectOptions ??
      ((isSelectFilter || isMultiSelectFilter || isAutocompleteFilter) &&
      facetedUniqueValues
        ? Array.from(facetedUniqueValues.keys())
            .filter((value) => value !== null && value !== undefined)
            .sort((a, b) => a.localeCompare(b))
        : undefined),
    [
      columnDef.filterSelectOptions,
      facetedUniqueValues,
      isMultiSelectFilter,
      isSelectFilter,
    ],
  );
};
