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
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_CoreTableInstance,
} from '@/components/ui/shadcn-table/types';

export const getColumnId = <TData extends ST_RowData>(
  columnDef: ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>,
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header;

export const getAllLeafColumnDefs = <TData extends ST_RowData>(
  columns: ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>[],
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>[] => {
  const allLeafColumnDefs: ST_ColumnDef<
    TData,
    unknown,
    ST_NeutralPartPropTypes
  >[] = [];
  const getLeafColumns = (
    cols: ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>[],
  ) => {
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
  columnDefs: ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>[];
  tableOptions: ST_DefinedTableOptions<TData>;
}): ST_DefinedColumnDef<TData>[] => {
  const { defaultDisplayColumn, state: { columnFilterFns = {} } = {} } =
    tableOptions;
  return columnDefs.map((columnDef) => {
    if (!columnDef.id) columnDef.id = getColumnId(columnDef);
    if (!columnDef.columnDefType) columnDef.columnDefType = 'data';
    if (columnDef.columns?.length) {
      columnDef.columnDefType = 'group';
      columnDef.columns = prepareColumns({
        columnDefs: columnDef.columns,
        tableOptions,
      });
    } else if (columnDef.columnDefType === 'data') {
      //each name resolves against the table's registry when it aggregates
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as string[];
        columnDef.aggregationFn = constructAggregationFn({
          aggregate: (context) =>
            aggFns.map((fn) =>
              context.table._rowModelFns.aggregationFns?.[fn]?.aggregate(
                context,
              ),
            ),
        });
      }

      //a filterFn function keeps running until another mode is picked
      const filterFn = columnFilterFns[columnDef.id];
      if (
        filterFn &&
        !(
          columnDef.filterFn instanceof Function &&
          columnDef.filterFn.name === filterFn
        )
      ) {
        columnDef.filterFn = filterFn;
      }
    } else if (columnDef.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as ST_ColumnDef<
          TData,
          unknown,
          ST_NeutralPartPropTypes
        >),
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

/**
 * The column's current filter mode name, or an empty string while it runs a
 * filterFn function.
 */
export const getColumnFilterFnName = <TData extends ST_RowData>(
  columnDef: ST_DefinedColumnDef<TData>,
): ST_FilterOption =>
  typeof columnDef.filterFn === 'string' ? columnDef.filterFn : '';

export const getDefaultColumnFilterFn = <TData extends ST_RowData>(
  columnDef: ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>,
): ST_FilterOption => {
  const { filterVariant } = columnDef;
  if (filterVariant === 'multi-select') return 'arrIncludesSome';
  if (filterVariant?.includes('range')) return 'betweenInclusive';
  if (filterVariant === 'select' || filterVariant === 'checkbox')
    return 'equals';
  return 'fuzzy';
};

const emptyFacetedUniqueValues: ReturnType<
  ST_Column<ST_RowData>['getFacetedUniqueValues']
> = new Map();

export const getColumnFilterInfo = <TData extends ST_RowData>({
  header,
  table,
}: {
  header: ST_Header<TData>;
  table: ST_CoreTableInstance<TData>;
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
      getColumnFilterFnName(columnDef),
    );
  const isSelectFilter = filterVariant === 'select';
  const isMultiSelectFilter = filterVariant === 'multi-select';
  const isTextboxFilter =
    ['autocomplete', 'text'].includes(filterVariant!) ||
    (!isSelectFilter && !isMultiSelectFilter);
  const currentFilterOption = getColumnFilterFnName(columnDef);

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  // Facets are computed as soon as the row model is registered; the option
  // keeps them empty until enabled.
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
  table: ST_CoreTableInstance<TData>;
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
      isAutocompleteFilter,
      isMultiSelectFilter,
      isSelectFilter,
    ],
  );
};
