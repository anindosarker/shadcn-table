import { useCallback, useMemo } from 'react';
import { useSelector } from '@tanstack/react-store';
import { type Range, useVirtualizer } from '@tanstack/react-virtual';
import {
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { extraIndexRangeExtractor } from '@/components/ui-base/shadcn-table/shared/utils/virtualization.utils';

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
      enableRowVirtualization,
      renderDetailPanel,
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

  const rowCount = realRows.length;

  const normalRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 58 : 73;

  const rangeExtractor = useCallback(
    (range: Range) => extraIndexRangeExtractor(range, draggingRowIndex),
    [draggingRowIndex],
  );

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
