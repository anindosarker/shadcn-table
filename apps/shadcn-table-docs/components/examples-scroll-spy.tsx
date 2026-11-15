'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { replaceExamplesUrl } from '@/lib/examples-url';

/** The spy watches the upper 40 percent of the viewport. */
const SPY_LINE = 0.4;

/**
 * Wraps the continuous examples page. Every child marked `data-spy-url` is a
 * target; the one covering the line at 40 percent of the viewport height wins
 * and its url (`/docs/examples#<slug>`) replaces the address bar entry, which
 * the sidebar highlight follows. Until the first block reaches that line the
 * page is on its intro and reads as `/docs/examples`. A load with a hash
 * scrolls to that block once the page has mounted.
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
      if (url) replaceExamplesUrl(url);
    };

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) document.getElementById(hash)?.scrollIntoView();

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
