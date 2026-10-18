import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { AsciiDune } from '@/components/dev-home/v4/ascii-dune';
import { archivo } from '@/components/dev-home/v4/font';
import { Starfield } from '@/components/dev-home/v4/starfield';
import { SignalDemo } from '@/components/dev-home/v5/signal-demo';
import { CodeStrip } from '@/components/dev-home/v7/code-strip';
import { RiseFigure } from '@/components/dev-home/v7/rise-figure';
import { Footer } from '@/components/dev-home/v9/footer';
import { Nav } from '@/components/dev-home/v9/nav';
import { SpecTable } from '@/components/dev-home/v9/spec-table';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v7/v7.css';
import '@/components/dev-home/v9/v9.css';

export default function Variant9Page() {
  return (
    <div data-variant="9" className={`v4-root v9 ${archivo.variable}`}>
      <Starfield />
      <Nav />

      <main className="flex flex-1 flex-col">
        {/* hero and band share one dune field */}
        <div className="v9-zone">
          <AsciiDune className="v9-field" fps={9} />

          <section className="v4-shell v9-hero" aria-labelledby="v9-title">
            <p className="v9-eyebrow">
              <span>{'//'}</span> shadcn-table
            </p>
            <h1 id="v9-title" className="v4-display v9-h1">
              The shadcn table, with the <em>whole grid</em> wired in.
            </h1>
            <div className="v9-hero-row">
              <p className="v9-lede">
                A React data grid on TanStack Table v8 and shadcn/ui. Sorting,
                filtering, pinning, grouping, editing and virtualization are
                table options, in source you own.
              </p>
              <div className="v9-hero-act">
                <InstallCommand className="v9-install" />
                <div className="v4-hero-actions">
                  <Link
                    href="/docs/getting-started/install"
                    className="v4-btn v4-btn-solid v4-btn-lg"
                  >
                    Get started
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </Link>
                  <Link href="/docs/examples" className="v4-link">
                    Browse examples
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* the demo, nearly edge to edge, on the field */}
          <section className="v9-band" aria-labelledby="v9-band-title">
            <div className="v9-band-inner">
              <div className="v9-band-head">
                <h2 id="v9-band-title" className="v4-display v9-band-title">
                  Watch it work. Then take over.
                </h2>
                <p className="v9-band-note">
                  A real table, not a recording. Each step is one piece of table
                  state.
                </p>
              </div>
              <RiseFigure
                caption="Live replay"
                note="Click into the table to take over."
              >
                <SignalDemo />
              </RiseFigure>
            </div>
          </section>
        </div>

        <div className="v4-shell">
          {/* sheet 01: features */}
          <section className="v9-sheet" aria-labelledby="v9-features-title">
            <div className="v9-sheet-label">
              <p className="v9-index">01 / Features</p>
              <h2 id="v9-features-title" className="v4-display v9-h2">
                Every feature is one prop.
              </h2>
              <p className="v9-sheet-lede">
                Each drawing acts out its feature as it scrolls into view. Hover
                one to hold it.
              </p>
              <Link href="/docs/guides" className="v4-link">
                All feature guides
              </Link>
            </div>
            <div className="v9-sheet-body">
              <AutoplayTileGrid size="lg" className="lg:grid-cols-2" />
            </div>
          </section>

          {/* sheet 02: comparison */}
          <section className="v9-sheet" aria-labelledby="v9-compare-title">
            <div className="v9-sheet-label">
              <p className="v9-index">02 / Comparison</p>
              <h2 id="v9-compare-title" className="v4-display v9-h2">
                Same parts. More table.
              </h2>
              <p className="v9-sheet-lede">
                Both ship as source through the shadcn CLI. The plain Table is
                markup. ST is that markup with the grid built on top.
              </p>
            </div>
            <div className="v9-sheet-body">
              <SpecTable />
              <p className="v9-spec-note">
                Option names are from the feature guides. The plain column
                describes the shadcn/ui Table and its Data Table guide.
              </p>
            </div>
          </section>

          {/* 03: install, define columns, render */}
          <section className="v9-strip" aria-labelledby="v9-start-title">
            <div className="v9-strip-head">
              <div className="flex flex-col gap-4">
                <p className="v9-index">03 / Quick start</p>
                <h2 id="v9-start-title" className="v4-display v9-h2">
                  Install. Define. Render.
                </h2>
              </div>
              <Link
                href="/docs/getting-started/usage"
                className="v4-btn v4-btn-outline"
              >
                Read the usage guide
              </Link>
            </div>
            <CodeStrip />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
