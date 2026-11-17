# 56: Story texts Miscellaneous, tracker

Status: running
Branch `v0.9/story-texts-misc`, worktree 09
Checks:
- Check: Task 2 `grep -L "TryIt"` and `grep -L "## Related guides"` over `more/miscellaneous-*.mdx` (63 files) at 3d9c8c5e: pass, both print nothing
- Check: Task 2 every page has a non-empty `description`, one `### Try it` with 2 to 4 steps directly above `<StoryExample`, one `## Related guides` list of 1 to 4 links below it, no em dash at 3d9c8c5e: pass
- Check: Task 2 every `/docs/guides/<slug>` link names an existing guide file (32 guides) at 3d9c8c5e: pass; link text unified to `Global Filtering (Search)` on one page, as on basic.mdx
- Check: Task 2 `pnpm format` at 3d9c8c5e: pass, no diff (prettier does not cover .mdx)
- Check: Task 2 `git status` and `git diff origin/v0.9/docs-layout --stat` at 685dc11f: pass, only the 63 `more/miscellaneous-*.mdx` files
- Check: Task 3 `pnpm --filter shadcn-table-docs build` at 3d9c8c5e: pass
- Check: Task 3 step truth, Playwright script on `next start -p 5340`, base selected (default), the 13 pages without a play (31 steps) at 3d9c8c5e plus the two step fixes of 685dc11f: pass, 31 of 31 after the fixes; first run failed 2 steps: `search-field--position-left` step 1 (the `Show/Hide search` toggle sits with the toolbar buttons on the right; the field opens on the left) and `use-effects--filter-options-async` step 2 (the empty filtered table shows `No results found`, not `No records to display`); both rewritten and rerun green
- Check: Task 3 labels named by the steps read in `components/ui-radix` and `components/ui-aria`: `locales/en.ts` identical to base apart from the import line; `ST_TableBody` picks `noResultsFound` for a filtered empty table in all three; `ST_ToggleRowActionMenuButton` renders no `Row Actions` button while the menu items are empty
- Check: Task 3 `aria-tooltips--select-filter-and-group-value` (play runs on aria only) checked on base on the same server: pass, hover row checkbox `Toggle select row`, keyboard focus opens and blur closes it, hover filter checkbox `Filter by Is Active`, hover grouped `Ohio` `State`
- Check: Task 5 every Related guides link of the 63 pages (32 guides) on the same production build at 3d9c8c5e: pass, 32 of 32 return 200
- Check: server on 5340 stopped
- Check: `pnpm test typecheck --base radix` at 685dc11f: pass (tsc clean)
- Check: `pnpm test lint` at 685dc11f: pass (0 errors, 9 warnings)
- Check: `pnpm test validate-repo` at 685dc11f: pass (story pages match, 40 unit tests), tree clean after

- Task 1 site table: done by the writers (their notes in the run), run: workflow 56-texts-misc
- Task 2 three parts on every page: done, 3d9c8c5e, run: workflow 56-texts-misc assembler
- Task 3 step truth: done, 685dc11f, run: workflow 56-texts-misc assembler
- Task 4 text check by judges: judges: run by the workflow
- Task 4 fix round: five failed lines rewritten (callback-refs virtualized step 1, dragging-when-filtered description, subheader-row-ring step 2, empty-mode-chip step 3, chips-string-column description), 94dee38c, run: workflow 56-texts-misc fixer
- Task 5 cleanup: done, 685dc11f, run: workflow 56-texts-misc assembler

## Attention

- Two pages with a play carry a step the play does not assert (writers' notes): `mobile-date-pickers--mobile-date-time-pickers` steps 1 and 2 say the browser's date and time pickers open (play checks only the input types); `app-bar-overlaps-with-full-screen-modal--fullscreen-is-above-appbar` step 2 (play presses Escape, does not check the result). Kept as written; the lead decides whether the play or the step changes.
- `filter-popover--empty-mode-chip-clear-has-name` step 3 now says to click the chip's clear button (the chip goes, the input is back); the play only checks that button's `Clear filter` name and does not click it. A step the visitor can see beat a screen-reader statement; revert if the step must match the play exactly.
