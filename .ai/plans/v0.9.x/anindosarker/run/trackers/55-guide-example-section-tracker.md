# 55: Guide example block, tracker

Status: done
Branch `v0.9/guide-example-block`, worktree 07
Checks:
- Check: docs build, `pnpm --filter shadcn-table-docs build` at 3ad894e9: pass
- Check: task 1 ids, `next start -p 5342` + Playwright `document.querySelectorAll('[id]')` grouped by id at 3ad894e9: pass (`/docs/guides/virtualization-new-format-3` no duplicate ids, second row-virtualization mount `example-enable-row-virtualization-_R_4jqav5tqbtalb_`; `/docs/guides/column-pinning-new-format-3` none; `/docs/examples/basic` has `#example-basic`)
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5342` (production build of 3ad894e9) at 3ad894e9: pass (getting-started 262, api 111, guides 705, examples 941, 0 failed)
- Check: typecheck, `pnpm test typecheck --base radix` at 3ad894e9: pass
- Check: lint, `pnpm test lint` at 3ad894e9: pass (9 warnings, none in owned files)
- Check: format, `pnpm format` at 3ad894e9: pass (no changes)

- Task 1 unique element id: done, bfbbeb00
- Task 2 cleanup: done, 3ad894e9
