# 56: Story texts A to C, tracker

Status: running
Branch `v0.9/story-texts-a-c`, worktree 03 (from `origin/v0.9/docs-layout` at 06d58c57, D109)
Checks:
- Check: three parts, structure script over the 127 `features-[a-c]*.mdx` and `basic-*.mdx` pages (non-empty description, one `### Try it` with 2 to 4 steps directly above `<StoryExample>`, one `## Related guides` with 1 to 4 links to existing guide files, no em dash) at f1417a08: pass
- Check: `grep -L "TryIt"` and `grep -L "## Related guides"` over the globs at f1417a08: pass (print nothing)
- Check: `git diff origin/v0.9/docs-layout...HEAD --stat` lists only files the globs match, at f1417a08: pass (127 files; `origin/v0.9/docs-layout` moved past the base 06d58c57 and touches none of them)
- Check: `pnpm format` at 4cd14ef0 and f1417a08: pass, no diff
- Check: build, `pnpm --filter shadcn-table-docs build` at 4cd14ef0: pass
- Check: step truth, Playwright run of every step of the 79 no-play pages on `next start -p 5342`, base selected, at 4cd14ef0: pass (215 step assertions; the 2 failures are the old step 1 of the two `column-grouping-enabled-with-selection*` pages, already rewritten in 4cd14ef0 to the ticked-person step, which passes); server stopped
- Check: labels in `components/ui-radix` and `components/ui-aria`: `shared/locales/en.ts` identical to base apart from the import path: pass
- Check: Related guides, all 28 `/docs/guides/<slug>` links of these pages return 200 on the production build at 4cd14ef0: pass
- Check: `pnpm test typecheck --base radix` at f1417a08: not run (waiting on the build lock)
- Check: `pnpm test lint` at f1417a08: not run (waiting on the build lock)
- Check: `pnpm test validate-repo` at f1417a08: not run (waiting on the build lock)
- Check (verifier, run d3a60a09): structure script over the 127 pages at 4a732ad7: pass (non-empty description without backticks, one `### Try it`, 2 to 4 steps directly above `<StoryExample>`, one `## Related guides` with 1 to 4 links to existing guide files, no em dash)
- Check (verifier): `grep -L "TryIt"` and `grep -L "## Related guides"` over the globs at 4a732ad7: pass (print nothing)
- Check (verifier): `git diff 06d58c57...HEAD --name-only` at 4a732ad7: pass (127 files, all matched by the globs; `origin/v0.9/docs-layout` is now cd1daf88 and touches none of them since 06d58c57)
- Check (verifier): `pnpm test typecheck --base radix` at 4a732ad7: pass (tsc clean)
- Check (verifier): `pnpm test lint` at 4a732ad7: pass (0 errors, 9 warnings)
- Check (verifier): `pnpm test validate-repo` at 4a732ad7: pass (story pages match: 636 stories, 42 example pages, 594 story pages; 40 unit tests; tree clean after)
- Check (verifier): build, `pnpm --filter shadcn-table-docs build` at 4a732ad7: pass (2125 static pages)

- Task 1 site table: done by the writers, e519d0c8, run d3a60a09
- Task 2 three parts on every page: done, e519d0c8 and f1417a08 (backticks taken out of 25 descriptions), run d3a60a09
- Task 3 step truth: done, 4cd14ef0, run d3a60a09 (steps corrected by the browser run on 11 pages)
- Task 4 text check by judges: judges: run by the workflow
- Task 4 fix round 1: 7 failed lines rewritten (cell-actions-enabled-custom steps 3 to 2, the release-over-`Item 1` regression step dropped; click-to-copy-enabled step 2 gives the reason for `Tab`/`Shift+Tab`; 5 descriptions or steps reworded), 4a732ad7, run d3a60a09; no no-play step changed action or result, so no browser run; `pnpm format` clean
- Task 5 cleanup: done, `pnpm format` clean, build and guide links checked, f1417a08, run d3a60a09

## Attention

- Frontmatter descriptions show as plain text: a backtick shows literally in the page header and in the meta description. 25 descriptions of this glob had backticks; they were taken out (f1417a08), so option names such as layoutMode="grid" now read as plain text. The other text milestones' worktrees also have such descriptions (D to F 32, G to R 18, S to Z 11, Styling 11, worktree 09 24); the same fix applies there.
- Stories with a play: the spec's Task 3 check also names `pnpm test storybook-tests --base base|radix|aria`; this milestone changes no story file, so it was not run here (not on the milestone's Local CI line).
- `features-column-grouping--column-grouping-enabled-custom-aggregate`: the red AggregatedCell on Gender never shows, because Gender has no aggregationFn; the page says group rows leave Gender empty. Recommended: the review-fixes milestone gives the story an aggregationFn, then the page text follows.
- `features-aggregation--aggregation-remove-mode-custom-grouped-cell`: under groupedColumnMode 'remove' the custom GroupedCell never shows on group rows, only on leaf rows, where the arrow column shows the person's gender (Storybook base, 2026-11-17); the description now says that. Recommended: a story fix in the review-fixes milestone if group rows should show it.
- `features-click-to-copy--click-to-copy-disabled-per-column`: the table never turns click to copy on, so the story does not show one column off next to columns that are on. Recommended: a story fix.
- `features-column-grouping--column-grouping-enabled-with-selection*`: ticking a state row does not tick the people in it (browser run); the steps tick a person instead.
