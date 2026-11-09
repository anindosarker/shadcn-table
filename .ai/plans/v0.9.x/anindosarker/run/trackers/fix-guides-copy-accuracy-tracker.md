# Guides copy accuracy (F32), tracker

Status: done
Files owned: `apps/shadcn-table-docs/content/docs/guides/*.mdx`, `apps/shadcn-table-docs/content/docs/api/**`
Depends on: none
Branch `v0.9/fix-guides-copy-accuracy`, worktree 04
Checks:
- Check: frontmatter guides, `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/guides` at a6936758: pass (0 on every rule)
- Check: frontmatter api, `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/api` at a6936758: pass (0 on every rule)
- Check: types, `pnpm --filter shadcn-table-docs types:check` at a6936758: pass
- Check: build, `pnpm --filter shadcn-table-docs build` at a6936758: pass
- Check: lint, `pnpm test lint` at a6936758: pass (0 errors, 9 warnings)
- Check: validate-repo, `pnpm test validate-repo` at a6936758: pass
- Check: typo grep, `grep -rn 'should also should\|news rows\|\bect\.\|version 2.6.0' apps/shadcn-table-docs/content/docs/guides` at a6936758: pass (prints nothing)

- Task 1 Apply the eight copy findings: done (a6936758)

Notes:
- The spec's grep pattern `ect\.` also matches `select.` (density-toggle.mdx:25, customize-icons.mdx:87) and `Object.` (production-ready-tables.mdx:81, 190); the check ran with `\bect\.` so it prints nothing.

## Attention
- Finding 8 (restating "These are the methods ..." / "Here is a list of all the ... options" sentences): left as is, the finding's second option. Dropping them puts table-instance-apis, column-options and state-options under the 150-word floor of check-frontmatter (126, 137, 136 words).
