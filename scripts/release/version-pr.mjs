#!/usr/bin/env node
// Usage (repo root, clean tree): node scripts/release/version-pr.mjs <next>
//
// Opens or rewrites the version pull request, run by .github/workflows/release.yml
// on a push to `master` whose CHANGELOG.md has `## Unreleased` lines (<next>
// from next-version.mjs). It writes <next> into
// packages/shadcn-table/package.json and the docs app package.json, renames
// `## Unreleased` to `## <next> - <date>`, resets branch release/next to the
// current HEAD (git checkout -B) with one commit `chore: version <next>`
// (as github-actions[bot] when GITHUB_ACTIONS is set), force-pushes it, and
// opens the pull request into `master` or edits the open one from
// release/next. Running it again on a later `master` replaces the branch and
// the pull request text, so several merges accumulate in one version PR.
// It returns to the starting branch at the end. Merging the PR runs the
// release job of release.yml.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCS_PACKAGE_NAME = 'shadcn-table-docs';
const LIB_PACKAGE = 'packages/shadcn-table/package.json';
const CHANGELOG = 'CHANGELOG.md';
const BRANCH = 'release/next';
const BASE = 'master';
const BOT = [
  '-c',
  'user.name=github-actions[bot]',
  '-c',
  'user.email=41898282+github-actions[bot]@users.noreply.github.com',
];
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const fail = (reason) => {
  console.error(`version-pr: ${reason}`);
  process.exit(1);
};

const run = (cmd, args, input) =>
  execFileSync(cmd, args, {
    encoding: 'utf8',
    input,
    stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'inherit'],
  }).trim();
const git = (...args) => run('git', args);
const gh = (args, input) => run('gh', args, input);

const next = process.argv[2];
if (!next || !VERSION.test(next)) {
  fail('usage: node scripts/release/version-pr.mjs <next>, a semver version');
}

const ROOT = git('rev-parse', '--show-toplevel');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(ROOT, rel), text);

/** The docs app's package.json, found by package name so a folder rename does not matter. */
const docsPackage = () => {
  const apps = path.join(ROOT, 'apps');
  for (const dir of fs.readdirSync(apps)) {
    const rel = path.join('apps', dir, 'package.json');
    if (!fs.existsSync(path.join(ROOT, rel))) continue;
    if (JSON.parse(read(rel)).name === DOCS_PACKAGE_NAME) return rel;
  }
  return fail(`no apps/*/package.json named ${DOCS_PACKAGE_NAME}`);
};

// Guards; nothing is written before they pass.
const dirty = git('status', '--porcelain');
if (dirty) fail(`working tree is not clean:\n${dirty}`);

const changelog = read(CHANGELOG);
const unreleased = /^## Unreleased[ \t]*$/m;
if (!unreleased.test(changelog)) {
  fail(`${CHANGELOG} has no "## Unreleased" section; nothing to version`);
}
const docsPkg = docsPackage();
const start =
  git('rev-parse', '--abbrev-ref', 'HEAD') === 'HEAD'
    ? git('rev-parse', 'HEAD')
    : git('rev-parse', '--abbrev-ref', 'HEAD');

// Writes. The version line is replaced in place so the files keep their
// formatting; a package.json with no or several version lines is a bug here.
const setVersion = (rel) => {
  const text = read(rel);
  const matches = text.match(/^[ \t]*"version":[ \t]*"[^"]*",?[ \t]*$/gm) ?? [];
  if (matches.length !== 1) {
    fail(`${rel}: expected one "version" line, found ${matches.length}`);
  }
  write(
    rel,
    text.replace(/^([ \t]*"version":[ \t]*")[^"]*(")/m, `$1${next}$2`),
  );
};

const now = new Date();
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');
const closed = changelog.replace(unreleased, `## ${next} - ${date}`);

git('checkout', '--quiet', '-B', BRANCH);
setVersion(LIB_PACKAGE);
setVersion(docsPkg);
write(CHANGELOG, closed);
git('add', '--', LIB_PACKAGE, docsPkg, CHANGELOG);
const identity = process.env.GITHUB_ACTIONS ? BOT : [];
run('git', [...identity, 'commit', '--quiet', '-m', `chore: version ${next}`]);
git('push', '--quiet', '--force', 'origin', `${BRANCH}:${BRANCH}`);
console.log(`committed chore: version ${next} on ${BRANCH}, force-pushed`);

// The PR body: the closed section without its heading, then what merging does.
const lines = closed.split(/\r?\n/);
const from = lines.findIndex((line) => line === `## ${next} - ${date}`);
let to = lines.findIndex((line, i) => i > from && /^## /.test(line));
if (to === -1) to = lines.length;
const section = lines
  .slice(from + 1, to)
  .join('\n')
  .trim();
const title = `chore: version ${next}`;
const body = `${section}\n\nMerging releases v${next}: tag, production smoke, installs, GitHub release.\n`;

let failure;
try {
  const open = gh([
    'pr',
    'list',
    '--head',
    BRANCH,
    '--base',
    BASE,
    '--state',
    'open',
    '--json',
    'number',
    '--jq',
    '.[0].number // empty',
  ]);
  if (open) {
    gh(['pr', 'edit', open, '--title', title, '--body-file', '-'], body);
    console.log(`edited pull request #${open}`);
  } else {
    const url = gh(
      [
        'pr',
        'create',
        '--base',
        BASE,
        '--head',
        BRANCH,
        '--title',
        title,
        '--body-file',
        '-',
      ],
      body,
    );
    console.log(`opened ${url}`);
  }
} catch {
  failure = `gh could not open or edit the pull request from ${BRANCH}; in Actions, "Allow GitHub Actions to create and approve pull requests" (Settings, Actions, General) must be on`;
}
git('checkout', '--quiet', start);
if (failure) fail(failure);
