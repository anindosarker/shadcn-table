# 54: Example page format, tracker

Status: done (1d97c65d)
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
- Verifier, at 3a74f49c (HEAD): not rerun, recorded green: lint and docs-e2e base (at HEAD); typecheck radix and validate-repo (1dfd6c99, since then only `test/docs-e2e/lib/examples.mjs`; CI is the second run); Task 5 step truth on all three bases (ac223e33, since then only the changelog and that test file)
- Verifier `pnpm format` at 3a74f49c: no diff
- Verifier Acceptance (1.2) programmatic at 3a74f49c, against `origin/v0.9/docs-layout...HEAD` (docs-layout moved to 6dba74da; merge base a65e2856): `--diff-filter=M` examples `*.mdx` 42 files, +568 -42, every deletion the StorybookLink line; registry `--stat` nothing; deleted only the six `-new-format` pages; `grep -c new-format` 0; `isPreviewPage|Format previews` nothing; `grep -L TryIt` and `grep -l StorybookLink` nothing; docs-e2e base green at HEAD (builder). Pass. Judges: by the workflow
- Verifier `git merge-tree --write-tree origin/v0.9/docs-layout HEAD` (6dba74da): clean
- Verifier `pnpm test docs-e2e --base radix` at 3a74f49c (port 5340): pass (110 pages; getting-started 262, api 111, guides 705, examples 1067 passed, 0 failed); server stopped
- Verifier `pnpm test docs-e2e --base aria` at 3a74f49c (port 5340, after radix): pass (getting-started 262, api 111, guides 705, examples 1067 passed, 0 failed); server stopped
- Task 6 fixer: faceted-values steps 1 and 3, filter-switching step 3, filter-variants step 2 split or shortened (faceted-values and filter-variants now 4 steps, filter-switching 4; later steps renumbered only), virtualized step 3 names `State` and `Country` instead of `render`
- Task 6 fixer step truth: each rewritten step run by a Playwright script with base selected on the production build at 3a74f49c (port 5340, stopped; text-only change since): `Filter by City` appears, opens with `Blacksburg (1)` to `San Francisco (2)`; after `Richmond` the `State` list offers only `Virginia (1)`; Age mode reads `between`, opens `Between`, `Greater Than`, `Less Than`; Age shows `Min` and `Max`, San Francisco then 40 to 45 leaves Tanner Linsley; scrolled right shows `State`, `Country`, `Pet Name`, `Age`. Labels from `shared/locales/en.ts` (`Filter by {column}`, `Min`, `Max`, `Between`, `Greater Than`, `Less Than`) and the four examples' code are the same in radix and aria
- Task 6 fixer `pnpm format` at 86e7022c: no diff
- Task 6 fixer `pnpm test docs-e2e --base base` at 86e7022c: pass (110 pages; examples 1067 passed, 0 failed); server stopped
- Verifier 2, at 86e7022c (HEAD): not rerun, recorded green: `pnpm format` and docs-e2e base (fixer, at HEAD); step truth of the five rewritten steps (fixer, base); lint (3a74f49c), typecheck radix and validate-repo (1dfd6c99): since then only example `.mdx` text and `test/docs-e2e/lib/examples.mjs`, CI is the second run. docs-e2e radix and aria (3a74f49c) not rerun: not in 2.2, since then only four `.mdx` text changes
- Verifier 2 Acceptance (1.2) programmatic at 86e7022c, against `origin/v0.9/docs-layout...HEAD` (6dba74da, merge base a65e2856): `--diff-filter=M` examples `*.mdx` 42 files, +571 -42 (+3 from the fixer's split steps), every deletion the StorybookLink line; registry `--stat` nothing; deleted only the six `-new-format` pages; other files only `CHANGELOG.md`, `meta.json`, `lib/example-pages.mjs`, `test/docs-e2e/lib/examples.mjs`; `grep -c new-format` 0; `isPreviewPage|Format previews` nothing; `grep -L TryIt` and `grep -l StorybookLink` nothing; 42 pages each with `### Try it` and `## Related guides`; docs-e2e base green at HEAD (fixer). Pass. Judges: by the workflow
- Verifier 2 `git merge-tree --write-tree origin/v0.9/docs-layout HEAD` (6dba74da): clean

- Task 1 site table: 87ea42fe (notes below; no file)
- Task 2 comparison pages removed: 87ea42fe
- Task 3 format on the 42 pages: ac223e33
- Task 4 nothing else changed: ac223e33
- Task 5 step truth: ac223e33
- Task 6 text check by judges: run by the workflow
- Task 6 fixer, the five lines the judges failed (spec 54 1.2): 86e7022c
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
