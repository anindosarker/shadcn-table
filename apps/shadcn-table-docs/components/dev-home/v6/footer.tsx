import Link from 'next/link';
import { Band } from '@/components/dev-home/v3/band';
import { GET_STARTED_HREF, SpecMark } from '@/components/dev-home/v3/spec-nav';

const LINKS = [
  { label: 'Get started', href: GET_STARTED_HREF },
  { label: 'API reference', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
];

const SOURCES = [
  {
    label: 'GitHub repository',
    href: 'https://github.com/anindosarker/shadcn-table',
  },
  { label: 'TanStack Table', href: 'https://tanstack.com/table' },
  { label: 'shadcn/ui', href: 'https://ui.shadcn.com' },
];

const linkClass =
  'text-sm text-(--dh-ink-muted) outline-2 outline-offset-2 outline-transparent hover:text-(--dh-ink) focus-visible:outline-(--dh-focus)';

/** Title block: what this is, where the docs are, where the source is. */
export function BlueprintFooter() {
  return (
    <Band as="footer">
      <div className="v3-grid v3-grid-3">
        <div className="v3-cell flex flex-col gap-4 p-5 sm:p-6">
          <SpecMark className="size-7 text-(--dh-accent)" />
          <p className="text-sm leading-relaxed text-pretty text-(--dh-ink-muted)">
            A full-featured React data grid on shadcn/ui and TanStack Table v8.
            MIT licensed, and the source lands in your project.
          </p>
        </div>
        <nav
          aria-label="Docs"
          className="v3-cell flex flex-col gap-3 p-5 sm:p-6"
        >
          <p className="v3-label">Docs</p>
          <ul className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="v3-cell flex flex-col gap-3 p-5 sm:p-6">
          <p className="v3-label">Source</p>
          <ul className="flex flex-col gap-2">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Band as="div">
        <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="v3-label">Sheet 6 / Blueprint replay</p>
          <Link href="/dev" className={linkClass}>
            All variants
          </Link>
        </div>
      </Band>
    </Band>
  );
}
