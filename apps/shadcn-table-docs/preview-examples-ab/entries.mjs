// PREVIEW ONLY: tab links and redirects of the two preview sections (EX A, EX B); delete with the demo.
/**
 * Like the real Examples section (docs-layout L13), EX A and EX B have no
 * index page: their tabs link the first row, and next.config.mjs redirects
 * the bare section URL there (lib/examples-entry.mjs sectionEntryUrl).
 */
import metaA from '../content/docs/examples-a/meta.json' with { type: 'json' };
import metaB from '../content/docs/examples-b/meta.json' with { type: 'json' };
import { sectionEntryUrl } from '../lib/examples-entry.mjs';

export const PREVIEW_SECTIONS = [
  {
    text: 'EX A',
    section: '/docs/examples-a',
    url: sectionEntryUrl('/docs/examples-a', metaA),
  },
  {
    text: 'EX B',
    section: '/docs/examples-b',
    url: sectionEntryUrl('/docs/examples-b', metaB),
  },
];
