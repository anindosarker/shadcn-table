#!/usr/bin/env node
// Usage (repo root): node scripts/release/notes.mjs <version> > notes.md
//
// Prints the body of the `## <version>` section of CHANGELOG.md (the lines
// after that heading up to the next `## ` heading or the end of the file,
// surrounding blank lines dropped) for `gh release create --notes-file`.
// Exits non-zero when the section is missing or empty, so a release never
// ships without notes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const CHANGELOG = 'CHANGELOG.md';

const version = process.argv[2];
if (!version) {
  console.error('usage: node scripts/release/notes.mjs <version>');
  process.exit(1);
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const lines = fs
  .readFileSync(path.join(ROOT, CHANGELOG), 'utf8')
  .split(/\r?\n/);
const heading = new RegExp(`^## ${escapeRegExp(version)}(?:\\s|$)`);
const start = lines.findIndex((line) => heading.test(line));
if (start === -1) {
  console.error(`notes: ${CHANGELOG} has no "## ${version}" section`);
  process.exit(1);
}
let end = lines.findIndex((line, i) => i > start && /^## /.test(line));
if (end === -1) end = lines.length;

const body = lines
  .slice(start + 1, end)
  .join('\n')
  .trim();
if (!body) {
  console.error(`notes: the "## ${version}" section of ${CHANGELOG} is empty`);
  process.exit(1);
}
process.stdout.write(`${body}\n`);
