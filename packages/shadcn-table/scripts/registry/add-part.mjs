#!/usr/bin/env node
// Usage (repo root): pnpm add-part <radix|base> <part> [<part> ...]
//
// Fetches a shadcn part for one base, in that base's style
// (bases/<base>/components.json: `radix-nova` or `base-nova`), and writes
// its files into bases/<base>/components/ui/. Parts are per base and are
// never shared, so a part the library needs on both bases is added twice.
//
// The item JSON (https://ui.shadcn.com/r/styles/<style>/<part>.json) is
// fetched for its file list and dependencies, then the shadcn CLI installs
// the part into a scratch project carrying the base's components.json, so
// the file goes through the CLI's own transforms (alias rewrites, icon
// placeholders, `"use client"` for rsc: false) instead of a copy of them
// here. Only the requested part's files are copied out of the scratch; the
// parts it depends on are printed for the caller to add on purpose.
//
// The upstream registry imports `cn` from the `cn` npm package; this repo
// keeps the `@/lib/utils` helper every base ships, so that import is
// rewritten to the base's utils alias and `cn` is left out of the printed
// dependencies. The written files are formatted with the repo's prettier.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PKG, ROOT } from './lib.mjs';

const BASES = ['radix', 'base'];
const [base, ...parts] = process.argv.slice(2);
if (!BASES.includes(base) || parts.length === 0) {
  console.error('usage: pnpm add-part <radix|base> <part> [<part> ...]');
  process.exit(1);
}

const baseDir = path.join(PKG, 'bases', base);
const uiDir = path.join(baseDir, 'components/ui');
const components = JSON.parse(
  fs.readFileSync(path.join(baseDir, 'components.json'), 'utf8'),
);
const utilsAlias = components.aliases.utils;
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

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
// and lib/utils.ts, an empty stylesheet, a package.json so dependency
// installs have somewhere to go and a tsconfig that maps `@/` onto it.
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
  fs.writeFileSync(path.join(dir, 'index.css'), '');
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

const scratch = makeScratch();
const written = [];
try {
  const items = await Promise.all(parts.map(fetchItem));
  // The CLI's spinner output goes to stderr; surface it only on failure.
  try {
    execFileSync(
      path.join(PKG, 'node_modules/.bin/shadcn'),
      ['add', ...parts, '--cwd', scratch, '--yes', '--overwrite', '--silent'],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
  } catch (error) {
    process.stderr.write(error.stderr ?? String(error));
    process.exit(error.status ?? 1);
  }

  for (const item of items) {
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
        source.replace(/from\s+(['"])cn\1/g, `from $1${utilsAlias}$1`),
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
      `${item.name} (${components.style}) -> bases/${base}/components/ui/`,
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
