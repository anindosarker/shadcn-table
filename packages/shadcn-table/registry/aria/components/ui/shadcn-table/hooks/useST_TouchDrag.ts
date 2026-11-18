import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  createST_TouchDragEvent,
  ST_TOUCH_GHOST_ATTR,
  type ST_TouchDataTransfer,
} from '@/components/ui/shadcn-table/shared/utils/drag.utils';

/** How long a finger rests on a draggable header cell before it drags. */
export const ST_TOUCH_HOLD_MS = 300;
/** How far a finger may wander during the hold before it counts as a swipe. */
const HOLD_SLOP_PX = 8;
/** Height of the hot zone at the top and bottom of the scroll container. */
const EDGE_PX = 48;
/** Scroll speed at the very edge; it scales down with the zone depth. */
const MAX_SPEED_PX = 16;
/** How long after a touch drop a click the browser derives from it is dropped. */
const CLICK_GUARD_MS = 400;

/**
 * The event a touch drag hands to drag handlers in place of a drag event:
 * the pointer event of that moment, with the drag source as `currentTarget`
 * and no `dataTransfer`.
 */
export type ST_TouchDragEvent = PointerEvent & {
  currentTarget: HTMLElement;
  nativeEvent: PointerEvent;
};

export interface ST_TouchDragOptions {
  /** Read when the drag would start; false leaves the touch to the browser. */
  canStart?: () => boolean;
  /** The finger's rest before the drag starts; 0 starts it at once. */
  delay?: number;
  /** False when the source cannot drag: no page listener is kept for it. */
  enabled?: boolean;
  /** The element the ghost copies. */
  getGhostSource: () => HTMLElement | null;
  /** Scrolled up or down while the finger is near its top or bottom edge. */
  getScrollContainer?: () => HTMLElement | null;
  /** The drop routine; `cancelled` when no drop target took the drop. */
  onEnd: (event: ST_TouchDragEvent, cancelled: boolean) => void;
  onStart: (event: ST_TouchDragEvent) => void;
}

const toHandlerEvent = (
  event: PointerEvent,
  currentTarget: HTMLElement,
): ST_TouchDragEvent =>
  new Proxy(event, {
    get: (target, key) => {
      if (key === 'currentTarget') return currentTarget;
      if (key === 'nativeEvent') return target;
      if (key === 'persist') return () => {};
      const value: unknown = Reflect.get(target, key, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as ST_TouchDragEvent;

/** Touch drags under way: while one is on, the finger moves no page. */
let activeDrags = 0;
/** Mounted drag sources; the page listener below lives while there is one. */
let mountedSources = 0;

// WebKit on iOS lets a touchmove listener cancel the scroll only when it was
// on the page before the touch began, so it stays while a source is mounted.
// It listens in the capture phase: an element under the finger that stops
// touchmove does not keep it from the page.
const PAGE_LISTENER = { capture: true, passive: false } as const;
const blockScroll = (event: TouchEvent) => {
  if (activeDrags > 0 && event.cancelable) event.preventDefault();
};

/** An empty transfer whose `dropEffect` keeps what a drop target writes. */
const createDataTransfer = (): ST_TouchDataTransfer => {
  // A constructed `DataTransfer` lends its empty file and item lists; its own
  // `dropEffect` ignores writes outside a native drag.
  const blank = new DataTransfer();
  return {
    clearData: () => {},
    dropEffect: 'move',
    effectAllowed: 'move',
    files: blank.files,
    getData: () => '',
    items: blank.items,
    setData: () => {},
    setDragImage: () => {},
    types: [],
  };
};

/** Read through a call: a target's handler may set it during the dispatch. */
const readDropEffect = (dataTransfer: ST_TouchDataTransfer) =>
  dataTransfer.dropEffect;

/** A fixed copy of `source` that takes no pointer events. */
const createGhost = (source: HTMLElement) => {
  const rect = source.getBoundingClientRect();
  const style = getComputedStyle(source);
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  clone.style.translate = '';
  clone.style.opacity = '1';
  const isCell = source instanceof HTMLTableCellElement;
  const sourceCells = isCell ? [source] : [...source.children];
  const cloneCells = isCell ? [clone] : [...clone.children];
  // Cells take their widths from the table's CSS variables, which the copy
  // outside the table does not see.
  sourceCells.forEach((cell, index) => {
    const copy = cloneCells[index] as HTMLElement | undefined;
    if (!copy) return;
    const width = `${cell.getBoundingClientRect().width}px`;
    copy.style.width = width;
    copy.style.minWidth = width;
    copy.style.maxWidth = width;
  });

  let ghost = clone;
  if (isCell || source instanceof HTMLTableRowElement) {
    const table = document.createElement('table');
    const section = document.createElement(
      source.closest('thead') ? 'thead' : 'tbody',
    );
    const row = isCell ? document.createElement('tr') : clone;
    if (isCell) row.append(clone);
    section.append(row);
    table.append(section);
    table.style.borderCollapse = 'collapse';
    ghost = table;
  }
  ghost.setAttribute(ST_TOUCH_GHOST_ATTR, '');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  Object.assign(ghost.style, {
    background: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    boxShadow: '0 8px 24px rgb(0 0 0 / 0.18)',
    boxSizing: 'border-box',
    color: style.color,
    font: style.font,
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    margin: '0',
    opacity: '0.9',
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'fixed',
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    zIndex: '2147483647',
  });
  document.body.append(ghost);
  return ghost;
};

/** Drops the next click the browser derives from the finger on `source`. */
const guardClick = (source: HTMLElement) => {
  const swallow = (event: MouseEvent) => {
    if (!event.isTrusted || !source.contains(event.target as Node)) return;
    event.preventDefault();
    event.stopPropagation();
    window.removeEventListener('click', swallow, true);
  };
  window.addEventListener('click', swallow, true);
  setTimeout(
    () => window.removeEventListener('click', swallow, true),
    CLICK_GUARD_MS,
  );
};

// The element under the finger receives the drag events a mouse drag sends,
// so every drop target keeps its own handlers.
const trackFinger = ({
  down,
  options,
  source,
}: {
  down: PointerEvent;
  options: RefObject<ST_TouchDragOptions>;
  source: HTMLElement;
}) => {
  const dataTransfer = createDataTransfer();
  const { pointerId } = down;
  let last = down;
  let x = down.clientX;
  let y = down.clientY;
  let active = false;
  let moved = false;
  let accepted = false;
  let over: Element | null = null;
  let ghost: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let frame = 0;
  let holdTimer: ReturnType<typeof setTimeout> | undefined;

  const send = ({
    relatedTarget,
    target,
    type,
  }: {
    relatedTarget?: Element | null;
    target: Element;
    type: 'dragenter' | 'dragleave' | 'dragover' | 'drop';
  }) => {
    const event = createST_TouchDragEvent({
      dataTransfer,
      relatedTarget,
      type,
      x,
      y,
    });
    target.dispatchEvent(event);
    return event;
  };

  const hitTest = () => {
    const target = document.elementFromPoint(x, y);
    if (target !== over) {
      if (target) send({ relatedTarget: over, target, type: 'dragenter' });
      if (over)
        send({ relatedTarget: target, target: over, type: 'dragleave' });
      over = target;
    }
    if (!target) {
      accepted = false;
      return;
    }
    dataTransfer.dropEffect = 'move';
    const event = send({ target, type: 'dragover' });
    accepted =
      event.defaultPrevented && readDropEffect(dataTransfer) !== 'none';
  };

  /** The scroll speed for the finger between the edges `top` and `bottom`. */
  const edgeDelta = (top: number, bottom: number) => {
    const depth = (distance: number) =>
      Math.min(1, Math.max(0, (EDGE_PX - distance) / EDGE_PX));
    return y < top + EDGE_PX
      ? -MAX_SPEED_PX * depth(y - top)
      : y > bottom - EDGE_PX
        ? MAX_SPEED_PX * depth(bottom - y)
        : 0;
  };

  /** Whether `element` scrolled by `delta`. */
  const scrollBy = (element: Element, delta: number) => {
    if (!delta) return false;
    const before = element.scrollTop;
    element.scrollTop += delta;
    return element.scrollTop !== before;
  };

  const scrollStep = () => {
    frame = 0;
    const box = active ? options.current.getScrollContainer?.() : null;
    if (!box) return;
    // The edges of the part of the box on screen.
    const rect = box.getBoundingClientRect();
    const boxDelta = edgeDelta(
      Math.max(rect.top, 0),
      Math.min(rect.bottom, window.innerHeight),
    );
    // A box that cannot scroll leaves it to the page, as a mouse drag does.
    const page = document.scrollingElement;
    const scrolled =
      scrollBy(box, boxDelta) ||
      (!!page && scrollBy(page, edgeDelta(0, window.innerHeight)));
    if (!scrolled) return;
    hitTest();
    frame = requestAnimationFrame(scrollStep);
  };

  const moveGhost = () => {
    if (ghost) ghost.style.translate = `${x - startX}px ${y - startY}px`;
  };

  const detach = () => {
    clearTimeout(holdTimer);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    ghost?.remove();
    ghost = null;
    window.removeEventListener('pointermove', handleMove, true);
    window.removeEventListener('pointerup', handleUp, true);
    window.removeEventListener('pointercancel', handleCancel, true);
    window.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('dragstart', preventDefault, true);
    window.removeEventListener('contextmenu', preventDefault, true);
  };

  const finish = (cancelled: boolean) => {
    const wasActive = active;
    active = false;
    detach();
    if (!wasActive) return;
    activeDrags -= 1;
    if (cancelled && over)
      send({ relatedTarget: null, target: over, type: 'dragleave' });
    // A finger that rests and lifts in place is a tap: its click stays.
    if (moved) guardClick(source);
    options.current.onEnd(toHandlerEvent(last, source), cancelled);
  };

  const start = () => {
    if (options.current.canStart && !options.current.canStart()) {
      return finish(true);
    }
    active = true;
    activeDrags += 1;
    startX = x;
    startY = y;
    const ghostSource = options.current.getGhostSource();
    if (ghostSource) ghost = createGhost(ghostSource);
    options.current.onStart(toHandlerEvent(last, source));
    hitTest();
  };

  function handleMove(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    last = event;
    x = event.clientX;
    y = event.clientY;
    if (!active) {
      if (Math.hypot(x - down.clientX, y - down.clientY) > HOLD_SLOP_PX) {
        finish(true);
      }
      return;
    }
    if (Math.hypot(x - startX, y - startY) > HOLD_SLOP_PX) moved = true;
    moveGhost();
    hitTest();
    if (!frame && options.current.getScrollContainer) {
      frame = requestAnimationFrame(scrollStep);
    }
  }

  function handleUp(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    last = event;
    x = event.clientX;
    y = event.clientY;
    if (active) {
      hitTest();
      if (accepted && over) send({ target: over, type: 'drop' });
    }
    finish(!accepted);
  }

  function handleCancel(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    last = event;
    finish(true);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (active && event.key === 'Escape') finish(true);
  }

  // A long press would also start the browser's own drag or its menu.
  function preventDefault(event: Event) {
    event.preventDefault();
  }

  window.addEventListener('pointermove', handleMove, true);
  window.addEventListener('pointerup', handleUp, true);
  window.addEventListener('pointercancel', handleCancel, true);
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('dragstart', preventDefault, true);
  window.addEventListener('contextmenu', preventDefault, true);

  const delay = options.current.delay ?? 0;
  if (delay > 0) holdTimer = setTimeout(start, delay);
  else start();

  return () => finish(true);
};

/**
 * Reorder by touch for one drag source: a finger on the source drags it,
 * at once or after `delay`, with a ghost copy under the finger, and ends in
 * `onEnd` as a mouse drag ends in `onDragEnd`. A drop target takes a touch
 * drop as it takes a mouse drop: by `preventDefault` on `dragover` without
 * `dropEffect` `none`. Mouse and pen pointers are left to the HTML5 drag the
 * source already has.
 */
export const useST_TouchDrag = (options: ST_TouchDragOptions) => {
  const latest = useRef(options);
  useLayoutEffect(() => {
    latest.current = options;
  });
  const cancel = useRef<(() => void) | undefined>(undefined);
  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;
    mountedSources += 1;
    if (mountedSources === 1) {
      window.addEventListener('touchmove', blockScroll, PAGE_LISTENER);
    }
    return () => {
      cancel.current?.();
      mountedSources -= 1;
      if (mountedSources === 0) {
        window.removeEventListener('touchmove', blockScroll, PAGE_LISTENER);
      }
    };
  }, [enabled]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    cancel.current?.();
    const stop = trackFinger({
      down: event.nativeEvent,
      options: latest,
      source: event.currentTarget,
    });
    cancel.current = () => {
      cancel.current = undefined;
      stop();
    };
  };

  return { onPointerDown };
};
