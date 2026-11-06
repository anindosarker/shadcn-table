// validate-pr, on a pull request only (PR, GH_TOKEN, GITHUB_REPOSITORY,
// GITHUB_BASE_REF, GITHUB_HEAD_REF): source-branch, release-label,
// version-bump-dry-run. The record's details carry version, label, reason and
// the `## Unreleased` line counts by heading for PR Summary. Summary
// `Ships as <v> (<label>)` or the reason nothing ships. Outside a pull
// request (no PR) it passes with the changelog counts only.
import fs from 'node:fs';
import path from 'node:path';
import * as releaseLabel from './lib/release-label.mjs';
import * as sourceBranch from './lib/source-branch.mjs';
import * as versionBump from './lib/version-bump-dry-run.mjs';

/** The `- ` lines under each `### Heading` of `## Unreleased`, by heading. */
export const changelogCounts = (text) => {
  const counts = {};
  let inUnreleased = false;
  let heading;
  for (const line of text.split('\n')) {
    if (/^## /.test(line)) {
      inUnreleased = /^## Unreleased\b/.test(line);
      heading = undefined;
      continue;
    }
    if (!inUnreleased) continue;
    const h = line.match(/^### (.+?)\s*$/);
    if (h) {
      heading = h[1].toLowerCase();
      continue;
    }
    if (heading && /^- /.test(line))
      counts[heading] = (counts[heading] ?? 0) + 1;
  }
  return counts;
};

export const run = async (ctx) => {
  const changelog = changelogCounts(
    fs.readFileSync(path.join(ctx.root, 'CHANGELOG.md'), 'utf8'),
  );
  const pr = process.env.PR;
  if (!pr) {
    return {
      status: 'pass',
      summary: 'not a pull request, skipped',
      details: { changelog },
    };
  }
  const env = {
    repo: process.env.GITHUB_REPOSITORY ?? 'anindosarker/shadcn-table',
    pr,
    baseRef: process.env.GITHUB_BASE_REF ?? '',
    headRef: process.env.GITHUB_HEAD_REF ?? '',
    root: ctx.root,
  };
  const errors = [];
  const details = { changelog };

  errors.push(...sourceBranch.check(env));

  const { files, labels } = await releaseLabel.read(env);
  const labelResult = releaseLabel.check({ ...env, files, labels });
  errors.push(...labelResult.problems);
  if (labelResult.reason) details.reason = labelResult.reason;
  if (labelResult.label) details.label = labelResult.label;

  if (labelResult.label) {
    const bump = await versionBump.check({
      label: labelResult.label,
      files,
      repo: env.repo,
      root: ctx.root,
    });
    errors.push(...bump.problems);
    if (bump.version) details.version = bump.version;
    if (bump.note) details.note = bump.note;
  }

  let summary;
  if (details.version) {
    summary = `Ships as ${details.version} (${details.label}${details.note ? `, ${details.note}` : ''})`;
  } else if (details.reason && !errors.length) {
    summary = details.reason;
  } else {
    summary = errors[0] ?? 'no version';
  }
  if (!errors.length) ctx.log(summary);
  return {
    status: errors.length ? 'fail' : 'pass',
    summary,
    details,
    ...(errors.length ? { errors } : {}),
  };
};
