import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';

export const GITHUB_URL = 'https://github.com/anindosarker/shadcn-react-table';

export const NAV_LINKS = [
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
  { label: 'GitHub', href: GITHUB_URL, external: true },
] as const;

/** The slash wordmark: an accent slash, then the name in mono. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/dev/4" className={`v4-wordmark ${className ?? ''}`}>
      <span aria-hidden="true" className="v4-wordmark-slash">
        {'//'}
      </span>
      <span>shadcn-react-table</span>
    </Link>
  );
}

/**
 * Split bar: slash wordmark left, uppercase mono links centred, an outline
 * "Docs" button and an accent "Get started" block right. Under md the links
 * drop to a second row so nothing scrolls sideways.
 */
export function Nav() {
  return (
    <header className="v4-nav">
      <div className="v4-shell v4-nav-row">
        <Wordmark />
        <nav aria-label="Primary" className="v4-nav-links">
          {NAV_LINKS.map((l) =>
            'external' in l ? (
              <a key={l.label} href={l.href} className="v4-nav-link">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className="v4-nav-link">
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <div className="v4-nav-actions">
          <Link href="/docs" className="v4-btn v4-btn-outline v4-nav-docs">
            Docs
            <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
          </Link>
          <Link
            href="/docs/getting-started/install"
            className="v4-btn v4-btn-solid"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
