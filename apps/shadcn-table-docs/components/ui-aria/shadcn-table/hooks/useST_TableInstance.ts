import { useMemo, useState } from 'react';
import { type Atom, createAtom, useSelector } from '@tanstack/react-store';
import {
  getInitialTableState,
  type TableOptions,
  type TableState,
} from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  type ST_DefinedTableOptions,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
  type ST_TableInstance,
  type ST_TableState,
} from '@/components/ui-aria/shadcn-table/types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  getDefaultColumnFilterFn,
  prepareColumns,
} from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import {
  getDefaultColumnOrderIds,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from '@/components/ui-aria/shadcn-table/shared/utils/displayColumn.utils';
import {
  type ST_Features,
  stFeatures,
} from '@/components/ui-aria/shadcn-table/features/stFeatures';
import { createSTTableHook } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';
import { getST_RowActionsColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowActionsColumnDef';
import { getST_RowDragColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowDragColumnDef';
import { getST_RowExpandColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowExpandColumnDef';
import { getST_RowNumbersColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowNumbersColumnDef';
import { getST_RowPinningColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowPinningColumnDef';
import { getST_RowSelectColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowSelectColumnDef';
import { getST_RowSpacerColumnDef } from '@/components/ui-aria/shadcn-table/hooks/display-columns/getST_RowSpacerColumnDef';
import { useST_Effects } from '@/components/ui-aria/shadcn-table/hooks/useST_Effects';

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

/** The state slices the option-time transforms read, one atom each. */
const ST_TRANSFORM_SLICES = [
  'columnFilterFns',
  'columnResizing',
  'creatingRow',
  'draggingColumn',
  'draggingRow',
  'globalFilterFn',
  'grouping',
  'isLoading',
  'pagination',
  'showSkeletons',
] as const;

type ST_TransformSlice = (typeof ST_TRANSFORM_SLICES)[number];

type ST_TransformAtoms = {
  [K in ST_TransformSlice]: Atom<TableState<ST_Features>[K]>;
};

/** The `useSelector` source shape. */
type SelectionSource<T> = {
  get: () => T;
  subscribe: (listener: (value: T) => void) => { unsubscribe: () => void };
};

type ST_TransformSources = {
  [K in ST_TransformSlice]: SelectionSource<
    TableState<ST_Features>[K] | undefined
  >;
};

interface ST_InstanceSetup<TData extends ST_RowData> {
  useAppTable: ReturnType<typeof createSTTableHook<TData>>['useAppTable'];
  initialState: Partial<ST_TableState<TData>>;
  /** The caller's atom, an own atom, or `controlledSource`. */
  readSources: ST_TransformSources;
  /** The own atoms, handed to `useAppTable`. */
  ownedAtoms: Partial<ST_TransformAtoms>;
}

/** Read for a slice the caller controls through `state`, which wins. */
const controlledSource: SelectionSource<undefined> = {
  get: () => undefined,
  subscribe: () => ({ unsubscribe() {} }),
};

const createSetup = <TData extends ST_RowData>(
  definedTableOptions: ST_DefinedTableOptions<TData>,
): ST_InstanceSetup<TData> => {
  // One table hook per mounted table: the call's `filterFns`, `sortFns` and
  // `aggregationFns` are registered on its features, read on the first render
  const { useAppTable } = createSTTableHook(definedTableOptions);

  const initialState: Partial<ST_TableState<TData>> = {
    ...definedTableOptions.initialState,
  };
  initialState.columnFilterFns = Object.assign(
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
            initialState.columnFilterFns?.[getColumnId(col)] ??
            getDefaultColumnFilterFn(col)),
    })),
  );
  initialState.columnOrder =
    initialState.columnOrder ??
    getDefaultColumnOrderIds({
      ...definedTableOptions,
      state: {
        ...initialState,
        ...definedTableOptions.state,
      },
    } as ST_StatefulTableOptions<TData>);
  initialState.globalFilterFn = definedTableOptions.globalFilterFn ?? 'fuzzy';
  // A partial `columnPinning` is spread over the defaults without filling the
  // other side, so `{ start: [...] }` alone would read `end` as undefined.
  if (initialState.columnPinning) {
    initialState.columnPinning = {
      start: initialState.columnPinning.start ?? [],
      end: initialState.columnPinning.end ?? [],
    };
  }

  // The value core's base atom would start from: feature defaults under
  // `initialState`.
  const seed = getInitialTableState(stFeatures, {
    ...initialState,
  } as Partial<TableState<ST_Features>>);
  const callerAtoms = definedTableOptions.atoms ?? {};
  const controlledState = definedTableOptions.state ?? {};
  const readSources = {} as ST_TransformSources;
  const ownedAtoms: Partial<ST_TransformAtoms> = {};
  const setupSlice = <K extends ST_TransformSlice>(slice: K) => {
    const callerAtom = callerAtoms[slice] as ST_TransformAtoms[K] | undefined;
    if (callerAtom) {
      readSources[slice] = callerAtom;
    } else if (Object.hasOwn(controlledState, slice)) {
      readSources[slice] = controlledSource;
    } else {
      const atom = createAtom(seed[slice]) as ST_TransformAtoms[K];
      ownedAtoms[slice] = atom;
      readSources[slice] = atom;
    }
  };
  ST_TRANSFORM_SLICES.forEach(setupSlice);

  return { initialState, ownedAtoms, readSources, useAppTable };
};

export const useST_TableInstance = <
  TData extends ST_RowData,
  TSelected = ST_TableState<TData>,
>(
  definedTableOptions: ST_DefinedTableOptions<TData>,
  selector?: (state: TableState<ST_Features>) => TSelected,
): ST_TableInstance<TData, TSelected> => {
  // Fixed at mount, as the table hook and its features are: a slice the
  // caller controls through `atoms` or `state` keeps its caller as owner.
  const [{ initialState, ownedAtoms, readSources, useAppTable }] = useState(
    () => createSetup(definedTableOptions),
  );

  const columnFilterFns = useSelector(readSources.columnFilterFns);
  const creatingRow = useSelector(readSources.creatingRow);
  const draggingColumn = useSelector(readSources.draggingColumn);
  const draggingRow = useSelector(readSources.draggingRow);
  const globalFilterFn = useSelector(readSources.globalFilterFn);
  const grouping = useSelector(readSources.grouping);
  const isLoading = useSelector(readSources.isLoading);
  const showSkeletons = useSelector(readSources.showSkeletons);
  // Page changes and pointer moves stay off the owner.
  const pageSize = useSelector(readSources.pagination, (p) => p?.pageSize);
  const isResizingColumn = useSelector(
    readSources.columnResizing,
    (r) => r?.isResizingColumn,
  );

  // Controlled `state` last: a slice read from `controlledSource` is undefined
  // here and always present there.
  const state = {
    ...transformStateDefaults,
    ...initialState,
    columnFilterFns,
    columnResizing: {
      ...transformStateDefaults.columnResizing,
      ...initialState.columnResizing,
      isResizingColumn,
    },
    creatingRow,
    draggingColumn,
    draggingRow,
    globalFilterFn,
    grouping,
    isLoading,
    pagination: {
      ...transformStateDefaults.pagination,
      ...initialState.pagination,
      pageSize,
    },
    showSkeletons,
    ...definedTableOptions.state,
  } as ST_TableState<TData>;

  // Column defs hold while a column resizes or a column or row drags, so the
  // table keeps its column instances until the gesture ends.
  const isFrozen = Boolean(
    state.columnResizing.isResizingColumn ||
      state.draggingColumn ||
      state.draggingRow,
  );
  const [heldColumns, setHeldColumns] = useState<
    ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes>[] | null
  >(null);

  const columns = useMemo(() => {
    if (heldColumns) return heldColumns;
    const statefulTableOptions: ST_StatefulTableOptions<TData> = {
      ...definedTableOptions,
      state: {
        ...transformStateDefaults,
        ...initialState,
        columnFilterFns,
        creatingRow,
        grouping,
        ...definedTableOptions.state,
      } as ST_TableState<TData>,
    };
    return prepareColumns({
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
  }, [
    heldColumns,
    definedTableOptions,
    initialState,
    columnFilterFns,
    creatingRow,
    grouping,
  ]);
  if (isFrozen && !heldColumns) {
    setHeldColumns(columns);
  } else if (!isFrozen && heldColumns) {
    setHeldColumns(null);
  }

  const data = useMemo(
    () =>
      (state.isLoading || state.showSkeletons) &&
      !definedTableOptions.data.length
        ? [...Array(Math.min(state.pagination.pageSize, 20)).fill(null)].map(
            () =>
              Object.assign(
                {},
                ...getAllLeafColumnDefs(columns).map((col) => ({
                  [getColumnId(col)]: null,
                })),
              ),
          )
        : definedTableOptions.data,
    [
      definedTableOptions.data,
      state.isLoading,
      state.showSkeletons,
      state.pagination.pageSize,
      columns,
    ],
  );

  // The erased feature slots cannot hold the `TData`-typed ST options, since
  // `Row` is invariant in `TData`, so the options go in under core's type and
  // the result cast re-applies the ST types; caller atoms win over own atoms.
  const table = useAppTable(
    {
      ...definedTableOptions,
      atoms: { ...ownedAtoms, ...definedTableOptions.atoms },
      columns,
      data,
      globalFilterFn: state.globalFilterFn,
      initialState,
    } as Omit<TableOptions<ST_Features, TData>, 'features'>,
    selector,
  ) as unknown as ST_TableInstance<TData, TSelected>;

  useST_Effects(table);

  return table;
};
