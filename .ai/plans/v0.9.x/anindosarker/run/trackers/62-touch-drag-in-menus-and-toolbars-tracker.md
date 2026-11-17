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

- Task 1 Touch plays first: done (7da8152e)
- Task 2 The three surfaces: done (80a997f1)
- Task 3 Emulation run: done (5c1f5787)
- Task 4 Cleanup: done (0295f70f)

## Notes

- The check on a real phone or tablet that D108 asks for is still owed for the columns menu, the sort rules and the drop zone; it belongs to the release that carries spec 62.
- `useST_TouchDrag` is reused unchanged. The menu grip and the sort rule handle pass its `onPointerDown`; the sort popover keeps one hook for all rules and records the rule under the finger in a ref. The sort rule handle gained `touch-none`; the menu grip already had it (`ST_GrabHandleButton`).
- The drop zone needed no touch wiring of its own (the header touch path already sends it `dragenter` and `dragover`); it gained a touch-only `dragleave` (a cancel or a finger leaving the zone clears its hover) and re-marks its hover on every `dragover`.
- Emulation method: Playwright Chromium, `devices['Pixel 7']`, `Input.dispatchTouchEvent` through CDP, on `storybook dev` of the worktree; a 3000 px spacer appended to the story page and the page scrolled to 60 px before each popup opens, so a scroll in either direction would show. Stories: `ColumnOrderingEnabled`, `SortPopoverSeeded`, `ColumnGroupingEnabled`.

## Attention

- The grouping touch play drags a held header cell onto the drop zone, not a grip: no story of `ColumnGrouping.stories.tsx` sets `showColumnDragHandle`, and a new story export is ruled out (D106). The grip path to the drop zone is the column grip of the first milestone, already covered. Reverting means adding `showColumnDragHandle` to the `GroupByBanner` table, which changes that story's docs page.
- `ST_ToolbarDropZone` marks itself hovered on every `dragover`, the mouse included: on a table narrower than its columns the column auto-scroll (`useST_DragAutoScroll`) keeps re-sending `dragover` to the header last under the pointer while it scrolls, which took the hover from the zone, so a drop on the zone reordered the column instead of grouping. For the mouse the only change is that a drop on the zone groups also while the auto-scroll runs.
- Found, not fixed (outside this milestone's files): `useST_DragAutoScroll` keeps scrolling the table sideways from the last pointer position inside it after the pointer or finger has left the table for the drop zone, until the table reaches its end. Fix where it lives: stop the loop on a `dragover` outside the table container.
