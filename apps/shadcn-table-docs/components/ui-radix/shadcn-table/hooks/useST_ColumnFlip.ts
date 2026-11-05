import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from '@tanstack/react-store';
import {
  type ST_Column,
  type ST_CoreTableInstance,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-radix/shadcn-table/types';
import {
  ST_FLIP_COLUMN_ATTR,
  ST_FLIP_SLIDING_ATTR,
} from '@/components/ui-radix/shadcn-table/shared/utils/drag.utils';

const SLIDE_MS = 200;
const HIGHLIGHT_MS = 600;
const EASING = 'ease-out';
const MAX_SLIDE_ROWS = 200;
const HIGHLIGHT =
  'inset 0 0 0 9999px color-mix(in srgb, var(--primary) 20%, transparent)';
const HIGHLIGHT_END = 'inset 0 0 0 9999px transparent';

/** Whether the user asked for reduced motion; false outside a browser. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface HeaderBox {
  readonly id: string;
  readonly left: number;
  readonly pinned: boolean;
  readonly width: number;
}

/** A cell's inline or running `translate`, so layout reads can subtract it. */
const shiftOf = (element: Element) => {
  const value = parseFloat(getComputedStyle(element).translate);
  return Number.isFinite(value) ? value : 0;
};

/**
 * The layout box of every leaf header cell, relative to the table's left
 * edge, with any preview shift or running slide taken out.
 */
const measureHeaders = (tableElement: HTMLTableElement): HeaderBox[] => {
  const origin = tableElement.getBoundingClientRect().left;
  const boxes: HeaderBox[] = [];
  tableElement
    .querySelectorAll<HTMLElement>(`:scope > thead [${ST_FLIP_COLUMN_ATTR}]`)
    .forEach((th) => {
      const id = th.getAttribute(ST_FLIP_COLUMN_ATTR);
      if (!id) return;
      const rect = th.getBoundingClientRect();
      boxes.push({
        id,
        left: rect.left - origin - shiftOf(th),
        pinned: th.hasAttribute('data-flip-pinned'),
        width: rect.width,
      });
    });
  return boxes;
};

/**
 * The left offset of every unpinned column's header in the current layout,
 * the `positions` a reorder hands to the column slide through
 * `columnFlipPending`.
 */
export const getST_ColumnFlipPositions = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
): Map<string, number> => {
  const positions = new Map<string, number>();
  const tableElement = table.refs.tableRef.current;
  if (!tableElement) return positions;
  for (const box of measureHeaders(tableElement)) {
    if (!box.pinned) positions.set(box.id, box.left);
  }
  return positions;
};

/** Whether a dragged column may land on `column`. */
const getCanDrop = <TData extends ST_RowData>(column: ST_Column<TData>) =>
  !!column.table.options.enableColumnOrdering &&
  column.columnDef.enableColumnOrdering !== false;

/**
 * Each unpinned header's shift in the drag preview: the drop rule (the
 * dragged column takes the target's index) applied to the unpinned columns.
 * A drop into a pinned region is not previewed. In an RTL table the first
 * column is the rightmost, so the slots are laid right to left.
 */
const previewShifts = (
  boxes: HeaderBox[],
  draggingId: string,
  targetId: string | undefined,
  rtl: boolean,
): Map<string, number> => {
  const shifts = new Map<string, number>();
  const center = boxes.filter((box) => !box.pinned);
  const from = center.findIndex((box) => box.id === draggingId);
  const to = center.findIndex((box) => box.id === targetId);
  if (from < 0 || to < 0 || from === to) return shifts;
  const preview = [...center];
  preview.splice(to, 0, preview.splice(from, 1)[0]);
  if (rtl) {
    let right = center[0].left + center[0].width;
    for (const box of preview) {
      right -= box.width;
      shifts.set(box.id, right - box.left);
    }
    return shifts;
  }
  let left = center[0].left;
  for (const box of preview) {
    shifts.set(box.id, left - box.left);
    left += box.width;
  }
  return shifts;
};

/** Runs a compositor animation with `will-change` set only while it runs. */
const animate = (
  element: HTMLElement,
  keyframes: Keyframe[],
  duration: number,
  willChange: string,
) => {
  element.style.willChange = willChange;
  const animation = element.animate(keyframes, { duration, easing: EASING });
  const clear = () => {
    element.style.willChange = '';
  };
  animation.addEventListener('finish', clear);
  animation.addEventListener('cancel', clear);
  return animation;
};

/**
 * Lifts the moved column's cells above the unpinned cells they slide across
 * (those share `z-0` and paint in DOM order, so a later cell would cover the
 * moved one) and the pinned cells above the moved column, until the last
 * slide finishes or is cancelled. Returns the undo, which runs once.
 */
const liftMovedColumn = (
  moved: HTMLElement[],
  pinned: HTMLElement[],
  slides: Animation[],
) => {
  const saved = new Map<HTMLElement, string>();
  const lift = (cell: HTMLElement, zIndex: string) => {
    if (!saved.has(cell)) saved.set(cell, cell.style.zIndex);
    cell.style.zIndex = zIndex;
  };
  moved.forEach((cell) => lift(cell, '1'));
  pinned.forEach((cell) => lift(cell, '2'));
  let lifted = true;
  const restore = () => {
    if (!lifted) return;
    lifted = false;
    saved.forEach((zIndex, cell) => {
      cell.style.zIndex = zIndex;
    });
  };
  let running = slides.length;
  const settle = () => {
    running -= 1;
    if (!running) restore();
  };
  slides.forEach((slide) => {
    slide.addEventListener('finish', settle);
    slide.addEventListener('cancel', settle);
  });
  return restore;
};

/**
 * Flashes the column highlight on an element: the primary tint fades out over
 * the highlight duration. Reduced motion keeps it, as for a moved column.
 */
export const flashST_Highlight = (element: HTMLElement) =>
  animate(
    element,
    [{ boxShadow: HIGHLIGHT }, { boxShadow: HIGHLIGHT_END }],
    HIGHLIGHT_MS,
    'box-shadow',
  );

/**
 * Column reorder animations, per table instance, on refs and the DOM only.
 *
 * While a column drags, only the header row previews: the other unpinned
 * headers slide aside through an inline `translate` (the head cells'
 * transition utilities apply under `data-flip-sliding` on the table) and the
 * dragged header sits in the gap. Drop targets follow the layout slots, not
 * the slid cells. A cancelled drag slides the headers back. When a reorder
 * hands over `columnFlipPending`, the body cells (and, for a Columns menu
 * drop, the headers) slide from their old offsets with `element.animate()`,
 * then the moved column fades a `--primary` tint. Any other order change
 * applies at once. Reduced motion keeps the highlight only.
 */
export const useST_ColumnFlip = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): void => {
  const columnOrder = useSelector(table.atoms.columnOrder);
  const shiftedIds = useRef(new Set<string>());
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const unliftMovedColumn = useRef<() => void>(undefined);
  // The instance a render hands over can change identity; its atoms do not.
  const latestTable = useRef(table);
  useLayoutEffect(() => {
    latestTable.current = table;
  });
  const draggingAtom = table.atoms.draggingColumn;

  useEffect(() => {
    const table = latestTable.current;
    const { refs } = table;
    let boxes: HeaderBox[] = [];
    let preview = false;
    let tableElement: HTMLTableElement | null = null;
    let previewTargetId: string | undefined;

    const writeShift = (id: string, shift: number) => {
      const th = refs.tableHeadCellRefs.current?.[id];
      if (th) th.style.translate = shift ? `${shift}px` : '';
    };

    const clearShifts = () => {
      shiftedIds.current.forEach((id) => writeShift(id, 0));
      shiftedIds.current = new Set();
      previewTargetId = undefined;
    };

    const showPreview = (
      draggingId: string,
      targetId: string | undefined,
      rtl: boolean,
    ) => {
      if (!preview || targetId === previewTargetId) return;
      previewTargetId = targetId;
      const shifts = previewShifts(boxes, draggingId, targetId, rtl);
      shiftedIds.current.forEach((id) => {
        if (!shifts.get(id)) writeShift(id, 0);
      });
      const next = new Set<string>();
      shifts.forEach((shift, id) => {
        if (!shift) return;
        writeShift(id, shift);
        next.add(id);
      });
      shiftedIds.current = next;
    };

    const slotAt = (x: number) =>
      boxes.find(
        (box) => !box.pinned && x >= box.left && x < box.left + box.width,
      )?.id;

    const handleDragOver = (event: DragEvent) => {
      const dragging = table.atoms.draggingColumn.get();
      if (!dragging || !tableElement) return;
      const cellId =
        (event.target as Element | null)
          ?.closest?.(`[${ST_FLIP_COLUMN_ATTR}]`)
          ?.getAttribute(ST_FLIP_COLUMN_ATTR) ?? undefined;
      const cellColumn = cellId ? table.getColumn(cellId) : undefined;
      const x = event.clientX - tableElement.getBoundingClientRect().left;
      const id = cellColumn?.getIsPinned()
        ? cellColumn.id
        : (slotAt(x) ?? cellColumn?.id);
      const target = id ? table.getColumn(id) : undefined;
      const next =
        target && (target.id === dragging.id || getCanDrop(target))
          ? target
          : null;
      if (table.atoms.hoveredColumn.get()?.id !== next?.id) {
        table.setHoveredColumn(next);
      }
      // The auto-scroll loop's synthetic dragover has no data transfer.
      if (event.dataTransfer) {
        event.preventDefault();
        event.dataTransfer.dropEffect = next ? 'move' : 'none';
      }
      showPreview(
        dragging.id,
        next && !next.getIsPinned() ? next.id : undefined,
        getComputedStyle(tableElement).direction === 'rtl',
      );
    };

    const start = () => {
      tableElement = refs.tableRef.current;
      if (!tableElement) return;
      clearTimeout(settleTimer.current);
      boxes = measureHeaders(tableElement);
      preview =
        !prefersReducedMotion() && !table.options.enableColumnVirtualization;
      if (preview) tableElement.setAttribute(ST_FLIP_SLIDING_ATTR, '');
      tableElement.addEventListener('dragover', handleDragOver);
    };

    const end = () => {
      const element = tableElement;
      tableElement = null;
      if (!element) return;
      element.removeEventListener('dragover', handleDragOver);
      if (table.atoms.columnFlipPending.get()) {
        // A drop: the new order takes over from the preview with no
        // transition, so the headers stay where the preview put them.
        element.removeAttribute(ST_FLIP_SLIDING_ATTR);
        clearShifts();
        // A drop that left the order as it was hands over nothing.
        setTimeout(() => {
          if (table.atoms.columnFlipPending.get()) {
            table.setColumnFlipPending(null);
          }
        });
        return;
      }
      clearShifts();
      settleTimer.current = setTimeout(
        () => element.removeAttribute(ST_FLIP_SLIDING_ATTR),
        SLIDE_MS,
      );
    };

    const { unsubscribe } = draggingAtom.subscribe((dragging) => {
      if (dragging && !tableElement) start();
      else if (!dragging) end();
    });
    return () => {
      unsubscribe();
      end();
      clearTimeout(settleTimer.current);
    };
  }, [draggingAtom]);

  // Runs after the commit of the new order, before paint.
  useLayoutEffect(() => {
    const table = latestTable.current;
    const pending = table.atoms.columnFlipPending.get();
    const tableElement = table.refs.tableRef.current;
    if (!pending || !tableElement) return;
    table.setColumnFlipPending(null);
    const {
      options: { enableColumnVirtualization, enableRowVirtualization },
    } = table;

    const reduceMotion = prefersReducedMotion();
    const headerGroups = table.getHeaderGroups().length > 1;
    const canSlide =
      !reduceMotion && !headerGroups && !enableColumnVirtualization;
    const canSlideBody =
      canSlide &&
      !enableRowVirtualization &&
      table.getRowModel().rows.length <= MAX_SLIDE_ROWS;

    const cellsOf = (section: 'tbody' | 'thead', id: string) =>
      tableElement.querySelectorAll<HTMLElement>(
        `:scope > ${section} > tr > [${ST_FLIP_COLUMN_ATTR}="${CSS.escape(id)}"]`,
      );

    if (canSlide) {
      // The sections that slide: the header row only on a Columns menu drop,
      // a header drop leaves the headers where the preview put them.
      const sections = [
        ...(pending.dragDrop ? [] : (['thead'] as const)),
        ...(canSlideBody ? (['tbody'] as const) : []),
      ];
      const slides: Animation[] = [];
      for (const box of measureHeaders(tableElement)) {
        if (box.pinned) continue;
        const before = pending.positions.get(box.id);
        if (before === undefined) continue;
        const delta = Math.round(before - box.left);
        if (!delta) continue;
        const keyframes = [{ translate: `${delta}px` }, { translate: '0px' }];
        for (const section of sections) {
          cellsOf(section, box.id).forEach((cell) =>
            slides.push(animate(cell, keyframes, SLIDE_MS, 'translate')),
          );
        }
      }
      unliftMovedColumn.current?.();
      if (slides.length) {
        unliftMovedColumn.current = liftMovedColumn(
          sections.flatMap((section) => [...cellsOf(section, pending.movedId)]),
          sections.flatMap((section) => [
            ...tableElement.querySelectorAll<HTMLElement>(
              `:scope > ${section} > tr > [data-pinned]`,
            ),
          ]),
          slides,
        );
      }
    }

    for (const section of ['thead', 'tbody'] as const) {
      cellsOf(section, pending.movedId).forEach(flashST_Highlight);
    }
  }, [columnOrder]);
};
