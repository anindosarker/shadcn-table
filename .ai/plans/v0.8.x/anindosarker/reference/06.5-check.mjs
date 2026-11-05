#!/usr/bin/env node
// Spec 06.5 Acceptance check (programmatic part, 1.6.8). Usage:
//   node 06.5-check.mjs
// Checks the docs app on the three bases: no unbacked routes (F42), the sort
// chip in the custom toolbars (F51), the page copy caps (F52), the AlertDialog
// delete confirm (F53), the icon-aware column size floor (F54) and the page
// check assertions of 1.6.7. Plain node, no dependencies; exits 1 on any
// report.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const app = path.join(repo, 'apps/shadcn-table-docs');
const BASES = ['radix', 'base', 'aria'];
const EDITING = ['modal', 'cell', 'row', 'table', 'tree'].map(
  (x) => `editing-crud-${x}`,
);
const MIN_ICON_SIZE = 110;

const problems = [];
const read = (file) => fs.readFileSync(file, 'utf8');
const relRepo = (file) => path.relative(repo, file).split(path.sep).join('/');
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

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

/** The object text at `open` with every nested bracket's content blanked. */
const topLevel = (body) => {
  let depth = 0;
  let out = '';
  for (const ch of body) {
    if (ch === '{' || ch === '(' || ch === '[') depth++;
    if (depth <= 1) out += ch;
    else out += ch === '\n' ? '\n' : ' ';
    if (ch === '}' || ch === ')' || ch === ']') depth--;
  }
  return out;
};

// F42: routes a page answers only
const routes = read(path.join(app, 'lib/routes.ts'));
for (const href of ['/about', '/changelog', '/roadmap']) {
  if (routes.includes(`href: '${href}'`)) {
    problems.push(`lib/routes.ts: href ${href} has no page`);
  }
}

for (const base of BASES) {
  const dir = path.join(app, 'examples', base);
  // F51: the sort chip in the custom toolbars
  for (const slug of ['advanced', 'external-toolbar']) {
    const src = read(path.join(dir, slug, 'TS.tsx'));
    if (!src.includes('<ST_SortPopover table={table} variant="chip" />')) {
      problems.push(`examples/${base}/${slug}/TS.tsx: no sort chip`);
    }
  }
  // F52: the persistent-view blurb is one sentence
  const pv = read(path.join(dir, 'persistent-view/TS.tsx'));
  const blurb = pv.match(/<p\b[^>]*>([\s\S]*?)<\/p>/);
  const dots = blurb ? (blurb[1].match(/\./g) ?? []).length : -1;
  if (dots !== 1) {
    problems.push(
      `examples/${base}/persistent-view/TS.tsx: blurb has ${dots} sentence(s)`,
    );
  }
  // F53: no browser confirm, the AlertDialog part installed and imported
  for (const file of walk(dir)) {
    if (read(file).includes('window.confirm')) {
      problems.push(`${relRepo(file)}: window.confirm`);
    }
  }
  for (const slug of EDITING) {
    const src = read(path.join(dir, slug, 'TS.tsx'));
    if (!src.includes("from '@/components/ui/alert-dialog'")) {
      problems.push(`examples/${base}/${slug}/TS.tsx: no alert-dialog import`);
    }
  }
  if (
    !fs.existsSync(path.join(app, `components/ui-${base}/alert-dialog.tsx`))
  ) {
    problems.push(`components/ui-${base}/alert-dialog.tsx missing`);
  }
  // F54: an iconed column is at least MIN_ICON_SIZE wide or has no size
  for (const file of walk(dir).filter((f) =>
    /(TS\.tsx|makeData\.ts)$/.test(f),
  )) {
    const src = read(file);
    const name = relRepo(file);
    for (const match of src.matchAll(/\bicon:/g)) {
      const open = openingBrace(src, match.index - 1);
      if (open < 0) continue;
      const body = topLevel(src.slice(open, closing(src, open)));
      const size = body.match(/\bsize: (\d+)\b/);
      if (size && Number(size[1]) < MIN_ICON_SIZE) {
        problems.push(
          `${name}:${lineOf(src, match.index)} iconed column size ${size[1]}`,
        );
      }
    }
    if (/\bicon:/.test(src)) {
      for (const match of src.matchAll(
        /defaultColumn:\s*\{[^}]*?\bsize:\s*(\d+)/g,
      )) {
        if (Number(match[1]) < MIN_ICON_SIZE) {
          problems.push(
            `${name}:${lineOf(src, match.index)} defaultColumn size ${match[1]} over iconed columns`,
          );
        }
      }
    }
  }
}

// F52: page copy word caps
const bodyWords = (slug) => {
  const src = read(path.join(app, 'content/docs/examples', `${slug}.mdx`));
  const lines = src.split('\n');
  let i = 0;
  if (lines[0] === '---') {
    i = lines.indexOf('---', 1) + 1;
  }
  const body = [];
  for (; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith('<')) break;
    body.push(lines[i]);
  }
  const text = body.join('\n');
  return { text, words: text.split(/\s+/).filter(Boolean).length };
};
const caps = [
  ['persistent-view', 50],
  ['subheader-filters', 40],
  ['custom-headless', 110],
];
for (const [slug, cap] of caps) {
  const { text, words } = bodyWords(slug);
  if (words > cap) problems.push(`${slug}.mdx: ${words} words (cap ${cap})`);
  if (slug === 'persistent-view' && !text.includes('localStorage')) {
    problems.push(`${slug}.mdx: never says localStorage`);
  }
  if (slug === 'custom-headless' && text.includes('grid-no-grow')) {
    problems.push(`${slug}.mdx: still explains grid-no-grow`);
  }
}

// F53: the aria editing examples are listed as differing from radix
const ariaDiff = JSON.parse(
  read(
    path.join(
      repo,
      'packages/shadcn-table/scripts/registry/examples-aria-diff.json',
    ),
  ),
);
for (const slug of EDITING) {
  if (!ariaDiff.includes(`${slug}/TS.tsx`)) {
    problems.push(`examples-aria-diff.json: ${slug}/TS.tsx missing`);
  }
}

// 1.6.7: the page check assertions
const checks = (letter) =>
  read(path.join(app, `scripts/page-checks/${letter}.mjs`));
/** The text of the page check entry for `route` in `src`. */
const entry = (src, route) => {
  const at = src.indexOf(`'${route}':`);
  if (at < 0) return '';
  const open = src.indexOf('{', src.indexOf('=>', at));
  return src.slice(at, closing(src, open));
};
const d = checks('d');
const c = checks('c');
if (!d.includes("getByRole('alertdialog')")) {
  problems.push('d.mjs: no alertdialog assertion');
}
for (const route of [
  '/docs/examples/editing-crud',
  '/docs/examples/editing-crud-inline-cell',
  '/docs/examples/editing-crud-inline-row',
  '/docs/examples/editing-crud-inline-table',
  '/docs/examples/editing-crud-tree',
]) {
  if (!entry(d, route).includes('deleteDialog(')) {
    problems.push(`d.mjs ${route}: no delete dialog (alertdialog) assertion`);
  }
}
for (const [src, file, route, needle] of [
  [d, 'd.mjs', '/docs/examples/advanced', "'advanced', 'Name'"],
  [
    c,
    'c.mjs',
    '/docs/guides/toolbar-customization',
    "'external-toolbar', 'First Name'",
  ],
]) {
  if (!src.includes('sort chip') || !entry(src, route).includes(needle)) {
    problems.push(`${file} ${route}: no sort chip assertion`);
  }
}
const fits = ['b', 'd', 'e']
  .map((x) => (checks(x).match(/headerLabelsFit\(/g) ?? []).length)
  .reduce((a, n) => a + n, 0);
if (fits < 18) {
  problems.push(`page checks: headerLabelsFit( ${fits} times (want 18+)`);
}

if (problems.length) {
  for (const problem of problems) console.log(problem);
  console.log(`06.5-check: ${problems.length} report(s)`);
  process.exit(1);
}
console.log('06.5-check: no reports');
