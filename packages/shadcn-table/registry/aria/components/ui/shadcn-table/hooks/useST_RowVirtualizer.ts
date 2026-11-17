import { useCallback, useMemo } from 'react';
import { useSelector } from '@tanstack/react-store';
import { type Range, useVirtualizer } from '@tanstack/react-virtual';
import {
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { extraIndexRangeExtractor } from '@/components/ui/shadcn-table/shared/utils/virtualization.utils';

export const useST_RowVirtualizer = <
  TData extends ST_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
>(
  table: ST_TableInstance<TData>,
  rows?: ST_Row<TData>[],
): ST_RowVirtualizer<TScrollElement, TItemElement> | undefined => {
  'use no memo';
  const {
    getRowModel,
    options: {
      enableRowPinning,
      enableRowVirtualization,
      renderDetailPanel,
      rowPinningDisplayMode,
      rowVirtualizerInstanceRef,
      rowVirtualizerOptions,
    },
    refs: { tableContainerRef },
  } = table;

  // Off, the hook selects a constant, so these slices never re-render the
  // caller.
  const density = useSelector(table.atoms.density, (value) =>
    enableRowVirtualization ? value : undefined,
  );
  const draggingRow = useSelector(table.atoms.draggingRow, (value) =>
    enableRowVirtualization ? value : undefined,
  );
  const expanded = useSelector(table.atoms.expanded, (value) =>
    enableRowVirtualization ? value : undefined,
  );
  const stickyPinning =
    !!enableRowVirtualization &&
    !!enableRowPinning &&
    !!rowPinningDisplayMode?.includes('sticky');
  const rowPinning = useSelector(table.atoms.rowPinning, (value) =>
    stickyPinning ? value : undefined,
  );

  const rowVirtualizerProps = parseFromValuesOrFunc(rowVirtualizerOptions, {
    table,
  });

  const realRows = rows ?? getRowModel().rows;
  const draggingRowId = draggingRow?.id;
  const draggingRowIndex = useMemo(
    () =>
      draggingRowId
        ? realRows.findIndex((r) => r.id === draggingRowId)
        : undefined,
    [realRows, draggingRowId],
  );

  // Sticky pinned rows stay rendered wherever the scroll is, so they can
  // stay in view at the top or the bottom of the body.
  const pinnedRowIndexes = useMemo(() => {
    if (!rowPinning?.top?.length && !rowPinning?.bottom?.length) return [];
    return realRows.flatMap((row, index) =>
      row.getIsPinned() ? [renderDetailPanel ? index * 2 : index] : [],
    );
  }, [realRows, renderDetailPanel, rowPinning]);

  const rowCount = realRows.length;

  const normalRowHeight =
    density === 'compact' ? 40 : density === 'comfortable' ? 48 : 56;

  const rangeExtractor = useCallback(
    (range: Range) =>
      extraIndexRangeExtractor(
        range,
        draggingRowIndex === undefined
          ? pinnedRowIndexes
          : [draggingRowIndex, ...pinnedRowIndexes],
      ),
    [draggingRowIndex, pinnedRowIndexes],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer returns mutable functions; the hook opts out with 'use no memo'
  const rowVirtualizer = useVirtualizer({
    count: renderDetailPanel ? rowCount * 2 : rowCount,
    enabled: !!enableRowVirtualization,
    estimateSize: (index) =>
      renderDetailPanel && index % 2 === 1
        ? expanded === true
          ? 100
          : 0
        : normalRowHeight,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 4,
    rangeExtractor,
    ...rowVirtualizerProps,
  }) as unknown as ST_RowVirtualizer<TScrollElement, TItemElement>;

  if (!enableRowVirtualization) return undefined;

  rowVirtualizer.virtualRows = rowVirtualizer.getVirtualItems();

  if (rowVirtualizerInstanceRef) {
    // @ts-expect-error Virtualizer generics vs the ST_RowVirtualizer ref type
    rowVirtualizerInstanceRef.current = rowVirtualizer;
  }

  return rowVirtualizer;
};
