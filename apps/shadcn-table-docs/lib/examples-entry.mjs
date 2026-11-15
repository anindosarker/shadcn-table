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

/**
 * Preview-only comparison pages: `<slug>-new-format.mdx` and
 * `<slug>-new-format-<n>.mdx` show rewrites of `<slug>.mdx` next to it in the
 * sidebar. They render the original's example, so lookups keyed on the page
 * slug (Storybook story, registry page) resolve them to the original.
 */
const PREVIEW_SUFFIX = /-new-format(-\d+)?$/;

/** True for a preview-only comparison page slug. */
export const isPreviewPage = (/** @type {string} */ slug) =>
  PREVIEW_SUFFIX.test(slug);

/** The example page a slug stands for: a preview page's original, else itself. */
export const examplePageSlug = (/** @type {string} */ slug) =>
  slug.replace(PREVIEW_SUFFIX, '');
