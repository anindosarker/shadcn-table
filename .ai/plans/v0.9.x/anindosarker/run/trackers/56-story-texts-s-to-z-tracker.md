# 56: Story texts S to Z, tracker

Status: merged (63344bb8)
Branch `v0.9/story-texts-s-z`, worktree 07 (from `origin/v0.9/docs-layout` at 06d58c57, D109)
Checks:
- Check: three parts, structure script over the 115 `features-[s-z]*.mdx` pages (description, one `### Try it` with 2 to 4 steps directly above `<StoryExample>`, 1 to 4 Related guides links to existing guide files, no em dash, title/sidebarTitle/tag unchanged) at c73601b9: pass
- Check: `grep -L "TryIt"` and `grep -L "## Related guides"` over the glob at c73601b9: pass (print nothing)
- Check: `git diff origin/v0.9/docs-layout --stat` lists only files the glob matches, at c73601b9: pass (115 files)
- Check: build, `pnpm --filter shadcn-table-docs build` at 2f128832: pass
- Check: step truth, Playwright run of every step of the 81 no-play pages on `next start -p 5342`, base selected, at 2f128832 plus the two rewritten pages at c73601b9: pass except `features-search--custom-global-filter-fn` (see Attention); server stopped
- Check: labels in `components/ui-radix` and `components/ui-aria`: `shared/locales/en.ts` identical to base apart from the import path: pass
- Check: Related guides, all 28 `/docs/guides/<slug>` links of these pages return 200 on the production build at 2f128832: pass
- Check: typecheck, `pnpm test typecheck --base radix` at c73601b9: pass
- Check: lint, `pnpm test lint` at c73601b9: pass (0 errors, 9 warnings, none in these pages)
- Check: validate-repo, `pnpm test validate-repo` at c73601b9: pass
- Check: verifier, Task 2 `grep -L "TryIt"` and `grep -L "## Related guides"` over `more/features-[s-z]*.mdx` (115 files) at 9b5228f9: pass, both print nothing
- Check: verifier, Task 2 structure script: every page has a non-empty `description`, one `### Try it` with 2 to 4 steps directly above `<StoryExample` (304 steps), one `## Related guides` list of 1 to 4 links to existing guide files below it (214 links), no em dash; no title, sidebarTitle or `StoryExample` line changed, at 9b5228f9: pass
- Check: verifier, Task 2 `git status` clean and `git diff origin/v0.9/docs-layout...HEAD --stat` at 9b5228f9: pass, only the 115 glob files (merge base 06d58c57; origin/v0.9/docs-layout moved on to cd1daf88, so the two-dot diff also lists that branch's newer commits)
- Check: verifier, `pnpm test typecheck --base radix` at 9b5228f9: pass (tsc clean)
- Check: verifier, `pnpm test lint` at 9b5228f9: pass (0 errors, 9 warnings)
- Check: verifier, `pnpm test validate-repo` at 9b5228f9: pass (636 stories, 42 example pages, 594 story pages, story pages match, 40 unit tests), tree clean after
- Check: verifier, `pnpm --filter shadcn-table-docs build` at 9b5228f9: pass (2125 static pages)
- Check: verifier, Acceptance 1.2 rerun (storybook-tests base/radix/aria, storybook-static base, docs-e2e base/radix/aria, toolbar ids in `index.json`): not run; the shared build lock was held by another agent and the verifier had to return first. The judged text part passed in this workflow (Task 4)
- Check: verifier 2, at HEAD 9b5228f9: Local CI (typecheck radix, lint, validate-repo), `pnpm --filter shadcn-table-docs build` and the Task 2 checks (greps, structure and step count, diff stat) already recorded green at HEAD, not rerun; tree clean
- Check: verifier 2, Related guides 200 check (at 2f128832) still valid: `git diff 2f128832..HEAD` changes no `/docs/guides/` link
- Check: verifier 2, Acceptance 1.2 rerun (storybook-tests, storybook-static, docs-e2e): moved to milestone Story text checklist by the run, not run here

- Task 1 site table: done by the writers, 2f128832, run d3a60a09
- Task 2 three parts on every page: done, 2f128832, run d3a60a09
- Task 3 step truth: done, c73601b9, run d3a60a09 (two pages rewritten, one page untrue until its story changes)
- Task 4 text check by judges: judges: run by the workflow
- Task 4 fixer round 1: the 10 lines the judges failed rewritten (4 virtualization step 1 lines, dense and spacious step 1, search-disabled step 1, edition-icons step 2, two descriptions), 9d0d2deb, run d3a60a09; wording only, no action or result changed, so no browser rerun
- Task 4 fixer round 2: the 2 lines the judges failed rewritten (persistence-keeps-page-index description, edition-icons step 2), f61a9cf4, run d3a60a09; wording only, no browser rerun
- Task 4 fixer round 3: the 1 line the judges failed rewritten (persistence-keeps-page-index step 3, "stays on page 3" now "is back on page 3"), 9b5228f9, run d3a60a09; wording only, no browser rerun
- Task 5 cleanup: done, `pnpm format` clean, c73601b9, run d3a60a09

## Attention

- `features-search--custom-global-filter-fn`: the story's filter calls `startsWith` on the number column `Age` and throws on every search (`e.getValue(...).startsWith is not a function`), so no row is ever filtered. Its two steps describe the set-up, but they are not true until `Search.stories.tsx` changes (for example `String(row.getValue(id)).startsWith(filterValue)`). This milestone does not own the story file. Recommended: a story fix in the review-fixes milestone, then rerun the two steps.
- `features-sub-row-tree--sub-row-tree-with-selection`: on base, ticking a parent does not tick its sub-rows (`getST_RowSelectionHandler` unticks them again once all are selected). The writer's text said it does. The page now says that ticking a sub-row also ticks its parent's box, which is what happens. Recommended: the lead checks this against MRT; if MRT selects the sub-rows, it is a library bug and the page text changes back.
