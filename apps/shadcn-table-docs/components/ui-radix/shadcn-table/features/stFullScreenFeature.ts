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

export interface ST_TableState_FullScreen {
  isFullScreen: boolean;
}

export interface ST_TableOptions_FullScreen {
  enableFullScreenToggle?: boolean;
  onIsFullScreenChange?: OnChangeFn<boolean>;
}

export interface ST_Table_FullScreen {
  setIsFullScreen: (updater: ST_Updater<boolean>) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters */
declare module '@tanstack/react-table' {
  interface Plugins {
    stFullScreenFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stFullScreenFeature: ST_TableState_FullScreen;
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stFullScreenFeature: ST_TableOptions_FullScreen;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stFullScreenFeature: ST_Table_FullScreen;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stFullScreenFeature: TableFeature = {
  getInitialState: (initialState) => ({
    isFullScreen: false,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onIsFullScreenChange: makeStateUpdater('isFullScreen', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stFullScreenFeature', table, {
      table_setIsFullScreen: {
        fn: (updater: ST_Updater<boolean>) =>
          (table.options as ST_TableOptions_FullScreen).onIsFullScreenChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    });
  },
};
