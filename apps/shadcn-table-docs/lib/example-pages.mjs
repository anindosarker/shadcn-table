/**
 * Docs pages that render an example. Shared by
 * packages/shadcn-table/scripts/registry/examples.mjs (registry item title and
 * description) and lib/example-prompt.ts (the page URL in the copy prompt),
 * so both resolve an example to the same page.
 *
 * Plain ESM so the Node script can import it without a TypeScript loader;
 * tsconfig has `allowJs`, so the app imports it with types from the JSDoc.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * @typedef {{ slug: string; title?: string; description?: string } & Record<string, string>} ExamplePage
 */

/**
 * Minimal frontmatter reader: `key: value` lines between the first `---` pair.
 * @param {string} source
 * @returns {Record<string, string>}
 */
export function readFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  /** @type {Record<string, string>} */
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(\w+):\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/''/g, "'");
    } else if (value.startsWith('"') && value.endsWith('"')) {
      value = JSON.parse(value);
    }
    data[pair[1]] = value;
  }
  return data;
}

/**
 * Reads every `<pagesDir>/*.mdx`, keyed by page slug and by the name of each
 * `<SomethingExample />` component the page body renders (first page wins).
 * @param {string} pagesDir
 * @returns {Promise<{ bySlug: Map<string, ExamplePage>; byComponent: Map<string, ExamplePage> }>}
 */
export async function loadExamplePages(pagesDir) {
  /** @type {Map<string, ExamplePage>} */
  const bySlug = new Map();
  /** @type {Map<string, ExamplePage>} */
  const byComponent = new Map();
  const files = (await fs.readdir(pagesDir)).filter((f) => f.endsWith('.mdx'));
  for (const file of files) {
    const source = await fs.readFile(path.join(pagesDir, file), 'utf8');
    const page = {
      slug: file.replace(/\.mdx$/, ''),
      ...readFrontmatter(source),
    };
    bySlug.set(page.slug, page);
    for (const match of source.matchAll(/<([A-Z][A-Za-z0-9]*Example)\s*\/>/g)) {
      if (!byComponent.has(match[1])) byComponent.set(match[1], page);
    }
  }
  return { bySlug, byComponent };
}

/**
 * `aggregation-and-grouping` to `AggregationAndGrouping`: the slug's words
 * in PascalCase, the way scripts/example-map.mjs names the components.
 * @param {string} slug
 */
export const pascal = (slug) =>
  slug
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

/**
 * Name of the component a docs page renders for examples/<edition>/<slug>,
 * `<PascalCase(slug)>Example`, as scripts/example-map.mjs generates it.
 * @param {string} slug
 */
export const exampleExportName = (slug) => `${pascal(slug)}Example`;

/**
 * The docs page for an example: the page named after the slug, else the
 * first page rendering the example's component.
 * @param {string} slug
 * @param {Awaited<ReturnType<typeof loadExamplePages>>} pages
 * @returns {ExamplePage | undefined}
 */
export function findExamplePage(slug, pages) {
  return (
    pages.bySlug.get(slug) ?? pages.byComponent.get(exampleExportName(slug))
  );
}
