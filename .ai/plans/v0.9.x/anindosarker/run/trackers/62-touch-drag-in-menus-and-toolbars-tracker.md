# 62: Touch drag in menus and toolbars, tracker

Status: running
Branch `v0.9/touch-drag-menus-toolbars`, worktree 06
Checks:
- Check: touch plays fail before the change (P11), `ST_BASE=base vitest run` ColumnOrdering, SortPopover, ColumnGrouping at 7da8152e: fail as expected, 4 failed (Menu Reorder Moves Column, Locked Column Stays Put, Reorder Remove Delete: no ghost, no reorder; Group By Banner: a touch drag cancelled over the drop zone still groups), 40 passed
- Check: typecheck of the changed registry files, `tsc -p tsconfig.{baseui,radix,aria}.json --noEmit` at 80a997f1: pass (clean x3)
- Check: eslint and prettier on the changed files at 80a997f1: pass
- Check: touch and mouse plays of the four story files, `ST_BASE=<base> vitest run` ColumnOrdering, SortPopover, ColumnGrouping, ColumnHiding at 80a997f1: pass on base, radix, aria (55 of 55 each)
- Check: emulation base at 80a997f1, Pixel 7 Chromium with CDP touch events on local Storybook port 5342: fail, a held header dropped on the drop zone reordered the column to the end instead of grouping (the column auto-scroll took the hover from the zone); fixed in 5c1f5787
- Check: emulation base, same method, port 5342, at 5c1f5787: pass (body swipe scrolls the page; menu grip drag reorders, page and menu stay at their scroll, menu open; sort rule drag reorders, page stays, popover open; held header onto the drop zone groups, page stays), server stopped
- Check: emulation radix, same method, port 5343, at 5c1f5787: pass (all four), server stopped
- Check: emulation aria, same method, port 5343, at 5c1f5787: pass (all four), server stopped
- Check: typecheck, `pnpm test typecheck` (base, radix, aria) at 0295f70f: pass (tsc clean x3)
- Check: lint, `pnpm test lint` at 0295f70f: pass (9 warnings, all in docs examples this branch does not touch)
- Check: validate-repo, `pnpm test validate-repo` at 0295f70f: pass (bases identical, registry fresh, 40 unit tests; tree clean after)
- Check: storybook-tests base, `pnpm test storybook-tests --base base` at 0295f70f: pass (654 passed)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at 0295f70f: pass (654 passed)
- Check: storybook-tests aria, `pnpm test storybook-tests --base aria` at 0295f70f: pass (654 passed)
- Check: emulation at 0295f70f: the code is that of 5c1f5787 (0295f70f changes `CHANGELOG.md` only), so the three runs above stand
- Check: review fix plays fail before the change (P11), `ST_BASE=base vitest run` ColumnOrdering "Menu Reorder Moves Column" with the tap step at a75180a2 (code of 0295f70f): fail as expected (a tap on the State grip, then Reset order, made 55 `animate` calls)
- Check: same, ColumnGrouping "Group By Banner" with the auto-scroll dragover step, drop zone of 80a997f1 on base: fail as expected (the drop reordered, banner stayed "Grouped by Gender, then by City")
- Check: ColumnOrdering plays, `ST_BASE=<base> vitest run` at 7f075050: pass on base, radix, aria (12 of 12 each)
- Check: ColumnGrouping plays, `ST_BASE=<base> vitest run` at 4dc5318b: pass on base, radix, aria (25 of 25 each)
- Check: typecheck, `pnpm test typecheck` (base, radix, aria) at 4dc5318b: pass (tsc clean x3)
- Check: lint, `pnpm test lint` at 4dc5318b: pass (9 warnings, docs examples untouched by this branch)
- Check: validate-repo, `pnpm test validate-repo` at 4dc5318b: pass (bases identical, registry fresh, 40 unit tests; tree clean after)
- Check: storybook-tests, `pnpm test storybook-tests --base <base>` at 4dc5318b: pass on base, radix, aria (654 passed each)
- Check (verifier): Local CI line of 2.2 at 4dc5318b = HEAD: typecheck x3, lint, validate-repo, storybook-tests x3 recorded green above at HEAD, not rerun; tree clean, branch contains `origin/claude/review` (3d3b4cd2, plan commits only past 39e1e6b9)
- Check (verifier): Acceptance 1.2, touch plays recorded failing before the change (P11) above for all four surfaces; touch plays end in the mouse order and assert the ghost (D132), covered by storybook-tests at HEAD
- Check (verifier): Acceptance 1.2 emulation rerun at 4dc5318b (code changed after the 5c1f5787 runs), same method, Storybook dev on ports 5346 (base), 5347 (radix), 5348 (aria) concurrently: pass, 4 of 4 per base (body swipe scrolls the page; menu grip drag reorders, page 60 to 60, menu scroll unchanged, menu open; sort rule drag reorders, page unchanged, popover open; held header onto the drop zone groups, 11 group rows, page 0); servers stopped

- Task 1 Touch plays first: done (7da8152e)
- Task 2 The three surfaces: done (80a997f1)
- Task 3 Emulation run: done (5c1f5787)
- Task 4 Cleanup: done (0295f70f)
- Review fixes: done (a75180a2, 7f075050, 53ff9964, 4dc5318b)

## Notes

- The check on a real phone or tablet that D108 asks for is still owed for the columns menu, the sort rules and the drop zone; it belongs to the release that carries spec 62.
- `useST_TouchDrag` is reused unchanged. The menu grip and the sort rule handle pass its `onPointerDown`; the sort popover keeps one hook for all rules and records the rule under the finger in a ref. The sort rule handle gained `touch-none`; the menu grip already had it (`ST_GrabHandleButton`).
- The drop zone needed no touch wiring of its own (the header touch path already sends it `dragenter` and `dragover`); it gained a touch-only `dragleave` (a cancel or a finger leaving the zone clears its hover) and re-marks its hover on every `dragover`.
- Emulation method: Playwright Chromium, `devices['Pixel 7']`, `Input.dispatchTouchEvent` through CDP, on `storybook dev` of the worktree; a 3000 px spacer appended to the story page and the page scrolled to 60 px before each popup opens, so a scroll in either direction would show. Stories: `ColumnOrderingEnabled`, `SortPopoverSeeded`, `ColumnGroupingEnabled`.

## Attention

- The grouping touch play drags a held header cell onto the drop zone, not a grip: no story of `ColumnGrouping.stories.tsx` sets `showColumnDragHandle`, and a new story export is ruled out (D106). The grip path to the drop zone is the column grip of the first milestone, already covered. Reverting means adding `showColumnDragHandle` to the `GroupByBanner` table, which changes that story's docs page.
- `ST_ToolbarDropZone` takes the hover back on a touch `dragover` only: on a table narrower than its columns the column auto-scroll (`useST_DragAutoScroll`) re-sends `dragover` to the header last under the pointer while it scrolls, which took the hover from the zone. The mouse path is untouched; a mouse drop on the zone while the auto-scroll runs belongs to the `useST_DragAutoScroll` root-cause fix below.
- Found, not fixed (outside this milestone's files): `useST_DragAutoScroll` keeps scrolling the table sideways from the last pointer position inside it after the pointer or finger has left the table for the drop zone, until the table reaches its end. Fix where it lives: stop the loop on a `dragover` outside the table container.
- Found, not fixed: the columns menu grip's touch drag passes no `getScrollContainer`, so on a phone a column cannot be dragged to a menu row out of view (the mouse scrolls the menu through the browser's own drag auto-scroll). Passing the menu's scrolling popup is not enough: when the popup cannot scroll further, `useST_TouchDrag`'s page fallback would scroll the page behind it, which Task 3 rules out. Fix in `useST_TouchDrag` (first milestone's file): a container option that never falls back to the page, then pass the popup from the menu grip.
