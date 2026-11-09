'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarIcon } from 'lucide-react';
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { BaseSwitch } from '@/components/base-selector';
import { GitHubIcon } from '@/components/github-icon';
import { DiscordIcon } from '@/components/discord-icon';
import { cn } from '@/lib/cn';
import { DISCORD_URL, GITHUB_URL, NAV_LINKS } from '@/lib/layout.shared';
import { trackOutboundClicked } from '@/lib/analytics';

/**
 * `slots.header` for the docs layout: the landing page's bar (mono
 * "// shadcn-table" wordmark, GitHub, the base select and the theme pill),
 * plus the search and sidebar triggers the docs need, and under it the
 * section switcher row (Docs, Examples, Guides, API; L7). Keeps fumadocs'
 * `#nd-subnav` id and grid area so the layout and the sticky offsets still
 * apply; --fd-header-height covers both rows.
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
            onClick={() =>
              trackOutboundClicked({ target: 'github', surface: 'header' })
            }
          >
            <GitHubIcon />
          </a>
          <a
            href={DISCORD_URL}
            aria-label="Discord"
            target="_blank"
            rel="noreferrer"
            className="site-nav-icon site-nav-desktop"
            onClick={() =>
              trackOutboundClicked({ target: 'discord', surface: 'header' })
            }
          >
            <DiscordIcon />
          </a>
          {/* the site-wide base (Base UI | Radix UI | React Aria) next to the theme pill */}
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
      {/* section switcher (L7): under the bar, left-aligned over the sidebar
          column, the active section underlined; scrolls sideways when narrow */}
      <nav
        aria-label="Sections"
        className="flex h-9 items-stretch gap-1 overflow-x-auto px-4 [border-top:var(--docs-rule)] [scrollbar-width:none]"
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.url}
            href={l.url}
            data-active={isActive(l.url, pathname) || undefined}
            className="inline-flex shrink-0 items-center whitespace-nowrap border-b-2 border-transparent px-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fd-muted-foreground transition-colors hover:text-(--docs-accent) data-active:border-(--docs-accent) data-active:text-(--docs-accent)"
          >
            {l.text}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/** Active anywhere in the link's docs section (/docs/<section>/...), so
 * "Docs" (/docs/getting-started/introduction) lights up on every getting-started page. */
function isActive(url: string, pathname: string) {
  const section = url.split('/').slice(0, 3).join('/');
  return pathname === section || pathname.startsWith(`${section}/`);
}
