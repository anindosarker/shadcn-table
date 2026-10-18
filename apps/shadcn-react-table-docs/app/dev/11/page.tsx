import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { AsciiDune } from '@/components/dev-home/v4/ascii-dune';
import { GITHUB_URL } from '@/components/dev-home/v5/chrome';
import { InstallTabs } from '@/components/dev-home/v5/install-tabs';
import { SignalDemo } from '@/components/dev-home/v5/signal-demo';
import { SpecSheet } from '@/components/dev-home/v8/spec-sheet';
import { ReplayFooter } from '@/components/dev-home/v11/footer';
import { ReplayNav } from '@/components/dev-home/v11/nav';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v8/v8.css';
import '@/components/dev-home/v11/v11.css';

const BUILT_ON = ['shadcn/ui', 'TanStack Table v8', 'Tailwind CSS'] as const;

/** v5's luminous ring, behind the hero. */
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

export default function Variant11Page() {
  return (
    <div data-variant="11" className="v5 v8 v11 flex flex-1 flex-col">
      <ReplayNav />

      <main className="flex flex-1 flex-col">
        {/* hero: the replay runs above the fold, beside the pitch */}
        <section className="v11-hero" aria-labelledby="v11-title">
          <AsciiDune className="v11-field" fps={8} />
          <Arc />
          <div className="v11-wide v11-hero-grid">
            <div className="v11-copy">
              <p className="v11-eyebrow">
                <span>{'//'}</span> React data grid on shadcn/ui
              </p>
              <h1 id="v11-title" className="v11-h1">
                Every grid feature, <em>already wired</em> into shadcn.
              </h1>
              <p className="v11-lede">
                Sorting, filtering, pinning and grouping on TanStack Table v8,
                installed as shadcn/ui source you own. The live table is running
                them now.
              </p>
            </div>

            <figure className="v11-demo" aria-labelledby="v11-demo-cap">
              <figcaption id="v11-demo-cap" className="v11-demo-cap">
                <span className="v11-eyebrow">
                  <span>Live</span> replay
                </span>
                <span className="v11-demo-note">
                  A real table. Click into it to take over.
                </span>
              </figcaption>
              <div className="v5-panel">
                <SignalDemo />
              </div>
            </figure>

            <div className="v11-install">
              <InstallTabs />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/docs/getting-started/install"
                  className="v5-cta-white"
                >
                  Get Started
                </Link>
                <Link href="/docs/examples" className="v5-ghost gap-1.5">
                  Browse examples
                  <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
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
          </div>
        </section>

        {/* features: one autoplay grid laid out as a bento */}
        <section className="v11-features" aria-labelledby="v11-features-title">
          <div className="v11-wide">
            <div className="v11-features-head">
              <div className="flex flex-col gap-4">
                <p className="v8-index">01 / Features</p>
                <h2 id="v11-features-title" className="v5-h2">
                  Every feature is one prop.
                </h2>
              </div>
              <p className="v5-section-lede">
                The drawings act their features out while they are on screen.
                Hover one to hold it, or open it for the guide.
              </p>
            </div>
            <AutoplayTileGrid size="lg" className="v11-bento" />
          </div>
        </section>

        {/* comparison: v8's sticky-label sheet */}
        <div className="v11-wide">
          <section
            className="v8-sheet border-t border-(--dh-rule) px-0!"
            aria-labelledby="v11-compare-title"
          >
            <div className="v8-sheet-label">
              <p className="v8-index">02 / Comparison</p>
              <h2 id="v11-compare-title" className="v5-h2">
                Same parts. More table.
              </h2>
              <p className="v5-section-lede">
                Both ship as source through the shadcn CLI. The plain Table is
                markup. SRT is that markup with the grid already built on top.
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
                <Link href="/docs/guides">feature guides</Link>. The plain
                column describes the shadcn/ui Table component and its Data
                Table guide.
              </p>
            </div>
          </section>
        </div>
      </main>

      <ReplayFooter />
    </div>
  );
}
