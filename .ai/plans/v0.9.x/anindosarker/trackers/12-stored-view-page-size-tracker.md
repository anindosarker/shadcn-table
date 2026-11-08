# 12: Stored view persists rows per page, tracker

Status: done, awaiting review and merge
Branch `v0.9/stored-view-page-size`, worktree 05
Checks:
- Check: Persistence play red (P11), `ST_BASE=base vitest run stories/features/ViewSettings.stories.tsx` (package `shadcn-table`) on the shipped code plus the extended play: fail as expected, `Persistence` at `toContain('"pageSize":20')`, stored view `{"columnOrder":[...],"density":"spacious","viewSettings":{...}}` has no pageSize; 10 other stories pass
- Check: Persistence play green, `ST_BASE=<base> vitest run stories/features/ViewSettings.stories.tsx` for base, radix, aria at 4be5d8b2: pass (11 passed each)
- Check: typecheck, `pnpm test typecheck --base radix`, `--base base`, `--base aria` at 4be5d8b2: pass (tsc clean)
- Check: lint, `pnpm test lint` at 4be5d8b2: pass (0 errors, 9 warnings, all pre-existing in `apps/shadcn-table-docs/examples/*/{advanced,expanding-tree-flat-parse}/TS.tsx`)
- Check: validate-repo, `pnpm test validate-repo` at 812cc69f (pre-commit tree): pass
- Check: docs-e2e, `pnpm test docs-e2e --base base /docs/guides/view-settings` at 812cc69f: pass (11 passed)
- Check: format, `pnpm format`: no changes
- Check: storybook-tests base, `pnpm test storybook-tests --base base` at 89e41e5f: pass (618 passed) on rerun; two earlier runner runs under load ended 1 failed, 617 passed, test name not captured; three direct `vitest run` runs in between 618 passed (P5 flake under load)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at 89e41e5f: pass (618 passed)
- Check: storybook-tests aria, `pnpm test storybook-tests --base aria` at 89e41e5f: pass (618 passed)

- Task 1 Reproduce: done (e5cef62f)
- Task 2 Stored view and hook: done (4be5d8b2)
- Task 3 Docs and generated copies: done (812cc69f)
- Task 4 Cleanup: done (89e41e5f, tracker in the next commit)
