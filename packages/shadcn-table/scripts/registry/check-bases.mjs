#!/usr/bin/env node
// Usage (repo root): pnpm check:bases, also the CI job `bases`.
//
// Two file sets exist once per base (BASES in lib.mjs): the library,
// registry/<base>/components/ui/shadcn-table, and the docs examples,
// apps/shadcn-table-docs/examples/<base>. A common change is made in
// every tree by hand, and this guard is how a missed twin is found: every
// base other than the reference (radix) is compared against it with its
// own list of files allowed to differ, scripts/registry/<base>-diff.json
// for the library and scripts/registry/examples-<base>-diff.json for the
// examples. A file not on the list must be byte-identical in that tree and
// the reference, every listed file must exist in both, and no file may exist
// in one of the two only. It prints one line per base and set, then every
// offending path, and exits non-zero on any problem; it never copies or
// edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { DOCS, BASES, PKG, REFERENCE_BASE } from './lib.mjs';

const LIB_REL = 'components/ui/shadcn-table';

// The guarded sets: a tree per base and the allow list of every other
// base, named for the messages.
const SETS = [
  {
    label: (base) => `registry/${base}`,
    tree: (base) => path.join(PKG, 'registry', base, LIB_REL),
    diffList: (base) => `${base}-diff.json`,
    unit: 'library files',
  },
  {
    label: (base) => `examples/${base}`,
    tree: (base) => path.join(DOCS, 'examples', base),
    diffList: (base) => `examples-${base}-diff.json`,
    unit: 'example files',
  },
];

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

let failed = false;

for (const set of SETS) {
  const referenceDir = set.tree(REFERENCE_BASE);
  const reference = new Set(walk(referenceDir));
  for (const base of BASES) {
    if (base === REFERENCE_BASE) continue;
    const diffList = set.diffList(base);
    const allowed = new Set(
      JSON.parse(
        fs.readFileSync(path.join(PKG, 'scripts/registry', diffList), 'utf8'),
      ),
    );
    const treeDir = set.tree(base);
    const tree = new Set(walk(treeDir));
    const problems = [];

    for (const rel of reference) {
      if (!tree.has(rel)) {
        problems.push(`only in ${set.label(REFERENCE_BASE)}: ${rel}`);
      }
    }
    for (const rel of tree) {
      if (!reference.has(rel)) {
        problems.push(`only in ${set.label(base)}: ${rel}`);
      }
    }
    for (const rel of allowed) {
      if (!reference.has(rel) || !tree.has(rel)) {
        problems.push(`listed in ${diffList} but missing from a tree: ${rel}`);
      }
    }
    for (const rel of reference) {
      if (allowed.has(rel) || !tree.has(rel)) continue;
      const same = fs
        .readFileSync(path.join(referenceDir, rel))
        .equals(fs.readFileSync(path.join(treeDir, rel)));
      if (!same) {
        problems.push(
          `differs between the trees and is not in ${diffList}: ${rel}`,
        );
      }
    }

    const pair = `${set.label(REFERENCE_BASE)} and ${set.label(base)}`;
    if (problems.length) {
      failed = true;
      console.error(
        `check-bases: ${pair}: ${problems.length} problem${problems.length === 1 ? '' : 's'}`,
      );
      for (const problem of problems) console.error(`  ${problem}`);
    } else {
      console.log(
        `check-bases: ${pair}: ${reference.size} ${set.unit} in both trees, ${allowed.size} allowed to differ`,
      );
    }
  }
}

if (failed) process.exit(1);
