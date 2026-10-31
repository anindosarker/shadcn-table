#!/usr/bin/env node
// Usage: pnpm check:icons (repo root) or pnpm --filter shadcn-table
// check:icons, also a CI step of the `library` job (once, the maps are
// byte-identical across bases).
//
// Every icon set holds the same keys: the Lucide map icons.ts and the maps
// below icons/ (tabler, phosphor, hugeicons, remixicon) of every base. The
// keys are read with a regex over the `ST_Default_Icons` object literal, one
// `key:` per line, with no TypeScript import. It prints one line per base,
// then every missing map, missing key and extra key against icons.ts, and
// exits non-zero on any problem; it never edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { BASES } from './registry/bases.mjs';
import { PKG } from './registry/lib.mjs';

const LIB_REL = 'components/ui/shadcn-table';
const REFERENCE_MAP = 'icons.ts';
const MAPS = [
  'icons/tabler.ts',
  'icons/phosphor.ts',
  'icons/hugeicons.ts',
  'icons/remixicon.ts',
];

/** The keys of the `ST_Default_Icons` object literal in `file`, sorted. */
const readKeys = (file) => {
  const source = fs.readFileSync(file, 'utf8');
  const body = source.match(
    /export const ST_Default_Icons\b[^{]*\{([\s\S]*?)\n\}/,
  )?.[1];
  if (body === undefined) return undefined;
  return [...body.matchAll(/^\s+(\w+):/gm)].map((m) => m[1]).sort();
};

let failed = 0;

for (const base of BASES) {
  const lib = path.join(PKG, 'registry', base, LIB_REL);
  const problems = [];
  const reference = readKeys(path.join(lib, REFERENCE_MAP));
  if (!reference) {
    problems.push(`${REFERENCE_MAP}: no ST_Default_Icons object`);
  } else {
    for (const map of MAPS) {
      const file = path.join(lib, map);
      if (!fs.existsSync(file)) {
        problems.push(`${map}: missing`);
        continue;
      }
      const keys = readKeys(file);
      if (!keys) {
        problems.push(`${map}: no ST_Default_Icons object`);
        continue;
      }
      for (const key of reference.filter((k) => !keys.includes(k))) {
        problems.push(`${map}: missing key ${key}`);
      }
      for (const key of keys.filter((k) => !reference.includes(k))) {
        problems.push(`${map}: extra key ${key}`);
      }
    }
  }
  console.log(
    `check-icons: registry/${base}: ${reference?.length ?? 0} keys in ${REFERENCE_MAP}, ${problems.length} problems in ${MAPS.length} maps`,
  );
  for (const problem of problems) console.log(`  ${problem}`);
  failed += problems.length;
}

process.exit(failed ? 1 : 0);
