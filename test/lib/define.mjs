// The contract of a test folder: test/<name>/run.mjs default-exports
// defineTest({ name, paths, bases, scenarios, run }). The runner
// (test/run.mjs) reads nothing else from the folder.
//
//   name       the folder name, also `pnpm test <name>` and the CI job
//   paths      globs (`**`, `*`) of the files whose change selects the test
//              under `pnpm test --changed`
//   bases      the bases a based test runs once each (`--base` picks one)
//   scenarios  the scenarios a scenario test runs once each (`--scenario`)
//   pending    true while the folder is a placeholder: listed, never run
//   run        async (ctx) => ({ status, summary, details?, errors? })
//
// ctx: { base?, scenario?, ci, flags, root, out, log }; `flags` are the
// arguments the runner does not own (`--url`, `--no-browser`, `--no-diff`).
const BASE_NAMES = ['base', 'radix', 'aria'];

/** Validates and freezes a test definition. */
export const defineTest = (def) => {
  if (!def || typeof def.name !== 'string' || !def.name) {
    throw new Error('defineTest: a test needs a name');
  }
  if (!Array.isArray(def.paths)) {
    throw new Error(`defineTest(${def.name}): paths must be an array`);
  }
  if (typeof def.run !== 'function') {
    throw new Error(`defineTest(${def.name}): run must be a function`);
  }
  if (def.bases && def.scenarios) {
    throw new Error(`defineTest(${def.name}): bases or scenarios, not both`);
  }
  for (const base of def.bases ?? []) {
    if (!BASE_NAMES.includes(base)) {
      throw new Error(`defineTest(${def.name}): unknown base ${base}`);
    }
  }
  return Object.freeze({ ...def });
};
