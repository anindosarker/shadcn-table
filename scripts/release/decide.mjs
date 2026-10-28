#!/usr/bin/env node
// Usage (repo root, the decide job of .github/workflows/release.yml):
//   node scripts/release/decide.mjs
//
// Chooses what a run of release.yml does and prints one line
// `mode=<mode> version=<version> level=<level>`; in Actions it also appends
// the three outputs to $GITHUB_OUTPUT and a line to $GITHUB_STEP_SUMMARY.
// Reads EVENT (push or workflow_dispatch), INPUT_VERSION (the dispatch
// input) and GITHUB_SHA from the environment; gh needs GH_TOKEN.
//   version  CHANGELOG.md has `## Unreleased` lines (next-version.mjs exits
//            0). level is the `release:` label of the pull request merged as
//            GITHUB_SHA (patch, minor or major), or empty: the headings decide.
//   release  the section has no lines (exit 2) and v<package version> is not
//            tagged on origin: the version PR was merged. A dispatch is always
//            a release, for INPUT_VERSION or the package version.
//   none     the section has no lines and the tag exists.
// Any other exit code of next-version.mjs (a malformed section) is passed
// through, so the workflow fails on it.
import { execFileSync, spawnSync } from 'node:child_process';
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
const LEVELS = ['patch', 'minor', 'major'];

/**
 * The decision without its side effects. `env` holds EVENT, INPUT_VERSION
 * and GITHUB_SHA; `version` is the library version; `changelogStatus()` is
 * the exit code of next-version.mjs --from-changelog (0 lines, 2 none);
 * `mergedLabel(sha)` is the `release:` label of the pull request merged as
 * sha, or ''; `tagged(tag)` says whether origin has the tag. Returns the exit
 * code, the outputs and the lines to print.
 */
export const decide = (env, { version, changelogStatus, mergedLabel, tagged }) => {
  const lines = [];
  let mode;
  let level = '';
  if (env.EVENT === 'workflow_dispatch') {
    mode = 'release';
    version = env.INPUT_VERSION || version;
  } else {
    const status = changelogStatus();
    if (status === 0) {
      mode = 'version';
      const label = mergedLabel(env.GITHUB_SHA);
      const candidate = label.replace(/^release:/, '');
      if (label !== candidate && LEVELS.includes(candidate)) level = candidate;
      lines.push(`merged PR label: ${label || 'none'}`);
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
  lines.push(`mode=${mode} version=${version} level=${level || 'from headings'}`);
  return { code: 0, mode, version, level, lines };
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const run = (cmd, args) =>
    execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
  const result = decide(process.env, {
    version: JSON.parse(fs.readFileSync(path.join(ROOT, LIB_PACKAGE), 'utf8'))
      .version,
    changelogStatus: () =>
      spawnSync(process.execPath, [NEXT_VERSION, '--from-changelog'], {
        cwd: ROOT,
        stdio: ['ignore', 'ignore', 'inherit'],
      }).status,
    mergedLabel: (sha) =>
      run('gh', [
        'pr',
        'list',
        '--search',
        sha,
        '--state',
        'merged',
        '--json',
        'labels',
        '--jq',
        '[.[0].labels[]?.name | select(startswith("release:"))][0] // ""',
      ]),
    tagged: (tag) =>
      spawnSync(
        'git',
        ['ls-remote', '--exit-code', '--tags', 'origin', `refs/tags/${tag}`],
        { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] },
      ).status === 0,
  });
  for (const line of result.lines) console.log(line);
  if (result.code !== 0) process.exit(result.code);
  const { mode, version, level } = result;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `mode=${mode}\nversion=${version}\nlevel=${level}\n`,
    );
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `Mode \`${mode}\`, package version ${version}.\n`,
    );
  }
}
