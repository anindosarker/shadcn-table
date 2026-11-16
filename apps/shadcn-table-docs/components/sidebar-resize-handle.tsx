'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from 'fumadocs-ui/components/sidebar/base';

import {
  SIDEBAR_DEFAULT_WIDTH as DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH as MAX_WIDTH,
  SIDEBAR_MIN_WIDTH as MIN_WIDTH,
  SIDEBAR_WIDTH_KEY,
} from '@/lib/sidebar-state';

const STEP = 16;

/**
 * Drag handle on the sidebar's end edge. Sets --docs-sidebar-width on <html>;
 * app/global.css feeds it to fumadocs' --fd-sidebar-width, which the layout
 * grid's sidebar column reads. Arrow keys step 16px, Home/End jump to the
 * limits, double click resets. Desktop only (hidden in the drawer and while
 * the sidebar is collapsed).
 */
export function SidebarResizeHandle() {
  const { collapsed, mode } = useSidebar();
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useEffect(() => {
    // the layout's inline script already set --docs-sidebar-width
    const saved = readWidth();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only
    if (saved) setWidth(saved);
  }, []);

  function apply(next: number, save = true) {
    const w = Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
    setWidth(w);
    document.documentElement.style.setProperty(
      '--docs-sidebar-width',
      `${w}px`,
    );
    if (!save) return;
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(w));
    } catch {}
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const left = handle.closest('aside')?.getBoundingClientRect().left ?? 0;
    const root = document.documentElement;
    root.toggleAttribute('data-sidebar-resizing', true);
    const move = (ev: PointerEvent) => apply(ev.clientX - left, false);
    const up = (ev: PointerEvent) => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      root.toggleAttribute('data-sidebar-resizing', false);
      apply(ev.clientX - left);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const next = {
      ArrowLeft: width - STEP,
      ArrowRight: width + STEP,
      Home: MIN_WIDTH,
      End: MAX_WIDTH,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    apply(next);
  }

  if (mode !== 'full' || collapsed) return null;
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={width}
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={() => {
        apply(DEFAULT_WIDTH);
        try {
          localStorage.removeItem(SIDEBAR_WIDTH_KEY);
        } catch {}
      }}
      className="absolute inset-y-0 end-0 z-30 !w-2 translate-x-1/2 cursor-col-resize touch-none outline-none after:absolute after:inset-y-0 after:start-1/2 after:w-px after:-translate-x-1/2 after:transition-colors hover:after:bg-(--docs-accent) focus-visible:after:bg-(--docs-accent)"
    />
  );
}

function readWidth() {
  try {
    const w = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
    return w >= MIN_WIDTH && w <= MAX_WIDTH ? w : undefined;
  } catch {
    return undefined;
  }
}
