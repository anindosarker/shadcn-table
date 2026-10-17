#!/usr/bin/env node
/**
 * Writes apps/shadcn-react-table-docs/registry.json with one shadcn registry
 * item per docs example (examples/<slug>/TS.tsx plus makeData.ts when
 * present). The root registry.json includes this file, so the GitHub
 * namespace serves every example as
 * `anindosarker/shadcn-react-table/example-<slug>`.
 *
 * Per item:
 * - name `example-<slug>`, type `registry:block`
 * - title and description from the example's docs page frontmatter
 *   (content/docs/examples/<slug>.mdx, or the page that renders the
 *   example's component), else the slug in Title Case
 * - registryDependencies: the library item pinned to the docs branch from
 *   lib/shared.ts gitConfig, plus the shadcn parts the example
 *   imports from `@/components/ui/<part>` (library paths excluded)
 * - dependencies: third-party packages imported by the example files, other
 *   than react, react-dom and lucide-react (already library dependencies)
 * - files: targets under `@components/examples/<slug>/` so the two files land
 *   side by side in the project's components directory and `./makeData`
 *   keeps resolving
 *
 * Usage:
 *   node scripts/build-registry-items.mjs            # writes registry.json
 *   node scripts/build-registry-items.mjs --resolve <dir>
 *     also writes one resolved item json (files[].content filled in) per
 *     example into <dir>, for local `shadcn add <file> --dry-run` checks
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  findExamplePage,
  loadExamplePages,
  readExampleExportName,
} from '../lib/example-pages.mjs';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const EXAMPLES_DIR = path.join(APP_DIR, 'examples');
const PAGES_DIR = path.join(APP_DIR, 'content', 'docs', 'examples');
const OUT_FILE = path.join(APP_DIR, 'registry.json');

const SHARED_FILE = path.join(APP_DIR, 'lib', 'shared.ts');
const LIBRARY_ITEM_NAME = 'shadcn-react-table';
const LIBRARY_IMPORT = '@/components/ui/shadcn-react-table';
const UI_IMPORT_PREFIX = '@/components/ui/';
/** Packages the library item already installs. */
const SKIPPED_PACKAGES = new Set(['react', 'react-dom', 'lucide-react']);
const ITEM_FILES = ['TS.tsx', 'makeData.ts'];

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

/**
 * `gitConfig` from lib/shared.ts (user, repo, branch), read as text so the
 * script needs no TypeScript loader. The library dependency carries the
 * branch as its ref: the CLI resolves every registryDependencies address on
 * its own, so an unversioned address would read the default branch instead
 * of the branch the docs are built from.
 */
async function libraryItemAddress() {
  const source = await fs.readFile(SHARED_FILE, 'utf8');
  const block = source.match(/export const gitConfig = \{([\s\S]*?)\};/)?.[1];
  const field = (key) =>
    block?.match(new RegExp(`${key}:\\s*['"]([^'"]+)['"]`))?.[1];
  const user = field('user');
  const repo = field('repo');
  const branch = field('branch');
  if (!user || !repo || !branch) {
    throw new Error(
      `gitConfig user, repo and branch not found in ${SHARED_FILE}`,
    );
  }
  return `${user}/${repo}/${LIBRARY_ITEM_NAME}#${branch}`;
}

async function buildItem(slug, pages, libraryItem) {
  const dir = path.join(EXAMPLES_DIR, slug);
  const files = [];
  const registryDependencies = new Set([libraryItem]);
  const dependencies = new Set();
  const sources = {};

  for (const name of ITEM_FILES) {
    const file = path.join(dir, name);
    if (!(await exists(file))) continue;
    const source = await fs.readFile(file, 'utf8');
    sources[name] = source;
    for (const specifier of importSpecifiers(source)) {
      if (specifier.startsWith('.')) {
        const local = specifier.replace(/^\.\//, '');
        if (
          !ITEM_FILES.some(
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
        console.warn(
          `${slug}/${name}: project import "${specifier}" has no registry mapping`,
        );
      } else if (!SKIPPED_PACKAGES.has(packageName(specifier))) {
        dependencies.add(packageName(specifier));
      }
    }
    files.push({
      path: `examples/${slug}/${name}`,
      type: 'registry:component',
      target: `@components/examples/${slug}/${name === 'TS.tsx' ? `${slug}.tsx` : name}`,
    });
  }

  const exportName = await readExampleExportName(dir);
  const page = findExamplePage({ slug, exportName }, pages);
  const title = page?.title || titleCase(slug);
  const description =
    page?.description || `${title} example from shadcn-react-table.`;

  const item = {
    name: `example-${slug}`,
    type: 'registry:block',
    title,
    description,
    registryDependencies: [...registryDependencies],
    files,
  };
  if (dependencies.size) item.dependencies = [...dependencies].sort();
  return { item, sources };
}

async function main() {
  const pages = await loadExamplePages(PAGES_DIR);
  const libraryItem = await libraryItemAddress();
  const slugs = (await fs.readdir(EXAMPLES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const items = [];
  const resolved = [];
  for (const slug of slugs) {
    if (!(await exists(path.join(EXAMPLES_DIR, slug, 'TS.tsx')))) {
      console.warn(`${slug}: no TS.tsx, skipped`);
      continue;
    }
    const { item, sources } = await buildItem(slug, pages, libraryItem);
    items.push(item);
    resolved.push({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      ...item,
      files: item.files.map((file) => ({
        ...file,
        content: sources[path.basename(file.path)],
      })),
    });
  }

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'srt-examples',
    homepage: 'https://github.com/anindosarker/shadcn-react-table',
    items,
  };
  await fs.writeFile(OUT_FILE, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(
    `${path.relative(process.cwd(), OUT_FILE)}: ${items.length} items`,
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
