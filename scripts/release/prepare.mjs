#!/usr/bin/env node
// Usage (repo root):
//   node scripts/release/prepare.mjs [--level patch|minor|major] [--base-version <v>]
//   node scripts/release/prepare.mjs --check --base-version <v>
//
// Prepares a release on the current branch, run by the `version bump
// (release:prepare)` job of .github/workflows/pr.yml on the release pull
// request (`pnpm release:prepare` locally). The next version comes from
// next-version.mjs: the --level when given (the PR's `release:` label), else
// the `## Unreleased` headings. It writes that version into
// packages/shadcn-table/package.json and the docs app's package.json, renames
// `## Unreleased` to `## <next> - <YYYY-MM-DD>` (UTC) and prints <next>.
// Exit 2 when `## Unreleased` has no lines (nothing to version), 1 on a bad
// level or a malformed section. No git: the caller commits.
//
// --base-version <v> (the library version on master, the job passes it): the
// next version is computed from <v>, and a head already bumped to another
// version folds that section into the new one.
//
// --check --base-version <v> says whether the head is already bumped, <v>
// being the library version on master (the caller reads it):
//   0  bumped: no `## Unreleased` lines and the library version is not <v>
//   2  not bumped: `## Unreleased` has lines
//   1  inconsistent: no lines and the version equals <v>, or a malformed section
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { levelFromChangelog, run } from './next-version.mjs';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const LIB_PACKAGE = 'packages/shadcn-table/package.json';
const DOCS_PACKAGE_NAME = 'shadcn-table-docs';
const CHANGELOG = 'CHANGELOG.md';
const USAGE =
  'usage: node scripts/release/prepare.mjs [--level patch|minor|major] [--base-version <v>] | --check --base-version <v>';
const UNRELEASED = /^## Unreleased[ \t]*$/m;
const VERSION_LINE = /^[ \t]*"version":[ \t]*"[^"]*",?[ \t]*$/gm;

/**
 * The package.json text with its one `"version"` line set to `next`, in
 * place so the file keeps its formatting. Throws unless the text has exactly
 * one version line.
 */
export const setVersion = (packageJsonText, next) => {
  const found = packageJsonText.match(VERSION_LINE)?.length ?? 0;
  if (found !== 1) {
    throw new Error(`expected one "version" line, found ${found}`);
  }
  return packageJsonText.replace(
    /^([ \t]*"version":[ \t]*")[^"]*(")/m,
    `$1${next}$2`,
  );
};

/**
 * The bump without its side effects: `version` is the library version,
 * `changelog()` reads CHANGELOG.md, `now()` gives the date of the heading.
 * Returns the next version and the renamed changelog, or the exit code and
 * the message.
 */
export const prepare = (argv, { version, changelog, now }) => {
  const args = [];
  let from = version;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--level' && i + 1 < argv.length) {
      args.push('--level', argv[++i]);
    } else if (argv[i] === '--base-version' && i + 1 < argv.length) {
      from = argv[++i];
    } else {
      return { code: 1, err: `prepare: unknown argument ${argv[i]}\n${USAGE}` };
    }
  }
  const text = changelog();
  const result = run([...args, '--from-changelog'], {
    version: from,
    changelog: () => text,
  });
  if (result.code === 2) {
    return {
      code: 2,
      err: `prepare: no lines under ## Unreleased in ${CHANGELOG}; nothing to version`,
    };
  }
  if (result.code !== 0) {
    return {
      code: result.code,
      err: result.err.replace(/^next-version:/, 'prepare:'),
    };
  }
  const next = result.out.trim();
  const date = now().toISOString().slice(0, 10);
  // The earlier bump's heading goes first, so its lines fold into the new
  // section (the new heading may carry the same version).
  let closed = text;
  if (version !== from) {
    closed = closed.replace(
      new RegExp(
        '^## ' +
          version.replaceAll('.', '\\.') +
          ' - \\d{4}-\\d{2}-\\d{2}[ \\t]*\\n\\n?',
        'm',
      ),
      '',
    );
  }
  closed = closed.replace(UNRELEASED, `## ${next} - ${date}`);
  return { code: 0, next, changelog: closed };
};

/**
 * Whether the head is already bumped against `baseVersion`, the library
 * version on master. Returns the exit code and the line to print.
 */
export const check = ({ version, baseVersion, changelog }) => {
  let level;
  try {
    level = levelFromChangelog(changelog(), Number(version.split('.')[0]));
  } catch (error) {
    return { code: 1, line: `prepare: ${error.message}` };
  }
  if (level) {
    return {
      code: 2,
      line: `not bumped: ## Unreleased has lines (version ${version})`,
    };
  }
  if (version === baseVersion) {
    return {
      code: 1,
      line: `inconsistent: no ## Unreleased lines and the version ${version} equals master's`,
    };
  }
  return {
    code: 0,
    line: `already bumped: ${version} (master ${baseVersion})`,
  };
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const write = (rel, text) => fs.writeFileSync(path.join(ROOT, rel), text);
  const exit = (code, message) => {
    if (message) console.error(message);
    process.exit(code);
  };
  const argv = process.argv.slice(2);
  const version = JSON.parse(read(LIB_PACKAGE)).version;
  if (argv.includes('--check')) {
    const at = argv.indexOf('--base-version');
    const baseVersion = at === -1 ? undefined : argv[at + 1];
    if (argv.length !== 3 || !baseVersion || baseVersion.startsWith('--')) {
      exit(1, `prepare: --check needs --base-version <v>\n${USAGE}`);
    }
    const { code, line } = check({
      version,
      baseVersion,
      changelog: () => read(CHANGELOG),
    });
    console.log(line);
    process.exit(code);
  }
  const result = prepare(argv, {
    version,
    changelog: () => read(CHANGELOG),
    now: () => new Date(),
  });
  if (result.code !== 0) exit(result.code, result.err);
  const docs = fs
    .readdirSync(path.join(ROOT, 'apps'))
    .map((dir) => path.join('apps', dir, 'package.json'))
    .find(
      (rel) =>
        fs.existsSync(path.join(ROOT, rel)) &&
        JSON.parse(read(rel)).name === DOCS_PACKAGE_NAME,
    );
  if (!docs)
    exit(1, `prepare: no apps/*/package.json named ${DOCS_PACKAGE_NAME}`);
  // Both package.json files are checked before anything is written.
  let updated;
  try {
    updated = [LIB_PACKAGE, docs].map((rel) => [
      rel,
      setVersion(read(rel), result.next),
    ]);
  } catch (error) {
    exit(1, `prepare: ${error.message}`);
  }
  for (const [rel, text] of updated) write(rel, text);
  write(CHANGELOG, result.changelog);
  console.log(result.next);
}
