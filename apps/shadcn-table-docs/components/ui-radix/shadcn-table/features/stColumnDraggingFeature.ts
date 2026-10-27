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
  ST_Column,
  ST_RowData,
  ST_Updater,
} from '@/components/ui-radix/shadcn-table/types';

// TableState_FeatureMap is not generic over TData, so the state slice and its
// on*Change options hold the column with its data type erased to ST_RowData
// (the MRT twin uses `Column<any, any, any>`); the APIs keep today's per-TData
// types and ST_TableOptions<TData> types the options for TData.
type ST_ErasedColumn = ST_Column<ST_RowData>;

export interface ST_TableState_ColumnDragging {
  draggingColumn: ST_ErasedColumn | null;
  hoveredColumn: Partial<ST_ErasedColumn> | null;
}

export interface ST_TableOptions_ColumnDragging {
  onDraggingColumnChange?: OnChangeFn<ST_ErasedColumn | null>;
  onHoveredColumnChange?: OnChangeFn<Partial<ST_ErasedColumn> | null>;
}

export interface ST_Table_ColumnDragging<TData extends ST_RowData> {
  setDraggingColumn: (updater: ST_Updater<ST_Column<TData> | null>) => void;
  setHoveredColumn: (
    updater: ST_Updater<Partial<ST_Column<TData>> | null>,
  ) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters */
declare module '@tanstack/react-table' {
  interface Plugins {
    stColumnDraggingFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stColumnDraggingFeature: ST_TableState_ColumnDragging;
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stColumnDraggingFeature: ST_TableOptions_ColumnDragging;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stColumnDraggingFeature: ST_Table_ColumnDragging<TData>;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stColumnDraggingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    draggingColumn: null,
    hoveredColumn: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onDraggingColumnChange: makeStateUpdater('draggingColumn', table),
    onHoveredColumnChange: makeStateUpdater('hoveredColumn', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stColumnDraggingFeature', table, {
      table_setDraggingColumn: {
        fn: (updater: ST_Updater<ST_ErasedColumn | null>) =>
          (
            table.options as ST_TableOptions_ColumnDragging
          ).onDraggingColumnChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setHoveredColumn: {
        fn: (updater: ST_Updater<Partial<ST_ErasedColumn> | null>) =>
          (
            table.options as ST_TableOptions_ColumnDragging
          ).onHoveredColumnChange?.((old) => functionalUpdate(updater, old)),
      },
    });
  },
};
