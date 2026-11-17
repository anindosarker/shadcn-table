# 56: Story texts G to R, tracker

Status: running
Branch `v0.9/story-texts-g-r`, worktree 06 (from `origin/v0.9/docs-layout` at 06d58c57, D109)
Checks:
- Check: three parts, structure script over the 109 `features-[g-r]*.mdx` pages (description, one `### Try it` with 2 to 4 steps directly above `<StoryExample>`, 1 to 4 Related guides links to existing guide files, no em dash) at 13a07e12: pass
- Check: `grep -L "TryIt"` and `grep -L "## Related guides"` over the glob at 13a07e12: pass (print nothing)
- Check: `git diff origin/v0.9/docs-layout...HEAD --stat` lists only files the glob matches, at 13a07e12: pass (109 files; `origin/v0.9/docs-layout` moved past the base 06d58c57 and touches none of them)
- Check: `pnpm format` at 13a07e12: pass, no diff
- Check: build, `pnpm --filter shadcn-table-docs build` at 13a07e12: pass
- Check: step truth, Playwright run of every step of the 71 no-play pages on `next start -p 5341`, base selected, at 13a07e12: pass (172 steps, 0 failed; step count per page equals the page's Try it list); server stopped
- Check: labels in `components/ui-radix` and `components/ui-aria`: `shared/locales/en.ts` identical to base apart from the import path; `ST_RowPinButton.tsx` tooltip `Pin`/`Unpin` and aria-label `Pin` the same in all three: pass
- Check: Related guides, all 25 `/docs/guides/<slug>` links of these pages return 200 on the production build at 13a07e12: pass
- Check: typecheck, `pnpm test typecheck --base radix` at 13a07e12: pass
- Check: lint, `pnpm test lint` at 13a07e12: pass (0 errors, 9 warnings, none in these pages)
- Check: validate-repo, `pnpm test validate-repo` at 13a07e12: pass (594 story pages match; tree clean after)

- Task 1 site table: done by the writers, 92e75aab, run d3a60a09
- Task 2 three parts on every page: done, 92e75aab, run d3a60a09
- Task 3 step truth: done, 13a07e12, run d3a60a09 (two steps corrected by the browser run)
- Task 4 text check by judges: judges: run by the workflow
- Task 4 fixer round 1: four descriptions failed by the judges reworded (header groups resizing grid, pages footer row range, select all all mode, select all page mode), no step changed so no browser run, `pnpm format` clean, f1ad83c9, run d3a60a09
- Task 5 cleanup: done, `pnpm format` clean, 13a07e12, run d3a60a09

## Attention

- `features-pagination--pagination-enabled-big-data-language`: the story passes only a language, which changes the number format (`1.000`, `11.111`) and no label. The steps hold in a browser whose language is not German; a German browser shows English numbers.
- `features-row-number--enable-row-numbers-original` and `-original-virtual`: the story names are swapped against their code (`Original` has row virtualization, `Original Virtual` has none). The descriptions follow the code. Recommended: the review-fixes milestone renames or swaps the two stories.
- `features-row-actions--row-actions-complete-override`: the custom Cell replaces the Save and Cancel buttons, so row edit mode cannot be left from the table; the steps stop at the fields opening.
- `features-row-pinning--row-pinning-sticky-with-virtualization`: a virtual row is placed absolutely, so a pinned row does not stick on scroll; the steps claim only that it stays pinned.
