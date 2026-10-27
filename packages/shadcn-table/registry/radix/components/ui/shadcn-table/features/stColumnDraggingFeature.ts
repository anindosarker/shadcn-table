// Column dragging feature: owns the `draggingColumn` and `hoveredColumn` state
// slices, their `onDraggingColumnChange` / `onHoveredColumnChange` options and
// the `table.setDraggingColumn` / `table.setHoveredColumn` APIs used while a
// column is dragged to reorder or group.
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
  Updater,
} from '@tanstack/react-table';
import type { ST_Column, ST_RowData } from '@/components/ui/shadcn-table/types';

// TableState_FeatureMap is not generic over TData, so the state slice holds
// the column with its data type erased to ST_RowData (the MRT twin uses
// `Column<any, any, any>`); options and APIs keep today's per-TData types.
type ST_ErasedColumn = ST_Column<ST_RowData>;

export interface ST_TableState_ColumnDragging {
  draggingColumn: ST_ErasedColumn | null;
  hoveredColumn: Partial<ST_ErasedColumn> | null;
}

export interface ST_TableOptions_ColumnDragging<TData extends ST_RowData> {
  onDraggingColumnChange?: OnChangeFn<ST_Column<TData> | null>;
  onHoveredColumnChange?: OnChangeFn<Partial<ST_Column<TData>> | null>;
}

export interface ST_Table_ColumnDragging<TData extends ST_RowData> {
  setDraggingColumn: (updater: Updater<ST_Column<TData> | null>) => void;
  setHoveredColumn: (
    updater: Updater<Partial<ST_Column<TData>> | null>,
  ) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- merged declarations must repeat the core's type parameters */
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
    stColumnDraggingFeature: ST_TableOptions_ColumnDragging<
      Extract<TData, ST_RowData>
    >;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stColumnDraggingFeature: ST_Table_ColumnDragging<
      Extract<TData, ST_RowData>
    >;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stColumnDraggingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    draggingColumn: null,
    hoveredColumn: null,
    ...initialState,
  }),
  // The state updater works on the erased slice; the cast hands it out under
  // the per-TData option type the table is declared with.
  getDefaultTableOptions: <TData extends RowData>(
    table: Parameters<typeof makeStateUpdater>[1],
  ): ST_TableOptions_ColumnDragging<Extract<TData, ST_RowData>> => ({
    onDraggingColumnChange: makeStateUpdater(
      'draggingColumn',
      table,
    ) as OnChangeFn<ST_Column<Extract<TData, ST_RowData>> | null>,
    onHoveredColumnChange: makeStateUpdater(
      'hoveredColumn',
      table,
    ) as OnChangeFn<Partial<ST_Column<Extract<TData, ST_RowData>>> | null>,
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stColumnDraggingFeature', table, {
      table_setDraggingColumn: {
        fn: (updater: Updater<ST_ErasedColumn | null>) =>
          (
            table.options as ST_TableOptions_ColumnDragging<ST_RowData>
          ).onDraggingColumnChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setHoveredColumn: {
        fn: (updater: Updater<Partial<ST_ErasedColumn> | null>) =>
          (
            table.options as ST_TableOptions_ColumnDragging<ST_RowData>
          ).onHoveredColumnChange?.((old) => functionalUpdate(updater, old)),
      },
    });
  },
};
