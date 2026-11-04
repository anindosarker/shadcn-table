#!/usr/bin/env node
// Spec 06.2 Acceptance check (programmatic part, 1.6.7). Usage:
//   node 06.2-check.mjs <root>
// <root> is apps/shadcn-table-docs/examples/<base> or
// packages/shadcn-table/stories (relative to the repo or absolute).
// Every column object (an `accessorKey:` object or a `columnHelper.accessor(`
// call) must carry `icon:`; a loop-built column file must take its icon from
// a lookup. For an examples root also: no data column size from 40 to 55, the
// custom toolbars render the view settings button, the composed examples
// render ShadcnTable, the editing examples put the actions column first, the
// home demo sets no columnFilterDisplayMode and the docs prose rule skips
// .not-prose. Plain node, no dependencies; exits 1 on any report.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const arg = process.argv[2];
if (!arg) {
  console.error('usage: node 06.2-check.mjs <root>');
  process.exit(2);
}
const root = path.resolve(repo, arg);
const rel = (file) => path.relative(root, file).split(path.sep).join('/');
const isStories = /(^|\/)stories\/?$/.test(root);

// Columns built in a loop: the per-object check is replaced by a lookup check.
const LOOP_FILES = [
  'dynamic-columns/TS.tsx',
  'enable-column-virtualization/makeData.ts',
  'features/Virtualization.stories.tsx',
  'features/RowOrdering.stories.tsx',
];

const problems = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'node_modules' ? [] : walk(full);
    }
    return [full];
  });

/** Index of the `{` that opens the object holding `index`, or -1. */
const openingBrace = (src, index) => {
  let depth = 0;
  for (let i = index; i >= 0; i--) {
    const ch = src[i];
    if (ch === '}' || ch === ')' || ch === ']') depth++;
    else if (ch === '{' || ch === '(' || ch === '[') {
      if (depth === 0) return ch === '{' ? i : -1;
      depth--;
    }
  }
  return -1;
};

/** Index just past the bracket that closes the one at `open`. */
const closing = (src, open) => {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{' || ch === '(' || ch === '[') depth++;
    else if (ch === '}' || ch === ')' || ch === ']') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return src.length;
};

const lineOf = (src, index) => src.slice(0, index).split('\n').length;

const columnFiles = walk(root).filter((file) =>
  isStories
    ? file.endsWith('.stories.tsx')
    : /(^|\/)(TS\.tsx|makeData\.ts|components\/UsersTable\.tsx)$/.test(
        rel(file),
      ),
);

for (const file of columnFiles) {
  const name = rel(file);
  const src = fs.readFileSync(file, 'utf8');
  if (LOOP_FILES.some((loop) => name.endsWith(loop))) {
    if (/accessorKey:|columnHelper\.accessor\(/.test(src)) {
      if (!/Record<string, LucideIcon>/.test(src) || !/icon:/.test(src)) {
        problems.push(`${name}: loop-built columns without an icon lookup`);
      }
    }
    continue;
  }
  for (const match of src.matchAll(/accessorKey:/g)) {
    const open = openingBrace(src, match.index - 1);
    if (open < 0) continue;
    const body = src.slice(open, closing(src, open));
    if (!/\bicon:/.test(body)) {
      problems.push(`${name}:${lineOf(src, match.index)} column without icon`);
    }
  }
  for (const match of src.matchAll(/columnHelper\.accessor\(/g)) {
    const open = match.index + match[0].length - 1;
    const body = src.slice(open, closing(src, open));
    if (!/\bicon:/.test(body)) {
      problems.push(`${name}:${lineOf(src, match.index)} column without icon`);
    }
  }
}

if (!isStories) {
  for (const file of columnFiles) {
    const name = rel(file);
    if (!/(TS\.tsx|makeData\.ts)$/.test(name)) continue;
    const src = fs.readFileSync(file, 'utf8');
    for (const match of src.matchAll(/\bsize: (4\d|5[0-5])\b/g)) {
      problems.push(`${name}:${lineOf(src, match.index)} size ${match[1]}`);
    }
  }
  const has = (slug, needle) => {
    const file = path.join(root, slug, 'TS.tsx');
    if (!fs.existsSync(file)) {
      problems.push(`${slug}/TS.tsx missing`);
      return;
    }
    if (!fs.readFileSync(file, 'utf8').includes(needle)) {
      problems.push(`${slug}/TS.tsx: no ${needle}`);
    }
  };
  for (const slug of [
    'advanced',
    'custom-top-toolbar',
    'custom-headless',
    'external-toolbar',
  ]) {
    has(slug, '<ST_ViewSettingsButton');
  }
  for (const slug of ['custom-column-filtering-ui', 'enable-row-ordering']) {
    has(slug, '<ShadcnTable');
  }
  for (const slug of [
    'editing-crud-modal',
    'editing-crud-row',
    'editing-crud-cell',
    'editing-crud-table',
    'editing-crud-tree',
  ]) {
    has(slug, "positionActionsColumn: 'first'");
  }
  const app = path.join(repo, 'apps/shadcn-table-docs');
  const signal = fs.readFileSync(
    path.join(app, 'components/dev-home/v12/signal-table.tsx'),
    'utf8',
  );
  if (signal.includes('columnFilterDisplayMode')) {
    problems.push('signal-table.tsx: sets columnFilterDisplayMode');
  }
  const css = fs.readFileSync(path.join(app, 'app/global.css'), 'utf8');
  if (!css.includes('#nd-page .prose :is(p, ul, ol):not(.not-prose *) {')) {
    problems.push('global.css: the prose margin rule reaches .not-prose');
  }
  if (/:is\(p, ul, ol\)\s*\{/.test(css)) {
    problems.push(
      'global.css: an :is(p, ul, ol) rule without :not(.not-prose *)',
    );
  }
}

if (problems.length) {
  for (const problem of problems) console.log(problem);
  console.log(`06.2-check: ${problems.length} report(s)`);
  process.exit(1);
}
console.log(`06.2-check: ${columnFiles.length} files, no reports`);
