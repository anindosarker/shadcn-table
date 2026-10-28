import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
  type OnChangeFn,
  type RowData,
  type TableFeature,
  type TableFeatures,
  type TableOptions_ColumnFiltering,
} from '@tanstack/react-table';
import {
  type ST_ColumnFilterFnsState,
  type ST_FilterOption,
  type ST_RowData,
  type ST_TableInstance,
  type ST_Updater,
} from '@/components/ui/shadcn-table/types';

export interface ST_TableState_FilterModes {
  columnFilterFns: ST_ColumnFilterFnsState;
  globalFilterFn: ST_FilterOption;
  showColumnFilters: boolean;
  showGlobalFilter: boolean;
}

export interface ST_TableOptions_FilterModes {
  onColumnFilterFnsChange?: OnChangeFn<ST_ColumnFilterFnsState>;
  onGlobalFilterFnChange?: OnChangeFn<ST_FilterOption>;
  onShowColumnFiltersChange?: OnChangeFn<boolean>;
  onShowGlobalFilterChange?: OnChangeFn<boolean>;
}

export interface ST_Table_FilterModes {
  setColumnFilterFns: (updater: ST_Updater<ST_ColumnFilterFnsState>) => void;
  setGlobalFilterFn: (updater: ST_Updater<ST_FilterOption>) => void;
  setShowColumnFilters: (updater: ST_Updater<boolean>) => void;
  setShowGlobalFilter: (updater: ST_Updater<boolean>) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters */
declare module '@tanstack/react-table' {
  interface Plugins {
    stFilterModesFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stFilterModesFeature: ST_TableState_FilterModes;
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stFilterModesFeature: ST_TableOptions_FilterModes;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stFilterModesFeature: ST_Table_FilterModes;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stFilterModesFeature: TableFeature = {
  getInitialState: (initialState) => ({
    columnFilterFns: {},
    globalFilterFn: 'fuzzy',
    showColumnFilters: false,
    showGlobalFilter: false,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onColumnFilterFnsChange: makeStateUpdater('columnFilterFns', table),
    onGlobalFilterFnChange: makeStateUpdater('globalFilterFn', table),
    onShowColumnFiltersChange: makeStateUpdater('showColumnFilters', table),
    onShowGlobalFilterChange: makeStateUpdater('showGlobalFilter', table),
  }),
  constructTableAPIs: (table) => {
    const options = () =>
      table.options as ST_TableOptions_FilterModes &
        Pick<
          TableOptions_ColumnFiltering<TableFeatures, RowData>,
          'onColumnFiltersChange'
        >;
    // Core memoizes the filtered row model on the `columnFilters` and
    // `globalFilter` atoms, so a mode change alone leaves the rows on the
    // previous mode's function. Emitting the same filters as a new array
    // re-runs filtering once the columns pick up the new mode; the raw handler,
    // because `setColumnFilters` would drop filters by the old mode's rules.
    // With no filter set there is nothing to re-run, so no handler call.
    const rerunFilters = () => {
      const { atoms } = table as unknown as ST_TableInstance<ST_RowData>;
      if (!atoms.columnFilters.get().length && !atoms.globalFilter.get())
        return;
      options().onColumnFiltersChange?.((old) => [...old]);
    };
    assignTableAPIs('stFilterModesFeature', table, {
      table_setColumnFilterFns: {
        fn: (updater: ST_Updater<ST_ColumnFilterFnsState>) => {
          options().onColumnFilterFnsChange?.((old) =>
            functionalUpdate(updater, old),
          );
          rerunFilters();
        },
      },
      table_setGlobalFilterFn: {
        fn: (updater: ST_Updater<ST_FilterOption>) => {
          options().onGlobalFilterFnChange?.((old) =>
            functionalUpdate(updater, old),
          );
          rerunFilters();
        },
      },
      table_setShowColumnFilters: {
        fn: (updater: ST_Updater<boolean>) =>
          options().onShowColumnFiltersChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
      table_setShowGlobalFilter: {
        fn: (updater: ST_Updater<boolean>) =>
          options().onShowGlobalFilterChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    });
  },
};
