#!/usr/bin/env node
// Usage (repo root): pnpm registry:hosted, after `pnpm registry:build` and
// `pnpm registry:items` (the docs `build` script runs all three before
// `next build`).
//
// Emits the hosted registries the docs site serves, one directory per base:
//   apps/shadcn-table-docs/public/r/radix/   from the Radix items
//   apps/shadcn-table-docs/public/r/base/    from the Base UI items
// Each directory gets its own registry.json catalog (the base's main item, its
// locale items and every example item) and the resolved item files `shadcn
// build` produces from it. The item names are the same in both directories
// (`shadcn-table`, `shadcn-table-locale-<code>`, `example-<slug>`), so the
// namespace form `@st=https://www.shadcn-table.com/r/{style}/{name}.json`
// resolves `@st/shadcn-table` to the consumer's own base. Example items carry
// no main-item dependency, so their JSON is identical in both directories.
//
// Reads the committed registry.json files, which keep the GitHub addresses;
// only the hosted copies get hosted addresses: the locale items depend on
// `<HOSTED_URL>/<base>/shadcn-table.json`, and every file path is made
// relative to the repo root so one `shadcn build` run resolves both the
// library and the example sources. REGISTRY_HOSTED_URL overrides the default
// https://www.shadcn-table.com/r (a preview deployment, for example).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PKG } from './registry-lib.mjs';

const ROOT = path.resolve(PKG, '..', '..');
const DOCS = path.join(ROOT, 'apps/shadcn-table-docs');
const OUT_ROOT = path.join(DOCS, 'public/r');
const HOSTED_URL = (
  process.env.REGISTRY_HOSTED_URL ?? 'https://www.shadcn-table.com/r'
).replace(/\/$/, '');
const SHADCN = path.join(PKG, 'node_modules/.bin/shadcn');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const library = readJson(path.join(PKG, 'registry.json'));
const examples = readJson(path.join(DOCS, 'registry.json'));

// Committed item name per base; the hosted name is `shadcn-table` for both.
const BASES = [
  { base: 'radix', committedName: 'shadcn-table' },
  { base: 'base', committedName: 'shadcn-table-base' },
];
const HOSTED_NAME = 'shadcn-table';

const prefixPaths = (item, prefix) => ({
  ...item,
  files: item.files.map((file) => ({
    ...file,
    path: `${prefix}/${file.path}`,
  })),
});

const exampleItems = examples.items.map((item) =>
  prefixPaths(item, path.relative(ROOT, DOCS)),
);

for (const { base, committedName } of BASES) {
  const outDir = path.join(OUT_ROOT, base);
  const localePrefix = `${committedName}-locale-`;
  const main = library.items.find((item) => item.name === committedName);
  const locales = library.items.filter((item) =>
    item.name.startsWith(localePrefix),
  );
  if (!main || locales.length === 0) {
    console.error(
      `emit-hosted-registry: ${committedName} or its locale items missing from packages/shadcn-table/registry.json; run pnpm registry:build first`,
    );
    process.exit(1);
  }

  const libPrefix = path.relative(ROOT, PKG);
  const hostedMain = prefixPaths({ ...main, name: HOSTED_NAME }, libPrefix);
  const hostedLocales = locales.map((item) =>
    prefixPaths(
      {
        ...item,
        name: `${HOSTED_NAME}-locale-${item.name.slice(localePrefix.length)}`,
        registryDependencies: [`${HOSTED_URL}/${base}/${HOSTED_NAME}.json`],
      },
      libPrefix,
    ),
  );

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: `${library.name}-${base}`,
    homepage: library.homepage,
    items: [hostedMain, ...hostedLocales, ...exampleItems],
  };

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const catalog = path.join(outDir, 'registry.json');
  fs.writeFileSync(catalog, JSON.stringify(registry, null, 2) + '\n');

  // The CLI's per-item spinner goes to stderr; surface it only on failure.
  try {
    execFileSync(
      SHADCN,
      [
        'build',
        path.relative(ROOT, catalog),
        '--output',
        path.relative(ROOT, outDir),
        '--cwd',
        ROOT,
      ],
      { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] },
    );
  } catch (error) {
    process.stderr.write(error.stderr ?? String(error));
    process.exit(error.status ?? 1);
  }

  const written = fs.readdirSync(outDir).filter((f) => f.endsWith('.json'));
  console.log(
    `${path.relative(ROOT, outDir)}: ${written.length - 1} items (1 main, ${hostedLocales.length} locale, ${exampleItems.length} example) + registry.json`,
  );
}
