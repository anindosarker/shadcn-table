# 57: Stories match their examples, tracker

Status: running
Branch `v0.9/stories-match-examples`, worktree 08
Checks:
- Check: Task 1, `pnpm ls recharts --filter shadcn-table --filter shadcn-table-docs` at 4b9945a2: pass (2.15.4 both)
- Check: Task 1, `git diff origin/v0.9/docs-layout --stat -- packages/shadcn-table/registry.json packages/shadcn-table/registry` at 4b9945a2: pass (empty)
- Check: Task 1, `pnpm --filter shadcn-table-docs types:check` at 4b9945a2: pass
- Check: Task 1, `tsc -p tsconfig.stories.json`, eslint and prettier on the touched files at 4b9945a2: pass
- Check: Task 2, P11: the ColumnPinning play on the pre-fix line (`enableColumnPinning: false`) at 208044f7, `ST_BASE=base vitest run stories/features/ColumnPinning.stories.tsx -t "Column Pinning"`: fails as required ("expected [ …(2) ] to have a length of +0 but got 2", the ID column menu had two pin items); passes with the fix
- Check: Task 2, `grep -rn "enableColumnPinning: false" apps/shadcn-table-docs/examples packages/shadcn-table/stories` at 0053aa0c: pass (empty)
- Check: Task 3, `grep -n "<svg\|DeleteUserConfirm.*role"` on DetailPanel and Editing stories at 5cbabe60: pass (empty)
- Check: Task 3, `ST_BASE=<base> vitest run` DetailPanel and Editing stories at 5cbabe60: pass (43 passed on base, radix, aria)
- Check: Task 3, `pnpm --filter shadcn-table-docs types:check`, `tsc -p tsconfig.stories.json`, `tsc:aria`, eslint and prettier on the two stories at 5cbabe60: pass
- Check: Task 4, production docs build (from the docs-e2e run) on `next start` port 5340, base selected, against the static base Storybook on port 5342 after each play finished: same headers, rows, first three rows, chart (1 surface, 3 lines, same ticks and strokes) and dialog (title, Cancel, Delete, centered modal with overlay) at 0053aa0c; servers stopped
  - chart-detail-panel vs features-detail-panel--chart-detail-panel: same
  - editing-crud vs features-editing--editing-crud: same
  - editing-crud-inline-row vs features-editing--inline-editing: same
  - editing-crud-inline-cell vs features-editing--editing-crud-inline-cell: same
  - editing-crud-inline-table vs features-editing--editing-crud-inline-table: same
  - editing-crud-tree vs features-editing--editing-crud-tree: same
- Check: `pnpm test typecheck --base base` at 0053aa0c: pass (tsc clean)
- Check: `pnpm test typecheck --base radix` at 0053aa0c: pass (tsc clean)
- Check: `pnpm test typecheck --base aria` at 0053aa0c: pass (tsc clean)
- Check: `pnpm test lint` at 0053aa0c: pass (0 errors, 9 warnings, all in examples not touched here)
- Check: `pnpm test validate-repo` at 0053aa0c: pass (bases identical, registry fresh, story pages match, 40 unit tests)
- Check: `pnpm test storybook-tests --base base` at 0053aa0c: pass (638 passed)
- Check: `pnpm test storybook-tests --base radix` at 0053aa0c: pass (638 passed)
- Check: `pnpm test storybook-tests --base aria` at 0053aa0c: pass (638 passed)
- Check: `pnpm test storybook-static --base base` at aabec7ec: pass (reset pass, intro links to the docs page, old intro text absent)
- Check: `pnpm test storybook-static --base radix` at aabec7ec: pass
- Check: `pnpm test storybook-static --base aria` at aabec7ec: pass
- Check: `pnpm test docs-e2e --base base` at 0053aa0c: pass (5 sections, 115 pages)
- Check: Task 6, `pnpm format` and `pnpm -w registry:items` at 0053aa0c: no changes; `git diff origin/v0.9/docs-layout --stat -- packages/shadcn-table/registry.json packages/shadcn-table/registry`: empty

- Task 1 Dependency and story support: done (4b9945a2)
- Task 2 Column pinning: done (208044f7)
- Task 3 The six stories: done (5cbabe60)
- Task 4 Side by side against the examples: done (0053aa0c)
- Task 5 Story intro line: done (aabec7ec)
- Task 6 Cleanup: done (0053aa0c)

## Attention

- The three `stories/support/<base>/alert-dialog.tsx` are `pnpm add-part <base> alert-dialog` output (the stock nova part with Tailwind classes, moved out of registry/), not a byte copy of the docs app's `components/ui-<base>/alert-dialog.tsx`: the docs copy uses `cn-*` classes that only the docs style sheets resolve, so in Storybook it would render unstyled. Same exports; the docs build still uses its own file (story-variants.mjs rewrite). The aria copy drops one unused type import for lint.
