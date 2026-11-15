'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { ExampleSkeleton } from '@/components/example-skeleton';

/** How far outside the viewport a block starts loading. */
const LOAD_MARGIN = '800px 0px';

/** A block body fetched through `loadExampleBlock`, or its failure. */
export type BlockBody =
  | { status: 'done'; body: ReactNode }
  | { status: 'error' };

/**
 * A block of the continuous examples page whose body is not in the HTML.
 * Shows the skeleton until the block comes within 800px of the viewport,
 * then calls `load(slug)`; the owner fetches the body once and keeps it, so
 * a remount renders it at once. On failure it links to the single example
 * page instead.
 */
export function LazyBlock({
  slug,
  body,
  load,
  url,
  title,
}: {
  /** Path under /docs/examples/, for example `basic`. */
  slug: string;
  body: BlockBody | undefined;
  load: (slug: string) => void;
  /** The single example page, the fallback link on failure. */
  url: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || body) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        load(slug);
      },
      { rootMargin: LOAD_MARGIN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [body, load, slug]);

  if (body?.status === 'done') return <>{body.body}</>;
  if (body?.status === 'error') {
    return (
      <p className="text-fd-muted-foreground">
        {title} did not load here.{' '}
        <Link href={url} className="font-medium underline">
          Open the example page
        </Link>
        .
      </p>
    );
  }
  return (
    <div ref={ref}>
      <ExampleSkeleton />
    </div>
  );
}
