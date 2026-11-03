import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
} from '@tanstack/react-table';
import type {
  OnChangeFn,
  RowData,
  TableFeature,
  TableFeatures,
} from '@tanstack/react-table';
import type {
  ST_FilterChipsState,
  ST_Updater,
} from '@/components/ui-aria/shadcn-table/types';

export interface ST_TableState_FilterChips {
  filterChips: ST_FilterChipsState;
}

export interface ST_TableOptions_FilterChips {
  onFilterChipsChange?: OnChangeFn<ST_FilterChipsState>;
}

export interface ST_Table_FilterChips {
  setFilterChips: (updater: ST_Updater<ST_FilterChipsState>) => void;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    stFilterChipsFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stFilterChipsFeature: ST_TableState_FilterChips;
  }
  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stFilterChipsFeature: ST_TableOptions_FilterChips;
  }
  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stFilterChipsFeature: ST_Table_FilterChips;
  }
}

export const stFilterChipsFeature: TableFeature = {
  getInitialState: (initialState) => ({
    filterChips: { columnIds: [], openAnchor: null, openColumnId: null },
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onFilterChipsChange: makeStateUpdater('filterChips', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stFilterChipsFeature', table, {
      table_setFilterChips: {
        fn: (updater: ST_Updater<ST_FilterChipsState>) =>
          (table.options as ST_TableOptions_FilterChips).onFilterChipsChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    });
  },
};
