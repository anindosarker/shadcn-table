# Page index play (F22), tracker

Status: done
Files owned: `packages/shadcn-table/stories/features/ViewSettings.stories.tsx`
Depends on: none
Branch `v0.9/page-index-play`, worktree 05
Checks:
- Lint, `pnpm test lint` at 3a61b89b (story only, pre-commit tree): pass, 9 warnings outside the owned file
- Typecheck radix, `pnpm test typecheck --base radix` at 3a61b89b (pre-commit tree): pass
- Red (P11), `pnpm test storybook-tests --base base` at 3a61b89b with the three `useST_ViewPersistence.ts` at 117a81b5: fail, 1 failed 618 passed, `Persistence Keeps Page Index` received `pageSize=20 pageIndex=1`
- Green, `pnpm test storybook-tests --base base` at 3a61b89b: pass, 619 passed
- Green, `pnpm test storybook-tests --base radix` at 3a61b89b: pass, 619 passed
- Green, `pnpm test storybook-tests --base aria` at 3a61b89b: pass, 619 passed on the third run; run 1 failed `Filtering` "Multi Select Field Controls" only, run 2 failed `ClickToCopy` "Click Copies Value" only (P5 flake), both under load and outside this file

- Task 1 Persistence page index play: done (3a61b89b)

## Attention

- `ViewSettingsTable` prints `pageIndex=<n>` after `pageSize` in its `view-state` output, so the new play reads the page index; the other plays match with `toContain` and are unaffected.
- aria `Filtering` "Multi Select Field Controls" failed once under load (not in the P5 flake list, passed on the two reruns).
