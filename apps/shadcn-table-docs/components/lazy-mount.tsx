'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ExampleSkeleton } from '@/components/example-skeleton';
import { cn } from '@/lib/cn';

/** How far outside the viewport a block starts mounting. */
const MOUNT_MARGIN = '800px 0px';

/**
 * Renders its children only once it comes within 800px of the viewport, and
 * keeps them mounted after that. Until then it shows an ExampleSkeleton
 * (imported here, not passed as a prop, so the server payload does not carry
 * a second copy per block) and reserves a minimum height so the scroll
 * position does not jump while blocks above mount.
 */
export function LazyMount({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: MOUNT_MARGIN },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={ref}
      data-mounted={mounted || undefined}
      className={cn(!mounted && 'min-h-[560px]', className)}
    >
      {mounted ? children : <ExampleSkeleton />}
    </div>
  );
}
