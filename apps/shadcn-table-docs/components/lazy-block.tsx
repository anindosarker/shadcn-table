'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ExampleSkeleton } from '@/components/example-skeleton';
import { loadExampleBlock } from '@/lib/load-example-block';

/** How far outside the viewport a block starts loading. */
const LOAD_MARGIN = '800px 0px';

type State =
  | { status: 'idle' }
  | { status: 'done'; body: ReactNode }
  | { status: 'error' };

/**
 * A block of the continuous examples page whose body is not in the HTML.
 * Shows the skeleton until the block comes within 800px of the viewport,
 * then asks the server for the body once (`loadExampleBlock`) and keeps it.
 * On failure it links to the single example page instead.
 */
export function LazyBlock({
  slug,
  url,
  title,
}: {
  /** Path under /docs/examples/, for example `basic`. */
  slug: string;
  /** The single example page, the fallback link on failure. */
  url: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    const element = ref.current;
    if (!element || started.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (started.current) return;
        started.current = true;
        loadExampleBlock(slug).then(
          (body) => setState({ status: 'done', body }),
          () => setState({ status: 'error' }),
        );
      },
      { rootMargin: LOAD_MARGIN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [slug]);

  if (state.status === 'done') return <>{state.body}</>;
  if (state.status === 'error') {
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
