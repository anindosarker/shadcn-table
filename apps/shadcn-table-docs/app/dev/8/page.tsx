import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { InstallTabs } from '@/components/dev-home/v5/install-tabs';
import { SignalDemo } from '@/components/dev-home/v5/signal-demo';
import {
  GITHUB_URL,
  SignalFooter,
  SignalNav,
} from '@/components/dev-home/v5/chrome';
import { SpecSheet } from '@/components/dev-home/v8/spec-sheet';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v8/v8.css';

const BUILT_ON = ['shadcn/ui', 'TanStack Table v8', 'Tailwind CSS'] as const;

/** v5's luminous ring, reused behind the hero. */
function Arc() {
  return (
    <div aria-hidden="true" className="v5-arc">
      <div className="v5-arc-spin">
        <div className="v5-arc-glow" />
        <div className="v5-arc-ring" />
      </div>
    </div>
  );
}

export default function Variant8Page() {
  return (
    <div data-variant="8" className="v5 v8">
      <div className="v5-frame">
        <SignalNav />

        {/* hero: editorial headline, then lede and install side by side */}
        <section className="v8-hero" aria-labelledby="v8-title">
          <Arc />
          <div className="v8-kicker">
            <Link href="/docs" className="v5-pill">
              <span className="v5-pill-tag">v1</span>
              <span className="whitespace-nowrap">Read the docs</span>
              <ArrowRightIcon
                aria-hidden="true"
                className="v5-pill-arrow size-3.5"
              />
            </Link>
          </div>
          <h1 id="v8-title" className="v8-h1">
            The shadcn table, with the <em>whole grid</em> wired in.
          </h1>
          <div className="v8-hero-row">
            <div className="flex flex-col gap-6">
              <p className="v8-lede">
                shadcn-table is a React data grid on TanStack Table v8 and
                shadcn/ui. Sorting, filtering, pinning, grouping, editing and
                virtualization are table options, in source you own.
              </p>
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
            <InstallTabs />
          </div>
        </section>
      </div>

      {/* signal band: the self-driving demo, nearly edge to edge */}
      <section className="v8-band" aria-labelledby="v8-band-title">
        <div className="v8-band-inner">
          <div className="v8-band-head">
            <h2 id="v8-band-title" className="v8-band-title">
              Watch it work. Then take over.
            </h2>
            <p className="v8-band-note">
              A real table, not a recording. Each step is one piece of table
              state.
            </p>
          </div>
          <div className="v5-panel" data-variant="8">
            <SignalDemo />
          </div>
        </div>
      </section>

      <div className="v5-frame">
        {/* sheet 01: features */}
        <section className="v8-sheet" aria-labelledby="v8-features-title">
          <div className="v8-sheet-label">
            <p className="v8-index">01 / Features</p>
            <h2 id="v8-features-title" className="v5-h2">
              Every feature is one prop.
            </h2>
            <p className="v5-section-lede">
              Each drawing acts out a feature as it scrolls into view. Hover one
              to replay it. Turn it on in your table with a single option.
            </p>
            <Link
              href="/docs/guides"
              className="v5-ghost mt-2 gap-1.5 self-start"
            >
              All feature guides
              <ArrowRightIcon aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <div className="v8-sheet-body">
            <AutoplayTileGrid size="lg" className="lg:grid-cols-2" />
          </div>
        </section>

        {/* sheet 02: comparison */}
        <section className="v8-sheet" aria-labelledby="v8-compare-title">
          <div className="v8-sheet-label">
            <p className="v8-index">02 / Comparison</p>
            <h2 id="v8-compare-title" className="v5-h2">
              Same parts. More table.
            </h2>
            <p className="v5-section-lede">
              Both ship as source through the shadcn CLI. The plain Table is
              markup. ST is that markup with the grid already built on top.
            </p>
            <div className="v8-actions">
              <Link
                href="/docs/getting-started/install"
                className="v5-cta-white"
              >
                Get Started
              </Link>
              <a href={GITHUB_URL} className="v5-ghost">
                View on GitHub
              </a>
            </div>
          </div>
          <div className="v8-sheet-body">
            <SpecSheet />
            <p className="v8-spec-note">
              Option names are from the{' '}
              <Link href="/docs/guides">feature guides</Link>. The plain column
              describes the shadcn/ui Table component and its Data Table guide.
            </p>
          </div>
        </section>

        <SignalFooter />
      </div>
    </div>
  );
}
