import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { Band, BandHead } from '@/components/dev-home/v3/band';
import { CodeBlock } from '@/components/dev-home/v3/code-block';
import { Colophon } from '@/components/dev-home/v3/colophon';
import {
  FeatureMatrix,
  LibraryTable,
} from '@/components/dev-home/v3/comparison-specs';
import { FeatureSpecs } from '@/components/dev-home/v3/feature-specs';
import { LiveFigure } from '@/components/dev-home/v3/live-figure';
import { RulerRail } from '@/components/dev-home/v3/ruler-rail';
import {
  GET_STARTED_HREF,
  NAV_LINKS,
  SpecNav,
} from '@/components/dev-home/v3/spec-nav';
import '@/components/dev-home/v3/v3.css';

const SECTIONS = [
  { id: 'v3-overview', label: 'Overview' },
  { id: 'v3-features', label: 'Features' },
  { id: 'v3-start', label: 'Quick start' },
  { id: 'v3-compare', label: 'Comparison' },
  { id: 'v3-install', label: 'Install' },
];

const SPECS: [key: string, value: string][] = [
  ['Core', 'TanStack Table v8'],
  ['Renders with', 'shadcn/ui'],
  ['Styling', 'Tailwind CSS'],
  ['License', 'MIT'],
  ['Lineage', 'Port of material-react-table'],
  ['Ships via', 'shadcn CLI registry'],
];

const COLUMNS_SNIPPET = `const columns = useMemo<ST_ColumnDef<Person>[]>(
  () => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'city', header: 'City' },
  ],
  [],
);`;

const RENDER_SNIPPET = `const table = useShadcnTable({
  columns,
  data,
  enableColumnPinning: true,
});

return <ShadcnTable table={table} />;`;

const btnIcon = 'size-3.5 shrink-0';

export default function Variant3Page() {
  return (
    <main data-variant="3" className="v3 flex-1">
      <RulerRail sections={SECTIONS} />
      <div className="v3-frame">
        <SpecNav />

        {/* 01 · Overview: headline, spec list, install, live figure */}
        <section id="v3-overview" aria-labelledby="v3-title">
          <div className="v3-split">
            <div className="v3-xbr flex flex-col gap-7 px-4 pt-14 pb-12 sm:px-8 sm:pt-20 sm:pb-16">
              <p className="v3-label">
                <span className="text-(--dh-accent)">01</span>
                <span aria-hidden="true"> / </span>
                React data grid
              </p>
              <h1
                id="v3-title"
                className="max-w-[12ch] text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.035em] text-balance sm:text-7xl lg:text-[5.25rem]"
              >
                A data grid, built to spec.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-pretty text-(--dh-ink-muted) sm:text-lg">
                shadcn-table is a full-featured React table on shadcn/ui and
                TanStack Table v8. Sorting, filtering, pinning, grouping,
                editing and virtualization are props, in components you own.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={GET_STARTED_HREF} className="v3-btn v3-btn-solid">
                  Get started
                  <ArrowRightIcon aria-hidden="true" className={btnIcon} />
                </Link>
                <Link href="/docs/examples" className="v3-btn">
                  Browse examples
                </Link>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="v3-label px-4 pt-6 pb-3 sm:px-8 lg:pt-20">
                Specification
              </p>
              <dl className="flex flex-col">
                {SPECS.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-t border-dashed border-(--v3-dash-soft) px-4 py-3 sm:px-8"
                  >
                    <dt className="v3-label leading-6">{k}</dt>
                    <dd className="text-sm leading-6 [overflow-wrap:anywhere] text-(--dh-ink)">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <Band as="div">
            <div className="flex flex-col gap-3 px-4 py-5 sm:px-8 lg:flex-row lg:items-center lg:gap-8">
              <p className="v3-label shrink-0">Install / shadcn CLI</p>
              <InstallCommand variant="bare" className="min-w-0 flex-1" />
            </div>
          </Band>

          <Band as="div">
            <LiveFigure />
          </Band>
        </section>

        {/* 02 · Features: the spec grid */}
        <Band id="v3-features" labelledBy="v3-features-title">
          <BandHead
            index="02"
            label="Features"
            id="v3-features-title"
            title="Each feature is one prop."
            lede="Twelve of the switches ST ships with. Hover a cell to watch its drawing act the feature out, then open the guide."
          />
          <Band as="div">
            <FeatureSpecs />
          </Band>
        </Band>

        {/* 03 · Quick start */}
        <Band id="v3-start" labelledBy="v3-start-title">
          <BandHead
            index="03"
            label="Quick start"
            id="v3-start-title"
            title="Three steps to a working grid."
          />
          <Band as="div">
            <ol className="v3-grid v3-grid-3">
              <li className="v3-cell flex flex-col gap-4 p-5 sm:p-6">
                <p className="v3-label text-(--dh-accent)!">Step 1</p>
                <h3 className="text-lg font-semibold tracking-tight">
                  Add the component
                </h3>
                <p className="text-sm leading-relaxed text-pretty text-(--dh-ink-muted)">
                  The shadcn CLI copies ST into your project, next to the rest
                  of your ui folder.
                </p>
                <InstallCommand
                  variant="bare"
                  className="mt-auto border border-dashed border-(--v3-dash-soft) bg-(--dh-paper-2) py-1 pr-1 pl-3"
                />
              </li>
              <li className="v3-cell flex flex-col gap-4 p-5 sm:p-6">
                <p className="v3-label text-(--dh-accent)!">Step 2</p>
                <h3 className="text-lg font-semibold tracking-tight">
                  Define columns
                </h3>
                <p className="text-sm leading-relaxed text-pretty text-(--dh-ink-muted)">
                  Columns are TanStack Table column defs with a few extra
                  options.
                </p>
                <CodeBlock code={COLUMNS_SNIPPET} className="mt-auto" />
              </li>
              <li className="v3-cell flex flex-col gap-4 p-5 sm:p-6">
                <p className="v3-label text-(--dh-accent)!">Step 3</p>
                <h3 className="text-lg font-semibold tracking-tight">
                  Render the table
                </h3>
                <p className="text-sm leading-relaxed text-pretty text-(--dh-ink-muted)">
                  Pass your data to the hook, turn features on with props, and
                  render.
                </p>
                <CodeBlock code={RENDER_SNIPPET} className="mt-auto" />
              </li>
            </ol>
          </Band>
        </Band>

        {/* 04 · Comparison */}
        <Band id="v3-compare" labelledBy="v3-compare-title">
          <BandHead
            index="04"
            label="Comparison"
            id="v3-compare-title"
            title="Measured against the field."
            lede="Where ST sits among React table libraries, and which features each one ships out of the box."
          />
          <Band as="div">
            <p className="v3-label px-4 pt-5 pb-3 sm:px-8">Libraries</p>
            <div className="px-1 pb-2 sm:px-5">
              <LibraryTable />
            </div>
          </Band>
          <Band as="div">
            <div className="flex flex-col gap-1 px-4 pt-5 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
              <p className="v3-label">Feature matrix</p>
              <p className="text-xs text-(--dh-ink-faint)">
                MT is Material Table. A dash means partial support.
              </p>
            </div>
            <Band as="div">
              <FeatureMatrix />
            </Band>
          </Band>
        </Band>

        {/* 05 · Install CTA */}
        <Band id="v3-install" labelledBy="v3-install-title">
          <div className="v3-split">
            <div className="v3-xbr flex flex-col gap-6 px-4 py-14 sm:px-8 sm:py-20">
              <p className="v3-label">
                <span className="text-(--dh-accent)">05</span>
                <span aria-hidden="true"> / </span>
                Install
              </p>
              <h2
                id="v3-install-title"
                className="max-w-[14ch] text-4xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-6xl"
              >
                Add it to your project.
              </h2>
              <InstallCommand className="w-full max-w-2xl rounded-none border-dashed border-(--v3-dash)" />
              <div className="flex flex-wrap gap-3">
                <Link href={GET_STARTED_HREF} className="v3-btn v3-btn-solid">
                  Read the install guide
                  <ArrowRightIcon aria-hidden="true" className={btnIcon} />
                </Link>
              </div>
            </div>
            <nav aria-label="Next steps" className="flex flex-col">
              <p className="v3-label px-4 pt-6 pb-3 sm:px-8 lg:pt-20">Next</p>
              <ul className="flex flex-col">
                {NAV_LINKS.map((l) => (
                  <li
                    key={l.label}
                    className="border-t border-dashed border-(--v3-dash-soft)"
                  >
                    <Link
                      href={l.href}
                      {...('external' in l
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                      className="group flex h-14 items-center justify-between px-4 text-base whitespace-nowrap text-(--dh-ink-muted) outline-2 -outline-offset-2 outline-transparent hover:text-(--dh-ink) focus-visible:outline-(--dh-focus) sm:px-8"
                    >
                      {l.label}
                      <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-4 transition-transform duration-(--dh-dur) ease-(--dh-ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Band>

        <Colophon />
      </div>
    </main>
  );
}
