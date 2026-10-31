#!/usr/bin/env node
// Usage (repo root): pnpm check:tailwind, or for one base
// pnpm --filter shadcn-table check:tailwind <base>; also a step of the CI job
// `library`, once per base.
//
// Every Tailwind class in the library, registry/<base>/components/ui/shadcn-table
// (shadcn parts excluded), must pass two rules:
// - canonical: the class equals its canonical form, the form Tailwind 4.3
//   IntelliSense suggests (`z-1` for `z-[1]`, `min-h-25` for `min-h-[100px]`).
//   The design system is loaded from registry/<base>/index.css, the stylesheet
//   Storybook imports, so the theme of that tree decides what is canonical.
// - logical: no physical direction class (`ml-`, `pr-`, `left-`, `text-right`,
//   `border-l`, `rounded-tr` and the rest of PHYSICAL), so the table follows
//   `dir` on any ancestor. A class behind an `rtl:` or `ltr:` variant is
//   direction-aware already and passes.
// Candidates come from the oxide scanner Tailwind itself uses and count only
// when they generate CSS. It prints one line per base, then every offending
// class with its file and line, and exits non-zero on any problem; it never
// edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { BASES, PKG } from './registry/lib.mjs';

const LIB_REL = 'components/ui/shadcn-table';

// Utility roots with a physical direction; a leading `-` (negative value) is
// stripped before the lookup.
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
const DIRECTION_VARIANTS = new Set(['rtl', 'ltr']);

const arg = process.argv[2];
if (arg && !BASES.includes(arg)) {
  console.error(
    `check-tailwind: unknown base "${arg}", expected one of ${BASES.join(', ')}`,
  );
  process.exit(1);
}
const bases = arg ? [arg] : BASES;

/** `.ts` and `.tsx` files below `dir`, absolute, sorted. */
const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p);
  }
  return out.sort();
};

/** True when the parsed candidate is a physical direction utility. */
const isPhysical = (parsed) => {
  if (!parsed || parsed.kind === 'arbitrary') return false;
  if (parsed.variants.some((v) => DIRECTION_VARIANTS.has(v.root))) return false;
  return PHYSICAL.has(parsed.root.replace(/^-/, ''));
};

const scanner = new Scanner({});
let failed = false;

for (const base of bases) {
  const baseDir = path.join(PKG, 'registry', base);
  const designSystem = await __unstable__loadDesignSystem(
    fs.readFileSync(path.join(baseDir, 'index.css'), 'utf8'),
    { base: baseDir },
  );
  const files = walk(path.join(baseDir, LIB_REL));
  const problems = [];
  let checked = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const bytes = Buffer.from(content, 'utf8');
    const candidates = scanner.getCandidatesWithPositions({
      content,
      extension: path.extname(file).slice(1),
    });
    const rel = path.relative(PKG, file).split(path.sep).join('/');
    for (const { candidate, position } of candidates) {
      if (!designSystem.candidatesToCss([candidate])[0]) continue;
      checked++;
      const line = bytes
        .subarray(0, position)
        .toString('utf8')
        .split('\n').length;
      const [canonical] = designSystem.canonicalizeCandidates([candidate], {
        rem: 16,
      });
      if (canonical !== candidate) {
        problems.push(`${rel}:${line}  ${candidate}  ->  ${canonical}`);
      }
      if (isPhysical(designSystem.parseCandidate(candidate)[0])) {
        problems.push(`${rel}:${line}  ${candidate}  ->  logical`);
      }
    }
  }

  if (problems.length) {
    failed = true;
    console.error(
      `check-tailwind: registry/${base}: ${problems.length} problem${problems.length === 1 ? '' : 's'} in ${checked} classes, ${files.length} files`,
    );
    for (const problem of problems) console.error(`  ${problem}`);
  } else {
    console.log(
      `check-tailwind: registry/${base}: ${checked} classes in ${files.length} files, all canonical and logical`,
    );
  }
}

if (failed) process.exit(1);
