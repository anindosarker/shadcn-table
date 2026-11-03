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
  ST_Updater,
  ST_ViewSettingsState,
} from '@/components/ui/shadcn-table/types';

export interface ST_TableState_ViewSettings {
  viewSettings: ST_ViewSettingsState;
}

export interface ST_TableOptions_ViewSettings {
  onViewSettingsChange?: OnChangeFn<ST_ViewSettingsState>;
}

export interface ST_Table_ViewSettings {
  /** Restores `initialState.viewSettings`, or the stock defaults with `defaultState`. */
  resetViewSettings: (defaultState?: boolean) => void;
  setViewSettings: (updater: ST_Updater<ST_ViewSettingsState>) => void;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    stViewSettingsFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stViewSettingsFeature: ST_TableState_ViewSettings;
  }
  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stViewSettingsFeature: ST_TableOptions_ViewSettings;
  }
  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stViewSettingsFeature: ST_Table_ViewSettings;
  }
}

/**
 * The stock view settings. `useST_TableInstance` seeds `stickyHeader` and
 * `rowNumbers` from `enableStickyHeader` and `enableRowNumbers`.
 */
export const ST_DEFAULT_VIEW_SETTINGS: ST_ViewSettingsState = {
  gridLines: 'rows',
  pins: ['columns', 'density'],
  rowNumbers: false,
  stickyHeader: false,
  striped: false,
  wrapText: false,
};

export const stViewSettingsFeature: TableFeature = {
  getInitialState: (initialState) => ({
    viewSettings: ST_DEFAULT_VIEW_SETTINGS,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onViewSettingsChange: makeStateUpdater('viewSettings', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stViewSettingsFeature', table, {
      table_setViewSettings: {
        fn: (updater: ST_Updater<ST_ViewSettingsState>) =>
          (
            table.options as ST_TableOptions_ViewSettings
          ).onViewSettingsChange?.((old) => functionalUpdate(updater, old)),
      },
      table_resetViewSettings: {
        fn: (defaultState?: boolean) =>
          (
            table.options as ST_TableOptions_ViewSettings
          ).onViewSettingsChange?.(() =>
            defaultState
              ? ST_DEFAULT_VIEW_SETTINGS
              : ((table.initialState as Partial<ST_TableState_ViewSettings>)
                  .viewSettings ?? ST_DEFAULT_VIEW_SETTINGS),
          ),
      },
    });
  },
};
