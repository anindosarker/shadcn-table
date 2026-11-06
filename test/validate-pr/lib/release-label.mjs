// release-label: the PR's `release:` labels, read live (`gh pr view`), not
// from the event payload, so a run sees a label added right after `opened`.
// More than one is an error. A PR into master needs exactly one; on another
// base a label is required only when the PR changes shipped files (the
// library trees, the installed docs copies, skills/).
import { run } from '../../lib/exec.mjs';

const SHIPPED =
  /^(packages\/shadcn-table\/registry\/|apps\/shadcn-table-docs\/components\/ui-(radix|base|aria)\/|skills\/)/;

const gh = async (args, root) => {
  const { code, stdout, stderr } = await run('gh', args, {
    cwd: root,
    capture: true,
    quiet: true,
  });
  if (code !== 0) throw new Error(`gh ${args[0]} ${args[1]}: ${stderr.trim()}`);
  return stdout.split('\n').filter(Boolean);
};

/** The PR's changed files and `release:` labels. */
export const read = async ({ repo, pr, root }) => ({
  files: await gh(
    [
      'api',
      `repos/${repo}/pulls/${pr}/files`,
      '--paginate',
      '--jq',
      '.[].filename',
    ],
    root,
  ),
  labels: await gh(
    [
      'pr',
      'view',
      String(pr),
      '--repo',
      repo,
      '--json',
      'labels',
      '--jq',
      '.labels[].name | select(startswith("release:"))',
    ],
    root,
  ),
});

/**
 * @returns {{ problems: string[], label?: string, reason?: string }} `label`
 * when a version is to be computed, `reason` when nothing ships.
 */
export const check = ({ baseRef, files, labels }) => {
  if (labels.length > 1) {
    return { problems: [`more than one release: label: ${labels.join(' ')}`] };
  }
  const shipped = files.filter((file) => SHIPPED.test(file));
  if (!labels.length && baseRef === 'master') {
    return {
      problems: [
        'a PR into master needs one release: label (release:patch, release:minor, release:major, release:skip)',
      ],
    };
  }
  if (!labels.length && shipped.length) {
    return {
      problems: [
        `this PR changes shipped files and has no release: label; add one of release:patch, release:minor, release:major, release:skip (${shipped.slice(0, 20).join(', ')})`,
      ],
    };
  }
  if (!labels.length)
    return { problems: [], reason: 'No release: label missing' };
  if (labels[0] === 'release:skip') {
    return { problems: [], reason: 'No release (release:skip)' };
  }
  return { problems: [], label: labels[0] };
};
