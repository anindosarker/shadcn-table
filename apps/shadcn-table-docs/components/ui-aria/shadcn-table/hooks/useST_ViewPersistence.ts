import {
  useCallback,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import {
  type ST_CoreTableInstance,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import {
  getServerSnapshot,
  getStoredViewSnapshot,
  getViewSettingsKey,
  readStoredView,
  removeStoredView,
  type ST_StoredView,
  subscribeStoredView,
  writeStoredView,
} from '@/components/ui-aria/shadcn-table/shared/utils/viewSettingsStorage.utils';

const ST_PENDING_ATTR = 'data-st-view-pending';

/**
 * The ids of the columns the table defines, in definition order, without the
 * library's display columns, so toggling row numbers keeps the storage key.
 */
export const getST_ViewColumnIds = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
): string[] =>
  table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !id.startsWith('st-'));

/** The table's view storage key, or `null` while `persistViewSettings` is off. */
export const getST_ViewSettingsKey = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
): string | null =>
  getViewSettingsKey({
    idInput: table.options.viewSettingsKeyInput,
    leafColumnIds: getST_ViewColumnIds(table),
    persistViewSettings: table.options.persistViewSettings,
  });

/**
 * The stored view, dropped as a whole when it names a data column the table
 * lacks. Display columns come and go with the options and view settings, so
 * the `st-` ids the view names count as known.
 */
const readKnownView = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
  key: string,
): ST_StoredView | null => {
  const view = readStoredView(key);
  if (!view) return null;
  const displayIds = [
    ...(view.columnOrder ?? []),
    ...Object.keys(view.columnVisibility ?? {}),
  ].filter((id) => id.startsWith('st-'));
  return readStoredView(key, [...getST_ViewColumnIds(table), ...displayIds]);
};

const readView = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
): ST_StoredView => ({
  columnOrder: table.atoms.columnOrder.get(),
  columnPinning: table.atoms.columnPinning.get(),
  columnVisibility: table.atoms.columnVisibility.get(),
  density: table.atoms.density.get(),
  viewSettings: table.atoms.viewSettings.get(),
});

const readDefaultView = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
): ST_StoredView => {
  const { initialState } = table;
  return {
    columnOrder: initialState.columnOrder ?? [],
    columnPinning: initialState.columnPinning ?? {},
    columnVisibility: initialState.columnVisibility ?? {},
    density: initialState.density ?? 'comfortable',
    viewSettings: initialState.viewSettings,
  };
};

/** JSON with object keys sorted, so two equal views compare equal. */
const stableStringify = (value: unknown): string =>
  JSON.stringify(value, (_key, entry: unknown) =>
    entry && typeof entry === 'object' && !Array.isArray(entry)
      ? Object.fromEntries(
          Object.entries(entry as Record<string, unknown>).sort(([a], [b]) =>
            a.localeCompare(b),
          ),
        )
      : entry,
  );

const applyView = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
  view: ST_StoredView,
) => {
  if (view.viewSettings) {
    const { viewSettings } = view;
    table.setViewSettings((old) => ({ ...old, ...viewSettings }));
  }
  if (view.density) table.setDensity(view.density);
  if (view.columnVisibility) {
    table.setColumnVisibility({ ...view.columnVisibility });
  }
  if (view.columnOrder) table.setColumnOrder([...view.columnOrder]);
  if (view.columnPinning) {
    table.setColumnPinning({
      end: [...(view.columnPinning.end ?? [])],
      start: [...(view.columnPinning.start ?? [])],
    });
  }
};

/**
 * Restores the view settings, their pins, density, column visibility, order
 * and pinning to `initialState` and deletes the stored view.
 */
export const resetST_View = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
) => {
  table.resetViewSettings();
  table.setDensity(table.initialState.density ?? 'comfortable');
  table.resetColumnVisibility();
  table.resetColumnOrder();
  table.resetColumnPinning();
  const key = getST_ViewSettingsKey(table);
  if (key) removeStoredView(key);
};

const noSubscription = () => () => {};

/**
 * With `persistViewSettings`, applies the stored view once after hydration,
 * clears the root's pending mark, and from then on saves every change of the
 * view settings, density, column visibility, order and pinning. A view equal
 * to `initialState` removes the stored entry instead.
 */
export const useST_ViewPersistence = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
) => {
  const key = getST_ViewSettingsKey(table);
  // Server HTML and the hydration render read `null`; the stored text arrives
  // on the render right after hydration.
  const subscribe = useCallback(
    (cb: () => void) => (key ? subscribeStoredView(key, cb) : () => {}),
    [key],
  );
  const getSnapshot = useCallback(
    () => (key ? getStoredViewSnapshot(key) : null),
    [key],
  );
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const appliedKeyRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!key || !hydrated) return;
    if (appliedKeyRef.current !== key) {
      appliedKeyRef.current = key;
      const view = stored ? readKnownView(table, key) : null;
      // Layout effect updates render before paint, so the cleared mark never
      // shows the default view.
      if (view) applyView(table, view);
      table.refs.tableContainerRef.current
        ?.closest(`[${ST_PENDING_ATTR}]`)
        ?.removeAttribute(ST_PENDING_ATTR);
    }
    const save = () => {
      const view = readView(table);
      if (stableStringify(view) === stableStringify(readDefaultView(table))) {
        removeStoredView(key);
      } else {
        writeStoredView(key, view);
      }
    };
    const subscriptions = [
      table.atoms.viewSettings.subscribe(save),
      table.atoms.density.subscribe(save),
      table.atoms.columnVisibility.subscribe(save),
      table.atoms.columnOrder.subscribe(save),
      table.atoms.columnPinning.subscribe(save),
    ];
    return () => subscriptions.forEach(({ unsubscribe }) => unsubscribe());
  }, [hydrated, key, stored, table]);
};
