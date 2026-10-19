#!/usr/bin/env node
// Usage (inside packages/shadcn-table): pnpm registry:build, or
// pnpm registry:dev for a local copy under .dev/ served on port 5310.
// Collects the items of every base tree (bases/<base>/registry.ts) into
// registry.json, then `shadcn build` turns it into public/r/<name>.json.
import fs from 'node:fs';
import path from 'node:path';
import { registry as radix } from '../bases/radix/registry.ts';
import { DEV, PKG } from './registry-lib.mjs';

const OUT = path.join(PKG, DEV ? '.dev/registry.json' : 'registry.json');

const bases = [radix];

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: radix.name,
  homepage: radix.homepage,
  items: bases.flatMap((base) => base.items),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(registry, null, 2) + '\n');
for (const base of bases) {
  const [main, ...locales] = base.items;
  console.log(
    `${path.relative(PKG, OUT)}: ${main.files.length} files in ${main.name}, ${locales.length} locale items, ${main.registryDependencies.length} registryDependencies`,
  );
}
