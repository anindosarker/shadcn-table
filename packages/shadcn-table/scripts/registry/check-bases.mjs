#!/usr/bin/env node
// Usage (repo root): pnpm check:bases, also the CI job `bases`.
//
// Two file sets exist once per edition (EDITIONS in lib.mjs): the library,
// registry/<edition>/components/ui/shadcn-table, and the docs examples,
// apps/shadcn-table-docs/examples/<edition>. A common change is made in
// every tree by hand, and this guard is how a missed twin is found: every
// edition other than the reference (radix) is compared against it with its
// own list of files allowed to differ, scripts/registry/<edition>-diff.json
// for the library and scripts/registry/examples-<edition>-diff.json for the
// examples. A file not on the list must be byte-identical in that tree and
// the reference, every listed file must exist in both, and no file may exist
// in one of the two only. It prints one line per edition and set, then every
// offending path, and exits non-zero on any problem; it never copies or
// edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { DOCS, EDITIONS, PKG, REFERENCE_EDITION } from './lib.mjs';

const LIB_REL = 'components/ui/shadcn-table';

// The guarded sets: a tree per edition and the allow list of every other
// edition, named for the messages.
const SETS = [
  {
    label: (edition) => `registry/${edition}`,
    tree: (edition) => path.join(PKG, 'registry', edition, LIB_REL),
    diffList: (edition) => `${edition}-diff.json`,
    unit: 'library files',
  },
  {
    label: (edition) => `examples/${edition}`,
    tree: (edition) => path.join(DOCS, 'examples', edition),
    diffList: (edition) => `examples-${edition}-diff.json`,
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
  const referenceDir = set.tree(REFERENCE_EDITION);
  const reference = new Set(walk(referenceDir));
  for (const edition of EDITIONS) {
    if (edition === REFERENCE_EDITION) continue;
    const diffList = set.diffList(edition);
    const allowed = new Set(
      JSON.parse(
        fs.readFileSync(path.join(PKG, 'scripts/registry', diffList), 'utf8'),
      ),
    );
    const treeDir = set.tree(edition);
    const tree = new Set(walk(treeDir));
    const problems = [];

    for (const rel of reference) {
      if (!tree.has(rel)) {
        problems.push(`only in ${set.label(REFERENCE_EDITION)}: ${rel}`);
      }
    }
    for (const rel of tree) {
      if (!reference.has(rel)) {
        problems.push(`only in ${set.label(edition)}: ${rel}`);
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

    const pair = `${set.label(REFERENCE_EDITION)} and ${set.label(edition)}`;
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
