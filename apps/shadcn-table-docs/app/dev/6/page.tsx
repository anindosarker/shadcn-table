import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { AutoplayTileGrid } from '@/components/dev-home/shared/autoplay-tile-grid';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { Band, BandHead } from '@/components/dev-home/v3/band';
import { RulerRail } from '@/components/dev-home/v3/ruler-rail';
import { GET_STARTED_HREF } from '@/components/dev-home/v3/spec-nav';
import { InstallTabs } from '@/components/dev-home/v5/install-tabs';
import { BlueprintFooter } from '@/components/dev-home/v6/footer';
import { BlueprintNav } from '@/components/dev-home/v6/nav';
import { PropSheet } from '@/components/dev-home/v6/prop-sheet';
import { Specimen } from '@/components/dev-home/v6/specimen';
import '@/components/dev-home/v3/v3.css';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v6/v6.css';

const SECTIONS = [
  { id: 'v6-overview', label: 'Overview' },
  { id: 'v6-specimen', label: 'Specimen' },
  { id: 'v6-features', label: 'Features' },
  { id: 'v6-props', label: 'Props' },
  { id: 'v6-install', label: 'Install' },
];

const SHEET: [key: string, value: string][] = [
  ['Engine', 'TanStack Table v8'],
  ['Renders with', 'shadcn/ui'],
  ['Styling', 'Tailwind CSS'],
  ['License', 'MIT'],
];

const btnIcon = 'size-3.5 shrink-0';

export default function Variant6Page() {
  return (
    <div data-variant="6" className="v3 v6 flex flex-1 flex-col">
      <RulerRail sections={SECTIONS} />
      <main className="v3-frame">
        <BlueprintNav />

        {/* 01 · Overview: headline and install side by side */}
        <section id="v6-overview" aria-labelledby="v6-title">
          <div className="v3-split">
            <div className="v3-xbr flex flex-col gap-7 px-4 pt-14 pb-12 sm:px-8 sm:pt-20 sm:pb-16">
              <p className="v3-label">
                <span className="text-(--dh-accent)">01</span>
                <span aria-hidden="true"> / </span>
                React data grid
              </p>
              <h1
                id="v6-title"
                className="max-w-[13ch] text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.035em] text-balance sm:text-7xl"
              >
                Drawn to spec. Running live.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-pretty text-(--dh-ink-muted) sm:text-lg">
                shadcn-table is a React data grid on TanStack Table v8 and
                shadcn/ui. Sorting, filtering, pinning and grouping are props.
                The specimen below is the real table, replaying them.
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
                Install / shadcn CLI
              </p>
              <div className="px-4 pb-6 sm:px-8">
                <InstallTabs />
              </div>
              <dl className="mt-auto flex flex-col">
                {SHEET.map(([k, v]) => (
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
        </section>

        {/* 02 · Specimen: the replay demo pinned to the sheet */}
        <Band id="v6-specimen" labelledBy="v6-specimen-title">
          <BandHead
            index="02"
            label="Specimen"
            id="v6-specimen-title"
            title="Four props, replayed on a real table."
            lede="Each callout on the ruler is one step of the replay and the prop behind it. Pick a step to jump there, or click into the table and drive."
          />
          <Band as="div">
            <Specimen />
          </Band>
        </Band>

        {/* 03 · Features: autoplaying tiles inside the dashed grid */}
        <Band id="v6-features" labelledBy="v6-features-title">
          <BandHead
            index="03"
            label="Features"
            id="v6-features-title"
            title="Twelve features, each one drawn."
            lede="The drawings act their feature out one after another. Hover one to hold it, then open its guide."
          />
          <Band as="div">
            <div className="px-4 py-6 sm:px-8 sm:py-8">
              <AutoplayTileGrid size="lg" />
            </div>
          </Band>
        </Band>

        {/* 04 · Props: the switch for each feature */}
        <Band id="v6-props" labelledBy="v6-props-title">
          <BandHead
            index="04"
            label="Props"
            id="v6-props-title"
            title="The prop sheet."
            lede="Pass one of these to useShadcnTable and the feature is on, with its shadcn UI already wired."
          />
          <Band as="div">
            <PropSheet />
          </Band>
        </Band>

        {/* 05 · Install */}
        <Band id="v6-install" labelledBy="v6-install-title">
          <div className="flex flex-col gap-6 px-4 py-14 sm:px-8 sm:py-20">
            <p className="v3-label">
              <span className="text-(--dh-accent)">05</span>
              <span aria-hidden="true"> / </span>
              Install
            </p>
            <h2
              id="v6-install-title"
              className="max-w-[16ch] text-4xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-6xl"
            >
              Copy the sheet into your project.
            </h2>
            <InstallCommand className="w-full max-w-2xl rounded-none border-dashed border-(--v3-dash)" />
            <div className="flex flex-wrap gap-3">
              <Link href={GET_STARTED_HREF} className="v3-btn v3-btn-solid">
                Read the install guide
                <ArrowRightIcon aria-hidden="true" className={btnIcon} />
              </Link>
            </div>
          </div>
        </Band>

        <BlueprintFooter />
      </main>
    </div>
  );
}
