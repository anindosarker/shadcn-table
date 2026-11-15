'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { LazyBlock, type BlockBody } from '@/components/lazy-block';
import { useExamplesScrollSpy } from '@/components/examples-scroll-spy';
import { registerStackScroller, replaceExamplesUrl } from '@/lib/examples-url';
import { loadExampleBlock } from '@/lib/load-example-block';

/** One row of the examples stack, in page order. */
export type StackItem =
  | { kind: 'intro'; content: ReactNode }
  | { kind: 'heading'; key: string; label: ReactNode }
  | {
      kind: 'block';
      /** Path under /docs/examples/, for example `basic`. */
      slug: string;
      /** The single example page. */
      url: string;
      title: string;
      description?: string;
      /** The server-rendered body of an eager block; the rest load on approach. */
      body?: ReactNode;
    };

/**
 * Heights until an item is measured. A block is its title, description and
 * the `min-h-[560px]` skeleton.
 */
const ESTIMATE: Record<StackItem['kind'], number> = {
  intro: 400,
  heading: 80,
  block: 720,
};

/**
 * The viewport the server and the hydration render assume, so both render
 * the same first items; the real window size replaces it after mount.
 */
const INITIAL_RECT = { width: 0, height: 900 };

/** Room for the sticky header and page bar above a scrolled-to block. */
const SCROLL_PADDING = 96;

const itemKey = (item: StackItem) =>
  item.kind === 'intro'
    ? 'intro'
    : item.kind === 'heading'
      ? item.key
      : item.slug;

/**
 * The examples stack as a window-virtualized list: only the items near the
 * viewport (overscan 2) are in the DOM, the rest keep their measured or
 * estimated space. Lazy block bodies are fetched once and kept here, so a
 * block that scrolls back in renders at once. The scroll spy, the sidebar
 * links (`scrollStackTo`) and a load with a hash all work from the
 * virtualizer's offsets, since most blocks are not in the DOM.
 */
export function ExamplesVirtualList({
  items,
  introUrl,
}: {
  items: StackItem[];
  introUrl: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  // Null until measured: the list's distance from the top of the page.
  const [scrollMargin, setScrollMargin] = useState<number | null>(null);
  const [bodies, setBodies] = useState<Record<string, BlockBody>>({});
  const started = useRef(new Set<string>());
  // Ends a running smooth scroll to the top; null when none runs.
  const stopTopScroll = useRef<(() => void) | null>(null);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: (index) => ESTIMATE[items[index].kind],
    getItemKey: (index) => itemKey(items[index]),
    overscan: 2,
    scrollMargin: scrollMargin ?? 0,
    scrollPaddingStart: SCROLL_PADDING,
    initialRect: INITIAL_RECT,
    // The default reads window.scrollY, which the server cannot know.
    initialOffset: 0,
  });
  // The same instance for the list's lifetime; the ref lets an event handler
  // set its `shouldAdjustScrollPositionOnItemSizeChange`, which 3.11 offers
  // as an instance field, not an option.
  const virtualizerRef = useRef(virtualizer);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () =>
      setScrollMargin(list.getBoundingClientRect().top + window.scrollY);
    measure();
    // Anything above the list that changes height moves it; the body's size
    // changes with it.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  const load = useCallback((slug: string) => {
    if (started.current.has(slug)) return;
    started.current.add(slug);
    loadExampleBlock(slug).then(
      (body) =>
        setBodies((prev) => ({ ...prev, [slug]: { status: 'done', body } })),
      () => setBodies((prev) => ({ ...prev, [slug]: { status: 'error' } })),
    );
  }, []);

  const urlAt = useCallback(
    (offset: number) => {
      // At the top the page shows the intro, even when a tall viewport puts
      // the spy line inside the first block. On the way up the blocks passed
      // are not written.
      if (window.scrollY <= 0 || stopTopScroll.current) return introUrl;
      const item = virtualizer.getVirtualItemForOffset(offset);
      // A heading between two blocks belongs to the block above it.
      for (let index = item?.index ?? 0; index >= 0; index--) {
        const entry = items[index];
        if (entry.kind === 'block') return `${introUrl}#${entry.slug}`;
        if (entry.kind === 'intro') break;
      }
      return introUrl;
    },
    [items, introUrl, virtualizer],
  );
  useExamplesScrollSpy(urlAt);

  /**
   * A smooth scroll to the top. The virtualizer keeps a block in place when a
   * block above the viewport changes size, with an instant `scrollTo` that
   * would cancel the smooth one; the target 0 does not depend on sizes, so
   * that correction is off until the scroll ends, reaches the top or the
   * user takes over.
   */
  const scrollToTopSmoothly = useCallback(() => {
    stopTopScroll.current?.();
    if (window.scrollY <= 0) return;
    const interrupts = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    const onScroll = () => {
      if (window.scrollY <= 0) stop();
    };
    const stop = () => {
      stopTopScroll.current = null;
      virtualizerRef.current.shouldAdjustScrollPositionOnItemSizeChange =
        undefined;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', stop);
      for (const type of interrupts) window.removeEventListener(type, stop);
    };
    stopTopScroll.current = stop;
    virtualizerRef.current.shouldAdjustScrollPositionOnItemSizeChange = () =>
      false;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', stop);
    for (const type of interrupts) {
      window.addEventListener(type, stop, { passive: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  useEffect(() => () => stopTopScroll.current?.(), []);

  const scrollTo = useCallback(
    (slug: string, { smooth = false }: { smooth?: boolean } = {}) => {
      if (!slug) {
        if (smooth) scrollToTopSmoothly();
        else window.scrollTo({ top: 0 });
        replaceExamplesUrl(introUrl);
        return true;
      }
      const index = items.findIndex(
        (entry) => entry.kind === 'block' && entry.slug === slug,
      );
      if (index < 0) return false;
      virtualizer.scrollToIndex(index, { align: 'start' });
      replaceExamplesUrl(`${introUrl}#${slug}`);
      return true;
    },
    [items, introUrl, virtualizer, scrollToTopSmoothly],
  );
  useEffect(() => registerStackScroller(scrollTo), [scrollTo]);

  // A load with a hash opens on that block, once the list's offset is known.
  const hashHandled = useRef(false);
  useEffect(() => {
    if (scrollMargin === null || hashHandled.current) return;
    hashHandled.current = true;
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (slug) scrollTo(slug);
  }, [scrollMargin, scrollTo]);

  const virtualItems = virtualizer.getVirtualItems();
  const offset = (virtualItems[0]?.start ?? 0) - (scrollMargin ?? 0);

  return (
    <div ref={listRef} style={{ height: virtualizer.getTotalSize() }}>
      {/* Items stay in normal flow under a spacer (no transform), so fixed
          and sticky elements inside the examples keep the viewport. */}
      <div style={{ paddingTop: offset }}>
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              // flow-root keeps child margins inside the measured box.
              className="flow-root"
            >
              <StackRow item={item} bodies={bodies} load={load} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StackRow({
  item,
  bodies,
  load,
}: {
  item: StackItem;
  bodies: Record<string, BlockBody>;
  load: (slug: string) => void;
}) {
  if (item.kind === 'intro') return item.content;
  if (item.kind === 'heading') {
    return (
      <p className="docs-eyebrow mt-16">
        <span aria-hidden="true">{'//'}</span> {item.label}
      </p>
    );
  }
  return (
    <section id={item.slug} className="scroll-mt-24 pt-6">
      <h2>{item.title}</h2>
      {item.description && (
        <p className="text-fd-muted-foreground">{item.description}</p>
      )}
      {item.body ?? (
        <LazyBlock
          slug={item.slug}
          body={bodies[item.slug]}
          load={load}
          url={item.url}
          title={item.title}
        />
      )}
    </section>
  );
}
