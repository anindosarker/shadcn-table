# Stored view page index (F22), tracker

Status: done
Files owned: `packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts`, `apps/shadcn-table-docs/content/docs/guides/view-settings.mdx`, `apps/shadcn-table-docs/content/docs/examples/persistent-view.mdx`
Depends on: none
Branch `v0.9/stored-view-page-index`, worktree 05
Checks:
- `pnpm test typecheck --base radix|base|aria` at 2cb30726: pass
- eslint and prettier on the three hooks at 2cb30726: pass
- `pnpm test validate-repo` at 7a2c9c66: pass
- `pnpm test storybook-tests --base base` at 7a2c9c66: pass (618 tests, ViewSettings Persistence included)
- `pnpm test docs-e2e --base base /docs/guides/view-settings` at 7a2c9c66: pass (11)
- `pnpm test lint` at 7a2c9c66: pass (9 warnings, 0 errors)

- Task 1 applyView keeps the page index, docs copies regenerated: done (2cb30726)
- Task 2 docs, Reset view and persistent view: done (6d7381fc)
- Task 3 checks and changelog: done (7a2c9c66)
