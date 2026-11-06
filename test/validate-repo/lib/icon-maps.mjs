// icon-maps, the second check of `pnpm test validate-repo`.
//
// Every icon set holds the same keys: the Lucide map icons.ts and the maps
// below icons/ (tabler, phosphor, hugeicons, remixicon) of every base. The
// keys are read with a regex over the `ST_Default_Icons` object literal, one
// `key:` per line, with no TypeScript import. A map also never imports from
// components/icons/: each edition draws with its own set (D76). It prints one
// line per base, then every missing map, missing key, extra key against
// icons.ts and components/icons/ import, and returns the problems; it never
// edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { BASES } from '../../../tools/registry/bases.mjs';
import { PKG } from '../../../tools/registry/lib.mjs';

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

/** @param {(line: string) => void} log */
export const check = async (log) => {
  const all = [];
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
        if (
          /from '[^']*components\/icons\//.test(fs.readFileSync(file, 'utf8'))
        ) {
          problems.push(`${map}: imports from components/icons/`);
        }
      }
    }
    log(
      `icon-maps: registry/${base}: ${reference?.length ?? 0} keys in ${REFERENCE_MAP}, ${problems.length} problems in ${MAPS.length} maps`,
    );
    for (const problem of problems) log(`  ${problem}`);
    all.push(...problems.map((problem) => `registry/${base}: ${problem}`));
  }
  return all;
};
