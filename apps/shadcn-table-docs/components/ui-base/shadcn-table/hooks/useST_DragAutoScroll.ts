import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';

/** Width of the hot zone at each inner edge of the unpinned area. */
const ZONE_PX = 64;
/** Scroll speed at the very edge; it scales down with the zone depth. */
const MAX_SPEED_PX = 20;

/**
 * Scrolls the table container sideways while a column drags near the inner
 * edges of the unpinned area (`--st-pin-start` / `--st-pin-end` on the
 * container, else the pinned columns' widths). Native drag fires `dragover`
 * only while the pointer moves, so a frame loop keeps scrolling from the last
 * pointer position and, each scrolled frame, re-sends a `dragover` to the
 * element under the pointer so the drop target follows. It scrolls and
 * dispatches only; it never writes styles.
 */
export const useST_DragAutoScroll = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
): void => {
  // The instance a render hands over can change identity; its atoms do not.
  const latestTable = useRef(table);
  useLayoutEffect(() => {
    latestTable.current = table;
  });
  const draggingAtom = table.atoms.draggingColumn;

  useEffect(() => {
    const table = latestTable.current;
    let box: HTMLElement | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const pinWidth = (side: 'end' | 'start') => {
      const fromVar = parseFloat(
        box ? getComputedStyle(box).getPropertyValue(`--st-pin-${side}`) : '',
      );
      if (Number.isFinite(fromVar)) return fromVar;
      return side === 'start'
        ? table.getStartTotalSize()
        : table.getEndTotalSize();
    };

    /** Pixels per frame: negative towards the start, 0 outside the zones. */
    const speed = () => {
      if (!box) return 0;
      const rect = box.getBoundingClientRect();
      const rtl = getComputedStyle(box).direction === 'rtl';
      const left = rect.left + pinWidth(rtl ? 'end' : 'start');
      const right = rect.right - pinWidth(rtl ? 'start' : 'end');
      const depth = (distance: number) =>
        Math.min(1, Math.max(0, (ZONE_PX - distance) / ZONE_PX));
      if (pointerX < left + ZONE_PX) {
        return -MAX_SPEED_PX * depth(pointerX - left);
      }
      if (pointerX > right - ZONE_PX) {
        return MAX_SPEED_PX * depth(right - pointerX);
      }
      return 0;
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const step = () => {
      frame = 0;
      const delta = speed();
      if (!box || !table.atoms.draggingColumn.get() || delta === 0) {
        return stop();
      }
      const before = box.scrollLeft;
      box.scrollLeft += delta;
      if (box.scrollLeft === before) return stop();
      const target = document.elementFromPoint(pointerX, pointerY);
      if (target && box.contains(target)) {
        target.dispatchEvent(
          new DragEvent('dragover', {
            bubbles: true,
            clientX: pointerX,
            clientY: pointerY,
          }),
        );
      }
      frame = requestAnimationFrame(step);
    };

    const handleDragOver = (event: DragEvent) => {
      // The loop's own dragover would start a second loop.
      if (!event.isTrusted || !table.atoms.draggingColumn.get()) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame && speed() !== 0) frame = requestAnimationFrame(step);
    };

    // The pointer left the window: no related target, and off the viewport.
    const handleDragLeave = (event: DragEvent) => {
      const { clientX: x, clientY: y } = event;
      if (
        !event.relatedTarget &&
        (x <= 0 || y <= 0 || x >= innerWidth || y >= innerHeight)
      ) {
        stop();
      }
    };

    const detach = () => {
      stop();
      box?.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragend', stop);
      document.removeEventListener('drop', stop);
      box = null;
    };

    const attach = () => {
      box = table.refs.tableContainerRef.current;
      if (!box) return;
      box.addEventListener('dragover', handleDragOver);
      document.addEventListener('dragleave', handleDragLeave);
      document.addEventListener('dragend', stop);
      document.addEventListener('drop', stop);
    };

    const { unsubscribe } = draggingAtom.subscribe((dragging) => {
      if (dragging && !box) attach();
      else if (!dragging) detach();
    });
    return () => {
      unsubscribe();
      detach();
    };
  }, [draggingAtom]);
};
