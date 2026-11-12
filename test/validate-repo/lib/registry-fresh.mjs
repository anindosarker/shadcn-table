// registry-fresh, the check after registry-valid in `pnpm test
// validate-repo` (D68): runs
// the registry generators in the order of the docs `build` script and fails
// on every tracked file they wrote that differs from the index. The outputs
// are derived, not listed: a tracked file whose modification time changed
// during the run was written by a generator, so a new generated file is
// covered without editing this check. The check never resets or stashes
// anything (P2): after a failure the regenerated files stay in the working
// tree, ready to commit.
import fs from 'node:fs';
import path from 'node:path';
import { run, stripAnsi } from '../../lib/exec.mjs';

const GENERATORS = ['registry:build', 'registry:items', 'registry:hosted'];

/** @param {string} root @returns {Promise<string[]>} */
const trackedFiles = async (root) => {
  const { code, stdout, stderr } = await run('git', ['ls-files', '-z'], {
    cwd: root,
    capture: true,
    quiet: true,
  });
  if (code !== 0) throw new Error(`git ls-files: exit ${code} ${stderr}`);
  return stdout.split('\0').filter(Boolean);
};

/** @param {string} root @param {string[]} files */
const stamps = (root, files) =>
  new Map(
    files.map((file) => {
      try {
        return [
          file,
          fs.statSync(path.join(root, file), { bigint: true }).mtimeNs,
        ];
      } catch {
        return [file, null];
      }
    }),
  );

/**
 * The files whose stamp differs between two snapshots of the same list.
 *
 * @param {Map<string, bigint | null>} before
 * @param {Map<string, bigint | null>} after
 */
export const written = (before, after) =>
  [...before.keys()].filter((file) => before.get(file) !== after.get(file));

/** @param {(line: string) => void} log @param {string} root */
export const check = async (log, root) => {
  const files = await trackedFiles(root);
  const before = stamps(root, files);
  for (const script of GENERATORS) {
    const { code, stdout, stderr } = await run('pnpm', ['-w', script], {
      cwd: root,
      capture: true,
      quiet: true,
    });
    if (code !== 0) {
      const output = stripAnsi(stdout + stderr).trim();
      for (const line of output.split('\n')) log(`registry-fresh: ${line}`);
      return [`pnpm -w ${script}: exit ${code}`];
    }
  }
  const outputs = written(before, stamps(root, files));
  log(`registry-fresh: generators wrote ${outputs.length} tracked files`);
  if (!outputs.length) return [];
  const { code, stdout, stderr } = await run(
    'git',
    ['diff', '--name-only', '--', ...outputs],
    { cwd: root, capture: true, quiet: true },
  );
  if (code !== 0) return [`git diff: exit ${code} ${stderr.trim()}`];
  return stdout
    .split('\n')
    .filter(Boolean)
    .map(
      (file) =>
        `${file} is stale: run pnpm -w registry:build && pnpm -w registry:items and commit the result`,
    );
};
