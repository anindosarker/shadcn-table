# 56: Story pages review fixes, tracker

Status: done
Branch `v0.9/story-pages-review-fixes`, worktree 10
Checks:

- `pnpm --filter shadcn-table exec tsc -p tsconfig.stories.json --noEmit` at 80b8da51: pass (was 5 errors in the four story files)
- `pnpm --filter shadcn-table-docs types:check` with @ts-nocheck removed from all three copies: fail on 2 aria copies (ColumnGrouping, Customization); with the aria copies kept nocheck: pass
- `node lib/story-pages.mjs` with three stale pages (empty, description, body text): empty removed, the two with text kept, exit 1 naming both; reverted
- `pnpm test typecheck --base radix` at c1845265: pass
- `pnpm test lint` at c1845265: pass (9 warnings, none in changed files)
- `pnpm test validate-repo` at c1845265: pass
- `pnpm test storybook-static --base base` at c1845265: pass
- `pnpm test storybook-tests --base base` at c1845265: pass (636)
- `pnpm test docs-e2e --base base` at c1845265: pass (examples 1101 passed, 0 failed; the five More examples state checks pass)

- Task 1 Story pages review fixes: done (c1845265)

## Attention

- No check type-checks `packages/shadcn-table/stories`: `tsconfig.stories.json` exists in that package but no script or test runs it; the cheapest place is one more `tsc -p tsconfig.stories.json --noEmit` step in the `typecheck` test (radix base), about 12 seconds.
- The React Aria story copies keep `// @ts-nocheck`: features/ColumnGrouping (`RadioGroup` `onValueChange`) and features/Customization (`Dialog` `open`, `DialogContent`) use the Radix and Base UI part API, which the aria part lacks; the base and radix copies are now type-checked. To check the aria copies too, those two stories need a per-base branch, outside this milestone's files.
- `apps/shadcn-table-docs/tsconfig.ui-base.json` (not in the owned list) now includes `stories/.base/**`, so `types:bases` checks the base story copies; revert that include to drop it.
