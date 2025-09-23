import { useMemo } from 'react';
import { type Row } from '@tanstack/react-table';
import {
  type DropdownOption,
  type SRT_Column,
  type SRT_ColumnDef,
  type SRT_ColumnOrderState,
  type SRT_DefinedColumnDef,
  type SRT_DefinedTableOptions,
  type SRT_FilterOption,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';

export const getColumnId = <TData extends SRT_RowData>(
  columnDef: SRT_ColumnDef<TData>,
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header;

export const getAllLeafColumnDefs = <TData extends SRT_RowData>(
  columns: SRT_ColumnDef<TData>[],
): SRT_ColumnDef<TData>[] => {
  const allLeafColumnDefs: SRT_ColumnDef<TData>[] = [];
  const getLeafColumns = (cols: SRT_ColumnDef<TData>[]) => {
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

export const prepareColumns = <TData extends SRT_RowData>({
  columnDefs,
  tableOptions,
}: {
  columnDefs: SRT_ColumnDef<TData>[];
  tableOptions: SRT_DefinedTableOptions<TData>;
}): SRT_DefinedColumnDef<TData>[] => {
  const {
    aggregationFns = {},
    defaultDisplayColumn,
    filterFns = {},
    sortingFns = {},
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
      //assign aggregationFns if multiple aggregationFns are provided
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as string[];
        columnDef.aggregationFn = (
          columnId: string,
          leafRows: Row<TData>[],
          childRows: Row<TData>[],
        ) =>
          aggFns.map((fn) =>
            aggregationFns[fn]?.(columnId, leafRows, childRows),
          );
      }

      //assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
        columnDef.filterFn =
          filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy;
        (columnDef as SRT_DefinedColumnDef<TData>)._filterFn =
          columnFilterFns[columnDef.id];
      }

      //assign sortingFns
      if (Object.keys(sortingFns).includes(columnDef.sortingFn as string)) {
        // @ts-expect-error
        columnDef.sortingFn = sortingFns[columnDef.sortingFn];
      }
    } else if (columnDef.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as SRT_ColumnDef<TData>),
        ...columnDef,
      };
    }
    return columnDef;
  }) as SRT_DefinedColumnDef<TData>[];
};

export const reorderColumn = <TData extends SRT_RowData>(
  draggedColumn: SRT_Column<TData>,
  targetColumn: SRT_Column<TData>,
  columnOrder: SRT_ColumnOrderState,
): SRT_ColumnOrderState => {
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

export const getDefaultColumnFilterFn = <TData extends SRT_RowData>(
  columnDef: SRT_ColumnDef<TData>,
): SRT_FilterOption => {
  const { filterVariant } = columnDef;
  if (filterVariant === 'multi-select') return 'arrIncludesSome';
  if (filterVariant?.includes('range')) return 'betweenInclusive';
  if (filterVariant === 'select' || filterVariant === 'checkbox')
    return 'equals';
  return 'fuzzy';
};

export const getColumnFilterInfo = <TData extends SRT_RowData>({
  header,
  table,
}: {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}) => {
  const {
    options: { columnFilterModeOptions },
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

  const facetedUniqueValues = column.getFacetedUniqueValues();

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

export const useDropdownOptions = <TData extends SRT_RowData>({
  header,
  table,
}: {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
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
