# Perf budgets on CI (F28), tracker

Status: done
Files owned: `test/docs-e2e/lib/getting-started.mjs`
Depends on: none
Branch `v0.9/perf-budget-ci`, worktree `shadcn-react-table.worktrees/03`
Checks:
- Check: docs-e2e getting-started, `pnpm test docs-e2e --base base /` at de4336d2: pass (79 checks; perf: panel open 99 ms, perf: light/dark toggle 118 ms)
- Check: lint, `pnpm test lint` at de4336d2: pass (0 errors, 9 warnings, none in the owned file)
- Check: validate-repo, `pnpm test validate-repo` at de4336d2: pass

- Task 1 PERF_BUDGET_MS 300 locally, 600 under CI: done (de4336d2)

## Notes

- P11 does not apply: a CI-only threshold, no play written for it.
- The 600 ms branch is proven only by the next GitHub run (the 0.9.1 release PR); out of local reach.

## Attention

- The budget keys on `process.env.CI === 'true'` (the GitHub fact): no `ci` value reaches the page checks, and `test/run.mjs --ci` does not set `CI`, so a local `pnpm test docs-e2e --ci` keeps 300 ms.
