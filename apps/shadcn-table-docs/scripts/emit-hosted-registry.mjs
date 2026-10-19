#!/usr/bin/env node
/**
 * Hosted registry for the docs site: public/r/radix/ and public/r/base/
 * (gitignored), one directory per shadcn base, each with its own
 * registry.json catalog. next.config.mjs maps `/r/<style>/<name>.json` onto
 * these, so `shadcn add https://www.shadcn-table.com/r/<base>/<name>.json`
 * and the namespace form `@st=https://www.shadcn-table.com/r/{style}/{name}.json`
 * both resolve.
 *
 * Interim: the library's `registry:hosted` root script will own this emit;
 * until it lands, this script composes the directories from the built
 * library items (packages/shadcn-table/public/r, `pnpm -w registry:build`)
 * and a `shadcn build` of the docs example items (registry.json here,
 * `pnpm -w registry:items`). Both bases publish the Radix item names: the
 * Base UI edition `shadcn-table-base` is served as `/r/base/shadcn-table.json`
 * and its locales as `/r/base/shadcn-table-locale-<code>.json`, so one item
 * name works for every style. GitHub-form registryDependencies become the
 * hosted URL of the same item under the same base.
 *
 * Usage (inside apps/shadcn-table-docs): node scripts/emit-hosted-registry.mjs
 * NEXT_PUBLIC_SITE_URL overrides the origin written into the dependencies.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB_R = path.join(
  APP,
  '..',
  '..',
  'packages',
  'shadcn-table',
  'public',
  'r',
);
const OUT = path.join(APP, 'public', 'r');
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.shadcn-table.com'
).replace(/\/$/, '');
const GITHUB_PREFIX = 'anindosarker/shadcn-table/';

/** Library item name per base, as `registry:build` emits them. */
const BASE_ITEM = { radix: 'shadcn-table', base: 'shadcn-table-base' };
const BASES = Object.keys(BASE_ITEM);

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};

/** `shadcn-table-base-locale-de` to `shadcn-table-locale-de`; the Radix names stay. */
const hostedName = (name) => {
  for (const [base, item] of Object.entries(BASE_ITEM)) {
    if (base === 'radix') continue;
    if (name === item) return BASE_ITEM.radix;
    if (name.startsWith(`${item}-`))
      return `${BASE_ITEM.radix}-${name.slice(item.length + 1)}`;
  }
  return name;
};

/** Which base a built library item belongs to. */
const baseOf = (name) =>
  name === BASE_ITEM.base || name.startsWith(`${BASE_ITEM.base}-`)
    ? 'base'
    : 'radix';

/**
 * GitHub-form dependencies (`anindosarker/shadcn-table/<item>[#branch]`)
 * become the hosted URL of that item under the given base. Bare shadcn/ui
 * part names and URLs pass through.
 */
const hostedDeps = (deps = [], base) =>
  deps.map((dep) => {
    if (!dep.startsWith(GITHUB_PREFIX)) return dep;
    const item = dep.slice(GITHUB_PREFIX.length).replace(/#.*$/, '');
    return `${SITE_URL}/r/${base}/${hostedName(item)}.json`;
  });

/** Catalog entry: the item without file contents. */
const catalogEntry = (item) => ({
  ...item,
  files: item.files?.map(({ content: _content, ...file }) => file),
});

if (!fs.existsSync(path.join(LIB_R, 'registry.json'))) {
  console.error(
    `emit-hosted-registry: ${path.relative(APP, LIB_R)}/registry.json missing; run pnpm -w registry:build first`,
  );
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });

// Example items: one `shadcn build` of the docs registry.json, then a copy
// per base with the dependencies pointed at that base.
const examplesOut = path.join(OUT, '.examples');
execFileSync(
  'pnpm',
  ['exec', 'shadcn', 'build', 'registry.json', '--output', examplesOut],
  { cwd: APP, stdio: 'inherit' },
);
const exampleItems = readJson(path.join(examplesOut, 'registry.json')).items;

const catalogs = Object.fromEntries(BASES.map((base) => [base, []]));

for (const base of BASES) {
  for (const { name } of exampleItems) {
    const item = readJson(path.join(examplesOut, `${name}.json`));
    item.registryDependencies = hostedDeps(item.registryDependencies, base);
    writeJson(path.join(OUT, base, `${name}.json`), item);
    catalogs[base].push(catalogEntry(item));
  }
}
fs.rmSync(examplesOut, { recursive: true, force: true });

// Library items: each built item goes to its base's directory under the
// Radix item name.
for (const { name } of readJson(path.join(LIB_R, 'registry.json')).items) {
  const base = baseOf(name);
  const item = readJson(path.join(LIB_R, `${name}.json`));
  item.name = hostedName(name);
  item.registryDependencies = hostedDeps(item.registryDependencies, base);
  writeJson(path.join(OUT, base, `${item.name}.json`), item);
  catalogs[base].unshift(catalogEntry(item));
}

for (const base of BASES) {
  writeJson(path.join(OUT, base, 'registry.json'), {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'shadcn-table',
    homepage: SITE_URL,
    items: catalogs[base],
  });
  console.log(
    `public/r/${base}: ${catalogs[base].length} items (${catalogs[base].filter((i) => !i.name.startsWith('example-')).length} library, ${exampleItems.length} examples)`,
  );
}
