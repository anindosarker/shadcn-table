#!/usr/bin/env node
// Usage (inside packages/shadcn-table): pnpm registry:build, or
// pnpm registry:dev for a local copy under .dev/ (pnpm preview builds it and
// serves it on port 5310).
// Collects the items of every edition (registry/<edition>/registry.ts, in
// EDITIONS order) into registry.json, then `shadcn build` turns it into
// public/r/<name>.json. The DEFAULT_EDITION items follow once more under
// their plain names (`shadcn-table`, `shadcn-table-locale-<code>`), the
// GitHub shorthand aliases (aliasItems in lib.mjs).
import fs from 'node:fs';
import path from 'node:path';
import {
  aliasItems,
  DEFAULT_EDITION,
  DEV,
  EDITIONS,
  PKG,
  REFERENCE_EDITION,
} from './lib.mjs';

const OUT = path.join(PKG, DEV ? '.dev/registry.json' : 'registry.json');

// Every edition's main item is `shadcn-table-<edition>` (registry.ts in its
// tree); the catalog's own name and homepage come from the reference edition.
const editions = await Promise.all(
  EDITIONS.map(
    async (edition) =>
      (await import(`../../registry/${edition}/registry.ts`)).registry,
  ),
);
const reference = editions[EDITIONS.indexOf(REFERENCE_EDITION)];
const aliases = aliasItems(editions[EDITIONS.indexOf(DEFAULT_EDITION)].items);

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: reference.name,
  homepage: reference.homepage,
  items: [...editions.flatMap((edition) => edition.items), ...aliases],
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
for (const { items } of editions) {
  const [main, ...locales] = items;
  console.log(
    `${path.relative(PKG, OUT)}: ${main.files.length} files in ${main.name}, ${locales.length} locale items, ${main.registryDependencies.length} registryDependencies`,
  );
}
console.log(
  `${path.relative(PKG, OUT)}: ${aliases.length} aliases of the ${DEFAULT_EDITION} items (${aliases[0].name}, ...)`,
);
