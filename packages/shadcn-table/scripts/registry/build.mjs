#!/usr/bin/env node
// Usage (inside packages/shadcn-table): pnpm registry:build, or
// pnpm registry:dev for a local copy under .dev/ (pnpm preview builds it and
// serves it on port 5310).
// Collects the items of every base (registry/<base>/registry.ts, in
// BASES order) into registry.json, then `shadcn build` turns it into
// public/r/<name>.json. The DEFAULT_BASE items follow once more under
// their plain names (`shadcn-table`, `shadcn-table-locale-<code>`), the
// GitHub shorthand aliases (aliasItems in lib.mjs).
import fs from 'node:fs';
import path from 'node:path';
import {
  aliasItems,
  DEFAULT_BASE,
  DEV,
  BASES,
  PKG,
  REFERENCE_BASE,
} from './lib.mjs';

const OUT = path.join(PKG, DEV ? '.dev/registry.json' : 'registry.json');

// Every base's main item is `shadcn-table-<base>` (registry.ts in its
// tree); the catalog's own name and homepage come from the reference base.
const bases = await Promise.all(
  BASES.map(
    async (base) =>
      (await import(`../../registry/${base}/registry.ts`)).registry,
  ),
);
const reference = bases[BASES.indexOf(REFERENCE_BASE)];
const aliases = aliasItems(bases[BASES.indexOf(DEFAULT_BASE)].items);

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: reference.name,
  homepage: reference.homepage,
  items: [...bases.flatMap((base) => base.items), ...aliases],
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
for (const { items } of bases) {
  const [main, ...locales] = items;
  console.log(
    `${path.relative(PKG, OUT)}: ${main.files.length} files in ${main.name}, ${locales.length} locale items, ${main.registryDependencies.length} registryDependencies`,
  );
}
console.log(
  `${path.relative(PKG, OUT)}: ${aliases.length} aliases of the ${DEFAULT_BASE} items (${aliases[0].name}, ...)`,
);
