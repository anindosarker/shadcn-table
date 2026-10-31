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
import type { ST_Updater } from '@/components/ui-radix/shadcn-table/types';

export interface ST_TableState_Toolbars {
  showAlertBanner: boolean;
  showToolbarDropZone: boolean;
}

export interface ST_TableOptions_Toolbars {
  onShowAlertBannerChange?: OnChangeFn<boolean>;
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>;
}

export interface ST_Table_Toolbars {
  setShowAlertBanner: (updater: ST_Updater<boolean>) => void;
  setShowToolbarDropZone: (updater: ST_Updater<boolean>) => void;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    stToolbarsFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stToolbarsFeature: ST_TableState_Toolbars;
  }
  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stToolbarsFeature: ST_TableOptions_Toolbars;
  }
  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stToolbarsFeature: ST_Table_Toolbars;
  }
}

export const stToolbarsFeature: TableFeature = {
  getInitialState: (initialState) => ({
    showAlertBanner: false,
    showToolbarDropZone: false,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onShowAlertBannerChange: makeStateUpdater('showAlertBanner', table),
    onShowToolbarDropZoneChange: makeStateUpdater('showToolbarDropZone', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stToolbarsFeature', table, {
      table_setShowAlertBanner: {
        fn: (updater: ST_Updater<boolean>) =>
          (table.options as ST_TableOptions_Toolbars).onShowAlertBannerChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
      table_setShowToolbarDropZone: {
        fn: (updater: ST_Updater<boolean>) =>
          (
            table.options as ST_TableOptions_Toolbars
          ).onShowToolbarDropZoneChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    });
  },
};
