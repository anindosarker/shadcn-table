import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { GITHUB_URL, NAV_LINKS } from '@/components/dev-home/v4/nav';

/**
 * v4's split bar, pointed at /dev/9: slash wordmark, mono links, Docs and
 * Get started. Styles come from v4.css.
 */
export function Nav() {
  return (
    <header className="v4-nav">
      <div className="v4-shell v4-nav-row">
        <Link href="/dev/9" className="v4-wordmark">
          <span aria-hidden="true" className="v4-wordmark-slash">
            {'//'}
          </span>
          <span>shadcn-react-table</span>
        </Link>
        <nav aria-label="Primary" className="v4-nav-links">
          {NAV_LINKS.map((l) =>
            l.href === GITHUB_URL ? (
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
