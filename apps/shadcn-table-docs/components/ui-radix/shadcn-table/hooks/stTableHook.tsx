import {
  constructAggregationFn,
  createTableHook,
  createTableHookContexts,
  tableFeatures,
} from '@tanstack/react-table';
import { TooltipProvider } from '@/components/ui-radix/tooltip';
import {
  type ST_Features,
  stFeatures,
} from '@/components/ui-radix/shadcn-table/features/stFeatures';
import { ST_AggregationFns } from '@/components/ui-radix/shadcn-table/shared/fns/aggregationFns';
import { ST_FilterFns } from '@/components/ui-radix/shadcn-table/shared/fns/filterFns';
import { ST_SortFns } from '@/components/ui-radix/shadcn-table/shared/fns/sortFns';
import {
  type ST_DefinedTableOptions,
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableProviderProps,
} from '@/components/ui-radix/shadcn-table/types';

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

export function useSTContext<
  TData extends ST_RowData = ST_RowData,
>(): ST_TableInstance<TData> {
  // The context carries the core-typed table; the ST wrapper types re-type
  // its row, column, cell and header getters.
  return useTableContext() as unknown as ST_TableInstance<TData>;
}

export const ST_TableProvider = <TData extends ST_RowData>({
  children,
  table,
}: ST_TableProviderProps<TData>) => (
  // Radix Tooltip.Root throws without a TooltipProvider ancestor, and the
  // shadcn tooltip does not wrap each Tooltip in one. Mounting it with the
  // table covers every tooltip below, portalled content included.
  <TooltipProvider skipDelayDuration={0}>
    <table.AppTable>{children}</table.AppTable>
  </TooltipProvider>
);
