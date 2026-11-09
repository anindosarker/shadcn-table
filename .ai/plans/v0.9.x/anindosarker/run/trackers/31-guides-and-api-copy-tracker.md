# 31: Guides and API copy, tracker

Status: done
Branch `v0.9/guides-api-copy`, worktree `/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/04`
Checks:

- `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/guides` at 7912d34f: 0 on every rule (47 pages)
- `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/api` at 7912d34f: 0 on every rule (10 pages)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5353 pnpm --filter shadcn-table-docs build` at 7912d34f: pass
- `pnpm format` at 6453cdc7: no change (the glob does not cover `.mdx`)
- `pnpm test typecheck --base base` at 6453cdc7: pass
- `pnpm test lint` at 6453cdc7: pass (0 errors, 9 warnings)
- `pnpm test validate-repo` at 6453cdc7: pass
- `pnpm test docs-e2e --base base` at 6453cdc7: pass (107 pages, 939 example checks, 9 passed, 0 failed)
- `next start -p 5353` on the 7912d34f build: `curl -s localhost:5353/docs/guides/column-size | grep -o 'Updated 20[0-9-]*</p>' | wc -l` prints 1; `/docs/api` meta description is the new one; "How to column width" count 0; server stopped

- Task 1 Rewrite guides and API pages: done (7912d34f)
- Task 2 Cleanup and changelog: done (6453cdc7)

## Notes

- The spec counts 45 guide pages; the folder holds 46 besides the new TanStack guide (47 `.mdx` with it, `index.mdx` included). All 46 rewritten; the new guide untouched.
- `production-ready-tables.mdx` and `tint-tokens.mdx` keep their intros (already shadcn-specific); description only. `view-settings.mdx` has no intro before its first code block: the panel paragraph after it carries the shadcn-specific sentence.
- In-place typo fixes: "the the" (row-pinning), "let's you" (cell-instance-apis). "Shadcn Table" left only in one heading (best-practices "Debugging Shadcn Table", headings unchanged per 1.6.5) and one code comment (column-filtering).
- The whole-docs run of the script still shows examples pages (duplicate and word count): the examples milestone owns them; 2.2's whole-tree check runs after all three merge.
- Not fixed, outside 1.6.5's scope: `api/st-components.mdx` heading `ST_FilterFilterRangeFields` (the file is `ST_FilterRangeFields`), and `api/st-hooks.mdx` anchors `#usesrt_*` that may not match the `useST_*` headings.

## Attention
