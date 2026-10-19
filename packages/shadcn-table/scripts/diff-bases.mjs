#!/usr/bin/env node
// Usage (repo root): pnpm diff-bases
//
// Lists the files that differ between the two base trees (bases/radix and
// bases/base) beyond the allowlist below, as a markdown table (readable in a
// GitHub job summary). The trees are hand-written copies: a library change is
// expected in both, and the only files allowed to differ are the ones that
// touch base-specific primitives. Always exits 0; CI runs it as a non-blocking
// report, the review decides.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PKG } from './registry-lib.mjs';

const TREES = ['radix', 'base'];
const LIB = 'components/ui/shadcn-table';

// Files that differ on purpose (02-base-tree.md step 3): plain Base UI code
// against the Base UI parts where the Radix props differ.
const ALLOWED_LIB_FILES = [
  'ST_Tooltip.tsx',
  'ShadcnTable.tsx',
  'utils/style.utils.ts',
  'menus/ST_ActionMenuItem.tsx',
  'menus/ST_CellActionMenu.tsx',
  'menus/ST_ColumnActionMenu.tsx',
  'menus/ST_FilterOptionMenu.tsx',
  'menus/ST_RowActionMenu.tsx',
  'menus/ST_ShowHideColumnsMenu.tsx',
  'menus/ST_ShowHideColumnsMenuItems.tsx',
  'inputs/ST_EditCellTextField.tsx',
  'inputs/ST_FilterCheckbox.tsx',
  'inputs/ST_FilterRangeSlider.tsx',
  'inputs/ST_FilterTextField.tsx',
  'inputs/ST_GlobalFilterTextField.tsx',
  'inputs/ST_SelectCheckbox.tsx',
  'head/ST_TableHeadCellFilterContainer.tsx',
  'head/ST_TableHeadCellFilterLabel.tsx',
  'body/ST_TableDetailPanel.tsx',
  'modals/ST_EditRowModal.tsx',
  'toolbar/ST_LinearProgressBar.tsx',
  'toolbar/ST_TablePagination.tsx',
  'toolbar/ST_ToolbarAlertBanner.tsx',
].map((f) => `${LIB}/${f}`);

// Per-tree files that are base-specific by nature.
const ALLOWED_TREE_FILES = [
  'components.json',
  'index.css',
  'registry.ts',
  'package.json',
];

const isAllowed = (file) =>
  ALLOWED_LIB_FILES.includes(file) ||
  ALLOWED_TREE_FILES.includes(file) ||
  // The shadcn parts: each tree holds its own base's copies.
  (file.startsWith('components/ui/') && !file.startsWith(`${LIB}/`));

const [radixDir, baseDir] = TREES.map((t) => path.join(PKG, 'bases', t));

// `diff -rq` output, one line per differing or one-sided file.
let out = '';
try {
  execFileSync('diff', ['-rq', radixDir, baseDir], { encoding: 'utf8' });
} catch (error) {
  // diff exits 1 when the trees differ; anything else is a real failure.
  if (error.status !== 1) throw error;
  out = error.stdout;
}

const rows = [];
for (const line of out.split('\n').filter(Boolean)) {
  let m = line.match(/^Files (.+) and (.+) differ$/);
  if (m) {
    rows.push({ file: path.relative(radixDir, m[1]), status: 'differs' });
    continue;
  }
  m = line.match(/^Only in (.+): (.+)$/);
  if (m) {
    const abs = path.join(m[1], m[2]);
    const inRadix = abs.startsWith(radixDir + path.sep);
    const file = path.relative(inRadix ? radixDir : baseDir, abs);
    rows.push({ file, status: `only in ${inRadix ? 'radix' : 'base'}` });
    continue;
  }
  rows.push({ file: line, status: 'unparsed diff line' });
}
rows.sort((a, b) => a.file.localeCompare(b.file));

const unexpected = rows.filter(
  (r) => r.status !== 'differs' || !isAllowed(r.file),
);
const allowedCount = rows.length - unexpected.length;

console.log(`## diff-bases: bases/radix vs bases/base\n`);
console.log(
  `${rows.length} entries: ${allowedCount} allowed, ${unexpected.length} unexpected.\n`,
);
console.log('| File | Status | Allowed |');
console.log('| --- | --- | --- |');
for (const r of rows) {
  const ok = r.status === 'differs' && isAllowed(r.file);
  console.log(`| \`${r.file}\` | ${r.status} | ${ok ? 'yes' : '**no**'} |`);
}

// Allowlisted library files that no longer differ: the entry can go.
const stale = ALLOWED_LIB_FILES.filter(
  (f) =>
    !rows.some((r) => r.file === f) &&
    fs.existsSync(path.join(radixDir, f)) &&
    fs.existsSync(path.join(baseDir, f)),
);
if (stale.length) {
  console.log(
    `\nAllowlisted but identical (entry can be dropped): ${stale.map((f) => `\`${f}\``).join(', ')}`,
  );
}
