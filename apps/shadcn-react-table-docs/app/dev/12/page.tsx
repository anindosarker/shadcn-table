import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { archivo } from '@/components/dev-home/v4/font';
import { Starfield } from '@/components/dev-home/v4/starfield';
import { RiseFigure } from '@/components/dev-home/v7/rise-figure';
import { CodeStrip } from '@/components/dev-home/v12/code-strip';
import { Dune } from '@/components/dev-home/v12/dune';
import { Footer } from '@/components/dev-home/v12/footer';
import { Nav } from '@/components/dev-home/v12/nav';
import { SignalDemo } from '@/components/dev-home/v12/signal-demo';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v7/v7.css';
import '@/components/dev-home/v12/v12.css';

export default function Variant12Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      {/* dashed page frame: one rail at each content edge */}
      <div aria-hidden="true" className="v12-rails" />
      <Starfield />
      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="v12-hero" aria-labelledby="v12-title">
          <Dune className="v12-field" fps={9} />
          <div className="v4-shell v12-hero-copy">
            <p className="v7-eyebrow v12-eyebrow">
              <span>{'//'}</span> The batteries-included table for shadcn/ui.
            </p>
            <h1 id="v12-title" className="v4-display v12-h1">
              shadcn<span className="v7-wordmark-dash">-</span>react
              <span className="v7-wordmark-dash">-</span>table
            </h1>
            <p className="v12-pitch">
              A production-ready table library built with TanStack Table and
              shadcn/ui. Sorting, filtering, grouping, pinning, virtualization,
              and more, all built in.
            </p>
            <div className="v12-hero-row">
              <InstallCommand className="v12-install text-left" />
              <div className="v12-cta">
                <Link
                  href="/docs/getting-started/install"
                  className="v4-btn v4-btn-solid v4-btn-lg"
                >
                  Get started
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </Link>
                <Link href="/docs/examples" className="v4-link">
                  Examples
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="v12-demo" aria-label="Demo">
          <div className="v4-shell">
            <div className="v12-bleed">
              <RiseFigure
                caption="Demo"
                note="A real table running on this page. Click it to stop the replay."
              >
                <SignalDemo />
              </RiseFigure>
            </div>
          </div>
        </section>

        <section
          className="v12-section v12-features"
          aria-labelledby="v12-features-title"
        >
          <div className="v4-shell">
            <div className="v12-head">
              <div>
                <p className="v12-label">Features</p>
                <h2 id="v12-features-title" className="v5-h2">
                  What ships with the table
                </h2>
              </div>
              <div>
                <p className="v5-section-lede">
                  Each tile is a feature you switch on or configure with table
                  options. Export is the exception: the CSV and PDF examples add
                  it with export-to-csv and jsPDF.
                </p>
                <Link href="/docs/guides" className="v4-link self-start">
                  All feature guides
                </Link>
              </div>
            </div>
            <AutoplayTileGrid size="md" />
          </div>
        </section>

        <section className="v12-section" aria-labelledby="v12-install-title">
          <div className="v4-shell">
            <div className="v12-head">
              <div>
                <p className="v12-label">Install</p>
                <h2 id="v12-install-title" className="v5-h2">
                  Three steps to a working table
                </h2>
              </div>
              <div>
                <p className="v5-section-lede">
                  Start from a shadcn/ui project. The code matches the usage
                  guide.
                </p>
                <Link
                  href="/docs/getting-started/usage"
                  className="v4-link self-start"
                >
                  Usage guide
                </Link>
              </div>
            </div>
            <div className="v12-bleed">
              <CodeStrip />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
