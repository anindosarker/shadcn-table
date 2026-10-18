import Link from 'next/link';
import { ArrowRightIcon, StarIcon } from 'lucide-react';

export const GITHUB_URL = 'https://github.com/anindosarker/shadcn-table';

const NAV_LINKS = [
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
] as const;

/** The ST mark: three header cells over a pinned column, drawn in rules. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2.75" y="2.75" width="14.5" height="14.5" rx="3" />
      <path d="M2.75 7.5h14.5M8 7.5v9.75" />
      <rect
        x="2.75"
        y="2.75"
        width="14.5"
        height="4.75"
        rx="2"
        className="v5-mark-fill"
        stroke="none"
      />
    </svg>
  );
}

export function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/** Logo left, centred link row, GitHub + Get Started right. */
export function SignalNav() {
  return (
    <header className="v5-nav">
      <nav aria-label="Main" className="v5-nav-row">
        <Link href="/dev/5" className="v5-logo" aria-label="shadcn-table home">
          <Mark className="size-5 text-(--dh-accent)" />
          <span className="whitespace-nowrap">shadcn-table</span>
        </Link>
        <ul className="v5-nav-links v5-nav-links--center">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="v5-nav-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-2">
          <a href={GITHUB_URL} className="v5-gh">
            <GithubGlyph className="size-4" />
            <span className="v5-gh-label">Star on GitHub</span>
            <StarIcon aria-hidden="true" className="v5-gh-star size-3.5" />
          </a>
          <Link href="/docs/getting-started/install" className="v5-cta-white">
            Get Started
          </Link>
        </div>
      </nav>
      <ul className="v5-nav-links v5-nav-links--below" aria-label="Sections">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="v5-nav-link">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}

const FOOTER_COLS = [
  {
    title: 'Docs',
    links: [
      { label: 'Get Started', href: '/docs/getting-started/install' },
      { label: 'API', href: '/docs/api' },
      { label: 'Guides', href: '/docs/guides' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Examples', href: '/docs/examples' },
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'All variants', href: '/dev' },
    ],
  },
] as const;

/** Statement footer: one line of intent, link columns, a wordmark set huge. */
export function SignalFooter() {
  return (
    <footer className="v5-footer">
      <div className="v5-footer-top">
        <p className="v5-footer-statement">
          Tables you own, styled like the rest of your app.
        </p>
        <div className="v5-footer-cols">
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-xs text-(--dh-ink-faint)">{col.title}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="v5-footer-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="v5-footer-meta">
        <span>MIT licensed</span>
        <span>Built on TanStack Table v8 and shadcn/ui</span>
        <Link
          href="/docs/getting-started/install"
          className="v5-footer-link inline-flex items-center gap-1"
        >
          Install
          <ArrowRightIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
      <p aria-hidden="true" className="v5-wordmark">
        shadcn-table
      </p>
    </footer>
  );
}
