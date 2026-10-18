import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

const LINKS = [
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
] as const;

/** Hard-edged top bar: mono caps cells, the current page inverted. */
export function OrbitNav() {
  return (
    <header className="o1-nav">
      <Link href="/dev/1" className="o1-nav-cell o1-nav-brand">
        <span className="o1-nav-mark" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} />
          ))}
        </span>
        ST
      </Link>
      <nav aria-label="Main" className="flex min-w-0 flex-1 items-stretch">
        <Link
          href="/dev/1"
          aria-current="page"
          className="o1-nav-cell max-sm:hidden"
        >
          Home
        </Link>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="o1-nav-cell max-md:hidden"
          >
            {l.label}
          </Link>
        ))}
        <span className="flex-1 border-l border-(--dh-rule)" />
        <a
          href="https://github.com/anindosarker/shadcn-table"
          className="o1-nav-cell"
        >
          GitHub
        </a>
        <Link
          href="/docs/getting-started/install"
          className="o1-nav-cell o1-nav-cta"
        >
          <span className="max-[359px]:hidden">Get started</span>
          <span className="min-[360px]:hidden">Start</span>
          <ArrowRightIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </nav>
    </header>
  );
}
