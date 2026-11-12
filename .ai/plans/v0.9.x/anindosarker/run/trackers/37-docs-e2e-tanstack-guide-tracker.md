# 37: Docs e2e check for the TanStack guide, tracker

Status: merged (7669fc48)
Branch `v0.9/docs-e2e-tanstack-guide`, worktree 03
Checks:
- Check: baseline full run, `pnpm test docs-e2e --base base --url http://localhost:5355` (next start of a fresh `pnpm --filter shadcn-table-docs build`) at 413e9725: pass, 1945 checks (getting-started 205, api 109, guides 692, examples 939), 107 pages
- Check: lint, `pnpm test lint` at ad2042ad: pass (9 warnings, all in docs example files outside this milestone)
- Check: section run, `pnpm test docs-e2e --base base --url http://localhost:5355 --section guides` at ad2042ad: pass, 701 checks; the log lists `title`, `first section`, `headings` under `/docs/guides/tanstack-table-with-shadcn-ui @1440`
- Check: full run, `pnpm test docs-e2e --base base --url http://localhost:5355` at ad2042ad: pass, 1954 checks (guides 701), 108 pages; +9 over the baseline: 3 named checks plus 6 route checks (status, hydration, console at 1440 and 700) the page now gets as an entry
- Check: failing case, H1 changed to `TanStack Table and shadcn/ui`, `pnpm test docs-e2e --base base --url http://localhost:5356 /docs/guides/tanstack-table-with-shadcn-ui` (next dev) at ad2042ad: fail as expected, `FAIL ... @1440 title h1=TanStack Table and shadcn/ui`; change reverted, `git status --short` empty
- Check: `pnpm format` at ad2042ad: no changes
- Check (verifier): lint at ad2042ad still valid at 2cdc3ba6 (diff touches only .ai/), not rerun
- Check (verifier): acceptance rerun, section run `pnpm test docs-e2e --base base --url http://localhost:5355 --section guides` (next start of a fresh build) at 2cdc3ba6: pass, 701 checks; `title`, `first section`, `headings` listed under `/docs/guides/tanstack-table-with-shadcn-ui @1440`
- Check (verifier): acceptance rerun, full run `pnpm test docs-e2e --base base --url http://localhost:5355` at 2cdc3ba6: pass, 1954 checks (getting-started 205, api 109, guides 701, examples 939), 108 pages; baseline 1945, +9
- Check (verifier): acceptance rerun, failing case H1 `TanStack Table and shadcn/ui`, next dev on 5356 at 2cdc3ba6: fail as expected, `FAIL /docs/guides/tanstack-table-with-shadcn-ui @1440 title h1=TanStack Table and shadcn/ui`; reverted, `git status --short` empty

- Task 1 baseline count: done (eb399188)
- Task 2 entry and checks: done (ad2042ad)
- Task 3 acceptance: done (ad2042ad)
- Task 4 cleanup: done (ad2042ad)

## Attention
- `test/.out/docs-e2e-base.json` stores only counts (`details.checks`), not check names, so the new names were proven from the run log; `test/docs-e2e/test.mjs` stays unchanged per the spec.
- Spec 1.3 says the route run already loaded the guide; it did not (the run takes its pages from the entries), so the entry adds 6 route checks beside the 3 named ones.
