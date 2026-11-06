#!/usr/bin/env node
// Usage (repo root): pnpm registry:hosted, after `pnpm registry:build` and
// `pnpm registry:items` (the docs `build` script runs all three before
// `next build`).
//
// Emits the hosted registries the docs site serves, one directory per base
// (BASES in lib.mjs):
//   apps/shadcn-table-docs/public/r/radix/   from the Radix items
//   apps/shadcn-table-docs/public/r/base/    from the Base UI items
//   apps/shadcn-table-docs/public/r/aria/    from the React Aria items
// Each directory gets its own registry.json catalog (the base's core item, its
// Lucide main item, its icon set items, its locale items and the base's
// example items) and the resolved item files `shadcn build` produces from it.
// The item names are the same in every directory (`shadcn-table-core`,
// `shadcn-table`, `shadcn-table-<set>`, `shadcn-table-locale-<code>`,
// `example-<slug>`), so the namespace form
// `@st=https://www.shadcn-table.com/r/{style}/{name}.json` resolves
// `@st/shadcn-table` to the consumer's own base; the example items come from
// that base's examples/<base> sources (baseExampleItems).
//
// The GitHub shorthand aliases in the committed catalogs (aliasItems in
// lib.mjs: the plain names of the default base's items) are skipped: baseItems
// and baseExampleItems return the per-base items only.
//
// Reads the committed registry.json files, which keep the GitHub addresses;
// only the hosted copies get hosted addresses: the main, icon set, locale and
// example items depend on `<HOSTED_URL>/<base>/shadcn-table-core.json`, and
// every file path is made relative
// to the repo root so one `shadcn build` run resolves both the library and the
// example sources. REGISTRY_HOSTED_URL (or NEXT_PUBLIC_SITE_URL plus /r)
// overrides the default https://www.shadcn-table.com/r (a preview deployment,
// for example).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { DOCS, BASES, baseExampleItems, baseItems, PKG, ROOT } from './lib.mjs';

const OUT_ROOT = path.join(DOCS, 'public/r');
// REGISTRY_HOSTED_URL wins; otherwise the docs origin (NEXT_PUBLIC_SITE_URL,
// what lib/install.ts writes into the commands) plus /r; then production.
const HOSTED_URL = (
  process.env.REGISTRY_HOSTED_URL ??
  (process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/r`
    : 'https://www.shadcn-table.com/r')
).replace(/\/$/, '');
const SHADCN = path.join(PKG, 'node_modules/.bin/shadcn');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const library = readJson(path.join(PKG, 'registry.json'));
const examples = readJson(path.join(DOCS, 'registry.json'));

// The hosted name of every base's main item, whatever its committed name; the
// core, icon set and locale items take it as their prefix.
const HOSTED_NAME = 'shadcn-table';
const CORE_NAME = `${HOSTED_NAME}-core`;

const prefixPaths = (item, prefix) => ({
  ...item,
  files: item.files.map((file) => ({
    ...file,
    path: `${prefix}/${file.path}`,
  })),
});

for (const base of BASES) {
  const outDir = path.join(OUT_ROOT, base);
  const { core, main, editions, locales } = baseItems(library, base);
  if (!core || !main || editions.length === 0 || locales.length === 0) {
    console.error(
      `hosted.mjs: the ${base} core, main, icon set or locale items missing from packages/shadcn-table/registry.json; run pnpm registry:build first`,
    );
    process.exit(1);
  }
  const coreUrl = `${HOSTED_URL}/${base}/${CORE_NAME}.json`;
  // Every dependency on the committed core address becomes the hosted core.
  const onHostedCore = (item) => ({
    ...item,
    registryDependencies: item.registryDependencies?.map((dep) =>
      dep.endsWith(`/${core.name}`) ? coreUrl : dep,
    ),
  });
  const exampleItems = baseExampleItems(examples, base).map((item) =>
    prefixPaths(onHostedCore(item), path.relative(ROOT, DOCS)),
  );
  if (exampleItems.length === 0) {
    console.error(
      `hosted.mjs: no ${base} example items in apps/shadcn-table-docs/registry.json; run pnpm registry:items first`,
    );
    process.exit(1);
  }
  const localePrefix = `${main.name}-locale-`;

  const libPrefix = path.relative(ROOT, PKG);
  // An item's name and description name its main item: the committed name in
  // registry.json (lib.mjs), the hosted name here.
  const hosted = (item, name) =>
    prefixPaths(
      onHostedCore({
        ...item,
        name,
        description: item.description.replaceAll(main.name, HOSTED_NAME),
      }),
      libPrefix,
    );
  const hostedCore = hosted(core, CORE_NAME);
  const hostedMain = hosted(main, HOSTED_NAME);
  const hostedEditions = editions.map((item) =>
    hosted(item, `${HOSTED_NAME}${item.name.slice(main.name.length)}`),
  );
  const hostedLocales = locales.map((item) =>
    hosted(
      item,
      `${HOSTED_NAME}-locale-${item.name.slice(localePrefix.length)}`,
    ),
  );

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: `${library.name}-${base}`,
    homepage: library.homepage,
    items: [
      hostedCore,
      hostedMain,
      ...hostedEditions,
      ...hostedLocales,
      ...exampleItems,
    ],
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
    `${path.relative(ROOT, outDir)}: ${written.length - 1} items (core, main, ${hostedEditions.length} icon set, ${hostedLocales.length} locale, ${exampleItems.length} example) + registry.json`,
  );
}
