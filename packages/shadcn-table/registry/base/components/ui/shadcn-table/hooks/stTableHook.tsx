import {
  type ContextType,
  useCallback,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  constructAggregationFn,
  createTableHook,
  createTableHookContexts,
  tableFeatures,
} from '@tanstack/react-table';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  type ST_Features,
  stFeatures,
} from '@/components/ui/shadcn-table/features/stFeatures';
import { ST_AggregationFns } from '@/components/ui/shadcn-table/shared/fns/aggregationFns';
import { ST_FilterFns } from '@/components/ui/shadcn-table/shared/fns/filterFns';
import { ST_SortFns } from '@/components/ui/shadcn-table/shared/fns/sortFns';
import {
  type ST_DefinedTableOptions,
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableProviderProps,
} from '@/components/ui/shadcn-table/types';

/**
 * The table context every ST table publishes on. `createTableHook` falls back
 * to a context private to `@tanstack/react-table`, and
 * `createTableHookContexts` creates a fresh one, so each table hook is handed
 * this one explicitly: `useSTContext` then reads any table, whichever hook
 * built it.
 */
export const { tableContext, useTableContext } =
  createTableHookContexts<ST_Features>();

/**
 * Builds the table hook for one mounted table. v9 copies the `filterFns`,
 * `sortFns` and `aggregationFns` registries off `features` once, at
 * construction, so the call's own registries are merged over the built-ins
 * here and core resolves every name itself. A plain callable in
 * `aggregationFns` is taken as the `aggregate` step of a definition.
 */
export const createSTTableHook = <TData extends ST_RowData>({
  aggregationFns = {},
  filterFns,
  sortFns,
}: ST_DefinedTableOptions<TData>) => {
  const features: ST_Features = tableFeatures({
    ...stFeatures,
    filterFns: { ...ST_FilterFns, ...filterFns },
    sortFns: { ...ST_SortFns, ...sortFns },
    aggregationFns: {
      ...ST_AggregationFns,
      ...Object.fromEntries(
        Object.entries(aggregationFns).map(([name, aggregationFn]) => [
          name,
          typeof aggregationFn === 'function'
            ? constructAggregationFn({ aggregate: aggregationFn })
            : aggregationFn,
        ]),
      ),
    },
  });
  return createTableHook({ features, tableContext });
};

/**
 * Reads the table from the nearest `ST_TableProvider`, which `ShadcnTable`
 * renders around its layout. Throws outside a provider.
 */
export function useSTContext<
  TData extends ST_RowData = ST_RowData,
>(): ST_TableInstance<TData> {
  // The context carries the core-typed table; the ST wrapper types re-type
  // its row, column, cell and header getters.
  return useTableContext() as unknown as ST_TableInstance<TData>;
}

/**
 * A table state atom, `table.atoms.<slice>`, as `useST_Atom` reads it.
 */
type ST_AtomSource<TValue> = {
  get: () => TValue;
  subscribe: (listener: (value: TValue) => void) => { unsubscribe: () => void };
};

/**
 * Subscribes the calling component to one table atom, `table.atoms.<slice>`,
 * for a value that feeds a hook (a memo, an effect, a virtualizer) and so
 * cannot be read inside a `Subscribe` render function. The component
 * re-renders when the atom changes; atom values are immutable, so the snapshot
 * is stable between changes.
 */
export function useST_Atom<TValue>(atom: ST_AtomSource<TValue>): TValue {
  const subscribe = useCallback(
    (onChange: () => void) => atom.subscribe(onChange).unsubscribe,
    [atom],
  );
  const getSnapshot = () => atom.get();
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Provides a table to hand-composed ST components, such as an
 * `ST_TableContainer` rendered outside `ShadcnTable`, and the tooltip provider
 * their `ST_Tooltip`s need.
 */
export const ST_TableProvider = <TData extends ST_RowData>({
  children,
  table,
}: ST_TableProviderProps<TData>) => {
  // The context carries a stable handle, the first instance: its store,
  // atoms, refs and setters are live, and keeping it stable spares context
  // readers a re-render on every table state change. Its options are
  // refreshed from each render's instance, so option reads stay current; the
  // library never reads its `state`.
  const [handle] = useState(() => {
    // Custom renderers handed the handle (`render*`, `st*Props` of the context
    // components) may read `table.state`. The first instance holds only the
    // first render's selected slices, so the handle serves the live store.
    Object.defineProperty(table, 'state', {
      configurable: true,
      enumerable: true,
      get: () => table.store.state,
    });
    return table;
  });
  handle.options = table.options;

  // The context is typed for any core table; the ST wrapper types re-type its
  // getters, so TypeScript cannot relate the two without the cast.
  // Note: the tooltip provider lives here at the ST root because the latest
  // shadcn tooltip (registry change 2026-07) no longer self-wraps each Tooltip
  // in a TooltipProvider; Base UI Tooltip.Root works without one, but the
  // provider owns the shared open delay and the skip window (`timeout`), which
  // the library turns off. Mounting it once with the table keeps consumer
  // boilerplate at zero (MRT/MUI ergonomics) and covers every toolbar, menu,
  // modal, and cell, including portalled content (portals preserve React
  // context) and components hand-composed under this provider.
  return (
    <TooltipProvider timeout={0}>
      <tableContext.Provider
        value={handle as unknown as ContextType<typeof tableContext>}
      >
        {children}
      </tableContext.Provider>
    </TooltipProvider>
  );
};
