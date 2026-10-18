import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRightIcon, CheckIcon, MinusIcon } from 'lucide-react';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { OutlineTileGrid } from '@/components/dev-home/shared/outline-tiles';
import { cn } from '@/lib/cn';
import { GITHUB_URL, NAV_LINKS } from './links';
import { Showcase } from './showcase';
import { Wordmark } from './nav';
import { GitHubIcon } from './github-icon';

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

function PrimaryLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="v2-focus v2-press inline-flex h-11 items-center gap-2 rounded-full bg-(--dh-accent) px-5 text-sm font-semibold whitespace-nowrap text-(--dh-accent-ink)"
    >
      {children}
      <ArrowRightIcon aria-hidden="true" className="v2-arrow size-4" />
    </Link>
  );
}

function SectionHead({
  title,
  lede,
  className,
}: {
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex max-w-2xl flex-col gap-3', className)}>
      <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl">
        {title}
      </h2>
      {lede ? (
        <p className="text-base leading-relaxed text-pretty text-(--dh-ink-muted)">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/** Tiny highlighter: keywords, strings and Capitalised identifiers. */
const TOKEN =
  /('[^']*'|\b(?:const|return|import|from|type)\b|<\/?[A-Z][\w.]*|\b[A-Z]\w*\b)/g;

function Code({ children }: { children: string }) {
  const parts = children.split(TOKEN);
  return (
    <pre className="v2-code min-w-0 overflow-x-auto px-4 py-3.5 text-[12.5px] leading-[1.7] [scrollbar-width:thin]">
      <code>
        {parts.map((p, i) => {
          if (i % 2 === 0) return p;
          const cls = p.startsWith("'") ? 's' : /^[a-z]/.test(p) ? 'k' : 't';
          return (
            <span key={i} className={cls}>
              {p}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/* hero + showcase                                                     */
/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <section aria-labelledby="v2-hero-title" className="px-3 pt-3 sm:px-6">
      <div className="v2-panel mx-auto w-full max-w-7xl">
        <div aria-hidden="true" className="v2-halftone">
          <span className="v2-ht v2-ht-fine" />
          <span className="v2-ht v2-ht-mid" />
          <span className="v2-ht v2-ht-heavy" />
          <span className="v2-ht v2-ht-shimmer" />
        </div>

        <div className="relative flex flex-col gap-7 px-5 pt-14 pb-60 sm:px-10 sm:pt-20 md:pb-56 lg:px-14 lg:pt-24">
          <p className="v2-kicker text-xs sm:text-[13px]">
            [built on shadcn/ui + TanStack Table v8]
          </p>
          <h1
            id="v2-hero-title"
            className="v2-headline max-w-[13ch] text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            Every table feature. Your components.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-pretty text-(--dh-ink-muted) sm:text-lg">
            A full React data grid that installs as shadcn/ui source, straight
            into your repo.
          </p>
          <div className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryLink href="/docs/getting-started/install">
              Get started
            </PrimaryLink>
            <InstallCommand className="min-w-0 flex-1 bg-(--dh-paper)" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-48 w-full max-w-7xl px-2 sm:px-6 md:-mt-40 lg:px-10">
        <Showcase />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* features                                                            */
/* ------------------------------------------------------------------ */

export function Features() {
  return (
    <section
      aria-labelledby="v2-features-title"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-10"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHead
          title={<span id="v2-features-title">Each feature is one prop.</span>}
          lede="Sorting, filtering, pinning, grouping, editing and the rest ship turned on or one flag away. Hover a drawing to see it work."
        />
        <Link
          href="/docs/guides"
          className="v2-focus inline-flex shrink-0 items-center gap-1.5 self-start rounded-md text-sm whitespace-nowrap text-(--dh-ink-muted) hover:text-(--dh-ink) md:self-auto"
        >
          All guides
          <ArrowRightIcon aria-hidden="true" className="v2-arrow size-4" />
        </Link>
      </div>
      <OutlineTileGrid size="md" tileClassName="h-full" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* how it works                                                        */
/* ------------------------------------------------------------------ */

const STEPS: { title: string; body: string; code: string }[] = [
  {
    title: 'Add it with the shadcn CLI',
    body: 'The table lands in components/ui as source you can read and edit.',
    code: 'pnpm dlx shadcn@latest add \\\n  anindosarker/shadcn-table/shadcn-table',
  },
  {
    title: 'Define your columns',
    body: 'Plain TanStack column defs. Dot paths reach nested data.',
    code: `const columns = useMemo<ST_ColumnDef<Person>[]>(
  () => [
    { accessorKey: 'name.firstName', header: 'First Name' },
    { accessorKey: 'city', header: 'City' },
  ],
  [],
);`,
  },
  {
    title: 'Render the table',
    body: 'One hook, one component. Turn features on as props.',
    code: `const table = useShadcnTable({ columns, data });

return <ShadcnTable table={table} />;`,
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="v2-how-title"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-10"
    >
      <SectionHead
        title={<span id="v2-how-title">Three steps to a working grid.</span>}
        lede="The same calls as the basic example in the docs."
      />
      <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-(--dh-rule) bg-(--dh-paper-2)"
          >
            <div className="flex flex-col gap-2 p-5">
              <span className="font-mono text-xs text-(--dh-accent)">
                0{i + 1}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--dh-ink-muted)">
                {s.body}
              </p>
            </div>
            <div className="mt-auto min-w-0 border-t border-(--dh-rule) bg-(--dh-paper)">
              <Code>{s.code}</Code>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* comparison                                                          */
/* ------------------------------------------------------------------ */

type Cell = { text: string; yes?: boolean };

const COLUMNS = ['Renders with', 'Styling', 'License', 'Code lives in'];

const ROWS: { name: string; href?: string; ours?: boolean; cells: Cell[] }[] = [
  {
    name: 'shadcn-table',
    ours: true,
    cells: [
      { text: 'shadcn/ui', yes: true },
      { text: 'Tailwind CSS', yes: true },
      { text: 'MIT', yes: true },
      { text: 'Your repo', yes: true },
    ],
  },
  {
    name: 'TanStack Table',
    href: 'https://tanstack.com/table',
    cells: [
      { text: 'Nothing, headless' },
      { text: 'Bring your own' },
      { text: 'MIT', yes: true },
      { text: 'npm package' },
    ],
  },
  {
    name: 'Material React Table',
    href: 'https://www.material-react-table.com',
    cells: [
      { text: 'Material UI' },
      { text: 'MUI theme' },
      { text: 'MIT', yes: true },
      { text: 'npm package' },
    ],
  },
  {
    name: 'Mantine React Table',
    href: 'https://www.mantine-react-table.com',
    cells: [
      { text: 'Mantine' },
      { text: 'Mantine theme' },
      { text: 'MIT', yes: true },
      { text: 'npm package' },
    ],
  },
  {
    name: 'AG Grid',
    href: 'https://www.ag-grid.com/license-pricing',
    cells: [
      { text: 'Its own grid' },
      { text: 'AG Grid themes' },
      { text: 'MIT or paid' },
      { text: 'npm package' },
    ],
  },
];

function Mark({ yes }: { yes?: boolean }) {
  return yes ? (
    <CheckIcon
      aria-hidden="true"
      className="size-3.5 shrink-0 text-(--dh-accent)"
    />
  ) : (
    <MinusIcon
      aria-hidden="true"
      className="size-3.5 shrink-0 text-(--dh-ink-faint)"
    />
  );
}

function LibName({ row }: { row: (typeof ROWS)[number] }) {
  return row.href ? (
    <a
      href={row.href}
      className="v2-focus rounded-sm whitespace-nowrap hover:underline hover:underline-offset-4"
    >
      {row.name}
    </a>
  ) : (
    <span className="whitespace-nowrap text-(--dh-accent)">{row.name}</span>
  );
}

export function Comparison() {
  return (
    <section
      aria-labelledby="v2-compare-title"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-10"
    >
      <SectionHead
        title={<span id="v2-compare-title">The grid, minus the lock-in.</span>}
        lede="The same TanStack Table v8 core and feature set as Material React Table, rendered with the components you already use."
      />

      {/* wide screens: a real table */}
      <div className="hidden overflow-hidden rounded-2xl border border-(--dh-rule) md:block">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-(--dh-rule) bg-(--dh-paper-2) text-left">
              <th scope="col" className="w-[26%] px-5 py-3 font-medium">
                <span className="sr-only">Library</span>
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-5 py-3 text-xs font-medium tracking-wide text-(--dh-ink-faint) uppercase"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r.name}
                className={cn(
                  'border-b border-(--dh-rule) last:border-b-0',
                  r.ours && 'bg-(--dh-accent-faint)',
                )}
              >
                <th scope="row" className="px-5 py-4 text-left font-semibold">
                  <LibName row={r} />
                </th>
                {r.cells.map((c, i) => (
                  <td
                    key={COLUMNS[i]}
                    className={cn(
                      'px-5 py-4',
                      c.yes ? 'text-(--dh-ink)' : 'text-(--dh-ink-muted)',
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Mark yes={c.yes} />
                      {c.text}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* phones: one card per library */}
      <ul className="grid grid-cols-1 gap-3 md:hidden">
        {ROWS.map((r) => (
          <li
            key={r.name}
            className={cn(
              'rounded-2xl border border-(--dh-rule) p-4',
              r.ours ? 'bg-(--dh-accent-faint)' : 'bg-(--dh-paper-2)',
            )}
          >
            <p className="font-semibold">
              <LibName row={r} />
            </p>
            <dl className="mt-3 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
              {r.cells.map((c, i) => (
                <div key={COLUMNS[i]} className="contents">
                  <dt className="text-(--dh-ink-faint)">{COLUMNS[i]}</dt>
                  <dd
                    className={cn(
                      'flex items-center gap-2',
                      c.yes ? 'text-(--dh-ink)' : 'text-(--dh-ink-muted)',
                    )}
                  >
                    <Mark yes={c.yes} />
                    {c.text}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

export function InstallCta() {
  return (
    <section aria-labelledby="v2-cta-title" className="px-3 sm:px-6">
      <div className="v2-panel mx-auto w-full max-w-7xl overflow-hidden">
        <div aria-hidden="true" className="v2-halftone v2-halftone-cta">
          <span className="v2-ht v2-ht-fine" />
          <span className="v2-ht v2-ht-mid" />
          <span className="v2-ht v2-ht-heavy" />
          <span className="v2-ht v2-ht-shimmer" />
        </div>
        <div className="relative flex flex-col gap-6 px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
          <h2
            id="v2-cta-title"
            className="v2-headline max-w-[14ch] text-4xl sm:text-5xl lg:text-6xl"
          >
            Put it on your bench.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-(--dh-ink-muted)">
            One command adds the table and its parts. MIT licensed.
          </p>
          <div className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryLink href="/docs/getting-started/install">
              Read the install guide
            </PrimaryLink>
            <Link
              href="/docs/examples"
              className="v2-focus v2-press inline-flex h-11 items-center justify-center rounded-full border border-(--dh-rule-strong) bg-(--dh-paper) px-5 text-sm font-medium whitespace-nowrap hover:bg-(--dh-paper-3)"
            >
              Browse examples
            </Link>
          </div>
          <InstallCommand className="max-w-2xl bg-(--dh-paper)" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* footer                                                              */
/* ------------------------------------------------------------------ */

const FOOTER_GROUPS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  { title: 'Docs', links: [...NAV_LINKS] },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'Issues', href: `${GITHUB_URL}/issues` },
      { label: 'TanStack Table', href: 'https://tanstack.com/table' },
      { label: 'shadcn/ui', href: 'https://ui.shadcn.com' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
      <div className="v2-dotrule" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="v2-focus self-start rounded-lg">
            <Wordmark />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-(--dh-ink-muted)">
            A port of Material React Table to shadcn/ui. Built on TanStack Table
            v8.
          </p>
          <a
            href={GITHUB_URL}
            className="v2-focus inline-flex items-center gap-2 self-start rounded-md text-sm whitespace-nowrap text-(--dh-ink-muted) hover:text-(--dh-ink)"
          >
            <GitHubIcon className="size-4" />
            anindosarker/shadcn-table
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-6">
          {FOOTER_GROUPS.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <h2 className="font-mono text-xs text-(--dh-ink-faint)">
                [{g.title.toLowerCase()}]
              </h2>
              <ul className="flex flex-col gap-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="v2-focus rounded-sm text-sm whitespace-nowrap text-(--dh-ink-muted) hover:text-(--dh-ink)"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-(--dh-rule) pt-5 text-xs text-(--dh-ink-faint) sm:flex-row sm:items-center sm:justify-between">
        <p>MIT licensed.</p>
        <a
          href="#top"
          className="v2-focus self-start rounded-sm whitespace-nowrap hover:text-(--dh-ink) sm:self-auto"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
