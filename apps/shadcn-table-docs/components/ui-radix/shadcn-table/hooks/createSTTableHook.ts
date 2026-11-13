import {
  constructAggregationFn,
  createTableHook,
  tableFeatures,
} from '@tanstack/react-table';
import { tableContext } from '@/components/ui-radix/shadcn-table/context/ST_TableContext';
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
} from '@/components/ui-radix/shadcn-table/types';

/**
 * Builds the table hook for one mounted table. The `filterFns`, `sortFns` and
 * `aggregationFns` registries are read off `features` once, at construction,
 * so the call's own registries are merged over the built-ins here; a plain
 * callable in `aggregationFns` becomes the `aggregate` step of a definition.
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
