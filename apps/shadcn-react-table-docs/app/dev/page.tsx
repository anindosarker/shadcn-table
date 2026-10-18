import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import {
  OutlineArt,
  type FeatureId,
} from '@/components/dev-home/shared/outline-tiles';
import { InstallCommand } from '@/components/dev-home/shared/install-command';

const variants: {
  n: number;
  name: string;
  description: string;
  feature: FeatureId;
}[] = [
  {
    n: 1,
    name: 'Orbit',
    description:
      'Feature drawings orbit the wordmark; click one to open its live example.',
    feature: 'column-pinning',
  },
  {
    n: 2,
    name: 'Workbench',
    description:
      'Headline, install and a halftone dot field over a full-width live advanced table.',
    feature: 'grouping',
  },
  {
    n: 3,
    name: 'Spec sheet',
    description:
      'Dashed crosshair grid; each cell holds a drawing, its prop and a docs link.',
    feature: 'column-resizing',
  },
  {
    n: 4,
    name: 'Box-drawing field',
    description:
      'ASCII box characters settle into a grid, then hand over to the live table.',
    feature: 'virtualization',
  },
  {
    n: 5,
    name: 'Signal band',
    description:
      'Split hero with an arc glow; an accent band holds a table that sorts, filters, pins and groups itself.',
    feature: 'sorting',
  },
  {
    n: 6,
    name: 'Blueprint replay',
    description:
      'Spec-sheet grid with the self-playing demo as centerpiece; feature cells autoplay as you scroll.',
    feature: 'filtering',
  },
  {
    n: 7,
    name: 'Dune replay',
    description:
      'Box-drawing field hero that hands over to the replaying table; feature drawings play in sequence.',
    feature: 'row-selection',
  },
  {
    n: 8,
    name: 'Signal sheet',
    description:
      'Signal band hero and replay demo, followed by spec rows that act out each feature.',
    feature: 'editing',
  },
  {
    n: 9,
    name: 'Dune sheet',
    description:
      'Box-drawing hero over an edge-to-edge replay band, then a sheet of feature drawings firing at random.',
    feature: 'sorting',
  },
  {
    n: 10,
    name: 'Signal field',
    description:
      'Signal band layout with the box-drawing field behind it and a dense feature grid.',
    feature: 'grouping',
  },
  {
    n: 11,
    name: 'Replay first',
    description:
      'The replaying table above the fold beside the headline; features in a mixed-size grid below.',
    feature: 'column-pinning',
  },
];

export default function DevIndexPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 sm:px-8 sm:py-24">
      <header className="flex flex-col gap-5">
        <p className="text-xs font-medium tracking-[0.18em] text-(--dh-ink-faint) uppercase">
          shadcn-react-table · homepage experiments
        </p>
        <h1 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Eleven ways to sell a data grid.
        </h1>
        <p className="max-w-xl text-base text-pretty text-(--dh-ink-muted)">
          Each variant pitches the same library: a full-featured React table
          built on shadcn/ui and TanStack Table. Hover a row to see its feature
          drawing act out.
        </p>
        <InstallCommand className="mt-2 w-full max-w-[46rem]" />
      </header>

      <ol className="flex flex-col border-t border-(--dh-rule)">
        {variants.map((v) => (
          <li key={v.n} data-variant={v.n} className="bg-transparent">
            <Link
              href={`/dev/${v.n}`}
              className="dh-tile-host group grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 border-b border-(--dh-rule) py-5 outline-2 -outline-offset-2 outline-transparent focus-visible:outline-(--dh-focus) sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-6"
            >
              <span className="hidden font-mono text-sm text-(--dh-ink-faint) tabular-nums sm:block">
                {String(v.n).padStart(2, '0')}
              </span>
              <span className="dh-tile block p-1.5">
                <span className="dh-tile-glow" aria-hidden="true" />
                <OutlineArt feature={v.feature} />
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="font-mono text-xs text-(--dh-ink-faint) sm:hidden">
                    {String(v.n).padStart(2, '0')}
                  </span>
                  <span className="truncate text-lg font-semibold tracking-tight text-(--dh-ink) sm:text-xl">
                    {v.name}
                  </span>
                </span>
                <span className="text-sm text-pretty text-(--dh-ink-muted)">
                  {v.description}
                </span>
              </span>
              <ArrowRightIcon
                aria-hidden="true"
                className="hidden size-5 text-(--dh-ink-faint) transition-transform duration-300 ease-(--dh-ease-out) group-hover:translate-x-1 group-hover:text-(--dh-accent) sm:block"
              />
            </Link>
          </li>
        ))}
      </ol>

      <footer className="text-sm text-(--dh-ink-faint)">
        Not indexed. The live homepage is at{' '}
        <Link
          href="/"
          className="text-(--dh-ink-muted) underline decoration-(--dh-rule-strong) underline-offset-4 hover:text-(--dh-ink)"
        >
          /
        </Link>
        .
      </footer>
    </main>
  );
}
