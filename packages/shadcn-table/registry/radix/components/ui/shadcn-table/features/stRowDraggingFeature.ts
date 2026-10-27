// Row dragging feature: owns the `draggingRow` and `hoveredRow` state slices,
// their `onDraggingRowChange` / `onHoveredRowChange` options and the
// `table.setDraggingRow` / `table.setHoveredRow` APIs used while a row is
// dragged to reorder it or drop it on another table.
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
import type { ST_Row, ST_RowData } from '@/components/ui/shadcn-table/types';

// TableState_FeatureMap is not generic over TData, so the state slice holds
// the row with its data type erased to ST_RowData (the MRT twin uses
// `Row<any, any>`); options and APIs keep today's per-TData types.
type ST_ErasedRow = ST_Row<ST_RowData>;

export interface ST_TableState_RowDragging {
  draggingRow: ST_ErasedRow | null;
  hoveredRow: Partial<ST_ErasedRow> | null;
}

export interface ST_TableOptions_RowDragging<TData extends ST_RowData> {
  onDraggingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onHoveredRowChange?: OnChangeFn<Partial<ST_Row<TData>> | null>;
}

export interface ST_Table_RowDragging<TData extends ST_RowData> {
  setDraggingRow: (updater: Updater<ST_Row<TData> | null>) => void;
  setHoveredRow: (updater: Updater<Partial<ST_Row<TData>> | null>) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- merged declarations must repeat the core's type parameters */
declare module '@tanstack/react-table' {
  interface Plugins {
    stRowDraggingFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stRowDraggingFeature: ST_TableState_RowDragging;
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stRowDraggingFeature: ST_TableOptions_RowDragging<
      Extract<TData, ST_RowData>
    >;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stRowDraggingFeature: ST_Table_RowDragging<Extract<TData, ST_RowData>>;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stRowDraggingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    draggingRow: null,
    hoveredRow: null,
    ...initialState,
  }),
  // The state updater works on the erased slice; the cast hands it out under
  // the per-TData option type the table is declared with.
  getDefaultTableOptions: <TData extends RowData>(
    table: Parameters<typeof makeStateUpdater>[1],
  ): ST_TableOptions_RowDragging<Extract<TData, ST_RowData>> => ({
    onDraggingRowChange: makeStateUpdater(
      'draggingRow',
      table,
    ) as OnChangeFn<ST_Row<Extract<TData, ST_RowData>> | null>,
    onHoveredRowChange: makeStateUpdater(
      'hoveredRow',
      table,
    ) as OnChangeFn<Partial<ST_Row<Extract<TData, ST_RowData>>> | null>,
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stRowDraggingFeature', table, {
      table_setDraggingRow: {
        fn: (updater: Updater<ST_ErasedRow | null>) =>
          (
            table.options as ST_TableOptions_RowDragging<ST_RowData>
          ).onDraggingRowChange?.((old) => functionalUpdate(updater, old)),
      },
      table_setHoveredRow: {
        fn: (updater: Updater<Partial<ST_ErasedRow> | null>) =>
          (
            table.options as ST_TableOptions_RowDragging<ST_RowData>
          ).onHoveredRowChange?.((old) => functionalUpdate(updater, old)),
      },
    });
  },
};
