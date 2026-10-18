import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { AsciiDune } from '@/components/dev-home/v4/ascii-dune';
import { archivo } from '@/components/dev-home/v4/font';
import { Footer } from '@/components/dev-home/v7/footer';
import { Starfield } from '@/components/dev-home/v4/starfield';
import { SignalDemo } from '@/components/dev-home/v5/signal-demo';
import { CodeStrip } from '@/components/dev-home/v7/code-strip';
import { Nav } from '@/components/dev-home/v7/nav';
import { RiseFigure } from '@/components/dev-home/v7/rise-figure';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v7/v7.css';

export default function Variant7Page() {
  return (
    <div data-variant="7" className={`v4-root ${archivo.variable}`}>
      <Starfield />
      <Nav />

      <main className="flex flex-1 flex-col">
        {/* hero: the field is the backdrop, the copy stacks over it */}
        <section className="v7-hero" aria-labelledby="v7-title">
          <AsciiDune className="v7-field" fps={9} />
          <div className="v4-shell v7-hero-copy">
            <p className="v7-eyebrow">
              <span>{'//'}</span> React data grid on shadcn/ui
            </p>
            <h1 id="v7-title" className="v4-display v7-wordmark">
              shadcn<span className="v7-wordmark-dash">-</span>react
              <span className="v7-wordmark-dash">-</span>table
            </h1>
            <p className="v7-pitch">
              Sorting, filtering, pinning, grouping and virtualization on
              TanStack Table v8, installed as shadcn/ui source you own.
            </p>
            <InstallCommand className="v7-install text-left" />
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
        </section>

        {/* the replay rises out of the field */}
        <section className="v4-shell v7-rise" aria-label="Live table replay">
          <RiseFigure
            caption="Live replay"
            note="A real table. Click into it to take over."
          >
            <SignalDemo />
          </RiseFigure>
        </section>

        {/* features on a quiet band */}
        <section className="v7-band" aria-labelledby="v7-features-title">
          <div className="v4-shell v7-band-grid">
            <div className="v7-band-head">
              <h2 id="v7-features-title" className="v5-h2">
                Twelve features, one prop each.
              </h2>
              <p className="v5-section-lede">
                Each drawing acts out its feature in turn. Hover one to hold it.
              </p>
              <Link href="/docs/guides" className="v7-band-link">
                Read the feature guides
              </Link>
            </div>
            <AutoplayTileGrid size="md" />
          </div>
        </section>

        {/* install, define columns, render */}
        <section
          className="v4-shell v7-strip-section"
          aria-labelledby="v7-start-title"
        >
          <div className="v7-strip-head">
            <h2 id="v7-start-title" className="v5-h2">
              Install, define columns, render.
            </h2>
            <p className="v5-section-lede">
              The whole setup, using the same hook and component as the docs.
            </p>
          </div>
          <CodeStrip />
        </section>
      </main>

      <Footer />
    </div>
  );
}
