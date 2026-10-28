import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from '@tanstack/react-store';
import { type Range, useVirtualizer } from '@tanstack/react-virtual';
import {
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_TableInstance,
} from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { extraIndexRangeExtractor } from '@/components/ui-radix/shadcn-table/shared/utils/virtualization.utils';

export const useST_RowVirtualizer = <
  TData extends ST_RowData,
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
>(
  table: ST_TableInstance<TData>,
  rows?: ST_Row<TData>[],
): ST_RowVirtualizer<TScrollElement, TItemElement> | undefined => {
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

  if (!enableRowVirtualization) return undefined;

  // These feed the memo and the virtualizer, so they are hook subscriptions.
  const density = useSelector(table.atoms.density);
  const draggingRow = useSelector(table.atoms.draggingRow);
  const expanded = useSelector(table.atoms.expanded);

  const rowVirtualizerProps = parseFromValuesOrFunc(rowVirtualizerOptions, {
    table,
  });

  const realRows = rows ?? getRowModel().rows;
  const draggingRowIndex = useMemo(
    () =>
      draggingRow?.id
        ? realRows.findIndex((r) => r.id === draggingRow?.id)
        : undefined,
    [realRows, draggingRow?.id],
  );

  const rowCount = realRows.length;

  const normalRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 58 : 73;

  const rowVirtualizer = useVirtualizer({
    count: renderDetailPanel ? rowCount * 2 : rowCount,
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
    rangeExtractor: useCallback(
      (range: Range) => {
        return extraIndexRangeExtractor(range, draggingRowIndex);
      },
      [draggingRowIndex],
    ),
    ...rowVirtualizerProps,
  }) as unknown as ST_RowVirtualizer<TScrollElement, TItemElement>;

  // React attaches the container ref after the layout effects of the
  // components inside it, so the virtualizer's first update finds no scroll
  // element and renders nothing. Storing the element once the ref is attached
  // renders this component again, and that update picks the element up.
  const [, setScrollElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    setScrollElement(tableContainerRef.current);
  });

  rowVirtualizer.virtualRows = rowVirtualizer.getVirtualItems() as any;

  if (rowVirtualizerInstanceRef) {
    // @ts-expect-error Virtualizer generics vs the ST_RowVirtualizer ref type
    rowVirtualizerInstanceRef.current = rowVirtualizer;
  }

  return rowVirtualizer;
};
