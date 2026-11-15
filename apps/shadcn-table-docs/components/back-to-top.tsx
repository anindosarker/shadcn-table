'use client';

import { useSyncExternalStore } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { scrollStackTo } from '@/lib/examples-url';

function subscribe(listener: () => void) {
  window.addEventListener('scroll', listener, { passive: true });
  window.addEventListener('resize', listener);
  return () => {
    window.removeEventListener('scroll', listener);
    window.removeEventListener('resize', listener);
  };
}

/** True once the page is scrolled past one viewport height. */
const usePastFirstScreen = () =>
  useSyncExternalStore(
    subscribe,
    () => window.scrollY > window.innerHeight,
    () => false,
  );

/**
 * Floating button at the bottom right of the examples stack, shown past the
 * first viewport height. It scrolls smoothly to the top and points the URL
 * back at `/docs/examples`.
 */
export function BackToTop() {
  if (!usePastFirstScreen()) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => scrollStackTo('', { smooth: true })}
      className="fixed right-6 bottom-6 z-40 inline-flex size-10 items-center justify-center rounded-md border bg-fd-background text-fd-muted-foreground shadow-md transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none"
    >
      <ArrowUpIcon className="size-4" />
    </button>
  );
}
