import { useLayoutEffect, useRef } from 'react';
import {
  type ST_CoreTableInstance,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-radix/shadcn-table/types';
import {
  flashST_Highlight,
  prefersReducedMotion,
} from '@/components/ui-radix/shadcn-table/hooks/useST_ColumnFlip';

const SLIDE_MS = 200;
const EASING = 'ease-out';
const MAX_SLIDE_ROWS = 200;

/** The body row attribute that holds the row id the slide measures by. */
const ST_FLIP_ROW_ATTR = 'data-flip-row';

/** A row's running vertical `translate`, so layout reads can subtract it. */
const shiftYOf = (element: Element) => {
  const value = parseFloat(
    getComputedStyle(element).translate.split(' ')[1] ?? '',
  );
  return Number.isFinite(value) ? value : 0;
};

/**
 * Every unpinned body row element by its row data, with its top from the
 * table's top edge, any running slide taken out.
 */
const measureRows = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
  tableElement: HTMLTableElement,
) => {
  const origin = tableElement.getBoundingClientRect().top;
  const { rowsById } = table.getRowModel();
  const rows = new Map<ST_RowData, { element: HTMLElement; top: number }>();
  tableElement
    .querySelectorAll<HTMLElement>(
      `:scope > tbody > tr[${ST_FLIP_ROW_ATTR}]:not([data-pinned])`,
    )
    .forEach((element) => {
      const row = rowsById[element.getAttribute(ST_FLIP_ROW_ATTR) ?? ''];
      if (!row) return;
      rows.set(row.original, {
        element,
        top: element.getBoundingClientRect().top - origin - shiftYOf(element),
      });
    });
  return rows;
};

/**
 * The top of every unpinned body row by its row data, the `positions` a row
 * drop hands to the row slide through `rowFlipPending`.
 */
export const getST_RowFlipPositions = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
): Map<ST_RowData, number> => {
  const positions = new Map<ST_RowData, number>();
  const tableElement = table.refs.tableRef.current;
  if (!tableElement) return positions;
  measureRows(table, tableElement).forEach(({ top }, original) =>
    positions.set(original, top),
  );
  return positions;
};

/** Runs a compositor slide with `will-change` set only while it runs. */
const slide = (element: HTMLElement, delta: number) => {
  element.style.willChange = 'translate';
  const animation = element.animate(
    [{ translate: `0 ${delta}px` }, { translate: '0 0' }],
    { duration: SLIDE_MS, easing: EASING },
  );
  const clear = () => {
    element.style.willChange = '';
  };
  animation.addEventListener('finish', clear);
  animation.addEventListener('cancel', clear);
};

/**
 * The row drop animation, per table instance, on the DOM only.
 *
 * When a row drop hands over `rowFlipPending` and the new order renders, the
 * rows slide from their old to their new positions with `element.animate()`
 * and the dropped row's cells fade the column drop's `--primary` tint. Rows
 * are matched by their data, so index row ids work. A row that left the table
 * (a drop into another table) plays nothing. Reduced motion, row
 * virtualization and more than 200 rendered rows keep the highlight only.
 */
export const useST_RowFlip = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  rows: ST_Row<TData>[],
): void => {
  // The instance a render hands over can change identity; its atoms do not.
  const latestTable = useRef(table);
  useLayoutEffect(() => {
    latestTable.current = table;
  });

  // Runs after the commit of the new rows, before paint.
  useLayoutEffect(() => {
    const table = latestTable.current;
    const pending = table.atoms.rowFlipPending.get();
    const tableElement = table.refs.tableRef.current;
    if (!pending || !tableElement) return;
    table.setRowFlipPending(null);
    const now = measureRows(table, tableElement);
    const moved = now.get(pending.movedRow);
    if (!moved) return;

    const canSlide =
      !prefersReducedMotion() &&
      !table.options.enableRowVirtualization &&
      now.size <= MAX_SLIDE_ROWS;
    if (canSlide) {
      now.forEach(({ element, top }, original) => {
        const before = pending.positions.get(original);
        if (before === undefined) return;
        const delta = Math.round(before - top);
        if (delta) slide(element, delta);
      });
    }
    moved.element
      .querySelectorAll<HTMLElement>(':scope > td')
      .forEach(flashST_Highlight);
  }, [rows]);
};
