'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** The spy watches the upper 40 percent of the viewport. */
const SPY_LINE = 0.4;

/**
 * Wraps the continuous examples page. Every child marked `data-spy-url` is a
 * target; the one covering the line at 40 percent of the viewport height wins
 * and its url replaces the address bar entry. Next's App Router syncs
 * `usePathname` with `replaceState`, so the sidebar highlight and breadcrumb
 * follow. The intro wins whenever any part of it is in the upper band.
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

    const pick = (): string | undefined => {
      const ordered = targets.filter((target) => visible.has(target));
      if (ordered.length === 0) return undefined;
      const intro = ordered.find(
        (target) => target.dataset.spyUrl === introUrl,
      );
      if (intro) return introUrl;
      const line = window.innerHeight * SPY_LINE;
      const covering = ordered.find((target) => {
        const rect = target.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      return (covering ?? ordered[ordered.length - 1]).dataset.spyUrl;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(target);
          else visible.delete(target);
        }
        const url = pick();
        if (url && url !== window.location.pathname) {
          // Never pushState: scrolling must not add history entries.
          window.history.replaceState(window.history.state, '', url);
        }
      },
      { rootMargin: `0px 0px -${100 - SPY_LINE * 100}% 0px` },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [introUrl]);

  return <div ref={ref}>{children}</div>;
}
