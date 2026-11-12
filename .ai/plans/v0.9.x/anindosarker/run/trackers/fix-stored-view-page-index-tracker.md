# Stored view page index (Q22), tracker

Status: merged (811045dc86d26c0818081a9a7e436235b3fa4a1a)
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
- Verifier rerun at 864a2ec2 (registry.json changed after 7a2c9c66): `pnpm test typecheck --base radix|base|aria`: pass (tsc clean x3)
- `pnpm test lint` at 864a2ec2: pass (9 warnings, 0 errors)
- `pnpm test validate-repo` at 864a2ec2: pass (bases identical, registry valid, 27 unit tests)
- `pnpm test storybook-tests --base base` at 864a2ec2: pass (618)
- `pnpm test storybook-tests --base radix` at 864a2ec2: pass (618)
- `pnpm test storybook-tests --base aria` at 864a2ec2: pass (618)
- `pnpm test docs-e2e --base base /docs/guides/view-settings` at 864a2ec2: pass (11)
- Review fable: not run by the verifier

- Task 1 applyView keeps the page index, docs copies regenerated: done (2cb30726)
- Task 2 docs, Reset view and persistent view: done (6d7381fc)
- Task 3 checks and changelog: done (7a2c9c66)

## Attention

- No play covers Q22 (a stored rows per page with `initialState.pagination.pageIndex` above 0), so no P11 red line on the shipped code is recorded; the `Persistence` play of spec 12 stays green but does not exercise the page index. The verifier recorded the spec 12 checks only and did not add a play.
