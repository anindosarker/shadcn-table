import {
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
  type OnChangeFn,
  type RowData,
  type TableFeature,
  type TableFeatures,
} from '@tanstack/react-table';
import {
  type ST_Cell,
  type ST_RowData,
  type ST_Updater,
} from '@/components/ui/shadcn-table/types';

/**
 * `TableState_FeatureMap` is not generic and `Cell` is invariant in `TData`, so
 * the slice and its `onActionCellChange` option are typed over `ST_RowData`.
 * The `TData` shape is what `ST_TableState<TData>` and `ST_TableOptions<TData>`
 * show to users.
 */
export interface ST_TableState_CellActions {
  actionCell: ST_Cell<ST_RowData> | null;
}

export interface ST_TableOptions_CellActions {
  onActionCellChange?: OnChangeFn<ST_Cell<ST_RowData> | null>;
}

export interface ST_Table_CellActions<TData extends ST_RowData> {
  setActionCell: (updater: ST_Updater<ST_Cell<TData> | null>) => void;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    stCellActionsFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stCellActionsFeature: ST_TableState_CellActions;
  }
  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stCellActionsFeature: ST_TableOptions_CellActions;
  }
  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stCellActionsFeature: ST_Table_CellActions<TData>;
  }
}

export const stCellActionsFeature: TableFeature = {
  getInitialState: (initialState) => ({
    actionCell: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onActionCellChange: makeStateUpdater('actionCell', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stCellActionsFeature', table, {
      table_setActionCell: {
        fn: (updater: ST_Updater<ST_Cell<ST_RowData> | null>) =>
          (table.options as ST_TableOptions_CellActions).onActionCellChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
    });
  },
};
