#!/usr/bin/env node
/**
 * Writes the docs app's registry.json with one shadcn registry item per
 * docs example and base (examples/<base>/<slug>/TS.tsx plus every
 * other source file in the folder, subfolders included; BASES in
 * lib.mjs, the reference base's folder defines the example list). The
 * root registry.json includes this file, so the GitHub namespace serves
 * every example as `anindosarker/shadcn-table/example-<slug>-<base>`
 * (`example-basic-radix`, `example-basic-base`, `example-basic-aria`;
 * baseItemName); hosted.mjs serves each base's items under the plain
 * `example-<slug>` in /r/<base>/. The DEFAULT_BASE items follow once
 * more under that plain name, the GitHub shorthand aliases (aliasItems in
 * lib.mjs), which hosted.mjs skips.
 *
 * Per item:
 * - name `baseItemName('example-<slug>', base)`, type `registry:block`
 * - title and description from the example's docs page frontmatter
 *   (content/docs/examples/<slug>.mdx, or the page that renders the
 *   example's component), else the slug in Title Case
 * - registryDependencies: the shadcn parts that base's sources import
 *   from `@/components/ui/<part>` (library paths excluded). No dependency on
 *   the library item: the example works on every base's item alike, so
 *   the docs say to install the table first.
 * - dependencies: third-party packages imported by the example files, other
 *   than react, react-dom and lucide-react (already library dependencies)
 * - files: `examples/<base>/<slug>/<file>`, targets under
 *   `@components/examples/<slug>/` in every base, keeping the folder
 *   layout, so the files land side by side in the project's components
 *   directory and relative imports (`./makeData`, `../hooks/...`) keep
 *   resolving. The entry file alone is renamed to `<slug>.tsx`, so no other
 *   file may import it: the CLI reads every file from the repository at its
 *   `path`, so the import could not be rewritten on the way out. The build
 *   fails on such an import; move the shared export into the sibling.
 *
 * Usage (repo root):
 *   pnpm registry:items                               # writes registry.json
 *   node packages/shadcn-table/scripts/registry/examples.mjs --resolve <dir>
 *     also writes one resolved item json (files[].content filled in) per
 *     example into <dir>, for local `shadcn add <file> --dry-run` checks
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  aliasItems,
  DEFAULT_BASE,
  DOCS,
  BASES,
  baseItemName,
  REFERENCE_BASE,
} from './lib.mjs';

// The example helpers are the docs app's own (its playground imports them
// too), so they are loaded from there.
const docsLib = (file) => import(pathToFileURL(path.join(DOCS, 'lib', file)));
const { ENTRY_FILE, listExampleFiles } = await docsLib('example-files.mjs');
const { findExamplePage, loadExamplePages } =
  await docsLib('example-pages.mjs');

const APP_DIR = DOCS;
const EXAMPLES_DIR = path.join(APP_DIR, 'examples');
const PAGES_DIR = path.join(APP_DIR, 'content', 'docs', 'examples');
const OUT_FILE = path.join(APP_DIR, 'registry.json');

const LIBRARY_IMPORT = '@/components/ui/shadcn-table';
const UI_IMPORT_PREFIX = '@/components/ui/';
/** Packages the library item already installs. */
const SKIPPED_PACKAGES = new Set(['react', 'react-dom', 'lucide-react']);

const args = process.argv.slice(2);
const resolveIndex = args.indexOf('--resolve');
const resolveDir =
  resolveIndex === -1 ? null : path.resolve(args[resolveIndex + 1] ?? '');
if (resolveIndex !== -1 && !args[resolveIndex + 1]) {
  console.error('--resolve needs a directory');
  process.exit(1);
}

const exists = (file) =>
  fs
    .access(file)
    .then(() => true)
    .catch(() => false);

const titleCase = (slug) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** Every module specifier imported by a TS source, static and dynamic. */
function importSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\bimport\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bexport\s+(?:type\s+)?[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.add(match[1]);
  }
  return [...specifiers];
}

/** `@scope/name/sub` to `@scope/name`, `name/sub` to `name`. */
const packageName = (specifier) => {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

async function buildItem({ base, slug, pages }) {
  const dir = path.join(EXAMPLES_DIR, base, slug);
  const itemPath = (name) => `examples/${base}/${slug}/${name}`;
  const files = [];
  const registryDependencies = new Set();
  const dependencies = new Set();
  const sources = {};

  const itemFiles = await listExampleFiles(dir);
  for (const name of itemFiles) {
    const source = await fs.readFile(path.join(dir, name), 'utf8');
    sources[itemPath(name)] = source;
    for (const specifier of importSpecifiers(source)) {
      if (specifier.startsWith('.')) {
        const local = path.posix.join(path.posix.dirname(name), specifier);
        if (
          local === ENTRY_FILE.replace(/\.tsx$/, '') ||
          local === ENTRY_FILE
        ) {
          throw new Error(
            `${slug}/${name}: imports the entry file "${specifier}", which installs as ${slug}.tsx; export the shared value from ${name} (or another sibling) instead`,
          );
        }
        if (
          !itemFiles.some(
            (f) => f === local || f.replace(/\.tsx?$/, '') === local,
          )
        ) {
          console.warn(
            `${slug}/${name}: local import "${specifier}" is not part of the item`,
          );
        }
      } else if (
        specifier === LIBRARY_IMPORT ||
        specifier.startsWith(`${LIBRARY_IMPORT}/`)
      ) {
        // Covered by the library item.
      } else if (specifier.startsWith(UI_IMPORT_PREFIX)) {
        registryDependencies.add(
          specifier.slice(UI_IMPORT_PREFIX.length).split('/')[0],
        );
      } else if (specifier.startsWith('@/')) {
        throw new Error(
          `${slug}/${name}: project import "${specifier}" has no registry mapping`,
        );
      } else if (!SKIPPED_PACKAGES.has(packageName(specifier))) {
        dependencies.add(packageName(specifier));
      }
    }
    files.push({
      path: itemPath(name),
      type: 'registry:component',
      target: `@components/examples/${slug}/${name === ENTRY_FILE ? `${slug}.tsx` : name}`,
    });
  }

  const page = findExamplePage(slug, pages);
  const title = page?.title || titleCase(slug);
  const description =
    page?.description || `${title} example from shadcn-table.`;

  const item = {
    name: baseItemName(`example-${slug}`, base),
    type: 'registry:block',
    title,
    description,
    files,
  };
  if (registryDependencies.size) {
    item.registryDependencies = [...registryDependencies];
  }
  if (dependencies.size) item.dependencies = [...dependencies].sort();
  return { item, sources };
}

async function main() {
  const pages = await loadExamplePages(PAGES_DIR);
  const referenceDir = path.join(EXAMPLES_DIR, REFERENCE_BASE);
  const slugs = [];
  for (const entry of await fs.readdir(referenceDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!(await exists(path.join(referenceDir, entry.name, ENTRY_FILE)))) {
      console.warn(`${REFERENCE_BASE}/${entry.name}: no TS.tsx, skipped`);
      continue;
    }
    slugs.push(entry.name);
  }
  slugs.sort();

  const items = [];
  const defaultItems = [];
  const resolved = [];
  for (const base of BASES) {
    for (const slug of slugs) {
      const { item, sources } = await buildItem({ base, slug, pages });
      items.push(item);
      if (base === DEFAULT_BASE) defaultItems.push(item);
      resolved.push({
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        ...item,
        files: item.files.map((file) => ({
          ...file,
          content: sources[file.path],
        })),
      });
    }
  }

  const aliases = aliasItems(defaultItems);
  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'st-examples',
    homepage: 'https://github.com/anindosarker/shadcn-table',
    items: [...items, ...aliases],
  };
  await fs.writeFile(OUT_FILE, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(
    `${path.relative(process.cwd(), OUT_FILE)}: ${items.length} items (${slugs.length} examples, ${BASES.length} bases), ${aliases.length} ${DEFAULT_BASE} aliases`,
  );

  if (resolveDir) {
    await fs.mkdir(resolveDir, { recursive: true });
    for (const item of resolved) {
      await fs.writeFile(
        path.join(resolveDir, `${item.name}.json`),
        `${JSON.stringify(item, null, 2)}\n`,
      );
    }
    console.log(`${resolveDir}: ${resolved.length} resolved items`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
