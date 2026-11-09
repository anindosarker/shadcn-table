'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { SidebarIcon } from 'lucide-react';
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { BaseSwitch } from '@/components/base-selector';
import { GitHubIcon } from '@/components/github-icon';
import { DiscordIcon } from '@/components/discord-icon';
import { cn } from '@/lib/cn';
import { DISCORD_URL, GITHUB_URL } from '@/lib/layout.shared';
import { trackOutboundClicked } from '@/lib/analytics';

/**
 * `slots.header` for the docs layout: the landing page's bar (mono
 * "// shadcn-table" wordmark, GitHub, the base select and the theme pill),
 * plus the search and sidebar triggers the docs need. The section links
 * live in the sidebar (components/sidebar-section-tabs.tsx, L7). Keeps
 * fumadocs' `#nd-subnav` id and grid area so the layout and the sticky
 * offsets still apply.
 * Styles: app/global.css ("landing look").
 */
export function SiteNav(props: ComponentProps<'header'>) {
  const { slots } = useNotebookLayout();

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
        {/* from lg: the search field in the centre, max 28rem */}
        {slots.searchTrigger && (
          <div className="hidden min-w-0 justify-center [grid-area:search] lg:flex">
            <slots.searchTrigger.full
              hideIfDisabled
              className="site-nav-search"
            />
          </div>
        )}
        <div className="site-nav-actions">
          {/* below lg: the search icon with the actions */}
          {slots.searchTrigger && (
            <slots.searchTrigger.sm
              hideIfDisabled
              className="site-nav-icon site-nav-search-sm"
            />
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
    </header>
  );
}
