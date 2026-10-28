import {
  createCoreRowModel,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  stockFeatures,
  tableFeatures,
  type TableFeatures,
} from '@tanstack/react-table';
import { stCellActionsFeature } from '@/components/ui-base/shadcn-table/features/stCellActionsFeature';
import { stColumnDraggingFeature } from '@/components/ui-base/shadcn-table/features/stColumnDraggingFeature';
import { stConfigFeature } from '@/components/ui-base/shadcn-table/features/stConfigFeature';
import { stDensityFeature } from '@/components/ui-base/shadcn-table/features/stDensityFeature';
import { stEditingFeature } from '@/components/ui-base/shadcn-table/features/stEditingFeature';
import { stFilterModesFeature } from '@/components/ui-base/shadcn-table/features/stFilterModesFeature';
import { stFullScreenFeature } from '@/components/ui-base/shadcn-table/features/stFullScreenFeature';
import { stLoadingFeature } from '@/components/ui-base/shadcn-table/features/stLoadingFeature';
import { stRefsFeature } from '@/components/ui-base/shadcn-table/features/stRefsFeature';
import { stRowDraggingFeature } from '@/components/ui-base/shadcn-table/features/stRowDraggingFeature';
import { stToolbarsFeature } from '@/components/ui-base/shadcn-table/features/stToolbarsFeature';
import { ST_AggregationFns } from '@/components/ui-base/shadcn-table/shared/fns/aggregationFns';
import { ST_FilterFns } from '@/components/ui-base/shadcn-table/shared/fns/filterFns';
import { ST_SortFns } from '@/components/ui-base/shadcn-table/shared/fns/sortFns';

// The registry slots are typed as open records, not as the built-in keys: the
// table a call builds registers its own `filterFns`, `sortFns` and
// `aggregationFns` on top of these (hooks/stTableHook.tsx), so any name is a
// valid `filterFn`, `sortFn`, `aggregationFn` or `globalFilterFn` for core.
const filterFns: NonNullable<TableFeatures['filterFns']> = ST_FilterFns;
const sortFns: NonNullable<TableFeatures['sortFns']> = ST_SortFns;
const aggregationFns: NonNullable<TableFeatures['aggregationFns']> =
  ST_AggregationFns;

// Row models are gated at runtime by the `manual*` options, so a table that
// does not use a feature runs its model as an identity pass.
export const stFeatures = tableFeatures({
  ...stockFeatures,
  stCellActionsFeature,
  stColumnDraggingFeature,
  stConfigFeature,
  stDensityFeature,
  stEditingFeature,
  stFilterModesFeature,
  stFullScreenFeature,
  stLoadingFeature,
  stRefsFeature,
  stRowDraggingFeature,
  stToolbarsFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns,
  sortFns,
  aggregationFns,
});

export type ST_Features = typeof stFeatures;
