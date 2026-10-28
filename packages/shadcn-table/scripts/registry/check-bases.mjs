#!/usr/bin/env node
// Usage (repo root): pnpm check:bases, also the CI job `bases`.
//
// The library exists once per edition (registry/<edition>, EDITIONS in
// lib.mjs, each under components/ui/shadcn-table), and a common change is
// made in every tree by hand. This guard is how a missed twin is found: every
// edition other than the reference (radix) is compared against it with its
// own list, scripts/registry/<edition>-diff.json. A library file not on an
// edition's list must be byte-identical in that tree and the reference, every
// listed file must exist in both, and no library file may exist in one of the
// two only. It prints one line per edition, then every offending path, and
// exits non-zero on any problem; it never copies or edits a file.
import fs from 'node:fs';
import path from 'node:path';
import { EDITIONS, PKG, REFERENCE_EDITION } from './lib.mjs';

const LIB_REL = 'components/ui/shadcn-table';
const treeDir = (edition) => path.join(PKG, 'registry', edition, LIB_REL);

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

const reference = new Set(walk(treeDir(REFERENCE_EDITION)));
let failed = false;

for (const edition of EDITIONS) {
  if (edition === REFERENCE_EDITION) continue;
  const diffList = `${edition}-diff.json`;
  const allowed = new Set(
    JSON.parse(
      fs.readFileSync(path.join(PKG, 'scripts/registry', diffList), 'utf8'),
    ),
  );
  const tree = new Set(walk(treeDir(edition)));
  const problems = [];

  for (const rel of reference) {
    if (!tree.has(rel)) {
      problems.push(`only in registry/${REFERENCE_EDITION}: ${rel}`);
    }
  }
  for (const rel of tree) {
    if (!reference.has(rel)) problems.push(`only in registry/${edition}: ${rel}`);
  }
  for (const rel of allowed) {
    if (!reference.has(rel) || !tree.has(rel)) {
      problems.push(`listed in ${diffList} but missing from a tree: ${rel}`);
    }
  }
  for (const rel of reference) {
    if (allowed.has(rel) || !tree.has(rel)) continue;
    const same = fs
      .readFileSync(path.join(treeDir(REFERENCE_EDITION), rel))
      .equals(fs.readFileSync(path.join(treeDir(edition), rel)));
    if (!same) {
      problems.push(
        `differs between the trees and is not in ${diffList}: ${LIB_REL}/${rel}`,
      );
    }
  }

  const pair = `${REFERENCE_EDITION} and ${edition}`;
  if (problems.length) {
    failed = true;
    console.error(
      `check-bases: ${pair}: ${problems.length} problem${problems.length === 1 ? '' : 's'}`,
    );
    for (const problem of problems) console.error(`  ${problem}`);
  } else {
    console.log(
      `check-bases: ${pair}: ${reference.size} library files in both trees, ${allowed.size} allowed to differ`,
    );
  }
}

if (failed) process.exit(1);
