// date-picker, the check after bases-identical in `pnpm test validate-repo`
// (spec 81): each tree's date picker and hook equal what
// `pnpm add-date-picker <base>` writes for DATE_PICKER_TAG, through the
// tool's own `--check`. The tool reads the picker from GitHub: when GitHub
// cannot be reached the check is skipped with a printed line locally, and
// fails under --ci.
import {
  BASES,
  DATE_PICKER_REPO,
  DATE_PICKER_TAG,
} from '../../../tools/registry/lib.mjs';
import { run, stripAnsi } from '../../lib/exec.mjs';

const CATALOG = `https://raw.githubusercontent.com/${DATE_PICKER_REPO}/${DATE_PICKER_TAG}/registry.json`;

/**
 * @param {(line: string) => void} log
 * @param {string} root
 * @param {boolean} ci
 */
export const check = async (log, root, ci) => {
  const reachable = await fetch(CATALOG, {
    signal: AbortSignal.timeout(15_000),
  }).then(
    (res) => res.ok,
    () => false,
  );
  if (!reachable) {
    if (ci) return [`${CATALOG} could not be fetched`];
    log(`date-picker: skipped, ${CATALOG} could not be fetched`);
    return [];
  }
  const problems = [];
  for (const base of BASES) {
    const { code, stdout, stderr } = await run(
      process.execPath,
      ['tools/registry/add-date-picker.mjs', base, '--check'],
      { cwd: root, capture: true, quiet: true },
    );
    const output = stripAnsi(stdout + stderr).trim();
    for (const line of output.split('\n')) log(`date-picker: ${line}`);
    if (code !== 0) {
      problems.push(
        ...output
          .split('\n')
          .filter((line) => /^\s+(missing|extra|differs): /.test(line))
          .map((line) => `registry/${base}: ${line.trim()}`),
      );
      if (!problems.some((p) => p.startsWith(`registry/${base}:`))) {
        problems.push(`registry/${base}: add-date-picker --check exit ${code}`);
      }
    }
  }
  return problems;
};
