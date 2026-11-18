import { type Range, defaultRangeExtractor } from '@tanstack/react-virtual';
import {
  type ST_CoreTableInstance,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';

/**
 * Keeps extra rows or columns rendered while they are outside the virtualized
 * range: the dragged one, so its `dragend` fires, and the sticky pinned rows,
 * so they stay in view. Indexes stay in ascending order.
 */
export const extraIndexRangeExtractor = (
  range: Range,
  extraIndexes?: number | readonly number[],
) => {
  const newIndexes = defaultRangeExtractor(range);
  const extras = (
    typeof extraIndexes === 'number' ? [extraIndexes] : (extraIndexes ?? [])
  ).filter(
    (index) =>
      index >= 0 &&
      index < range.count &&
      !(
        index >= Math.max(range.startIndex - range.overscan, 0) &&
        index <= Math.min(range.endIndex + range.overscan, range.count - 1)
      ),
  );
  if (!extras.length) return newIndexes;
  return [...new Set([...newIndexes, ...extras])].sort((a, b) => a - b);
};

/**
 * Whether the sticky pinned rows stack higher than the scroll container holds
 * between the head and the sticky footer, so they cannot all stay in view.
 */
export const getPinnedStackOverflows = <TData extends ST_RowData>({
  pinnedCount,
  rowHeight,
  table,
}: {
  pinnedCount: number;
  rowHeight: number;
  table: Pick<ST_CoreTableInstance<TData>, 'options' | 'refs'>;
}) => {
  const {
    options: { enableStickyFooter },
    refs: { tableContainerRef, tableFooterRef, tableHeadRef },
  } = table;
  return (
    pinnedCount > 0 &&
    pinnedCount * rowHeight +
      (tableHeadRef.current?.clientHeight || 0) +
      ((enableStickyFooter && tableFooterRef.current?.clientHeight) || 0) >
      (tableContainerRef.current?.clientHeight ?? Infinity)
  );
};
