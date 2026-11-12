import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { IntentLink } from '@/components/dev-home/shared/intent-link';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { archivo } from '@/components/dev-home/v4/font';
import { Starfield } from '@/components/dev-home/v4/starfield';
import { CodeStrip } from './code-strip';
import { AgentBar } from '@/components/agent-bar';
import { agentPrompt, libraryAddCommand, perBase } from '@/lib/install';
import { Dune } from './dune';
import { Footer } from './footer';
import { Nav } from './nav';
import { RiseFigure } from './rise-figure';
import { SignalDemo } from './signal-demo';
import { ThemeDemo } from './theme-demo';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v7/v7.css';
import './v12.css';

/**
 * The homepage: v7's dune hero recoloured by the site theme, the replaying
 * demo, the theming demo, the feature tiles and the install strip. Rendered at "/".
 */
export function HomePage() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Starfield />
      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="v12-hero" aria-labelledby="v12-title">
          <Dune className="v12-field" fps={9} />
          <div className="v4-shell v12-hero-copy">
            <p className="v7-eyebrow v12-eyebrow">
              <span>{'//'}</span> The open-source React data table for
              shadcn/ui, built on TanStack Table.
            </p>
            <h1 id="v12-title" className="v4-display v12-h1">
              shadcn<span className="v7-wordmark-dash">-</span>table
            </h1>
            <p className="v12-pitch">
              A production-ready table library built with{' '}
              <span className="v12-accent">TanStack Table</span> and{' '}
              <span className="v12-accent">shadcn/ui</span>. Sorting, filtering,
              grouping, pinning, virtualization, and more, all built in.
            </p>
            <AgentBar
              prompt={agentPrompt}
              command={perBase((base) => libraryAddCommand(base))}
              className="v12-agent"
            />
            <div className="v12-cta">
              <IntentLink
                href="/docs/getting-started/install"
                className="v4-btn v4-btn-solid v4-btn-lg"
              >
                Get started
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </IntentLink>
              <IntentLink href="/docs/examples" className="v4-link">
                Examples
              </IntentLink>
            </div>
          </div>
        </section>

        <section className="v12-demo" aria-label="Demo">
          {/* gutter to gutter like the theming demo: the seven columns read
           * in full beside the steps from 1440px */}
          <div className="v12-wide">
            <RiseFigure caption="Live demo">
              <SignalDemo />
            </RiseFigure>
          </div>
        </section>

        <section
          className="v12-section v12-theming"
          aria-labelledby="v12-theming-title"
        >
          <div className="v4-shell">
            <div className="v12-head">
              <div>
                <p className="v12-label">{'//'} theming</p>
                <h2 id="v12-theming-title" className="v5-h2">
                  Change the theme.{' '}
                  <span className="v12-accent">Not the table.</span>
                </h2>
              </div>
              <div>
                <p className="v5-section-lede">
                  Your table automatically adapts to your shadcn/ui theme. No
                  extra configuration or code changes needed.
                </p>
              </div>
            </div>
          </div>
          <div className="v12-wide">
            {/* no caption: the heading above names it, and the section fits
             * one screen */}
            <RiseFigure>
              <ThemeDemo />
            </RiseFigure>
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
                  Everything you need.{' '}
                  <span className="v12-accent">Built in.</span>
                </h2>
              </div>
              <div>
                <p className="v5-section-lede">
                  Sorting, filtering, grouping, editing, virtualization, and
                  more. All built in, fully customizable, and ready to use.
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
                  Up and running in three steps.
                </h2>
              </div>
              <div>
                <p className="v5-section-lede">
                  Add the components, define your columns, and render your
                  table. That&apos;s all it takes to get started.
                </p>
                <Link
                  href="/docs/getting-started/usage"
                  className="v4-link inline-flex items-center gap-1 self-start"
                >
                  View usage guide
                  <ArrowUpRightIcon aria-hidden="true" className="size-4" />
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
