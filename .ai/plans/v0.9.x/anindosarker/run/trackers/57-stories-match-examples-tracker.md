# 57: Stories match their examples, tracker

Status: running
Branch `v0.9/stories-match-examples`, worktree 08
Checks:
- Check: Task 1, `pnpm ls recharts --filter shadcn-table --filter shadcn-table-docs` at 4b9945a2: pass (2.15.4 both)
- Check: Task 1, `git diff origin/v0.9/docs-layout --stat -- packages/shadcn-table/registry.json packages/shadcn-table/registry` at 4b9945a2: pass (empty)
- Check: Task 1, `pnpm --filter shadcn-table-docs types:check` at 4b9945a2: pass
- Check: Task 1, `tsc -p tsconfig.stories.json`, eslint and prettier on the touched files at 4b9945a2: pass

- Task 1 Dependency and story support: done (4b9945a2)

## Attention

- The three `stories/support/<base>/alert-dialog.tsx` are `pnpm add-part <base> alert-dialog` output (the stock nova part with Tailwind classes, moved out of registry/), not a byte copy of the docs app's `components/ui-<base>/alert-dialog.tsx`: the docs copy uses `cn-*` classes that only the docs style sheets resolve, so in Storybook it would render unstyled. Same exports; the docs build still uses its own file (story-variants.mjs rewrite). The aria copy drops one unused type import for lint.
