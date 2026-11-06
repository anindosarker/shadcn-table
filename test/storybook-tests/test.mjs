// storybook-tests (per base): the package's `test:<base>`, every story
// rendered in Chromium (vitest browser mode) and every play run. Chromium is
// installed by the CI job, not here. Summary the vitest count (`609 passed`).
import { run as exec, stripAnsi } from '../lib/exec.mjs';

/** `{ passed, failed, skipped }` from vitest's `Tests  ...` line. */
const counts = (output) => {
  const line = stripAnsi(output)
    .split('\n')
    .find((l) => /^\s*Tests\s+.*\(\d+\)/.test(l));
  if (!line) return undefined;
  const n = (word) =>
    Number(line.match(new RegExp(`(\\d+) ${word}`))?.[1] ?? 0);
  return { passed: n('passed'), failed: n('failed'), skipped: n('skipped') };
};

export const run = async (ctx) => {
  const { code, stdout, stderr } = await exec(
    'pnpm',
    ['--filter', 'shadcn-table', `test:${ctx.base}`],
    { cwd: ctx.root, capture: true },
  );
  const found = counts(stdout + stderr);
  const parts = found
    ? [
        found.failed ? `${found.failed} failed` : '',
        `${found.passed} passed`,
        found.skipped ? `${found.skipped} skipped` : '',
      ].filter(Boolean)
    : [];
  if (code !== 0) {
    return {
      status: 'fail',
      summary: parts.length ? parts.join(', ') : `vitest exit ${code}`,
      details: found,
      errors: [`shadcn-table test:${ctx.base}: exit ${code}`],
    };
  }
  return {
    status: 'pass',
    summary: parts.length ? parts.join(', ') : 'passed',
    details: found,
  };
};
