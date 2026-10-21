'use client';

import Link from 'next/link';
import { ThemeControls } from '@/components/theme-controls';
import { GitHubIcon } from '@/components/dev-home/v2/github-icon';
import { DiscordIcon } from '@/components/discord-icon';
import { GITHUB_URL } from '@/components/dev-home/v4/nav';
import { DISCORD_URL } from '@/lib/layout.shared';
import { trackOutboundClicked } from '@/lib/analytics';

const LINKS = [
  { label: 'Docs', href: '/docs/getting-started/install' },
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
] as const;

/**
 * v4's split bar: slash wordmark, mono links, then the docs site's own
 * controls on the right (GitHub, Discord, theme preset, light/dark), so this page
 * follows the same theme as the docs.
 */
export function Nav() {
  return (
    <header className="v4-nav">
      <div className="v4-shell v4-nav-row">
        <Link href="/" className="v4-wordmark">
          <span aria-hidden="true" className="v4-wordmark-slash">
            {'//'}
          </span>
          <span>shadcn-table</span>
        </Link>
        <nav aria-label="Primary" className="v4-nav-links">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="v4-nav-link">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="v4-nav-actions">
          <a
            href={GITHUB_URL}
            aria-label="GitHub"
            className="v12-gh"
            onClick={() =>
              trackOutboundClicked({ target: 'github', surface: 'nav' })
            }
          >
            <GitHubIcon className="size-4" />
          </a>
          <a
            href={DISCORD_URL}
            aria-label="Discord"
            target="_blank"
            rel="noreferrer"
            className="v12-gh"
            onClick={() =>
              trackOutboundClicked({ target: 'discord', surface: 'nav' })
            }
          >
            <DiscordIcon className="size-4" />
          </a>
          <ThemeControls />
        </div>
      </div>
    </header>
  );
}
