'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon, LayoutGridIcon } from 'lucide-react';
import { DEV_PAGES } from './pages';

/** Floating bar on every listed /dev page: back to the index, the current
 * page, and prev/next through DEV_PAGES. Hidden on pages not in the list. */
export function DevBar() {
  const pathname = usePathname();
  const index = DEV_PAGES.findIndex((p) => p.href === pathname);
  if (index === -1) return null;

  const prev = DEV_PAGES[index - 1];
  const next = DEV_PAGES[index + 1];
  const link =
    'flex size-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground';

  return (
    <nav
      aria-label="Experiments"
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit items-center gap-1 rounded-full border bg-popover/90 p-1 text-sm text-popover-foreground shadow-lg backdrop-blur"
    >
      <Link href="/dev" className={link} aria-label="All experiments">
        <LayoutGridIcon aria-hidden="true" className="size-4" />
      </Link>
      {prev ? (
        <Link
          href={prev.href}
          className={link}
          aria-label={`Previous: ${prev.name}`}
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span className={`${link} opacity-40`} aria-hidden="true">
          <ArrowLeftIcon className="size-4" />
        </span>
      )}
      <span className="px-2 font-medium">
        {DEV_PAGES[index].name}
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {index + 1}/{DEV_PAGES.length}
        </span>
      </span>
      {next ? (
        <Link
          href={next.href}
          className={link}
          aria-label={`Next: ${next.name}`}
        >
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span className={`${link} opacity-40`} aria-hidden="true">
          <ArrowRightIcon className="size-4" />
        </span>
      )}
    </nav>
  );
}
