import Link from 'next/link';
import { AsciiDune } from '@/components/dev-home/v4/ascii-dune';
import { GITHUB_URL } from '@/components/dev-home/v4/nav';

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
      {
        label: 'Material React Table',
        href: 'https://www.material-react-table.com',
      },
    ],
  },
] as const;

/**
 * v4's ledge footer with the wordmark pointed at /dev/7: a low dune off the
 * footer rule, then mono link columns beside the wordmark and licence line.
 */
export function Footer() {
  return (
    <footer className="v4-footer">
      <AsciiDune fps={6} className="v4-footer-dune" />
      <div className="v4-shell v4-footer-grid">
        <div className="v4-footer-brand">
          <Link href="/dev/7" className="v4-wordmark">
            <span aria-hidden="true" className="v4-wordmark-slash">
              {'//'}
            </span>
            <span>shadcn-table</span>
          </Link>
          <p>
            MIT licensed. Built on TanStack Table v8 and shadcn/ui. A port of
            Material React Table.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.head} aria-label={col.head} className="v4-footer-col">
            <h2>{col.head}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('http') ? (
                    <a href={l.href} className="v4-footer-link">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="v4-footer-link">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="v4-shell v4-footer-base">
        <span>└── end of table</span>
        <Link href="/dev" className="v4-footer-link">
          All variants
        </Link>
      </div>
    </footer>
  );
}
