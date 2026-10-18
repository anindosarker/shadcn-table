import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';

const CELLS = [
  { label: 'Get started', href: '/docs/getting-started/install' },
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
  {
    label: 'GitHub',
    href: 'https://github.com/anindosarker/shadcn-react-table',
    external: true,
  },
] as const;

/** Footer as a hard grid of link cells over a single mono base line. */
export function OrbitFooter() {
  return (
    <footer className="o1-foot">
      <ul className="o1-foot-grid">
        {CELLS.map((c) => (
          <li key={c.label}>
            {'external' in c ? (
              <a href={c.href}>
                {c.label}
                <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
              </a>
            ) : (
              <Link href={c.href}>
                {c.label}
                <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div className="o1-foot-base">
        <span>Shadcn React Table · MIT licence</span>
        <span>Built on TanStack Table v8 and shadcn/ui</span>
      </div>
    </footer>
  );
}
