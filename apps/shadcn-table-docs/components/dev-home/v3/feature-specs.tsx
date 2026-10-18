import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import {
  FEATURES,
  OutlineArt,
  type Feature,
} from '@/components/dev-home/shared/outline-tiles';

/** `enableX` props read as switches; the rest are shown as written. */
const propLine = (f: Feature) =>
  /^enable\w+$/.test(f.prop) ? `${f.prop}: true` : f.prop;

/**
 * The spec grid: one dashed cell per feature. The whole cell is the link
 * and the hover host, so the drawing plays and the dashes turn accent.
 */
export function FeatureSpecs() {
  return (
    <ul className="v3-grid v3-grid-4">
      {FEATURES.map((f, i) => (
        <li key={f.id} className="v3-cell flex">
          <Link href={f.docsHref} className="v3-spec dh-tile-host w-full">
            <span
              aria-hidden="true"
              className="flex items-center justify-between"
            >
              <span className="v3-label">
                F.{String(i + 1).padStart(2, '0')}
              </span>
              <span className="v3-label flex items-center gap-1">
                Docs
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="v3-spec-arrow size-3.5"
                />
              </span>
            </span>
            <span className="dh-tile px-2 py-1">
              <OutlineArt feature={f.id} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-base font-semibold tracking-tight text-(--dh-ink)">
                {f.title}
              </span>
              <span className="text-sm leading-snug text-pretty text-(--dh-ink-muted)">
                {f.description}
              </span>
            </span>
            <code className="v3-spec-prop mt-auto">{propLine(f)}</code>
          </Link>
        </li>
      ))}
    </ul>
  );
}
