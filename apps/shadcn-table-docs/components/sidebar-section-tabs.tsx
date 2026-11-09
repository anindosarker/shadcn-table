'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/layout.shared';

/**
 * The section switcher (L7): Docs, Examples, Guides, API at the top of the
 * sidebar (the `sidebar.banner` slot, above the section heading), the active
 * section underlined. One line; scrolls sideways when narrow.
 */
export function SidebarSectionTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="flex h-9 shrink-0 items-stretch overflow-x-auto [border-bottom:var(--docs-rule)] [scrollbar-width:none]"
    >
      {NAV_LINKS.map((l) => (
        <Link
          key={l.url}
          href={l.url}
          data-active={isActive(l.url, pathname) || undefined}
          className="-mb-px inline-flex shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fd-muted-foreground transition-colors hover:text-(--docs-accent) data-active:border-(--docs-accent) data-active:text-(--docs-accent)"
        >
          {l.text}
        </Link>
      ))}
    </nav>
  );
}

/** Active anywhere in the link's docs section (/docs/<section>/...), so
 * "Docs" (/docs/getting-started/introduction) lights up on every getting-started page. */
function isActive(url: string, pathname: string) {
  const section = url.split('/').slice(0, 3).join('/');
  return pathname === section || pathname.startsWith(`${section}/`);
}
