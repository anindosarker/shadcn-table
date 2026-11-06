// lint: eslint in the package (`--max-warnings 0`) and in the docs app, both
// run before the exit. Summary `0 warnings`, the warning count when the docs
// app (which has no warning limit) reports some, or the problem count on a
// failure.
import { run as exec, stripAnsi } from '../lib/exec.mjs';

const PACKAGES = ['shadcn-table', 'shadcn-table-docs'];

export const run = async (ctx) => {
  const errors = [];
  let problems = 0;
  let warnings = 0;
  for (const pkg of PACKAGES) {
    const { code, stdout, stderr } = await exec(
      'pnpm',
      ['--filter', pkg, 'lint'],
      { cwd: ctx.root, capture: true },
    );
    const totals = stripAnsi(stdout + stderr).match(
      /✖ (\d+) problems? \((\d+) errors?, (\d+) warnings?\)/,
    );
    const count = Number(totals?.[1] ?? 0);
    problems += count;
    warnings += Number(totals?.[3] ?? 0);
    if (code !== 0) {
      errors.push(
        `${pkg} lint: exit ${code}${count ? `, ${count} problems` : ''}`,
      );
    }
  }
  if (errors.length) {
    return {
      status: 'fail',
      summary: `${problems} problem${problems === 1 ? '' : 's'}`,
      errors,
    };
  }
  return {
    status: 'pass',
    summary: `${warnings} warning${warnings === 1 ? '' : 's'}`,
  };
};
