#!/usr/bin/env node
// Usage (repo root): pnpm check:bases, also the CI job `bases`.
//
// The library exists twice, once per base (registry/radix and registry/base,
// both under components/ui/shadcn-table), and a common change is made in both
// trees by hand. This guard is how a missed twin is found: every library file
// not listed in base-diff.json must be byte-identical in both trees, every
// listed file must exist in both, and no library file may exist in one tree
// only. It prints every offending path and exits non-zero; it never copies or
// edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const LIB_REL = 'components/ui/shadcn-table';
const TREES = {
  radix: path.join(PKG, 'registry/radix', LIB_REL),
  base: path.join(PKG, 'registry/base', LIB_REL),
};
const DIFF_LIST = path.join(PKG, 'scripts/registry/base-diff.json');

/** Files below `dir`, as `/`-joined paths relative to it, sorted. */
const walk = (dir, root = dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, root));
    else out.push(path.relative(root, p).split(path.sep).join('/'));
  }
  return out.sort();
};

const allowed = new Set(JSON.parse(fs.readFileSync(DIFF_LIST, 'utf8')));
const radix = new Set(walk(TREES.radix));
const base = new Set(walk(TREES.base));
const problems = [];

for (const rel of radix) {
  if (!base.has(rel)) problems.push(`only in registry/radix: ${rel}`);
}
for (const rel of base) {
  if (!radix.has(rel)) problems.push(`only in registry/base: ${rel}`);
}
for (const rel of allowed) {
  if (!radix.has(rel) || !base.has(rel)) {
    problems.push(`listed in base-diff.json but missing from a tree: ${rel}`);
  }
}
for (const rel of radix) {
  if (allowed.has(rel) || !base.has(rel)) continue;
  const same = fs
    .readFileSync(path.join(TREES.radix, rel))
    .equals(fs.readFileSync(path.join(TREES.base, rel)));
  if (!same) {
    problems.push(
      `differs between the trees and is not in base-diff.json: ${LIB_REL}/${rel}`,
    );
  }
}

if (problems.length) {
  console.error(
    `check-bases: ${problems.length} problem${problems.length === 1 ? '' : 's'}`,
  );
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(
  `check-bases: ${radix.size} library files in both trees, ${allowed.size} allowed to differ`,
);
