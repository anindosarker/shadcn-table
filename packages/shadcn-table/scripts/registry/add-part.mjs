#!/usr/bin/env node
// Usage (repo root): pnpm add-part <base|radix|aria> <part> [<part> ...]
//                    pnpm add-part <base|radix|aria> --all
//
// Fetches a shadcn part for one base (BASES in lib.mjs), in that
// base's style (registry/<base>/components.json: `radix-nova`,
// `base-nova` or `aria-nova`), and writes its files into
// registry/<base>/components/ui/. Parts are per base and are never
// shared, so a part the library needs on every base is added once per
// base. `--all` re-adds every part the base already has (every
// `*.tsx` directly below components/ui/, minus the components/ui/*.tsx files
// the base's registry items ship as their own files), the gate that the
// committed copies are the script's output.
//
// The item JSON (https://ui.shadcn.com/r/styles/<style>/<part>.json) is
// fetched for its file list and dependencies, then the shadcn CLI installs
// the part into a scratch project carrying the base's components.json, so
// the file goes through the CLI's own transforms (alias rewrites, icon
// placeholders, Tailwind class resolution) instead of a copy of them here.
// Only the requested part's files are copied out of the scratch; the parts it
// depends on are printed for the caller to add on purpose.
//
// The output is deterministic per part: one CLI invocation per part, the
// `'use client'` directive set per file from the item JSON (the CLI's own
// rsc transform tests the directive with a `/g` regex whose `lastIndex`
// leaks across the files of one run, @shadcn/registry 0.2.0), and a scratch
// stylesheet declaring `--font-heading` so the class survives the CLI's
// class resolution the way it does in a real project.
//
// The upstream registry imports `cn` from the `cn` npm package; this repo
// keeps the `@/lib/utils` helper every base ships, so that import is
// rewritten to the base's utils alias and `cn` is left out of the printed
// dependencies. The written files are formatted with the repo's prettier.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { BASES, PKG, ROOT } from './lib.mjs';

const [base, ...args] = process.argv.slice(2);
const all = args.includes('--all');
if (!BASES.includes(base) || args.length === 0 || (all && args.length > 1)) {
  console.error(
    `usage: pnpm add-part <${BASES.join('|')}> <part> [<part> ...] | --all`,
  );
  process.exit(1);
}

const baseDir = path.join(PKG, 'registry', base);
const uiDir = path.join(baseDir, 'components/ui');
const components = JSON.parse(
  fs.readFileSync(path.join(baseDir, 'components.json'), 'utf8'),
);
const utilsAlias = components.aliases.utils;
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

// Every part the base has: the *.tsx files directly below components/ui
// (the library lives in its own directory).
const committedParts = () =>
  fs
    .readdirSync(uiDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
    .map((e) => e.name.slice(0, -'.tsx'.length))
    .sort();

const parts = all ? committedParts() : args;

const fetchItem = async (part) => {
  const url = `https://ui.shadcn.com/r/styles/${components.style}/${part}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`add-part: ${url} answered ${res.status}`);
    process.exit(1);
  }
  return res.json();
};

// A throwaway project the CLI can install into: the base's components.json
// and lib/utils.ts, a stylesheet declaring the one theme token the parts use
// (`font-heading` on DialogTitle; the CLI drops a class whose token the
// project's stylesheet lacks, the value is irrelevant), a package.json so
// dependency installs have somewhere to go and a tsconfig that maps `@/`
// onto it.
const makeScratch = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'st-add-part-'));
  fs.writeFileSync(
    path.join(dir, 'components.json'),
    JSON.stringify(
      { ...components, tailwind: { ...components.tailwind, css: 'index.css' } },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(dir, 'index.css'),
    '@theme inline {\n  --font-heading: var(--font-sans);\n}\n',
  );
  fs.mkdirSync(path.join(dir, 'lib'));
  fs.copyFileSync(
    path.join(baseDir, 'lib/utils.ts'),
    path.join(dir, 'lib/utils.ts'),
  );
  const { packageManager } = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'),
  );
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(
      { name: 'st-add-part', private: true, type: 'module', packageManager },
      null,
      2,
    ),
  );
  fs.writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify(
      { compilerOptions: { baseUrl: '.', paths: { '@/*': ['./*'] } } },
      null,
      2,
    ),
  );
  return dir;
};

// The `'use client'` directive, with the blank line prettier keeps after it.
const DIRECTIVE = /^(['"])use client\1;?[ \t]*\r?\n(\r?\n)?/;
const withDirective = (source, upstream) => {
  const body = source.replace(DIRECTIVE, '');
  return DIRECTIVE.test(upstream) ? `'use client';\n\n${body}` : body;
};

const scratch = makeScratch();
const written = [];
try {
  const items = await Promise.all(parts.map(fetchItem));
  for (const item of items) {
    // The CLI's spinner output goes to stderr; surface it only on failure.
    try {
      execFileSync(
        path.join(PKG, 'node_modules/.bin/shadcn'),
        [
          'add',
          item.name,
          '--cwd',
          scratch,
          '--yes',
          '--overwrite',
          '--silent',
        ],
        { stdio: ['ignore', 'ignore', 'pipe'] },
      );
    } catch (error) {
      process.stderr.write(error.stderr ?? String(error));
      process.exit(error.status ?? 1);
    }

    for (const file of item.files) {
      if (file.type !== 'registry:ui') {
        console.error(
          `add-part: ${item.name} ships ${file.path} (${file.type}); only registry:ui parts are supported`,
        );
        process.exit(1);
      }
      const name = path.basename(file.path);
      const source = fs.readFileSync(
        path.join(scratch, 'components/ui', name),
        'utf8',
      );
      const target = path.join(uiDir, name);
      fs.writeFileSync(
        target,
        withDirective(source, file.content).replace(
          /from\s+(['"])cn\1/g,
          `from $1${utilsAlias}$1`,
        ),
      );
      written.push(target);
    }
  }
  execFileSync(path.join(ROOT, 'node_modules/.bin/prettier'), [
    '--write',
    '--log-level',
    'warn',
    ...written,
  ]);

  for (const item of items) {
    const dependencies = (item.dependencies ?? []).filter((d) => d !== 'cn');
    const registryDependencies = item.registryDependencies ?? [];
    console.log(
      `${item.name} (${components.style}) -> registry/${base}/components/ui/`,
    );
    for (const file of written.filter((p) =>
      item.files.some((f) => path.basename(f.path) === path.basename(p)),
    )) {
      console.log(`  ${rel(file)}`);
    }
    console.log(
      `  dependencies: ${dependencies.length ? dependencies.join(', ') : 'none'} (npm; add to packages/shadcn-table/package.json and the base's registry.ts if the library imports them)`,
    );
    console.log(
      `  registryDependencies: ${registryDependencies.length ? registryDependencies.join(', ') : 'none'} (parts; pnpm add-part ${base} <part> for each one the base lacks)`,
    );
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
