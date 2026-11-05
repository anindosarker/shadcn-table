# Home demo cues and last title (F49, D65), tracker

Status: running
Branch `v0.8/fix-demo-cues`, worktree 02, PR #123
Gates:
- Repro on shipped code (ec0949b5): Chromium 1440x900, demo scrolled into view, DOM sampled every 100 ms through one loop: no `.v12-cue` element is ever the sort editor content (Due / Ascending / Add sort / Delete sort), the "Due" sort chip, the "Status" chip editor content or the view settings panel; the cues on portalled elements (the options "Due", "Status", "In Review", the striped switch) compute `::after` `content: none`, so they never showed: red as reported
- `node scripts/check-pages.mjs e --url http://localhost:5347 --widths 1440 /` with the shipped `signal-demo.tsx` and `v12.css` and the new home entry: `demo: step titles` and `demo: cues the sort chip, the editors and the view settings panel` (`cued=`) fail as expected (P10)
- Fixed, same sampling at 1440x900 dark and 1280x720 light (toolbar scrolled just below the nav, D63): sort picker, "Due" chip with its sort editor, filter picker, "Status" chip editor, "Status: In Review" chip and view settings panel each carry `v12-cue` with a visible overlay; no stale cue, popover sizes unchanged, no flip, every step plays: green
- `pnpm --filter shadcn-table-docs types:check` at fea845a5: green
- `pnpm --filter shadcn-table-docs lint --quiet` at fea845a5: green (0 errors)
- `node scripts/check-pages.mjs e --base radix --url http://localhost:5347 /` at fea845a5: green (44 passed)
- `node scripts/check-pages.mjs e --base base --url http://localhost:5347 /` at fea845a5: green (44 passed)
- `node scripts/check-pages.mjs e --base aria --url http://localhost:5347 /` at fea845a5: green (44 passed)

- Milestone 01 cues on the chips and their editors, last title: done (fea845a5)

## Attention

- The cue also pulses the column pickers the Sort button and the "+ Filter" pill open (D65's "the control that acts and the editor or panel it opens" read for both pickers), so each of those steps runs about 1.5 s longer; drop the first `pulse(openPopover())` beat in Sorting and Filtering in `signal-demo.tsx` to revert.
- The cue overlay now takes `border-radius: inherit` everywhere, so the existing button, pill and chip cues follow their rounded corners instead of a square outline; remove that line from the `::after` rule in `v12.css` to revert.

## Notes

- Popovers render in portals outside `.v12`, where neither the cue rules nor the `--dh-*` tokens applied: every pulse on an option or the switch was invisible before this fix. `.v12-cue:not(.v12 *)` in `v12.css` carries the tokens and the overlay there; a React Aria popover's inline `position` wins over the rule's `position: relative`.
- The e.mjs cue assertion samples each frame inside the existing replay recorder (finer than 100 ms).
- Screenshots in the run's scratch only, not committed.
