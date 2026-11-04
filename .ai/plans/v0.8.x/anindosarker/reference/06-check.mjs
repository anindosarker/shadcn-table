#!/usr/bin/env node
// Spec 06 Acceptance check (programmatic part): the prop tables list every
// v0.8 option and column option of 01-surface.json, every new guide is
// registered in the sidebar, the guides index and a page-check cluster, and
// the stale v0.7 wording is gone from the guides. Plain node, no
// dependencies; exits 0 only when all pass.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const app = path.join(repo, 'apps/shadcn-table-docs');
const read = (rel) => fs.readFileSync(path.join(app, rel), 'utf8');

const NEW_GUIDES = [
  'column-icons',
  'filter-chips',
  'sort-editor',
  'view-settings',
  'overflow-tooltip',
  'scroll-cues',
  'tint-tokens',
];
// Each needle may appear only in the listed guides.
const ALLOWED = [
  [
    'grid-no-grow',
    ['column-size.mdx', 'column-resizing.mdx', 'display-columns.mdx'],
  ],
  ['Show/Hide columns', ['column-hiding.mdx', 'toolbar-customization.mdx']],
  ['aria-label="Move"', []],
  ['drag handle button', []],
];

const problems = [];

const surface = JSON.parse(
  fs.readFileSync(path.join(here, '01-surface.json'), 'utf8'),
);
const tableOptions = read('lib/prop-tables/tableOptions.ts');
const columnOptions = read('lib/prop-tables/columnOptions.ts');
for (const name of [...surface.options, ...surface.columnOptions]) {
  const row = new RegExp(`(tableOption|columnOption): '${name}',`);
  if (!row.test(tableOptions) && !row.test(columnOptions)) {
    problems.push(`prop tables: no row for ${name}`);
  }
}

const meta = JSON.parse(read('content/docs/guides/meta.json')).pages;
const routes = read('lib/routes.ts');
const clusters = ['a', 'b', 'c', 'd', 'e'].map((c) =>
  read(`scripts/page-checks/${c}.mjs`),
);
for (const slug of NEW_GUIDES) {
  if (!fs.existsSync(path.join(app, `content/docs/guides/${slug}.mdx`))) {
    problems.push(`guide ${slug}.mdx missing`);
  }
  if (!meta.includes(slug)) problems.push(`meta.json: ${slug} missing`);
  if (!routes.includes(`href: '/docs/guides/${slug}'`)) {
    problems.push(`routes.ts: ${slug} missing`);
  }
  if (!clusters.some((c) => c.includes(`'/docs/guides/${slug}'`))) {
    problems.push(`page checks: ${slug} missing`);
  }
}

const guidesDir = path.join(app, 'content/docs/guides');
const guides = fs.readdirSync(guidesDir).filter((f) => f.endsWith('.mdx'));
for (const [needle, allowed] of ALLOWED) {
  for (const file of guides) {
    if (allowed.includes(file)) continue;
    if (fs.readFileSync(path.join(guidesDir, file), 'utf8').includes(needle)) {
      problems.push(`${file}: contains ${JSON.stringify(needle)}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n06-check: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log('06-check: all checks pass');
