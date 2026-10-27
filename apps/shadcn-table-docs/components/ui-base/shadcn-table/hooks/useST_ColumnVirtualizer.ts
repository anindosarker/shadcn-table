import { useCallback, useMemo } from 'react';
import { type Range, useVirtualizer } from '@tanstack/react-virtual';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { extraIndexRangeExtractor } from '@/components/ui-base/shadcn-table/shared/utils/virtualization.utils';
import { useST_Atom } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export const useST_ColumnVirtualizer = <
  TData extends ST_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
>(
  table: ST_TableInstance<TData>,
): ST_ColumnVirtualizer | undefined => {
  const {
    options: {
      columnVirtualizerInstanceRef,
      columnVirtualizerOptions,
      enableColumnPinning,
      enableColumnVirtualization,
    },
    refs: { tableContainerRef },
  } = table;

  if (!enableColumnVirtualization) return undefined;

  // These feed the memos and the virtualizer, so they are hook subscriptions.
  const columnPinning = useST_Atom(table.atoms.columnPinning);
  const columnVisibility = useST_Atom(table.atoms.columnVisibility);
  const draggingColumn = useST_Atom(table.atoms.draggingColumn);

  const columnVirtualizerProps = parseFromValuesOrFunc(
    columnVirtualizerOptions,
    {
      table,
    },
  );

  const visibleColumns = table.getVisibleLeafColumns();

  const [leftPinnedIndexes, rightPinnedIndexes] = useMemo(
    () =>
      enableColumnPinning
        ? [
            table.getStartVisibleLeafColumns().map((c) => c.getPinnedIndex()),
            table
              .getEndVisibleLeafColumns()
              .map(
                (column) => visibleColumns.length - column.getPinnedIndex() - 1,
              )
              .sort((a, b) => a - b),
          ]
        : [[], []],
    [columnPinning, columnVisibility, enableColumnPinning],
  );

  const numPinnedLeft = leftPinnedIndexes.length;
  const numPinnedRight = rightPinnedIndexes.length;

  const draggingColumnIndex = useMemo(
    () =>
      draggingColumn?.id
        ? visibleColumns.findIndex((c) => c.id === draggingColumn?.id)
        : undefined,
    [draggingColumn?.id],
  );

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3,
    rangeExtractor: useCallback(
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
      [leftPinnedIndexes, rightPinnedIndexes, draggingColumnIndex],
    ),
    ...columnVirtualizerProps,
  }) as unknown as ST_ColumnVirtualizer<TScrollElement, TItemElement>;

  const virtualColumns = columnVirtualizer.getVirtualItems();
  columnVirtualizer.virtualColumns = virtualColumns as any;
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

  return columnVirtualizer as any;
};
