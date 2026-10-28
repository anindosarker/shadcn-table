#!/usr/bin/env node
// Usage (repo root):
//   node scripts/release/next-version.mjs [--level patch|minor|major] [--from-changelog]
//
// Prints the version the next release ships as: the library version in
// packages/shadcn-table/package.json bumped by one level. The level is
// --level when given (the PR's `release:` label), else the headings of the
// `## Unreleased` section of CHANGELOG.md:
//   Breaking, Removed   major (minor while the major version is 0)
//   Added, Changed      minor
//   Fixed, Docs         patch
// The highest level among the headings that have lines wins.
//
// Without --level, or with --from-changelog, the `## Unreleased` section
// must have lines: when the section is missing or empty the script prints
// nothing and exits 2, which means "no release". A line outside a `### `
// heading or an unknown heading exits 1. With --level alone the changelog is
// not read.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const LIB_PACKAGE = 'packages/shadcn-table/package.json';
const CHANGELOG = 'CHANGELOG.md';
const USAGE =
  'usage: node scripts/release/next-version.mjs [--level patch|minor|major] [--from-changelog]';

export const LEVELS = ['patch', 'minor', 'major'];
const HEADING_LEVELS = {
  Breaking: 'major',
  Removed: 'major',
  Added: 'minor',
  Changed: 'minor',
  Fixed: 'patch',
  Docs: 'patch',
};
const VERSION =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

/**
 * The version after `current` at `level`, like `npm version <level>`: a
 * prerelease of the same release line ships as that release.
 */
export const bump = (current, level) => {
  const m = VERSION.exec(current);
  if (!m) throw new Error(`${current} is not a semver version`);
  const [major, minor, patch] = [1, 2, 3].map((i) => Number(m[i]));
  const pre = Boolean(m[4]);
  if (level === 'major') {
    return pre && minor === 0 && patch === 0
      ? `${major}.0.0`
      : `${major + 1}.0.0`;
  }
  if (level === 'minor') {
    return pre && patch === 0
      ? `${major}.${minor}.0`
      : `${major}.${minor + 1}.0`;
  }
  if (level === 'patch') {
    return pre
      ? `${major}.${minor}.${patch}`
      : `${major}.${minor}.${patch + 1}`;
  }
  throw new Error(`level must be one of ${LEVELS.join(', ')}, got ${level}`);
};

/**
 * The lines of the `## Unreleased` section, blank lines dropped, or null
 * when the changelog has no such section.
 */
export const unreleasedLines = (changelog) => {
  const lines = changelog.split(/\r?\n/);
  const start = lines.findIndex((line) => /^## Unreleased[ \t]*$/.test(line));
  if (start === -1) return null;
  let end = lines.findIndex((line, i) => i > start && /^## /.test(line));
  if (end === -1) end = lines.length;
  return lines.slice(start + 1, end).filter((line) => line.trim() !== '');
};

/**
 * The release level the `## Unreleased` headings call for, or null when the
 * section is missing or has no lines under a heading. `major` is the current
 * major version: a breaking change is a minor release while it is 0.
 */
export const levelFromChangelog = (changelog, major) => {
  const lines = unreleasedLines(changelog);
  if (!lines) return null;
  const used = new Set();
  let heading = null;
  for (const line of lines) {
    const h = /^### (.+?)[ \t]*$/.exec(line);
    if (h) {
      if (!HEADING_LEVELS[h[1]]) {
        throw new Error(
          `${CHANGELOG}: unknown heading "### ${h[1]}" under "## Unreleased" (allowed: ${Object.keys(HEADING_LEVELS).join(', ')})`,
        );
      }
      heading = h[1];
      continue;
    }
    if (!heading) {
      throw new Error(
        `${CHANGELOG}: "${line.trim()}" under "## Unreleased" is outside a "### " heading`,
      );
    }
    used.add(HEADING_LEVELS[heading]);
  }
  if (used.size === 0) return null;
  const level = LEVELS.findLast((l) => used.has(l));
  return level === 'major' && major === 0 ? 'minor' : level;
};

/**
 * The CLI without its side effects: `version` is the current library
 * version, `changelog` reads CHANGELOG.md when needed. Returns the exit code
 * and the text to print.
 */
export const run = (argv, { version, changelog }) => {
  let level;
  let fromChangelog = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--level') level = argv[++i];
    else if (argv[i] === '--from-changelog') fromChangelog = true;
    else
      return {
        code: 1,
        err: `next-version: unknown argument ${argv[i]}\n${USAGE}`,
      };
  }
  if (level !== undefined && !LEVELS.includes(level)) {
    return {
      code: 1,
      err: `next-version: --level must be one of ${LEVELS.join(', ')}\n${USAGE}`,
    };
  }
  if (level === undefined || fromChangelog) {
    const major = Number(version.split('.')[0]);
    let derived;
    try {
      derived = levelFromChangelog(changelog(), major);
    } catch (error) {
      return { code: 1, err: `next-version: ${error.message}` };
    }
    if (!derived) return { code: 2, out: '' };
    level ??= derived;
  }
  return { code: 0, out: `${bump(version, level)}\n` };
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const { code, out, err } = run(process.argv.slice(2), {
    version: JSON.parse(read(LIB_PACKAGE)).version,
    changelog: () => read(CHANGELOG),
  });
  if (out) process.stdout.write(out);
  if (err) console.error(err);
  process.exit(code);
}
