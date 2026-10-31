#!/usr/bin/env node
// Usage (inside packages/shadcn-table): pnpm registry:build, or pnpm
// registry:dev for a local copy under .dev/ (pnpm preview builds it and serves
// it on port 5310). Collects the items of every base
// (registry/<base>/registry.ts, in BASES order) into registry.json, then
// `shadcn build` turns it into public/r/<name>.json. The DEFAULT_BASE items
// follow once more under their plain names (`shadcn-table`,
// `shadcn-table-core`, `shadcn-table-<set>`, `shadcn-table-locale-<code>`),
// the GitHub shorthand aliases (aliasItems in lib.mjs).
//
// `--dev` also merges the docs example items (examples.mjs, core addresses as
// local server URLs) into .dev/registry.json, so the local server resolves
// `example-<slug>-<base>` and the core item it depends on without GitHub.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  aliasItems,
  DEFAULT_BASE,
  DEV,
  DOCS,
  BASES,
  PKG,
  REFERENCE_BASE,
} from './lib.mjs';

const OUT = path.join(PKG, DEV ? '.dev/registry.json' : 'registry.json');

// Every base's main item is `shadcn-table-<base>` (registry.ts in its tree);
// the catalog's own name and homepage come from the reference base.
const bases = await Promise.all(
  BASES.map(
    async (base) =>
      (await import(`../../registry/${base}/registry.ts`)).registry,
  ),
);
const reference = bases[BASES.indexOf(REFERENCE_BASE)];
const aliases = aliasItems(bases[BASES.indexOf(DEFAULT_BASE)].items);

/**
 * The docs example items with core addresses as local server URLs, file paths
 * made relative to the package, where `shadcn build` runs.
 */
const devExampleItems = () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'shadcn-table-examples-'));
  const out = path.join(tmp, 'registry.json');
  try {
    execFileSync(
      process.execPath,
      [
        path.join(path.dirname(fileURLToPath(import.meta.url)), 'examples.mjs'),
        '--dev',
        '--out',
        out,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    );
    const prefix = path.relative(PKG, DOCS).split(path.sep).join('/');
    return JSON.parse(fs.readFileSync(out, 'utf8')).items.map((item) => ({
      ...item,
      files: item.files.map((file) => ({
        ...file,
        path: `${prefix}/${file.path}`,
      })),
    }));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
};

const examples = DEV ? devExampleItems() : [];

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: reference.name,
  homepage: reference.homepage,
  items: [...bases.flatMap((base) => base.items), ...aliases, ...examples],
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
for (const { items } of bases) {
  const [core, main] = items;
  const iconSets = items.filter((item) =>
    item.files.some((file) => file.path.includes('/shadcn-table/icons/')),
  );
  const locales = items.filter((item) => item.name.includes('-locale-'));
  console.log(
    `${path.relative(PKG, OUT)}: ${core.files.length} files in ${core.name}, ${main.name} (Lucide) and ${iconSets.length} icon set items on it, ${locales.length} locale items, ${core.registryDependencies.length} registryDependencies`,
  );
}
console.log(
  `${path.relative(PKG, OUT)}: ${aliases.length} aliases of the ${DEFAULT_BASE} items (${aliases[0].name}, ...)`,
);
if (DEV) {
  console.log(
    `${path.relative(PKG, OUT)}: ${examples.length} docs example items`,
  );
}
