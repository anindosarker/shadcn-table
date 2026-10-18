import Link from 'next/link';
import {
  FEATURES,
  OutlineArt,
} from '@/components/dev-home/shared/outline-tiles';

/**
 * Features as a tree listing. Each row is a tile host: hovering or focusing
 * it draws in the feature's outline drawing at the row's end and plays it.
 */
export function FeatureList() {
  return (
    <div className="v4-term">
      <p className="v4-term-head" aria-hidden="true">
        <span>{'<ShadcnTable />'}</span>
      </p>
      <ul className="v4-term-list">
        {FEATURES.map((f) => (
          <li key={f.id}>
            <Link href={f.docsHref} className="v4-feat dh-tile-host">
              <span aria-hidden="true" className="v4-feat-branch">
                ──
              </span>
              <span className="v4-feat-title">{f.title}</span>
              <span className="v4-feat-desc">{f.description}</span>
              <code className="v4-feat-prop">{f.prop}</code>
              <span className="v4-feat-art">
                <span className="dh-tile v4-feat-tile">
                  <span className="dh-tile-glow" aria-hidden="true" />
                  <OutlineArt feature={f.id} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
