// Owns the ST-only `density` state slice, the `enableDensityToggle` and
// `onDensityChange` options, and the `table.setDensity` API on the core table.
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
  ST_DensityState,
  ST_Updater,
} from '@/components/ui/shadcn-table/types';

export interface ST_TableState_Density {
  density: ST_DensityState;
}

export interface ST_TableOptions_Density {
  enableDensityToggle?: boolean;
  onDensityChange?: OnChangeFn<ST_DensityState>;
}

export interface ST_Table_Density {
  setDensity: (updater: ST_Updater<ST_DensityState>) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- declaration merging needs the TanStack type parameters, used or not */
declare module '@tanstack/react-table' {
  interface Plugins {
    stDensityFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stDensityFeature: ST_TableState_Density;
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stDensityFeature: ST_TableOptions_Density;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stDensityFeature: ST_Table_Density;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stDensityFeature: TableFeature = {
  getInitialState: (initialState) => ({
    density: 'comfortable',
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onDensityChange: makeStateUpdater('density', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stDensityFeature', table, {
      table_setDensity: {
        fn: (updater: ST_Updater<ST_DensityState>) =>
          (table.options as ST_TableOptions_Density).onDensityChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    });
  },
};
