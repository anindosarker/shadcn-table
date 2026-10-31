#!/usr/bin/env node
// Usage: pnpm check:tailwind (repo root, every base) or
// pnpm --filter shadcn-table check:tailwind [base], also a CI step of the
// `library` job.
//
// Every Tailwind class in the library, registry/<base>/components/ui/shadcn-table,
// must be in its canonical form and logical in direction. The design system
// is loaded from registry/<base>/index.css (the stylesheet Storybook imports),
// the class candidates of every library file come from the Tailwind scanner,
// and a candidate fails when `canonicalizeCandidates` rewrites it or when its
// utility is physical (`ml`, `mr`, `pl`, `pr`, `left`, `right`, `text-left`,
// `text-right`, `border-l`, `border-r`, the `rounded-*` side and corner
// forms, the `scroll-m*` and `scroll-p*` side forms); `rtl:` and `ltr:`
// prefixed candidates are not physical. shadcn parts are not checked. It
// prints one line per base, then every failing site, and exits non-zero on
// any failure; it never edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { BASES } from './registry/bases.mjs';
import { PKG } from './registry/lib.mjs';

const LIB_REL = 'components/ui/shadcn-table';

const PHYSICAL = new Set([
  'ml',
  'mr',
  'pl',
  'pr',
  'left',
  'right',
  'text-left',
  'text-right',
  'border-l',
  'border-r',
  'rounded-l',
  'rounded-r',
  'rounded-tl',
  'rounded-tr',
  'rounded-bl',
  'rounded-br',
  'scroll-ml',
  'scroll-mr',
  'scroll-pl',
  'scroll-pr',
]);

const arg = process.argv[2];
if (arg && !BASES.includes(arg)) {
  console.error(
    `check-tailwind: unknown base "${arg}", one of ${BASES.join(', ')}`,
  );
  process.exit(2);
}
const bases = arg ? [arg] : BASES;

/** Library source files below `dir`, `.ts` and `.tsx`, sorted. */
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.tsx?$/.test(entry.name) ? [full] : [];
    })
    .sort();

/** True when the candidate's utility is a physical direction utility. */
const isPhysical = (designSystem, candidate) => {
  const [parsed] = designSystem.parseCandidate(candidate);
  if (!parsed || parsed.kind === 'arbitrary') return false;
  if (parsed.variants.some((v) => v.root === 'rtl' || v.root === 'ltr')) {
    return false;
  }
  return PHYSICAL.has(parsed.root.replace(/^-/, ''));
};

let failed = 0;

for (const base of bases) {
  const baseDir = path.join(PKG, 'registry', base);
  const css = fs.readFileSync(path.join(baseDir, 'index.css'), 'utf8');
  const designSystem = await __unstable__loadDesignSystem(css, {
    base: baseDir,
  });
  const scanner = new Scanner({});
  const failures = [];
  let checked = 0;

  for (const file of walk(path.join(baseDir, LIB_REL))) {
    const buffer = fs.readFileSync(file);
    const content = buffer.toString('utf8');
    const extension = path.extname(file).slice(1);
    const rel = path.relative(PKG, file);
    for (const { candidate, position } of scanner.getCandidatesWithPositions({
      content,
      extension,
    })) {
      if (!designSystem.candidatesToCss([candidate])[0]) continue;
      checked++;
      const line = buffer
        .subarray(0, position)
        .toString('utf8')
        .split('\n').length;
      const [canonical] = designSystem.canonicalizeCandidates([candidate], {
        rem: 16,
      });
      if (canonical !== candidate) {
        failures.push(`${rel}:${line}  ${candidate}  ->  ${canonical}`);
      } else if (isPhysical(designSystem, candidate)) {
        failures.push(`${rel}:${line}  ${candidate}  ->  logical`);
      }
    }
  }

  console.log(
    `check-tailwind: registry/${base}: ${checked} class candidates, ${failures.length} not canonical or physical`,
  );
  for (const failure of failures) console.log(`  ${failure}`);
  failed += failures.length;
}

process.exit(failed ? 1 : 0);
