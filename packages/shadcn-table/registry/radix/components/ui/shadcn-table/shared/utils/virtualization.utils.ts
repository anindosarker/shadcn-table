import { type Range, defaultRangeExtractor } from '@tanstack/react-virtual';

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
