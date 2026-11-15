'use client';

import { useEffect, useRef } from 'react';
import { replaceExamplesUrl } from '@/lib/examples-url';

/** The spy watches the upper 40 percent of the viewport. */
const SPY_LINE = 0.4;

/**
 * Keeps the address bar on the examples stack block in view. On every scroll
 * frame it asks `urlAt` for the url of whatever covers the line at 40 percent
 * of the viewport height (a page offset, so blocks outside the DOM count too)
 * and writes it without a history entry: `/docs/examples#<slug>` for a block,
 * `/docs/examples` above the first one. The sidebar highlight follows the hash.
 */
export function useExamplesScrollSpy(urlAt: (offset: number) => string) {
  const urlAtRef = useRef(urlAt);
  useEffect(() => {
    urlAtRef.current = urlAt;
  }, [urlAt]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const line = window.scrollY + window.innerHeight * SPY_LINE;
        replaceExamplesUrl(urlAtRef.current(line));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
}
