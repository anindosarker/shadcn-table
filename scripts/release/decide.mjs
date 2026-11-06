#!/usr/bin/env node
// Usage (repo root, the decide job of .github/workflows/release.yml):
//   node scripts/release/decide.mjs
//
// Chooses what a run of release.yml does and prints one line
// `mode=<mode> version=<version>`; in Actions it also appends the two
// outputs to $GITHUB_OUTPUT and a line to $GITHUB_STEP_SUMMARY. Reads EVENT
// (push or workflow_dispatch), INPUT_VERSION (the dispatch input) and
// GITHUB_SHA from the environment.
//   release  CHANGELOG.md has no `## Unreleased` lines (next-version.mjs
//            exits 2) and v<package version> is not tagged on origin: the
//            release PR, bumped by its `version bump (release:prepare)`
//            check, was merged. A dispatch is always a release, for
//            INPUT_VERSION or the package version.
//   none     the section has no lines and the tag exists; or the section
//            has lines (exit 0): merged without the version bump, a warning,
//            nothing released.
// Any other exit code of next-version.mjs (a malformed section) is passed
// through, so the workflow fails on it.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const LIB_PACKAGE = 'packages/shadcn-table/package.json';
const NEXT_VERSION = 'scripts/release/next-version.mjs';

/**
 * The decision without its side effects. `env` holds EVENT, INPUT_VERSION
 * and GITHUB_SHA; `version` is the library version; `changelogStatus()` is
 * the exit code of next-version.mjs --from-changelog (0 lines, 2 none);
 * `tagged(tag)` says whether origin has the tag. Returns the exit code, the
 * outputs and the lines to print.
 */
export const decide = (env, { version, changelogStatus, tagged }) => {
  const lines = [];
  let mode;
  if (env.EVENT === 'workflow_dispatch') {
    mode = 'release';
    version = env.INPUT_VERSION || version;
  } else {
    const status = changelogStatus();
    if (status === 0) {
      mode = 'none';
      lines.push(
        '::warning::CHANGELOG.md has ## Unreleased lines on master: merged without the version bump; nothing released',
      );
    } else if (status === 2) {
      if (tagged(`v${version}`)) {
        mode = 'none';
        lines.push(
          `no Unreleased lines and v${version} is already tagged; nothing to do`,
        );
      } else {
        mode = 'release';
      }
    } else {
      return { code: status, lines };
    }
  }
  lines.push(`mode=${mode} version=${version}`);
  return { code: 0, mode, version, lines };
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = decide(process.env, {
    version: JSON.parse(fs.readFileSync(path.join(ROOT, LIB_PACKAGE), 'utf8'))
      .version,
    changelogStatus: () =>
      spawnSync(process.execPath, [NEXT_VERSION, '--from-changelog'], {
        cwd: ROOT,
        stdio: ['ignore', 'ignore', 'inherit'],
      }).status,
    tagged: (tag) =>
      spawnSync(
        'git',
        ['ls-remote', '--exit-code', '--tags', 'origin', `refs/tags/${tag}`],
        { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] },
      ).status === 0,
  });
  for (const line of result.lines) console.log(line);
  if (result.code !== 0) process.exit(result.code);
  const { mode, version } = result;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `mode=${mode}\nversion=${version}\n`,
    );
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `Mode \`${mode}\`, package version ${version}.\n`,
    );
  }
}
