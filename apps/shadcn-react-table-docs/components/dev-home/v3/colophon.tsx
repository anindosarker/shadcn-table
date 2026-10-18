import Link from 'next/link';
import { Band } from './band';
import { GET_STARTED_HREF, SpecMark } from './spec-nav';

const DOCS = [
  { label: 'Get started', href: GET_STARTED_HREF },
  { label: 'API reference', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
];

const TITLE_BLOCK: [key: string, value: string][] = [
  ['Title', 'shadcn-react-table'],
  ['Core', 'TanStack Table v8'],
  ['Renders with', 'shadcn/ui'],
  ['Styling', 'Tailwind CSS'],
  ['Port of', 'material-react-table'],
  ['License', 'MIT'],
];

const linkClass =
  'whitespace-nowrap text-sm text-(--dh-ink-muted) underline-offset-4 outline-2 outline-offset-2 outline-transparent hover:text-(--dh-ink) hover:underline focus-visible:outline-(--dh-focus)';

/** Footer as a drawing's title block: dense key / value cells. */
export function Colophon() {
  return (
    <Band as="footer">
      <div className="v3-grid v3-grid-4">
        <div className="v3-cell flex flex-col gap-4 p-5 sm:p-6">
          <SpecMark className="size-7 text-(--dh-accent)" />
          <p className="text-sm leading-relaxed text-pretty text-(--dh-ink-muted)">
            A full-featured React data grid on shadcn/ui and TanStack Table v8.
            The components land in your project, so you own them.
          </p>
        </div>

        <dl className="v3-cell grid grid-cols-2 content-start gap-x-4 gap-y-4 p-5 sm:p-6">
          {TITLE_BLOCK.map(([k, v]) => (
            <div key={k} className="flex min-w-0 flex-col gap-1">
              <dt className="v3-label">{k}</dt>
              <dd className="text-sm leading-snug [overflow-wrap:anywhere] text-(--dh-ink)">
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <nav
          aria-label="Docs"
          className="v3-cell flex flex-col gap-3 p-5 sm:p-6"
        >
          <p className="v3-label">Docs</p>
          <ul className="flex flex-col gap-2">
            {DOCS.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className={linkClass}>
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="v3-cell flex flex-col gap-3 p-5 sm:p-6">
          <p className="v3-label">Source</p>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="https://github.com/anindosarker/shadcn-react-table"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                GitHub repository
              </a>
            </li>
            <li>
              <a
                href="https://tanstack.com/table"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                TanStack Table
              </a>
            </li>
            <li>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                shadcn/ui
              </a>
            </li>
          </ul>
        </div>
      </div>

      <Band as="div">
        <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="v3-label">Sheet 3 of 5 / Spec sheet</p>
          <Link href="/dev" className={linkClass}>
            All variants
          </Link>
        </div>
      </Band>
    </Band>
  );
}
