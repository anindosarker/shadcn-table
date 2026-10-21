#!/usr/bin/env node
// Usage (repo root, on a clean `master`): pnpm release <version>
//
// The one release command. Guards, in order: clean tree; branch `master`;
// local `master` equals `origin/master` after a fetch; <version> is semver
// and greater than the library version; tag v<version> does not exist yet;
// CHANGELOG.md has a `## Unreleased` or `## <version>` section. A failed
// guard exits non-zero before anything is written.
//
// Then it writes <version> into packages/shadcn-table/package.json and the
// docs app package.json, renames `## Unreleased` to `## <version> - <date>`
// (local date), commits `chore: version <version>` with only those files,
// tags v<version>
// and pushes commit and tag. It does not publish to npm and runs no checks:
// the tag push runs .github/workflows/release.yml, which verifies production
// and creates the GitHub release.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DOCS_PACKAGE_NAME = 'shadcn-table-docs';
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const fail = (reason) => {
  console.error(`release: ${reason}`);
  process.exit(1);
};

const git = (...args) =>
  execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Semver precedence: negative, zero or positive like a comparator. */
const compareSemver = (a, b) => {
  const pa = SEMVER.exec(a);
  const pb = SEMVER.exec(b);
  for (let i = 1; i <= 3; i++) {
    const d = Number(pa[i]) - Number(pb[i]);
    if (d !== 0) return d;
  }
  // A version without a prerelease ranks above the same version with one.
  if (!pa[4] && !pb[4]) return 0;
  if (!pa[4]) return 1;
  if (!pb[4]) return -1;
  const ia = pa[4].split('.');
  const ib = pb[4].split('.');
  for (let i = 0; i < Math.max(ia.length, ib.length); i++) {
    if (ia[i] === undefined) return -1;
    if (ib[i] === undefined) return 1;
    const na = /^\d+$/.test(ia[i]);
    const nb = /^\d+$/.test(ib[i]);
    if (na && nb) {
      const d = Number(ia[i]) - Number(ib[i]);
      if (d !== 0) return d;
    } else if (na !== nb) {
      return na ? -1 : 1;
    } else if (ia[i] !== ib[i]) {
      return ia[i] < ib[i] ? -1 : 1;
    }
  }
  return 0;
};

const ROOT = git('rev-parse', '--show-toplevel');
const LIB_PACKAGE = 'packages/shadcn-table/package.json';
const CHANGELOG = 'CHANGELOG.md';
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

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

const version = process.argv[2];
if (!version) fail('usage: pnpm release <version>');

// Guards, in order; nothing is written before the last one passes.
const dirty = git('status', '--porcelain');
if (dirty) fail(`working tree is not clean:\n${dirty}`);

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== 'master') fail(`on branch ${branch}, releases run on master`);

git('fetch', '--quiet', 'origin');
const local = git('rev-parse', 'HEAD');
const remote = git('rev-parse', 'origin/master');
if (local !== remote) {
  fail(
    `local master (${local.slice(0, 7)}) differs from origin/master (${remote.slice(0, 7)}); pull or push first`,
  );
}

if (!SEMVER.test(version)) fail(`${version} is not a semver version`);
const current = JSON.parse(read(LIB_PACKAGE)).version;
if (compareSemver(version, current) <= 0) {
  fail(`${version} is not greater than the current version ${current}`);
}

const tag = `v${version}`;
if (git('tag', '--list', tag)) fail(`tag ${tag} already exists locally`);
if (git('ls-remote', '--tags', 'origin', `refs/tags/${tag}`)) {
  fail(`tag ${tag} already exists on origin`);
}

const changelog = read(CHANGELOG);
const unreleased = /^## Unreleased[ \t]*$/m;
const released = new RegExp(`^## ${escapeRegExp(version)}(?:\\s|$)`, 'm');
if (!unreleased.test(changelog) && !released.test(changelog)) {
  fail(
    `${CHANGELOG} has neither a "## Unreleased" nor a "## ${version}" section`,
  );
}

const docsPkg = docsPackage();

// Writes. The version line is replaced in place so the files keep their
// formatting; a package.json with no or several version lines is a bug here.
const setVersion = (rel) => {
  const text = read(rel);
  const matches = text.match(/^[ \t]*"version":[ \t]*"[^"]*",?[ \t]*$/gm) ?? [];
  if (matches.length !== 1) {
    fail(`${rel}: expected one "version" line, found ${matches.length}`);
  }
  fs.writeFileSync(
    path.join(ROOT, rel),
    text.replace(/^([ \t]*"version":[ \t]*")[^"]*(")/m, `$1${version}$2`),
  );
};
setVersion(LIB_PACKAGE);
setVersion(docsPkg);

if (released.test(changelog)) {
  console.log(`${CHANGELOG}: "## ${version}" already present, heading kept`);
} else {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  fs.writeFileSync(
    path.join(ROOT, CHANGELOG),
    changelog.replace(unreleased, `## ${version} - ${date}`),
  );
}

git('add', '--', LIB_PACKAGE, docsPkg, CHANGELOG);
git('commit', '--quiet', '-m', `chore: version ${version}`);
git('tag', tag);
console.log(`committed chore: version ${version}, tagged ${tag}`);
git('push', 'origin', 'master', tag);
console.log(
  `pushed master and ${tag}; .github/workflows/release.yml takes it from here`,
);
