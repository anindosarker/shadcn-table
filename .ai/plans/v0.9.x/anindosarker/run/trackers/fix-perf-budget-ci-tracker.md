# Perf budgets on CI (F28), tracker

Status: merged (629dcf81)
Files owned: `test/docs-e2e/lib/getting-started.mjs`
Depends on: none
Branch `v0.9/perf-budget-ci`, worktree `shadcn-react-table.worktrees/03`
Checks:
- Check: docs-e2e getting-started, `pnpm test docs-e2e --base base /` at de4336d2: pass (79 checks; perf: panel open 99 ms, perf: light/dark toggle 118 ms)
- Check: lint, `pnpm test lint` at de4336d2: pass (0 errors, 9 warnings, none in the owned file)
- Check: validate-repo, `pnpm test validate-repo` at de4336d2: pass
- Check (verifier): typecheck radix, `pnpm test typecheck --base radix` at 3d28edc5: pass (tsc clean)
- Check (verifier): docs build, `pnpm --filter shadcn-table-docs build` at 3d28edc5: pass
- Check (verifier): docs-e2e every page, `pnpm test docs-e2e --base base` at 3d28edc5: pass (getting-started 205, api 109, guides 692, examples 939, 0 failed; perf: panel open 90 ms, perf: light/dark toggle 123 ms)
- Check (verifier): de4336d2..3d28edc5 touches only `.ai/`, so the recorded docs-e2e `/`, lint and validate-repo lines stand for HEAD; spec 15 1.2 Acceptance holds locally (300 ms budget, sheet checks green)

- Task 1 PERF_BUDGET_MS 300 locally, 600 under CI: done (de4336d2)

## Notes

- P11 does not apply: a CI-only threshold, no play written for it.
- The 600 ms branch is proven only by the next GitHub run (the 0.9.1 release PR); out of local reach.
- Verifier: spec 15 2.2 "Review: fable" is not a local check; left to the review stage. D32's act reproduction not run: the red is runner timing, which act on Docker Desktop does not reproduce; the release PR run confirms.

## Attention

- The budget keys on `process.env.CI === 'true'` (the GitHub fact): no `ci` value reaches the page checks, and `test/run.mjs --ci` does not set `CI`, so a local `pnpm test docs-e2e --ci` keeps 300 ms.
