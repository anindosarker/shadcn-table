'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarIcon } from 'lucide-react';
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { BaseSwitch } from '@/components/base-selector';
import { GitHubIcon } from '@/components/github-icon';
import { cn } from '@/lib/cn';
import { GITHUB_URL, NAV_LINKS } from '@/lib/layout.shared';

/**
 * `slots.header` for the docs layout: the landing page's bar (mono
 * "// shadcn-table" wordmark, mono caps links, GitHub, the base switch and
 * the theme pill), plus the search and sidebar triggers the docs need. Keeps fumadocs'
 * `#nd-subnav` id and grid area so the layout and the sticky offsets still
 * apply. Below lg the links wrap to a second row, as on the landing page.
 * Styles: app/global.css ("landing look").
 */
export function SiteNav(props: ComponentProps<'header'>) {
  const { slots } = useNotebookLayout();
  const pathname = usePathname();

  return (
    <header
      id="nd-subnav"
      {...props}
      className={cn('site-nav [grid-area:header]', props.className)}
    >
      <div className="site-nav-row">
        <Link href="/" className="site-nav-brand">
          <span aria-hidden="true" className="site-nav-slash">
            {'//'}
          </span>
          <span>shadcn-table</span>
        </Link>
        <nav aria-label="Primary" className="site-nav-links">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.url}
              href={l.url}
              data-active={isActive(l.url, pathname) || undefined}
              className="site-nav-link"
            >
              {l.text}
            </Link>
          ))}
        </nav>
        <div className="site-nav-actions">
          {slots.searchTrigger && (
            <>
              <slots.searchTrigger.full
                hideIfDisabled
                className="site-nav-search"
              />
              <slots.searchTrigger.sm
                hideIfDisabled
                className="site-nav-icon site-nav-search-sm"
              />
            </>
          )}
          <a
            href={GITHUB_URL}
            aria-label="GitHub"
            className="site-nav-icon site-nav-desktop"
          >
            <GitHubIcon />
          </a>
          {/* the site-wide base (Radix | Base UI) next to the theme pill */}
          <div className="site-nav-desktop">
            <BaseSwitch />
          </div>
          {slots.themeSwitch && (
            <div className="site-nav-desktop">
              <slots.themeSwitch />
            </div>
          )}
          {slots.sidebar && (
            <slots.sidebar.trigger
              aria-label="Open sidebar"
              className="site-nav-icon site-nav-mobile"
            >
              <SidebarIcon />
            </slots.sidebar.trigger>
          )}
        </div>
      </div>
    </header>
  );
}

/** Active anywhere in the link's docs section (/docs/<section>/...), so
 * "Docs" (/docs/getting-started/install) lights up on every getting-started page. */
function isActive(url: string, pathname: string) {
  const section = url.split('/').slice(0, 3).join('/');
  return pathname === section || pathname.startsWith(`${section}/`);
}
