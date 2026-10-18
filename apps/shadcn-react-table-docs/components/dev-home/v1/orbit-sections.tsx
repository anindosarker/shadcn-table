import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import {
  FEATURES,
  OutlineArt,
} from '@/components/dev-home/shared/outline-tiles';
import { LiveTable } from '@/components/dev-home/shared/live-table';
import { InstallCommand } from '@/components/dev-home/shared/install-command';

/** Props the advanced example turns on (examples/advanced/TS.tsx). */
const ADVANCED_PROPS = [
  'enableColumnFilterModes',
  'enableColumnOrdering',
  'enableGrouping',
  'enableColumnPinning',
  'enableFacetedValues',
  'enableRowActions',
  'enableRowSelection',
  'renderDetailPanel',
] as const;

export function LiveTableSection() {
  return (
    <section id="table" className="o1-section">
      <div className="o1-wrap">
        <div className="o1-head">
          <h2 className="o1-h2">Every feature, one table.</h2>
          <p className="o1-lede">
            This is the advanced example from the docs, running on this page.
            Sort, filter, group, pin, reorder and select. It is the same
            component the install command copies into your project.
          </p>
        </div>
        <ul className="o1-chips" aria-label="Props in this example">
          {ADVANCED_PROPS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <LiveTable
          example="advanced"
          caption="Live: examples/advanced. Employee data, generated in the browser."
        />
      </div>
    </section>
  );
}

export function FeatureIndexSection() {
  return (
    <section id="features" className="o1-section">
      <div className="o1-wrap">
        <div className="o1-head">
          <h2 className="o1-h2">Twelve features, one prop each.</h2>
          <p className="o1-lede">
            Each one is a prop or a column option, not a plugin to wire up.
            Hover a row to see what it does; open it for the guide.
          </p>
        </div>
        <ul className="o1-index">
          {FEATURES.map((f) => (
            <li key={f.id}>
              <Link href={f.docsHref} className="o1-row dh-tile-host">
                <span className="dh-tile">
                  <OutlineArt feature={f.id} />
                </span>
                <span className="o1-row-text">
                  <span className="o1-row-title">{f.title}</span>
                  <span className="o1-row-desc">{f.description}</span>
                  <code className="o1-row-prop">{f.prop}</code>
                </span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="o1-row-arrow size-4"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const REASONS = [
  {
    title: 'You own the code',
    body: 'The shadcn CLI copies the table into your repo, next to your other components. Read it, change it, delete what you do not use.',
  },
  {
    title: 'TanStack Table v8 inside',
    body: 'Sorting, filtering, grouping and the rest run on the TanStack Table v8 core. Its table instance and APIs are there when you need them.',
  },
  {
    title: 'Styled by shadcn/ui',
    body: 'Built from shadcn/ui primitives and Tailwind CSS, so the table takes your theme tokens, dark mode included. A port of Material React Table, so the API will look familiar.',
  },
] as const;

const COMPARE = [
  {
    row: 'Feature set',
    diy: 'You build each feature on the headless hooks',
    srt: 'Sorting, filtering, grouping, pinning, editing, virtualization and more, ready',
  },
  {
    row: 'Markup and styles',
    diy: 'Yours, written from scratch',
    srt: 'Yours, copied in by the shadcn CLI',
  },
  {
    row: 'Theme',
    diy: 'Whatever you wire up',
    srt: 'Your shadcn/ui tokens out of the box',
  },
  {
    row: 'Table engine',
    diy: 'TanStack Table v8',
    srt: 'TanStack Table v8',
  },
  { row: 'Licence', diy: 'MIT', srt: 'MIT' },
] as const;

export function WhySection() {
  return (
    <section id="why" className="o1-section">
      <div className="o1-wrap">
        <div className="o1-head">
          <h2 className="o1-h2">A grid that lives in your repo.</h2>
          <p className="o1-lede">
            Not a black-box package. A shadcn/ui component with the whole data
            grid inside.
          </p>
        </div>
        <ol className="o1-why">
          {REASONS.map((r, i) => (
            <li key={r.title}>
              <span className="o1-why-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
        <table className="o1-compare">
          <caption>Building it yourself versus SRT</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[28%]">
                <span className="sr-only">Aspect</span>
              </th>
              <th scope="col">TanStack Table alone</th>
              <th scope="col" className="o1-us">
                Shadcn React Table
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((c) => (
              <tr key={c.row}>
                <th scope="row">{c.row}</th>
                <td>{c.diy}</td>
                <td className="o1-us">{c.srt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function InstallSection() {
  return (
    <section id="install" className="o1-section o1-install">
      <svg
        className="o1-install-rings"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="50" cy="50" r="49" />
        <circle cx="50" cy="50" r="36" className="o1-ring-spin" />
        <circle cx="50" cy="50" r="23" />
      </svg>
      <div className="o1-wrap">
        <div className="o1-head">
          <h2 className="o1-h2">One command. Then it is yours.</h2>
          <p className="o1-lede">
            Run it in a project that already uses shadcn/ui. The table lands in
            your components folder.
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4">
          <InstallCommand className="rounded-[3px] py-2.5 text-left" />
          <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
            <Link
              href="/docs/getting-started/install"
              className="o1-btn o1-btn-primary"
            >
              Read the install guide
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/docs/examples" className="o1-btn o1-btn-ghost">
              Browse examples
              <ArrowUpRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
