// registry-valid, the fourth check of `pnpm test validate-repo`: `shadcn
// registry validate` on the checkout's packages/shadcn-table/registry.json
// (D86 addendum).
import { run, stripAnsi } from '../../lib/exec.mjs';

/** @param {(line: string) => void} log @param {string} root */
export const check = async (log, root) => {
  const { code, stdout, stderr } = await run(
    'pnpm',
    ['--filter', 'shadcn-table', 'exec', 'shadcn', 'registry', 'validate'],
    { cwd: root, capture: true, quiet: true },
  );
  const output = stripAnsi(stdout + stderr).trim();
  for (const line of output.split('\n')) log(`registry-valid: ${line}`);
  return code === 0 ? [] : [`shadcn registry validate: exit ${code}`];
};
