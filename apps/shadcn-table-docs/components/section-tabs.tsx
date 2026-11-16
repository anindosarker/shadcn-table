'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/layout.shared';
import { SidebarCollapseButton } from '@/components/sidebar-collapse-button';

/**
 * The section switcher (L7): Get Started, Examples, Guides, API as the
 * header's second row (components/site-nav.tsx), under the brand row, the
 * active section underlined on the header's bottom rule. From md the
 * sidebar collapse button leads the row, pinned while the tabs scroll: the
 * 13px start padding puts the icon's drawn edge under the brand's "//", and
 * the first tab drops its start padding so the label sits about 9px from
 * the icon; below md (sidebar drawer) the first label
 * lines up with the brand instead. The tabs scroll sideways without a
 * scrollbar when narrow. The header's height (--fd-header-height,
 * app/global.css) counts this row, so the sidebar, the TOC and the sticky
 * offsets start below it.
 */
export function SectionTabs() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 flex-1 items-stretch ps-1 pe-1 md:ps-[13px] md:pe-3">
      <div className="hidden shrink-0 items-center md:flex">
        <SidebarCollapseButton />
      </div>
      <nav
        aria-label="Sections"
        className="flex min-w-0 flex-1 items-stretch overflow-x-auto [scrollbar-width:none]"
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.url}
            href={l.url}
            data-active={isActive(l.url, pathname) || undefined}
            className="-mb-px inline-flex shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-3 py-1 font-mono md:first:ps-0 text-[11px] uppercase tracking-[0.12em] [word-spacing:-0.4em] text-fd-muted-foreground transition-colors hover:text-(--docs-accent) data-active:border-(--docs-accent) data-active:text-(--docs-accent)"
          >
            {l.text}
          </Link>
        ))}
      </nav>
    </div>
  );
}

/** Active anywhere in the link's docs section (/docs/<section>/...), so
 * "Get Started" (/docs/getting-started/introduction) lights up on every getting-started page. */
function isActive(url: string, pathname: string) {
  const section = url.split('/').slice(0, 3).join('/');
  return pathname === section || pathname.startsWith(`${section}/`);
}
