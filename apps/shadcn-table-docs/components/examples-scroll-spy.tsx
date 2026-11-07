'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** The spy watches the upper 40 percent of the viewport. */
const SPY_LINE = 0.4;

/**
 * Next skips its `usePathname` sync when the state carries its own markers
 * (`__NA`, `_N`), treating the call as internal. Drop them and keep the rest;
 * Next copies its router tree back onto the state.
 */
function userHistoryState(): Record<string, unknown> | null {
  const state: unknown = window.history.state;
  if (!state || typeof state !== 'object') return null;
  const { __NA: _na, _N: _n, ...rest } = state as Record<string, unknown>;
  return rest;
}

/**
 * Wraps the continuous examples page. Every child marked `data-spy-url` is a
 * target; the one covering the line at 40 percent of the viewport height wins
 * and its url replaces the address bar entry. Next's App Router syncs
 * `usePathname` with `replaceState`, so the sidebar highlight and breadcrumb
 * follow. Until the first block reaches that line the page is on its intro
 * and reads as `/docs/examples`.
 */
export function ExamplesScrollSpy({
  children,
  introUrl,
}: {
  children: ReactNode;
  introUrl: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-spy-url]'),
    );
    const visible = new Set<HTMLElement>();

    const firstBlock = targets.find(
      (target) => target.dataset.spyUrl !== introUrl,
    );

    const pick = (): string | undefined => {
      const line = window.innerHeight * SPY_LINE;
      if (!firstBlock || firstBlock.getBoundingClientRect().top > line) {
        return introUrl;
      }
      const ordered = targets.filter((target) => visible.has(target));
      if (ordered.length === 0) return undefined;
      const covering = ordered.find((target) => {
        const rect = target.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      return (covering ?? ordered[ordered.length - 1]).dataset.spyUrl;
    };

    const update = () => {
      const url = pick();
      if (url && url !== window.location.pathname) {
        // Never pushState: scrolling must not add history entries.
        window.history.replaceState(userHistoryState(), '', url);
      }
    };

    // The observer keeps the set of targets in the upper band; the scroll
    // listener re-picks within that set, since the covering block can change
    // without any target entering or leaving the band.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(target);
          else visible.delete(target);
        }
        update();
      },
      { rootMargin: `0px 0px -${100 - SPY_LINE * 100}% 0px` },
    );
    for (const target of targets) observer.observe(target);

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [introUrl]);

  return <div ref={ref}>{children}</div>;
}
