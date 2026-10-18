import {
  getFeature,
  type FeatureId,
} from '@/components/dev-home/shared/outline-tiles';
import { SignalDemo } from '@/components/dev-home/v5/signal-demo';

/**
 * One callout per replay step, in the order the demo plays them, with the
 * table option that turns the feature on.
 */
const CALLOUTS: readonly {
  key: string;
  feature: FeatureId;
  note: string;
  prop: string;
}[] = [
  {
    key: 'A',
    feature: 'sorting',
    note: 'Salary, highest first',
    prop: 'enableSorting',
  },
  {
    key: 'B',
    feature: 'filtering',
    note: 'States starting with New',
    prop: 'enableColumnFilters',
  },
  {
    key: 'C',
    feature: 'column-pinning',
    note: 'Last name held left',
    prop: 'enableColumnPinning',
  },
  {
    key: 'D',
    feature: 'grouping',
    note: 'Rows grouped by state',
    prop: 'enableGrouping',
  },
];

/**
 * The replay demo mounted on a gridded plate, with a ruler of static
 * callouts naming each step it plays.
 */
export function Specimen() {
  return (
    <figure className="v6-specimen" aria-labelledby="v6-fig-caption">
      <ol className="v6-callouts" aria-label="What the replay does">
        {CALLOUTS.map((c) => {
          const f = getFeature(c.feature);
          return (
            <li key={c.key} className="v6-callout">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="v6-callout-key">
                  {c.key}
                </span>
                <span className="text-sm font-semibold tracking-tight text-(--dh-ink)">
                  {f.title}
                </span>
              </span>
              <span className="text-xs leading-snug text-(--dh-ink-muted)">
                {c.note}
              </span>
              <code className="v6-callout-prop">{c.prop}</code>
            </li>
          );
        })}
      </ol>

      <div className="v6-plate">
        <figcaption
          id="v6-fig-caption"
          className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
        >
          <span className="v3-label">
            <span className="text-(--dh-accent)">Fig. 1</span>
            <span aria-hidden="true"> / </span>
            Replay specimen
          </span>
          <span className="text-xs text-(--dh-ink-faint)">
            A live ST table. Click in to take over.
          </span>
        </figcaption>
        <div className="v6-mount">
          <span aria-hidden="true" className="v6-reg v6-reg-tl" />
          <span aria-hidden="true" className="v6-reg v6-reg-tr" />
          <span aria-hidden="true" className="v6-reg v6-reg-bl" />
          <span aria-hidden="true" className="v6-reg v6-reg-br" />
          <SignalDemo />
        </div>
      </div>
    </figure>
  );
}
