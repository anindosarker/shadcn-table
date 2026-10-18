import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { LiveTable } from '@/components/dev-home/shared/live-table';
import { AsciiDune } from '@/components/dev-home/v4/ascii-dune';
import { FeatureList } from '@/components/dev-home/v4/feature-list';
import { archivo } from '@/components/dev-home/v4/font';
import { Footer } from '@/components/dev-home/v4/footer';
import { Nav } from '@/components/dev-home/v4/nav';
import { SettleShowcase } from '@/components/dev-home/v4/settle-showcase';
import { Starfield } from '@/components/dev-home/v4/starfield';
import '@/components/dev-home/v4/v4.css';

/** What `shadcn add` writes into components/ui/shadcn-table (registry.json). */
const TREE = [
  ['ShadcnTable.tsx', ''],
  ['body/', '7'],
  ['buttons/', '13'],
  ['head/', '9'],
  ['footer/', '3'],
  ['hooks/', '14'],
  ['inputs/', '7'],
  ['menus/', '7'],
  ['toolbar/', '8'],
  ['fns/', '3'],
  ['utils/', '9'],
  ['index.ts', ''],
] as const;

const PILLARS = [
  {
    title: 'shadcn/ui, not a theme',
    body: 'Cells, menus, filters and dialogs render with your own shadcn/ui button, popover, select and dialog. Change a file, change the table.',
  },
  {
    title: 'TanStack Table v8 inside',
    body: 'State, sorting, filtering, grouping and pagination come from @tanstack/react-table. Virtualization from @tanstack/react-virtual.',
  },
  {
    title: 'MIT, every feature',
    body: 'No paid tier. Everything on this page ships with the one install command.',
  },
] as const;

const COMPARE = [
  {
    row: 'UI',
    srt: 'shadcn/ui components in your repo',
    headless: 'You build every component',
    licensed: 'The vendor’s own components',
  },
  {
    row: 'Features',
    srt: 'Batteries included',
    headless: 'Table logic only',
    licensed: 'Complete, advanced ones on paid tiers',
  },
  {
    row: 'Styling',
    srt: 'Tailwind and your shadcn tokens',
    headless: 'Whatever you write',
    licensed: 'The vendor’s theming API',
  },
  {
    row: 'License',
    srt: 'MIT',
    headless: 'MIT',
    licensed: 'Free core, commercial tiers',
  },
] as const;

export default function Variant4Page() {
  return (
    <main data-variant="4" className={`v4-root ${archivo.variable}`}>
      <Starfield />
      <Nav />

      <section className="v4-hero" aria-labelledby="v4-hero-title">
        <div className="v4-shell v4-hero-copy">
          <h1 id="v4-hero-title" className="v4-display v4-hero-title">
            The data grid
            <br />
            you own
          </h1>
          <p className="v4-hero-sub">
            Sorting, filtering, grouping, virtualization and editing, built on
            TanStack Table v8 and installed as shadcn/ui components you can read
            and change.
          </p>
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
        <AsciiDune className="v4-hero-dune" />
      </section>

      <SettleShowcase>
        <LiveTable
          example="advanced"
          caption="Live: the advanced example. Sort, filter, group, pin and select right here."
        />
      </SettleShowcase>

      <section className="v4-section" aria-labelledby="v4-features-title">
        <div className="v4-shell">
          <div className="v4-head">
            <h2 id="v4-features-title" className="v4-display v4-h2">
              Every feature is one prop
            </h2>
            <p className="v4-lede">
              Turn on what you need from the same component. Each row opens its
              guide.
            </p>
          </div>
          <FeatureList />
        </div>
      </section>

      <section className="v4-section" aria-labelledby="v4-own-title">
        <div className="v4-shell">
          <div className="v4-head">
            <h2 id="v4-own-title" className="v4-display v4-h2">
              Yours to read and change
            </h2>
            <p className="v4-lede">
              The shadcn CLI copies the table into your project. There is no
              package to wrap, and no styles to fight.
            </p>
          </div>
          <div className="v4-own">
            <figure className="v4-tree">
              <pre aria-label="Files added to components/ui/shadcn-table">
                <span className="v4-tree-root">
                  components/ui/shadcn-table/
                </span>
                {TREE.map(([name, count], i) => (
                  <span key={name} className="v4-tree-line">
                    <span className="v4-tree-glyph">
                      {i === TREE.length - 1 ? '└── ' : '├── '}
                    </span>
                    <span className="v4-tree-name">{name}</span>
                    {count ? (
                      <span className="v4-tree-count">{count} files</span>
                    ) : null}
                  </span>
                ))}
              </pre>
              <figcaption>
                92 files from one command, plus 37 optional locale packs.
              </figcaption>
            </figure>
            <ul className="v4-pillars">
              {PILLARS.map((p, i) => (
                <li key={p.title} className="v4-pillar">
                  <span aria-hidden="true" className="v4-pillar-n">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="v4-section" aria-labelledby="v4-compare-title">
        <div className="v4-shell">
          <div className="v4-head">
            <h2 id="v4-compare-title" className="v4-display v4-h2">
              Headless, licensed, or owned
            </h2>
            <p className="v4-lede">
              Where shadcn-table sits next to the two usual choices.
            </p>
          </div>
          <table className="v4-compare">
            <thead>
              <tr>
                <td />
                <th scope="col" className="v4-compare-us">
                  shadcn-table
                </th>
                <th scope="col">TanStack Table alone</th>
                <th scope="col">Licensed grids</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.row}>
                  <th scope="row">{r.row}</th>
                  <td className="v4-compare-us" data-label="shadcn-table">
                    {r.srt}
                  </td>
                  <td data-label="TanStack Table alone">{r.headless}</td>
                  <td data-label="Licensed grids">{r.licensed}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="v4-footnote">
            Licensed grids here means AG Grid Enterprise and MUI X Pro or
            Premium.
          </p>
        </div>
      </section>

      <section
        className="v4-section v4-install"
        aria-labelledby="v4-install-title"
      >
        <div className="v4-shell v4-install-inner">
          <h2 id="v4-install-title" className="v4-display v4-h2 v4-install-h">
            One command. All of it.
          </h2>
          <div className="v4-prompt">
            <InstallCommand variant="bare" />
          </div>
          <ol className="v4-steps">
            <li>
              <span aria-hidden="true">01</span>
              Start from a shadcn/ui project with a components.json.
            </li>
            <li>
              <span aria-hidden="true">02</span>
              Run the command. Files land in components/ui/shadcn-table.
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <code>
                {"import { ShadcnTable } from '@/components/ui/shadcn-table'"}
              </code>
            </li>
          </ol>
          <div className="v4-hero-actions">
            <Link
              href="/docs/getting-started/install"
              className="v4-btn v4-btn-solid v4-btn-lg"
            >
              Read the install guide
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/docs/api" className="v4-btn v4-btn-outline v4-btn-lg">
              API reference
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
