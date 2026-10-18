import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AsciiDune } from '@/components/dev-home/v4/ascii-dune';
import { GITHUB_URL, Mark } from '@/components/dev-home/v5/chrome';

const COLUMNS = [
  {
    head: 'Docs',
    links: [
      { label: 'Get started', href: '/docs/getting-started/install' },
      { label: 'API', href: '/docs/api' },
      { label: 'Guides', href: '/docs/guides' },
      { label: 'Examples', href: '/docs/examples' },
    ],
  },
  {
    head: 'Source',
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'TanStack Table', href: 'https://tanstack.com/table' },
      { label: 'shadcn/ui', href: 'https://ui.shadcn.com' },
      { label: 'All variants', href: '/dev' },
    ],
  },
] as const;

/**
 * A low dune settling onto the footer rule, then the statement, mono-caps
 * link columns and the licence line.
 */
export function ReplayFooter() {
  return (
    <footer className="v11-footer">
      <AsciiDune flip fps={6} className="v11-footer-dune" />
      <div className="v11-wide v11-footer-grid">
        <div className="flex min-w-0 flex-col gap-4">
          <Link
            href="/dev/11"
            className="v5-logo self-start"
            aria-label="shadcn-react-table home"
          >
            <Mark className="size-5 text-(--dh-accent)" />
            <span className="whitespace-nowrap">shadcn-react-table</span>
          </Link>
          <p className="v5-footer-statement">
            Tables you own, styled like the rest of your app.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav
            key={col.head}
            aria-label={col.head}
            className="flex flex-col gap-3"
          >
            <h2 className="v11-eyebrow">{col.head}</h2>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('http') ? (
                    <a href={l.href} className="v5-footer-link">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="v5-footer-link">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="v11-wide v11-footer-base">
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
    </footer>
  );
}
