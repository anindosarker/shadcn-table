// typecheck (per base): the package's `tsc:<base>` (the package names the
// Base UI config `baseui`); on radix also the docs app's `types:check`, once
// for all bases (D86 addendum). Summary `tsc clean` or the error count.
import { run as exec, stripAnsi } from '../lib/exec.mjs';

const PACKAGE_BASE = { base: 'baseui', radix: 'radix', aria: 'aria' };

export const run = async (ctx) => {
  const steps = [['shadcn-table', `tsc:${PACKAGE_BASE[ctx.base]}`]];
  if (ctx.base === 'radix') steps.push(['shadcn-table-docs', 'types:check']);
  const errors = [];
  let count = 0;
  for (const [pkg, script] of steps) {
    const { code, stdout, stderr } = await exec(
      'pnpm',
      ['--filter', pkg, script],
      { cwd: ctx.root, capture: true },
    );
    const found = stripAnsi(stdout + stderr)
      .split('\n')
      .filter((line) => /error TS\d+/.test(line));
    count += found.length;
    if (code !== 0) {
      errors.push(
        `${pkg} ${script}: exit ${code}${found.length ? `, ${found.length} errors` : ''}`,
        ...found.slice(0, 20),
      );
    }
  }
  const checked = steps.map(([pkg, script]) => `${pkg} ${script}`).join(', ');
  if (errors.length) {
    return {
      status: 'fail',
      summary: `${count || 'tsc'} error${count === 1 ? '' : 's'}`,
      details: { checked },
      errors,
    };
  }
  return { status: 'pass', summary: 'tsc clean', details: { checked } };
};
