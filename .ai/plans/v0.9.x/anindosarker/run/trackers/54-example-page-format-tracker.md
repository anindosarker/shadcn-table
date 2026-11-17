# 54: Example page format, tracker

Status: built, checks green; Task 6 judges run by the workflow
Branch `v0.9/example-page-format`, worktree 06
Checks:

- Task 2 `ls apps/shadcn-table-docs/content/docs/examples | grep -c new-format` at 87ea42fe: 0; `grep -rn "isPreviewPage\|Format previews" apps/shadcn-table-docs/lib/example-pages.mjs apps/shadcn-table-docs/content`: nothing (the guide `-new-format` pages and `table-of-contents-list.tsx` stay for spec 55/56)
- Task 2 toolbar Storybook button of `/docs/examples/basic`, production build at ac223e33 on 5345: href `https://storybook.shadcn-table.com/base/?path=/story/basic--default`, 200: pass
- Task 3 `grep -L "TryIt"` and `grep -l "StorybookLink"` over `content/docs/examples/*.mdx` at ac223e33: nothing; each of the 42 pages has one `### Try it` directly above its example tag with 2 to 4 steps and one `## Related guides`: pass; `/docs/examples/basic-new-format-2`: 404
- Task 3 every guide link on the 42 pages (`curl`, production build at ac223e33 on 5345): all 200
- Task 4 `git diff origin/v0.9/docs-layout --diff-filter=M -- 'apps/shadcn-table-docs/content/docs/examples/*.mdx'` at ac223e33: 42 files, 568 insertions, 42 deletions, every deletion the StorybookLink line: pass; `git diff origin/v0.9/docs-layout --stat -- apps/shadcn-table-docs/registry.json packages/shadcn-table/registry.json`: nothing
- Task 5 every step of the 42 pages run by a Playwright script on the production build at ac223e33 (port 5345, stopped), each step's result asserted: base 115/115, radix 115/115, aria 115/115 (the aria-diff and base-diff examples included); server stopped
- `pnpm format` at 1dfd6c99: no diff
- `pnpm test typecheck --base radix` at 1dfd6c99: pass (tsc clean)
- `pnpm test lint` at 3a74f49c: pass (0 errors, 9 warnings)
- `pnpm test validate-repo` at 1dfd6c99: pass (40 unit tests, registry fresh, no tracked file changed)
- `pnpm test docs-e2e --base base` at 3a74f49c: pass (110 pages; getting-started 262, api 111, guides 705, examples 1067 passed, 0 failed); server stopped. Bases radix and aria left to the verifier
- Task 6 judges: run by the workflow

- Task 1 site table: 87ea42fe (notes below; no file)
- Task 2 comparison pages removed: 87ea42fe
- Task 3 format on the 42 pages: ac223e33
- Task 4 nothing else changed: ac223e33
- Task 5 step truth: ac223e33
- Task 6 text check by judges: run by the workflow
- Task 7 cleanup: 3a74f49c

## Notes

- basic: step 1 corrected from the accepted page: the column menu item reads `Sort ascending`, not `Sort by First Name ascending`.
- Related guides use the guide's short name (Basic's style); detail-panel and row-dragging keep their accepted labels.
- react-query, remote, dynamic-columns, lazy-detail-panel, lazy-sub-rows, infinite-scrolling: steps use only the fixed `app/api/data` rows, never `Last Login`.
- faceted-values: facet lists follow the filtered rows, so step 3 shows `State` offering only `Virginia` after the `Richmond` pick.
- sticky-header: step 2 shows the footer row, not the `Sticky header` switch (see Attention).
- column-ordering: step 2 uses `Reset order` in `Show/Hide columns`; a pinned column still drags, so no pinning step.
- aggregation-and-grouping: `Sort descending` on `Salary` adds a second sort after `State`, so it sorts inside each state, not the groups.
- customized-grouping: groups start open, step 1 closes `Alabama`.
- static-row-pinning: each row has two `Pin` buttons (top, then bottom), named in the steps as first and second.

## Attention

- basic: the accepted step 1 named `Sort by First Name ascending`; the menu shows `Sort ascending`, so the step now names that label.
- sticky-header: `View settings` > `Sticky header` off leaves the header sticky when the table sets `enableStickyHeader: true` (switch reads off, `thead` keeps `sticky`); not fixed here, no step names it.
