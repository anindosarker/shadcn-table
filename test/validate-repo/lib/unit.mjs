// unit, the fifth check of `pnpm test validate-repo`: the tool unit tests,
// `node --test "tools/**/*.test.mjs"` (D85 addendum).
import { run, stripAnsi } from '../../lib/exec.mjs';

/**
 * @param {(line: string) => void} log
 * @param {string} root
 * @returns {Promise<{ problems: string[], tests: number }>}
 */
export const check = async (log, root) => {
  const { code, stdout, stderr } = await run(
    process.execPath,
    ['--test', '--test-reporter=spec', 'tools/**/*.test.mjs'],
    { cwd: root, capture: true, quiet: true },
  );
  const output = stripAnsi(stdout + stderr);
  const n = (key) =>
    Number(output.match(new RegExp(`ℹ ${key} (\\d+)`))?.[1] ?? 0);
  const tests = n('tests');
  const failed = n('fail');
  log(`unit: ${tests} tests, ${failed} failed`);
  if (code === 0) return { problems: [], tests };
  for (const line of output.split('\n').filter((l) => /^not ok|✖/.test(l))) {
    log(`  ${line}`);
  }
  return {
    problems: [`node --test: exit ${code}, ${failed} failed of ${tests}`],
    tests,
  };
};
