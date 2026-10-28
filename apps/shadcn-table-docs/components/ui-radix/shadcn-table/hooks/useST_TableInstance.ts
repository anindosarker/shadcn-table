import { useMemo, useRef, useState } from 'react';
import { shallow, useSelector } from '@tanstack/react-store';
import { type TableOptions, type TableState } from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  type ST_DefinedTableOptions,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
  type ST_TableInstance,
  type ST_TableState,
} from '@/components/ui-radix/shadcn-table/types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '@/components/ui-radix/shadcn-table/shared/utils/displayColumn.utils';
import { type ST_Features } from '@/components/ui-radix/shadcn-table/features/stFeatures';
import { createSTTableHook } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';
import { getST_RowActionsColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowActionsColumnDef';
import { getST_RowDragColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowDragColumnDef';
import { getST_RowExpandColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowExpandColumnDef';
import { getST_RowNumbersColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowNumbersColumnDef';
import { getST_RowPinningColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowPinningColumnDef';
import { getST_RowSelectColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowSelectColumnDef';
import { getST_RowSpacerColumnDef } from '@/components/ui-radix/shadcn-table/hooks/display-columns/getST_RowSpacerColumnDef';
import { useST_Effects } from '@/components/ui-radix/shadcn-table/hooks/useST_Effects';

/**
 * The slices the option-time transforms below read before the table exists,
 * on the first render. Afterwards the table's store holds every slice.
 */
const transformStateDefaults = {
  columnOrder: [],
  columnResizing: {},
  creatingRow: null,
  draggingColumn: null,
  draggingRow: null,
  grouping: [],
  isLoading: false,
  pagination: { pageIndex: 0, pageSize: 10 },
  showSkeletons: false,
};

/**
 * Passed as the table selector, it re-renders the owner on these slices only;
 * every other state change reaches the components through their own
 * subscriptions.
 */
export const selectST_TransformState = (state: TableState<ST_Features>) => ({
  columnFilterFns: state.columnFilterFns,
  creatingRow: state.creatingRow,
  globalFilterFn: state.globalFilterFn,
  grouping: state.grouping,
  isLoading: state.isLoading,
  pageSize: state.pagination.pageSize,
  showSkeletons: state.showSkeletons,
});

export const useST_TableInstance = <
  TData extends ST_RowData,
  TSelected = ST_TableState<TData>,
>(
  definedTableOptions: ST_DefinedTableOptions<TData>,
  selector?: (state: TableState<ST_Features>) => TSelected,
): ST_TableInstance<TData, TSelected> => {
  // One table hook per mounted table: the call's `filterFns`, `sortFns` and
  // `aggregationFns` are registered on its features, read on the first render
  const [{ useAppTable }] = useState(() =>
    createSTTableHook(definedTableOptions),
  );
  const tableRef = useRef<ST_TableInstance<TData, TSelected> | null>(null);

  const initialState: Partial<ST_TableState<TData>> = useMemo(() => {
    const initState = definedTableOptions.initialState ?? {};
    initState.columnFilterFns = Object.assign(
      {},
      ...getAllLeafColumnDefs(
        definedTableOptions.columns as ST_ColumnDef<
          TData,
          unknown,
          ST_NeutralPartPropTypes
        >[],
      ).map((col) => ({
        [getColumnId(col)]:
          col.filterFn instanceof Function
            ? (col.filterFn.name ?? 'custom')
            : (col.filterFn ??
              initState.columnFilterFns?.[getColumnId(col)] ??
              getDefaultColumnFilterFn(col)),
      })),
    );
    initState.columnOrder =
      initState.columnOrder ??
      getDefaultColumnOrderIds({
        ...definedTableOptions,
        state: {
          ...definedTableOptions.initialState,
          ...definedTableOptions.state,
        },
      } as ST_StatefulTableOptions<TData>);
    initState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy';
    // v9 spreads a partial `columnPinning` over its defaults without filling
    // the other side, so `{ start: [...] }` alone would read `end` as undefined
    if (initState.columnPinning) {
      initState.columnPinning = {
        start: initState.columnPinning.start ?? [],
        end: initState.columnPinning.end ?? [],
      };
    }
    return initState;
  }, []);

  // The transforms read the live store of the table built on an earlier
  // render, with this render's controlled `state` on top.
  const statefulTableOptions: ST_StatefulTableOptions<TData> = {
    ...definedTableOptions,
    state: {
      ...transformStateDefaults,
      ...initialState,
      ...tableRef.current?.store.state,
      ...definedTableOptions.state,
    } as ST_TableState<TData>,
  };

  const columnDefsRef = useRef<
    ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>[]
  >([]);
  const columns =
    statefulTableOptions.state.columnResizing.isResizingColumn ||
    statefulTableOptions.state.draggingColumn ||
    statefulTableOptions.state.draggingRow
      ? columnDefsRef.current
      : prepareColumns({
          columnDefs: [
            ...([
              showRowPinningColumn(statefulTableOptions) &&
                getST_RowPinningColumnDef(statefulTableOptions),
              showRowDragColumn(statefulTableOptions) &&
                getST_RowDragColumnDef(statefulTableOptions),
              showRowActionsColumn(statefulTableOptions) &&
                getST_RowActionsColumnDef(statefulTableOptions),
              showRowExpandColumn(statefulTableOptions) &&
                getST_RowExpandColumnDef(statefulTableOptions),
              showRowSelectionColumn(statefulTableOptions) &&
                getST_RowSelectColumnDef(statefulTableOptions),
              showRowNumbersColumn(statefulTableOptions) &&
                getST_RowNumbersColumnDef(statefulTableOptions),
            ].filter(Boolean) as ST_ColumnDef<
              TData,
              unknown,
              ST_NeutralPartPropTypes
            >[]),
            ...statefulTableOptions.columns,
            ...([
              showRowSpacerColumn(statefulTableOptions) &&
                getST_RowSpacerColumnDef(statefulTableOptions),
            ].filter(Boolean) as ST_ColumnDef<
              TData,
              unknown,
              ST_NeutralPartPropTypes
            >[]),
          ],
          tableOptions: statefulTableOptions,
        });
  columnDefsRef.current = columns;

  const data = useMemo(
    () =>
      (statefulTableOptions.state.isLoading ||
        statefulTableOptions.state.showSkeletons) &&
      !statefulTableOptions.data.length
        ? [
            ...Array(
              Math.min(statefulTableOptions.state.pagination.pageSize, 20),
            ).fill(null),
          ].map(() =>
            Object.assign(
              {},
              ...getAllLeafColumnDefs(columns).map((col) => ({
                [getColumnId(col)]: null,
              })),
            ),
          )
        : statefulTableOptions.data,
    [
      statefulTableOptions.data,
      statefulTableOptions.state.isLoading,
      statefulTableOptions.state.showSkeletons,
    ],
  );

  // The ST state, setters and refs come from the features on the core table.
  // The ST options type their rows, cells and columns for `TData` (state,
  // `on*Change`, column defs), which the erased feature slots cannot hold
  // since `Row` is invariant in `TData`, so the options go in under core's
  // type; the result cast re-applies the ST wrapper types to the row, column,
  // cell and header getters.
  const table = useAppTable(
    {
      ...definedTableOptions,
      columns,
      data,
      globalFilterFn: statefulTableOptions.state.globalFilterFn,
      initialState,
    } as Omit<TableOptions<ST_Features, TData>, 'features'>,
    selector,
  ) as unknown as ST_TableInstance<TData, TSelected>;

  tableRef.current = table;

  // The transforms above run on owner renders, so the owner follows their
  // slices whatever `selector` picks for `table.state`.
  useSelector(table.store, selectST_TransformState, { compare: shallow });

  useST_Effects(table);

  return table;
};
