// version-bump-dry-run: the version the PR ships as. The label's level and
// the `## Unreleased` lines go through tools/release/next-version.mjs; on
// exit 2 (no Unreleased lines) the head counts as already bumped when
// tools/release/prepare-release.mjs --check passes against master's library
// version, as Prepare Release leaves it.
import { run } from '../../lib/exec.mjs';
import fs from 'node:fs';
import path from 'node:path';

const node = (root, args) =>
  run(process.execPath, args, { cwd: root, capture: true, quiet: true });

const masterVersion = async ({ repo, root }) => {
  const { code, stdout, stderr } = await run(
    'gh',
    [
      'api',
      `repos/${repo}/contents/packages/shadcn-table/package.json?ref=master`,
      '--jq',
      '.content',
    ],
    { cwd: root, capture: true, quiet: true },
  );
  if (code !== 0)
    throw new Error(`gh api master package.json: ${stderr.trim()}`);
  return JSON.parse(Buffer.from(stdout.trim(), 'base64').toString('utf8'))
    .version;
};

/**
 * @returns {Promise<{ problems: string[], version?: string, note?: string }>}
 */
export const check = async ({ label, files, repo, root }) => {
  if (!files.includes('CHANGELOG.md')) {
    return {
      problems: [
        `${label} needs a line under "## Unreleased" in CHANGELOG.md; this PR does not change CHANGELOG.md`,
      ],
    };
  }
  const level = label.replace(/^release:/, '');
  const next = await node(root, [
    'tools/release/next-version.mjs',
    '--level',
    level,
    '--from-changelog',
  ]);
  if (next.code === 2) {
    const base = await masterVersion({ repo, root });
    const bumped = await node(root, [
      'tools/release/prepare-release.mjs',
      '--check',
      '--base-version',
      base,
    ]);
    if (bumped.code === 0) {
      const current = JSON.parse(
        fs.readFileSync(
          path.join(root, 'packages/shadcn-table/package.json'),
          'utf8',
        ),
      ).version;
      return { problems: [], version: current, note: 'already bumped' };
    }
    return {
      problems: [`${label} needs lines under "## Unreleased" in CHANGELOG.md`],
    };
  }
  if (next.code !== 0) {
    return {
      problems: [`next-version: exit ${next.code}: ${next.stderr.trim()}`],
    };
  }
  return { problems: [], version: next.stdout.trim() };
};
