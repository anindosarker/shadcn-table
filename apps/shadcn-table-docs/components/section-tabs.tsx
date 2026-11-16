'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, PREVIEW_NAV_LINKS } from '@/lib/layout.shared';

/**
 * The section switcher (L7): Get Started, Examples, Guides, API as the
 * header's second row (components/site-nav.tsx), under the brand row, the
 * active section underlined on the header's bottom rule. Left aligned with
 * the brand (the row's padding minus the links' px-3); scrolls sideways
 * without a scrollbar when narrow. The header's height
 * (--fd-header-height, app/global.css) counts this row, so the sidebar, the
 * TOC and the sticky offsets start below it.
 */
export function SectionTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="flex min-h-0 flex-1 items-stretch overflow-x-auto px-1 [scrollbar-width:none] md:px-3"
    >
      {/* preview-examples-ab: EX A and EX B after API */}
      {[...NAV_LINKS, ...PREVIEW_NAV_LINKS].map((l) => (
        <Link
          key={l.url}
          href={l.url}
          data-active={isActive(l.url, pathname) || undefined}
          className="-mb-px inline-flex shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] [word-spacing:-0.4em] text-fd-muted-foreground transition-colors hover:text-(--docs-accent) data-active:border-(--docs-accent) data-active:text-(--docs-accent)"
        >
          {l.text}
        </Link>
      ))}
    </nav>
  );
}

/** Active anywhere in the link's docs section (/docs/<section>/...), so
 * "Get Started" (/docs/getting-started/introduction) lights up on every getting-started page. */
function isActive(url: string, pathname: string) {
  const section = url.split('/').slice(0, 3).join('/');
  return pathname === section || pathname.startsWith(`${section}/`);
}
