/**
 * The Examples section has no index page (docs-layout L13): `/docs/examples`
 * redirects (next.config.mjs) to the first example in
 * content/docs/examples/meta.json order. Site navigation (section tabs, top
 * nav, home page nav and footer) links `/docs/examples`, so its Examples link
 * stays active on every example page; page lists (lib/routes.ts) and content
 * links name an example page itself.
 *
 * Plain ESM so next.config.mjs can import it; tsconfig has `allowJs`, so the
 * app imports it with types from the JSDoc.
 */
import meta from '../content/docs/examples/meta.json' with { type: 'json' };

/** The section's URL; it has no page of its own. */
export const EXAMPLES_URL = '/docs/examples';

/** First page slug in meta.json, skipping "---Label---" separators. */
const firstSlug = meta.pages.find((entry) => /^[a-z0-9-]+$/.test(entry));
if (!firstSlug)
  throw new Error('content/docs/examples/meta.json lists no page');

/** The first example page, `/docs/examples/<slug>`. */
export const FIRST_EXAMPLE_URL = `${EXAMPLES_URL}/${firstSlug}`;
