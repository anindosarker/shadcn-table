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
  type ST_Row,
  type ST_RowData,
  type ST_CoreTableInstance,
  type ST_Updater,
} from '@/components/ui/shadcn-table/types';
import { createRow } from '@/components/ui/shadcn-table/shared/utils/tanstack.helpers';

/**
 * `TableState_FeatureMap` is not generic and `Row` is invariant in `TData`, so
 * the instance-bearing slices and their `on*Change` options are typed over
 * `ST_RowData`. The `TData` shape is what `ST_TableState<TData>` and
 * `ST_TableOptions<TData>` show to users.
 */
export interface ST_TableState_Editing {
  creatingRow: ST_Row<ST_RowData> | null;
  editingCell: ST_Cell<ST_RowData> | null;
  editingRow: ST_Row<ST_RowData> | null;
}

export interface ST_TableOptions_Editing {
  onCreatingRowChange?: OnChangeFn<ST_Row<ST_RowData> | null>;
  onEditingCellChange?: OnChangeFn<ST_Cell<ST_RowData> | null>;
  onEditingRowChange?: OnChangeFn<ST_Row<ST_RowData> | null>;
}

export interface ST_Table_Editing<TData extends ST_RowData> {
  setCreatingRow: (updater: ST_Updater<ST_Row<TData> | null | true>) => void;
  setEditingCell: (updater: ST_Updater<ST_Cell<TData> | null>) => void;
  setEditingRow: (updater: ST_Updater<ST_Row<TData> | null>) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters */
declare module '@tanstack/react-table' {
  interface Plugins {
    stEditingFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stEditingFeature: ST_TableState_Editing;
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stEditingFeature: ST_TableOptions_Editing;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stEditingFeature: ST_Table_Editing<TData>;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stEditingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    creatingRow: null,
    editingCell: null,
    editingRow: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onCreatingRowChange: makeStateUpdater('creatingRow', table),
    onEditingCellChange: makeStateUpdater('editingCell', table),
    onEditingRowChange: makeStateUpdater('editingRow', table),
  }),
  constructTableAPIs: (table) => {
    const options = () => table.options as ST_TableOptions_Editing;
    const resolveCreatingRow = (
      row: ST_Row<ST_RowData> | null | true,
    ): ST_Row<ST_RowData> | null =>
      row === true
        ? createRow(table as unknown as ST_CoreTableInstance<ST_RowData>)
        : row;
    assignTableAPIs('stEditingFeature', table, {
      table_setCreatingRow: {
        fn: (updater: ST_Updater<ST_Row<ST_RowData> | null | true>) =>
          options().onCreatingRowChange?.((old) =>
            resolveCreatingRow(functionalUpdate(updater, old)),
          ),
      },
      table_setEditingCell: {
        fn: (updater: ST_Updater<ST_Cell<ST_RowData> | null>) =>
          options().onEditingCellChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
      table_setEditingRow: {
        fn: (updater: ST_Updater<ST_Row<ST_RowData> | null>) =>
          options().onEditingRowChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    });
  },
};
