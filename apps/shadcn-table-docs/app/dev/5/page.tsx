import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import {
  OutlineTile,
  FEATURES,
} from '@/components/dev-home/shared/outline-tiles';
import { InstallTabs } from '@/components/dev-home/v5/install-tabs';
import { SignalDemo } from '@/components/dev-home/v5/signal-demo';
import {
  GITHUB_URL,
  SignalFooter,
  SignalNav,
} from '@/components/dev-home/v5/chrome';
import '@/components/dev-home/v5/v5.css';

const BUILT_ON = ['shadcn/ui', 'TanStack Table v8', 'Tailwind CSS'] as const;

const COMPARE_COLS = [
  'shadcn-table',
  'Headless TanStack Table',
  'Commercial grids',
] as const;

const COMPARE_ROWS: readonly {
  label: string;
  cells: readonly [string, string, string];
}[] = [
  {
    label: 'License',
    cells: ['MIT', 'MIT', 'Free core, paid tiers for advanced features'],
  },
  {
    label: 'Rendering',
    cells: [
      'shadcn/ui components and Tailwind classes',
      'None. You write every cell, header and menu',
      'Their own components and theme system',
    ],
  },
  {
    label: 'How it ships',
    cells: [
      'Source copied into your repo by the shadcn CLI',
      'npm package',
      'npm package',
    ],
  },
  {
    label: 'Sorting, filtering, pinning, grouping',
    cells: [
      'Built in, switched on with one prop each',
      'Logic only. UI is up to you',
      'Built in, some features licensed',
    ],
  },
  {
    label: 'Engine',
    cells: ['TanStack Table v8', 'TanStack Table v8', 'Proprietary'],
  },
];

/** The soft luminous ring behind the hero and the CTA. */
function Arc({ flip }: { flip?: boolean }) {
  return (
    <div aria-hidden="true" className="v5-arc" data-flip={flip || undefined}>
      <div className="v5-arc-spin">
        <div className="v5-arc-glow" />
        <div className="v5-arc-ring" />
      </div>
    </div>
  );
}

export default function Variant5Page() {
  return (
    <main data-variant="5" className="v5">
      <div className="v5-frame">
        <SignalNav />

        {/* hero */}
        <section className="v5-hero" aria-labelledby="v5-title">
          <Arc />
          <div className="v5-hero-copy">
            <Link href="/docs" className="v5-pill">
              <span className="v5-pill-tag">v1</span>
              <span className="whitespace-nowrap">Read the docs</span>
              <ArrowRightIcon
                aria-hidden="true"
                className="v5-pill-arrow size-3.5"
              />
            </Link>
            <h1 id="v5-title" className="v5-h1">
              Every table feature. Your shadcn styles.
            </h1>
            <p className="v5-lede">
              A full-featured React data grid built on TanStack Table v8 and
              shadcn/ui. Sorting, filtering, pinning, grouping, virtualization
              and editing, added to your project with one CLI command.
            </p>
          </div>
          <div className="v5-hero-side">
            <InstallTabs />
            <div className="v5-built">
              <span className="text-xs text-(--dh-ink-faint)">Built on</span>
              <ul className="flex flex-wrap gap-2">
                {BUILT_ON.map((b) => (
                  <li key={b} className="v5-chip">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* full-bleed accent band with the self-driving table */}
      <section className="v5-band" aria-labelledby="v5-band-title">
        <div className="v5-band-inner">
          <div className="v5-band-head">
            <h2 id="v5-band-title" className="v5-h2 text-(--dh-accent-ink)">
              Watch it work. Then take over.
            </h2>
            <p className="v5-band-lede">
              A real table, not a recording. Each step below is one piece of
              table state.
            </p>
          </div>
          <div className="v5-panel" data-variant="5">
            <SignalDemo />
          </div>
        </div>
      </section>

      <div className="v5-frame">
        {/* features */}
        <section className="v5-section" aria-labelledby="v5-features-title">
          <div className="v5-section-head">
            <h2 id="v5-features-title" className="v5-h2">
              Twelve features, one prop each.
            </h2>
            <p className="v5-section-lede">
              Hover a drawing to see the feature move. Each card opens its docs.
            </p>
          </div>
          <ul className="v5-features">
            {FEATURES.map((f) => (
              <li key={f.id} className="min-w-0">
                <OutlineTile
                  feature={f.id}
                  size="lg"
                  href={f.docsHref}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </section>

        {/* comparison */}
        <section className="v5-section" aria-labelledby="v5-compare-title">
          <div className="v5-section-head">
            <h2 id="v5-compare-title" className="v5-h2">
              Between headless and heavy.
            </h2>
            <p className="v5-section-lede">
              TanStack gives you the engine. Commercial grids give you
              everything, in their styles. ST gives you the engine with the
              shadcn UI already wired up.
            </p>
          </div>

          <table className="v5-compare">
            <thead>
              <tr>
                <td />
                {COMPARE_COLS.map((c, i) => (
                  <th key={c} scope="col" data-ours={i === 0 || undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((cell, i) => (
                    <td
                      key={COMPARE_COLS[i]}
                      data-label={COMPARE_COLS[i]}
                      data-ours={i === 0 || undefined}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* install CTA */}
        <section className="v5-cta" aria-labelledby="v5-cta-title">
          <Arc flip />
          <div className="relative flex flex-col items-center gap-5 text-center">
            <h2 id="v5-cta-title" className="v5-h2 v5-cta-title">
              Add it in one command.
            </h2>
            <p className="v5-section-lede mx-auto">
              The CLI drops the table source next to your other shadcn
              components. Change anything.
            </p>
          </div>
          <InstallTabs className="relative mx-auto w-full max-w-2xl text-left" />
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs/getting-started/install" className="v5-cta-white">
              Get Started
            </Link>
            <a href={GITHUB_URL} className="v5-ghost">
              View on GitHub
            </a>
          </div>
        </section>

        <SignalFooter />
      </div>
    </main>
  );
}
