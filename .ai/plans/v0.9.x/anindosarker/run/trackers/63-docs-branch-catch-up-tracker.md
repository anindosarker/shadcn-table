# 63: Docs branch catch-up, tracker

Status: done (4535bd65)
Branch `v0.9/docs-branch-catch-up`, worktree 08
Checks:
- `git merge-base --is-ancestor origin/claude/review HEAD` at 62429d40: pass
- `git grep -n '^<<<<<<<\|^>>>>>>>' -- . ':!*.md'` at 62429d40: prints nothing
- Story ids after the merge (Storybook's CSF parser through `readStories` of `lib/story-pages.mjs`, 62429d40 against b86ae185): 638 before, 641 after; the diff adds only `features-column-dragging--touch-hold-on-range-slider`, `features-row-ordering--touch-drag-scrolls-page`, `features-row-pinning--row-pinning-select-sticky-with-virtualization` (the three new claude/review stories); none lost, no D110 export re-added
- Every line claude/review added to the story files and the two guides since the merge base 59be73e9 is present in the merge result (line check per file): pass (two comment lines reworded in ColumnGrouping)
- No story file assigns a `.play` twice at 62429d40: pass
- `pnpm install` at 10017aac: lockfile regenerated, no `10.6.2` left in it
- `pnpm ls storybook -r` at 10017aac: storybook 10.6.7 in shadcn-table and shadcn-table-docs
- `pnpm ls recharts -r` at 10017aac: recharts 2.15.4 in shadcn-table and shadcn-table-docs (as on b86ae185)
- `pnpm test typecheck --base base` at 10017aac: pass, tsc clean
- `pnpm test lint` at 10017aac: pass, 9 warnings (apps/shadcn-table-docs examples, untouched)
- `node lib/story-pages.mjs` at 10017aac: 599 story pages, 3 new
- `node lib/story-text-checklist.mjs` (main checkout file) at a62678ab: 599 pages
- `pnpm test validate-repo` at a62678ab (before commit, same tree): pass, story pages match (641 stories, 42 example pages, 599 story pages), 40 unit tests
- `pnpm --filter shadcn-table-docs build` at a62678ab: pass
- `pnpm test docs-e2e --base base --url <next start on 5340>` at a62678ab (that build): pass, 5 sections, 116 pages, 2564 checks (getting-started 268, api 111, guides 1020, examples 1107, site 58)
- `pnpm test docs-e2e --base radix --url ...` at a62678ab: pass, 116 pages, 2564 checks
- `pnpm test docs-e2e --base aria --url ...` at a62678ab: pass, 116 pages, 2564 checks
- Docs story page captures (`reference/d123-storybook-upgrade/tools/capture-docs.cjs`, same build) against `captures/before/docs-*.png`: 18 compared, all 18 differ only in the sidebar (every differing pixel at x <= 240): the More examples count and row numbers shift by the three new pages; table, Try it and toolbar equal
- Story page steps run once in Chromium on the docs production build, base selected, port 5340 (script: start, steps, stop), with `components/ui-<base>` regenerated locally by `pnpm --filter shadcn-table-docs lib:install base|radix|aria` and restored afterwards, not committed (see Attention): Sub Row Tree With Selection 3/3 steps true (ticking the row ticks its 4 sub-rows; the row ticks with the last sub-row only), Row Pinning Sticky With Virtualization 2/2 true (tooltip `Unpin`; pinned row in view at the end of the scroll), Row Pinning Select Sticky With Virtualization 3/3 true, Touch Drag Scrolls Page step 2 true (touch pointer events: ghost shown, page scrolled 104 to 1424); server stopped. On the committed copies the same run fails the two corrected pages (old library behaviour)
- `pnpm format` at a62678ab: one file reflowed (SortPopover.stories.tsx), committed 756f516d
- `pnpm test typecheck --base radix` at 756f516d: pass, tsc clean
- `pnpm test typecheck --base aria` at 756f516d: pass, tsc clean
- `pnpm test storybook-tests --base base` at 756f516d: pass, 641 passed, 85 files
- `pnpm test storybook-static --base base` at 756f516d: reset pass; `storybook-static/base/index.json` 641 story ids, equal to the CSF list after the merge; diff against b86ae185 adds only the three new story ids
- `pnpm test lint` at 756f516d: pass, 9 warnings (untouched docs examples)
- `pnpm test validate-repo` at 756f516d: pass, story pages match, 40 unit tests
- `prettier --check CHANGELOG.md` at 7418d110: pass
- `pnpm test storybook-tests --base radix` at 7418d110: pass, 641 passed, 85 files (record `test/.out/storybook-tests-radix.json`, run by the review)
- `pnpm test storybook-tests --base aria` at 7418d110: pass, 641 passed, 85 files (record `test/.out/storybook-tests-aria.json`, run by the review)
- D104 text check, three judges (independent headless sessions, the four criteria, majority per line) on the description, Try it steps and Related guides lines, at 7418d110:
  - Touch Hold On Range Slider: 5/5 lines pass 3 of 3
  - Touch Drag Scrolls Page: 4/4 lines pass 3 of 3
  - Row Pinning Select Sticky With Virtualization: steps 2 and 3 fail 2 of 3 (wording: the header checkbox's on-screen label is `Toggle select all`, not "select-all checkbox"); rewritten to name `Toggle select all` (f3bf538e) and rejudged: 7/7 lines pass 3 of 3
- `node lib/story-text-checklist.mjs` (main checkout file) at f3bf538e: 599 pages, the rewritten page's line updated
- `pnpm test validate-repo` at f3bf538e: pass, story pages match (641 stories, 42 example pages, 599 story pages), 40 unit tests
- `prettier --check` on the rewritten page at f3bf538e and on `CHANGELOG.md` at 79403873: pass
- Not rerun after f3bf538e and 79403873: text only (one Try it page, the changelog); docs-e2e checks the step count and order, which did not change
- Verifier (2.2, clean tree at 79403873, every heavy command through the lock script, one base at a time):
  - `pnpm test storybook-static --base base` at 79403873: reset pass; 599 story pages match `index.json`, 42 example stories; 641 story ids
  - `pnpm test storybook-static --base radix` at 79403873: reset pass; 641 story ids, equal to base (`diff` prints nothing)
  - `pnpm test storybook-static --base aria` at 79403873: reset pass; 641 story ids, equal to base; the three new ids present
  - `pnpm --filter shadcn-table-docs build` at 79403873: pass
  - `pnpm test docs-e2e --base base --url <next start on 5340>` at 79403873 (that build): pass, 5 sections, 116 pages, 2564 checks (getting-started 268, api 111, guides 1020, examples 1107, site 58)
  - `pnpm test docs-e2e --base radix --url ...` at 79403873: pass, 116 pages, 2564 checks, same per section
  - `pnpm test docs-e2e --base aria --url ...` at 79403873: pass, 116 pages, 2564 checks, same per section; server stopped, no listener left on 5340 to 5360
  - Not rerun (recorded green, diff since touches only story page text, the changelog and a format-only story change; CI is the second run): typecheck base (10017aac), radix and aria (756f516d), lint (756f516d), storybook-tests base (756f516d), radix and aria (7418d110), validate-repo (f3bf538e)
  - Acceptance (1.2) on the docs branch at 79403873: pass. Story tests 641 passed on each base (records above); static builds green on the three bases with equal id lists, 641 = 638 of `origin/v0.9/docs-layout` plus the three new claude/review stories (the baseline's 654 ids are claude/review's groups before D110, not the docs branch's reference); docs-e2e 116 pages on each base as in `baseline.md`, checks 2561 to 2564 (the three added story pages in getting-started); docs story page captures recorded at a62678ab differ only in the sidebar count; typecheck, lint, validate-repo green as recorded

- Task 1 The merge: done (62429d40)
- Task 2 Pins and install: done (10017aac)
- Task 3 Story pages: done (a62678ab; judged, f3bf538e)
- Task 4 Docs story pages against the baseline: done (a62678ab; compare.md and captures/after/docs-*.png on claude/review fdf593c5)
- Task 5 Cleanup: done (756f516d, changelog 7418d110)

Conflicted files and what was kept (62429d40):
- `CHANGELOG.md`: both sides, in order, per section (Added, Changed, Fixed)
- `apps/shadcn-table-docs/content/docs/guides/row-pinning.mdx`: docs side heading level (`## Static Row Pinning`, D105) and claude/review's removal of the "not compatible with row virtualization" note
- `ClickToCopy.stories.tsx`: docs side plays and helpers, plus claude/review's `ClickToCopyEnabledWithColumnResizing.play` (D127)
- `ColumnGrouping.stories.tsx`: `GroupByBanner` stays merged (D110); its new mouse and touch drop zone steps go into the step `Group By Banner` of `ColumnGroupingEnabledReorder.play`, the touch helpers at module level
- `ColumnOrdering.stories.tsx`: git paired claude/review's `LockedColumnStaysPut` hunk with the docs story `ColumnDndOrdering`; `ColumnDndOrdering` keeps the docs side, and the touch steps go into `ColumnOrderingDisabledPerColumn.play`, the story D110 merged `LockedColumnStaysPut` into (it renders `<ColumnOrderingDisabledPerColumn />`; spec 1.6.5 named `MenuReorderMovesColumn`, which takes claude/review's own `MenuReorderMovesColumn` steps unchanged)
- `RowOrdering.stories.tsx`: both stories, docs `RowDndOrdering` then claude/review's `TouchDragScrollsPage`
- `SortPopover.stories.tsx`: `ReorderRemoveDelete` stays merged; its mouse no-ghost and touch steps go into `reorderRemoveDelete` (play of `SortPopoverSeeded`), touch helpers before it
- `StickyHeader.stories.tsx`: imports of both sides; docs `StickyHeader` story, then claude/review's `EnableStickyHeader.play` (D120, D126)
- `pnpm-lock.yaml`: docs side in the merge, regenerated by `pnpm install` in 10017aac
- `.ai/.../53-docs-frame-tracker.md`: claude/review side (plan files live there)

Plays of specs 60 to 62 and where they are (62429d40):
- `ClickToCopyEnabledWithColumnResizing.play` (60, D127): own story
- `ColumnResizingWithPinning.play` (60, D126): own story
- `EnableStickyHeader.play` (60, D120, D126): own story
- `SubRowTreeWithSelection.play`, `SubRowTreeWithSelectionNoSubRowSelection.play`, `SubRowTreeWithSingleSelection.play` (60, D125): own stories
- `RowPinningStickyWithVirtualization.play` (61, D128): own story
- `RowPinningSelectStickyWithVirtualization` and its play (61.1): own new story
- Touch steps in `ColumnDraggingEnabled`, `ColumnDraggingCancelled`, `ColumnDraggingLockedColumn`, `ColumnDraggingWithGrip` (62): own stories
- `TouchHoldOnRangeSlider` (62, D139): own new story
- Touch steps in `DragReordersRows` and the new `TouchDragScrollsPage` (62, 62.2, D139): own stories
- Touch steps in `DragBetweenTables` (RowDragging, 62): own story
- Touch steps of `MenuReorderMovesColumn` (62): own story
- Touch steps of `LockedColumnStaysPut` (62): in `ColumnOrderingDisabledPerColumn.play` (D110 merge)
- Mouse and touch drop zone steps of `GroupByBanner` (62, 62.1): in the step `Group By Banner` of `ColumnGroupingEnabledReorder.play` (D110 merge)
- No-ghost and touch steps of `ReorderRemoveDelete` (62): in `reorderRemoveDelete`, the play of `SortPopoverSeeded` (D110 merge)

New and corrected story pages:
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-column-dragging--touch-hold-on-range-slider.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-row-ordering--touch-drag-scrolls-page.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-row-pinning--row-pinning-select-sticky-with-virtualization.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-sub-row-tree--sub-row-tree-with-selection.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-row-pinning--row-pinning-sticky-with-virtualization.mdx


## Attention
- The committed docs library copies `apps/shadcn-table-docs/components/ui-<base>/` (generated, P9) predate specs 60 to 62 on this branch and on claude/review alike (no `useST_TouchDrag.ts`, old `row.utils.ts`). A build of the branch therefore shows the old behaviour on the two corrected pages (ticking a parent leaves its sub-rows unticked; the pinned virtual row scrolls away) and no touch drag on the new touch pages. Kept as the earlier runs did (regenerated locally for the check, restored, not committed; the release regenerates them). Revert: commit the output of `pnpm --filter shadcn-table-docs lib:install base|radix|aria` on the docs branch, so its preview and the owner's wording review match the texts.
- The description of Sub Row Tree With Selection also stated the bug ("a row's box ticks when one of its sub-rows is ticked"); corrected with the Try it steps to "ticking a row ticks all its sub-rows" (spec 1.6.5 names the Try it text only). Revert: restore the old description line.
- The same page's Try it step 3 (`Clear selection` in the banner clears every box) was replaced by "untick it, then tick each of its sub-rows: the row ticks with the last one", to show D125's third behaviour (the play asserts it). Revert: restore the `Clear selection` step.
- The two judged steps on Row Pinning Select Sticky With Virtualization now name `Toggle select all`, the label of the header checkbox (aria label and tooltip), as `features-selection` pages do; the judges' alternative was none. Revert: "the select-all checkbox".
- Spec 1.6.5 names `MenuReorderMovesColumn` as the home of `LockedColumnStaysPut`'s steps; on the docs branch D110 merged that story into `ColumnOrderingDisabledPerColumn` (same table), so the steps went there.
- Touch Drag Scrolls Page step 1 (mouse drag to the window bottom scrolls the page) relies on the browser's own drag auto-scroll; headless Chromium does not reproduce it, so only step 2 (touch) was run.
