import { type Range, defaultRangeExtractor } from '@tanstack/react-virtual';

/**
 * Keeps the dragged row or column rendered while it scrolls out of the
 * virtualized range, so its `dragend` fires.
 */
export const extraIndexRangeExtractor = (
  range: Range,
  draggingIndex?: number,
) => {
  const newIndexes = defaultRangeExtractor(range);
  if (draggingIndex === undefined) return newIndexes;
  if (
    draggingIndex >= 0 &&
    draggingIndex < Math.max(range.startIndex - range.overscan, 0)
  ) {
    newIndexes.unshift(draggingIndex);
  }
  if (draggingIndex >= 0 && draggingIndex > range.endIndex + range.overscan) {
    newIndexes.push(draggingIndex);
  }
  return newIndexes;
};
