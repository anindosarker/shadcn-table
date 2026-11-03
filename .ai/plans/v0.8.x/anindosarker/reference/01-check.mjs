#!/usr/bin/env node
// Spec 01 Acceptance check: every key, string and option in 01-surface.json
// exists in each base, and the fourteen demo captures and the demo commit
// hash are present. Plain node, no dependencies; exits 0 only when all pass.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const surface = JSON.parse(
  fs.readFileSync(path.join(here, '01-surface.json'), 'utf8'),
);
const BASES = ['radix', 'base', 'aria'];
const VIEWS = [
  'default',
  'column-menu',
  'sort-editor',
  'chips',
  'view-settings',
  'drag',
  'scroll-cues',
];
const problems = [];

for (const base of BASES) {
  const lib = path.join(
    repo,
    'packages/shadcn-table/registry',
    base,
    'components/ui/shadcn-table',
  );
  const read = (rel) => fs.readFileSync(path.join(lib, rel), 'utf8');
  const types = read('types.ts');
  const iconKeyUnion =
    types.match(/export type ST_IconKey =([\s\S]*?);/)?.[1] ?? '';
  const en = read('shared/locales/en.ts');
  const config = read('features/stConfigFeature.ts');
  for (const key of surface.iconKeys) {
    if (!iconKeyUnion.includes(`'${key}'`)) {
      problems.push(`${base}: ST_IconKey lacks ${key}`);
    }
  }
  for (const key of surface.localizationKeys) {
    if (!new RegExp(`^\\s+${key}:`, 'm').test(en)) {
      problems.push(`${base}: en.ts lacks ${key}`);
    }
  }
  for (const option of [...surface.options, ...surface.columnOptions]) {
    if (!new RegExp(`^\\s+${option}\\?:`, 'm').test(config)) {
      problems.push(`${base}: stConfigFeature.ts lacks ${option}`);
    }
  }
}

for (const view of VIEWS) {
  for (const theme of ['light', 'dark']) {
    const file = `01-${view}-${theme}.png`;
    if (!fs.existsSync(path.join(here, file))) {
      problems.push(`reference: ${file} missing`);
    }
  }
}
const commitFile = path.join(here, '01-demo-commit.txt');
if (
  !fs.existsSync(commitFile) ||
  !/^[0-9a-f]{40}$/.test(fs.readFileSync(commitFile, 'utf8').trim())
) {
  problems.push('reference: 01-demo-commit.txt holds no 40-character hash');
}

for (const problem of problems) console.error(problem);
console.log(
  `01-check: ${BASES.length} bases, ${problems.length} problem${problems.length === 1 ? '' : 's'}`,
);
process.exit(problems.length ? 1 : 0);
