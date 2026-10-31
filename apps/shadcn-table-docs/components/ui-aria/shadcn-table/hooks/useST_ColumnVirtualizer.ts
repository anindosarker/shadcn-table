import { useCallback, useMemo } from 'react';
import { useSelector } from '@tanstack/react-store';
import { type Range, useVirtualizer } from '@tanstack/react-virtual';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { extraIndexRangeExtractor } from '@/components/ui-aria/shadcn-table/shared/utils/virtualization.utils';

export const useST_ColumnVirtualizer = <
  TData extends ST_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
>(
  table: ST_TableInstance<TData>,
): ST_ColumnVirtualizer<TScrollElement, TItemElement> | undefined => {
  'use no memo';
  const {
    options: {
      columnVirtualizerInstanceRef,
      columnVirtualizerOptions,
      enableColumnPinning,
      enableColumnVirtualization,
    },
    refs: { tableContainerRef },
  } = table;

  // Pinning and visibility change the pinned indexes below. Off, the hook
  // selects a constant, so these slices never re-render the caller.
  useSelector(table.atoms.columnPinning, (value) =>
    enableColumnVirtualization ? value : undefined,
  );
  useSelector(table.atoms.columnVisibility, (value) =>
    enableColumnVirtualization ? value : undefined,
  );
  const draggingColumn = useSelector(table.atoms.draggingColumn, (value) =>
    enableColumnVirtualization ? value : undefined,
  );

  const columnVirtualizerProps = parseFromValuesOrFunc(
    columnVirtualizerOptions,
    {
      table,
    },
  );

  const visibleColumns = table.getVisibleLeafColumns();
  const numVisibleColumns = visibleColumns.length;
  const startColumns = table.getStartVisibleLeafColumns();
  const endColumns = table.getEndVisibleLeafColumns();

  const [leftPinnedIndexes, rightPinnedIndexes] = useMemo(
    () =>
      enableColumnPinning
        ? [
            startColumns.map((c) => c.getPinnedIndex()),
            endColumns
              .map((column) => numVisibleColumns - column.getPinnedIndex() - 1)
              .sort((a, b) => a - b),
          ]
        : [[], []],
    [enableColumnPinning, endColumns, numVisibleColumns, startColumns],
  );

  const numPinnedLeft = leftPinnedIndexes.length;
  const numPinnedRight = rightPinnedIndexes.length;

  const draggingColumnId = draggingColumn?.id;
  const draggingColumnIndex = useMemo(
    () =>
      draggingColumnId
        ? visibleColumns.findIndex((c) => c.id === draggingColumnId)
        : undefined,
    [draggingColumnId, visibleColumns],
  );

  const rangeExtractor = useCallback(
    (range: Range) => {
      const newIndexes = extraIndexRangeExtractor(range, draggingColumnIndex);
      if (!numPinnedLeft && !numPinnedRight) {
        return newIndexes;
      }
      return [
        ...new Set([
          ...leftPinnedIndexes,
          ...newIndexes,
          ...rightPinnedIndexes,
        ]),
      ];
    },
    [
      draggingColumnIndex,
      leftPinnedIndexes,
      numPinnedLeft,
      numPinnedRight,
      rightPinnedIndexes,
    ],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer returns mutable functions; the hook opts out with 'use no memo'
  const columnVirtualizer = useVirtualizer({
    count: numVisibleColumns,
    enabled: !!enableColumnVirtualization,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3,
    rangeExtractor,
    ...columnVirtualizerProps,
  }) as unknown as ST_ColumnVirtualizer<TScrollElement, TItemElement>;

  if (!enableColumnVirtualization) return undefined;

  const virtualColumns = columnVirtualizer.getVirtualItems();
  columnVirtualizer.virtualColumns = virtualColumns;
  const numColumns = virtualColumns.length;

  if (numColumns) {
    const totalSize = columnVirtualizer.getTotalSize();

    const leftNonPinnedStart = virtualColumns[numPinnedLeft]?.start || 0;
    const leftNonPinnedEnd =
      virtualColumns[leftPinnedIndexes.length - 1]?.end || 0;

    const rightNonPinnedStart =
      virtualColumns[numColumns - numPinnedRight]?.start || 0;
    const rightNonPinnedEnd =
      virtualColumns[numColumns - numPinnedRight - 1]?.end || 0;

    columnVirtualizer.virtualPaddingLeft =
      leftNonPinnedStart - leftNonPinnedEnd;

    columnVirtualizer.virtualPaddingRight =
      totalSize -
      rightNonPinnedEnd -
      (numPinnedRight ? totalSize - rightNonPinnedStart : 0);
  }

  if (columnVirtualizerInstanceRef) {
    // @ts-expect-error Virtualizer generics vs the ST_ColumnVirtualizer ref type
    columnVirtualizerInstanceRef.current = columnVirtualizer;
  }

  return columnVirtualizer;
};
