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
  ST_Row,
  ST_RowData,
  ST_Updater,
} from '@/components/ui-aria/shadcn-table/types';

// TableState_FeatureMap is not generic over TData, so the state slice and its
// on*Change options hold the row with its data type erased to ST_RowData;
// ST_TableOptions<TData> types the options for TData.
type ST_ErasedRow = ST_Row<ST_RowData>;

/**
 * A row drop the row slide plays once the new order renders: the dropped
 * row's data and, by row data, each row's top from the table's top edge before
 * the drop.
 */
export interface ST_RowFlipPending {
  movedRow: ST_RowData;
  positions: Map<ST_RowData, number>;
}

export interface ST_TableState_RowDragging {
  draggingRow: ST_ErasedRow | null;
  hoveredRow: Partial<ST_ErasedRow> | null;
  rowFlipPending: ST_RowFlipPending | null;
}

export interface ST_TableOptions_RowDragging {
  onDraggingRowChange?: OnChangeFn<ST_ErasedRow | null>;
  onHoveredRowChange?: OnChangeFn<Partial<ST_ErasedRow> | null>;
  onRowFlipPendingChange?: OnChangeFn<ST_RowFlipPending | null>;
}

export interface ST_Table_RowDragging<TData extends ST_RowData> {
  setDraggingRow: (updater: ST_Updater<ST_Row<TData> | null>) => void;
  setHoveredRow: (updater: ST_Updater<Partial<ST_Row<TData>> | null>) => void;
  setRowFlipPending: (updater: ST_Updater<ST_RowFlipPending | null>) => void;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    stRowDraggingFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stRowDraggingFeature: ST_TableState_RowDragging;
  }
  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TData extends RowData,
  > {
    stRowDraggingFeature: ST_TableOptions_RowDragging;
  }
  interface Table_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stRowDraggingFeature: ST_Table_RowDragging<TData>;
  }
}

export const stRowDraggingFeature: TableFeature = {
  getInitialState: (initialState) => ({
    draggingRow: null,
    hoveredRow: null,
    rowFlipPending: null,
    ...initialState,
  }),
  getDefaultTableOptions: (table) => ({
    onDraggingRowChange: makeStateUpdater('draggingRow', table),
    onHoveredRowChange: makeStateUpdater('hoveredRow', table),
    onRowFlipPendingChange: makeStateUpdater('rowFlipPending', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('stRowDraggingFeature', table, {
      table_setDraggingRow: {
        fn: (updater: ST_Updater<ST_ErasedRow | null>) =>
          (table.options as ST_TableOptions_RowDragging).onDraggingRowChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
      table_setHoveredRow: {
        fn: (updater: ST_Updater<Partial<ST_ErasedRow> | null>) =>
          (table.options as ST_TableOptions_RowDragging).onHoveredRowChange?.(
            (old) => functionalUpdate(updater, old),
          ),
      },
      table_setRowFlipPending: {
        fn: (updater: ST_Updater<ST_RowFlipPending | null>) =>
          (
            table.options as ST_TableOptions_RowDragging
          ).onRowFlipPendingChange?.((old) => functionalUpdate(updater, old)),
      },
    });
  },
};
