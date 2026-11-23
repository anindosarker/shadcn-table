#!/usr/bin/env node
// Usage (repo root): pnpm add-date-picker <base|radix|aria> [--check]
//
// Writes one base's date picker into registry/<base>/ exactly as the shadcn
// CLI installs `anindosarker/shadcn-date-picker/date-picker-<base>` at
// DATE_PICKER_TAG (lib.mjs) in a project of that base's style: the files of
// components/date-picker/ and the hook hooks/use-mobile.ts. The CLI runs in a
// scratch project carrying the base's components.json, like add-part.mjs;
// only those files are copied out, as written (no prettier pass, no import
// rewrite), so they equal what a user of that style gets. The parts the
// picker needs are add-part.mjs's job (`pnpm add-part <base> <part>`).
//
// `--check` runs the same install and exits 1 listing every file that differs
// from the tree, is missing from it or is extra in it; it writes nothing.
//
// The CLI reads the item from GitHub; a failed fetch exits 1 with the
// address it tried.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  BASES,
  DATE_PICKER_REPO,
  DATE_PICKER_TAG,
  datePickerItemAddress,
  PKG,
  ROOT,
} from './lib.mjs';

const [base, ...args] = process.argv.slice(2);
const check = args.includes('--check');
if (!BASES.includes(base) || args.some((arg) => arg !== '--check')) {
  console.error(`usage: pnpm add-date-picker <${BASES.join('|')}> [--check]`);
  process.exit(1);
}

const baseDir = path.join(PKG, 'registry', base);
const components = JSON.parse(
  fs.readFileSync(path.join(baseDir, 'components.json'), 'utf8'),
);
// `@/components` and `@/hooks` as folders of the tree (and of the scratch).
const aliasDir = (alias) => alias.replace(/^@\//, '');
const PICKER_DIR = path.join(
  aliasDir(components.aliases.components),
  'date-picker',
);
const HOOK_FILE = path.join(
  aliasDir(components.aliases.hooks),
  'use-mobile.ts',
);
const address = datePickerItemAddress(base);
const catalogUrl = `https://raw.githubusercontent.com/${DATE_PICKER_REPO}/${DATE_PICKER_TAG}/registry.json`;
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/** The picker's files below `root`, relative to it, `/`-joined, sorted. */
const pickerFiles = (root) => {
  const out = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else out.push(path.relative(root, p).split(path.sep).join('/'));
    }
  };
  walk(path.join(root, PICKER_DIR));
  if (fs.existsSync(path.join(root, HOOK_FILE))) {
    out.push(HOOK_FILE.split(path.sep).join('/'));
  }
  return out.sort();
};

// A throwaway project the CLI can install into, the same shape add-part.mjs
// builds: the base's components.json, its lib/utils.ts, a stylesheet with the
// one theme token the parts use, a package.json and a tsconfig mapping `@/`.
const makeScratch = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'st-add-date-picker-'));
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
      {
        name: 'st-add-date-picker',
        private: true,
        type: 'module',
        packageManager,
      },
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

const reachable = await fetch(catalogUrl).then(
  (res) => res.ok,
  () => false,
);
if (!reachable) {
  console.error(`add-date-picker: ${catalogUrl} could not be fetched`);
  process.exit(1);
}

const scratch = makeScratch();
try {
  // The CLI's spinner output goes to stderr; surface it only on failure.
  try {
    execFileSync(
      path.join(PKG, 'node_modules/.bin/shadcn'),
      ['add', address, '--cwd', scratch, '--yes', '--overwrite', '--silent'],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
  } catch (error) {
    process.stderr.write(error.stderr ?? String(error));
    console.error(`add-date-picker: shadcn add ${address} failed`);
    process.exit(error.status ?? 1);
  }

  const installed = pickerFiles(scratch);
  if (!installed.length) {
    console.error(
      `add-date-picker: shadcn add ${address} wrote no picker file`,
    );
    process.exit(1);
  }

  if (check) {
    const committed = pickerFiles(baseDir);
    const problems = [
      ...installed
        .filter((file) => !committed.includes(file))
        .map((file) => `missing: ${rel(path.join(baseDir, file))}`),
      ...committed
        .filter((file) => !installed.includes(file))
        .map((file) => `extra: ${rel(path.join(baseDir, file))}`),
      ...installed
        .filter(
          (file) =>
            committed.includes(file) &&
            !fs
              .readFileSync(path.join(scratch, file))
              .equals(fs.readFileSync(path.join(baseDir, file))),
        )
        .map((file) => `differs: ${rel(path.join(baseDir, file))}`),
    ];
    if (problems.length) {
      console.error(
        `add-date-picker: registry/${base} differs from ${address}; run pnpm add-date-picker ${base}`,
      );
      for (const problem of problems) console.error(`  ${problem}`);
      process.exit(1);
    }
    console.log(
      `add-date-picker: registry/${base} matches ${address} (${installed.length} files)`,
    );
  } else {
    fs.rmSync(path.join(baseDir, PICKER_DIR), { recursive: true, force: true });
    for (const file of installed) {
      const target = path.join(baseDir, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(scratch, file), target);
    }
    console.log(
      `${address} -> registry/${base}/: ${installed.length} files (${PICKER_DIR}/**, ${HOOK_FILE})`,
    );
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
