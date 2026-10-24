import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';
import { ST_AggregationFns } from '@/components/ui/shadcn-table/fns/aggregationFns';
import { ST_FilterFns } from '@/components/ui/shadcn-table/fns/filterFns';
import { ST_SortFns } from '@/components/ui/shadcn-table/fns/sortFns';

/**
 * The TanStack Table v9 feature set the table instance is built with. Every
 * stock feature the library renders is registered here once, together with
 * the client-side row models and the three function registries, so the
 * `manual*`, `enable*` and `state` table options keep deciding what runs.
 * Prerequisites are listed before the slots that need them.
 */
export const stFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnGroupingFeature,
  rowAggregationFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  filterFns: ST_FilterFns,
  sortFns: ST_SortFns,
  aggregationFns: ST_AggregationFns,
});

export type ST_Features = typeof stFeatures;
