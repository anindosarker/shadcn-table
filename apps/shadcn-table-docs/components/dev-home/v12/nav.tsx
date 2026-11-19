'use client';

import { IntentLink } from '@/components/dev-home/shared/intent-link';
import { ThemeControls } from '@/components/theme-controls';
import { BaseSwitch } from '@/components/base-selector';
import { cn } from '@/lib/cn';
import { GitHubIcon } from '@/components/dev-home/v2/github-icon';
import { DiscordIcon } from '@/components/discord-icon';
import { GITHUB_URL } from '@/components/dev-home/v4/nav';
import { DISCORD_URL, LIBRARY_VERSION } from '@/lib/layout.shared';
import { trackOutboundClicked } from '@/lib/analytics';

const LINKS = [
  { label: 'Get Started', href: '/docs/getting-started/introduction' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
  { label: 'API', href: '/docs/api' },
] as const;

/**
 * v4's split bar: slash wordmark, mono links, then the docs site's own
 * controls on the right (GitHub, Discord, theme preset, light/dark), so this page
 * follows the same theme as the docs. `baseSwitch` adds the site-wide base
 * select before the theme pill, as in the docs bar (the 404 page, D121); the
 * home page's bar goes without it.
 */
export function Nav({ baseSwitch = false }: { baseSwitch?: boolean }) {
  // With the base select the bar runs out of room on a phone: GitHub and
  // Discord step aside below `sm` (the docs bar does the same below `md`).
  const linkClass = cn('v12-gh', baseSwitch && 'max-sm:hidden!');
  return (
    <header className="v4-nav">
      <div className="v4-shell v4-nav-row">
        {/* the wordmark, then the version linking to the GitHub releases, as in the docs bar */}
        <div className="flex min-w-0 items-center gap-2 [grid-area:brand]">
          <IntentLink href="/" className="v4-wordmark">
            <span aria-hidden="true" className="v4-wordmark-slash">
              {'//'}
            </span>
            <span>shadcn-table</span>
          </IntentLink>
          <a
            href={`${GITHUB_URL}/releases`}
            className="shrink-0 font-mono text-xs text-(--dh-ink-muted) transition-colors hover:text-(--dh-accent)"
          >
            v{LIBRARY_VERSION}
          </a>
        </div>
        <nav aria-label="Primary" className="v4-nav-links">
          {LINKS.map((l) => (
            <IntentLink key={l.label} href={l.href} className="v4-nav-link">
              {l.label}
            </IntentLink>
          ))}
        </nav>
        <div className="v4-nav-actions">
          <a
            href={GITHUB_URL}
            aria-label="GitHub"
            className={linkClass}
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
            className={linkClass}
            onClick={() =>
              trackOutboundClicked({ target: 'discord', surface: 'nav' })
            }
          >
            <DiscordIcon className="size-4" />
          </a>
          {baseSwitch && (
            <BaseSwitch className="rounded-full bg-transparent font-mono text-xs" />
          )}
          <ThemeControls />
        </div>
      </div>
    </header>
  );
}
