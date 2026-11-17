# 62: Reorder by touch, tracker

Status: done (fcd6af8f)
Branch `v0.9/touch-drag-columns-rows`, worktree 06
Checks:
- Check: touch plays fail before the change (P11), `ST_BASE=base vitest run` ColumnDragging, RowOrdering, RowDragging at d120f52c: fail as expected, 6 failed (Column Dragging Enabled, Cancelled, Locked Column, With Grip, Drag Reorders Rows, Drag Between Tables; no ghost, no reorder), 14 passed
- Check: typecheck, `pnpm test typecheck --base base|radix|aria` at 343ea5b1: pass (tsc clean x3)
- Check: validate-repo, `pnpm test validate-repo` at 343ea5b1: pass
- Check: touch and mouse plays of the three story files, `ST_BASE=<base> vitest run` ColumnDragging, RowOrdering, RowDragging at 53882385: pass on base, radix, aria (20 of 20 each)
- Check: emulation base, Pixel 7 Chromium with CDP touch events on local Storybook port 5341 at 351bfda5: pass (grip drag reorders, page and table do not scroll; body cell swipe scrolls; quick header swipe scrolls, no reorder; header hold reorders, no scroll; row at the bottom edge of the virtualized body scrolls it), server stopped
- Check: emulation radix, same method and port at 351bfda5: pass (all five), server stopped
- Check: emulation aria, same method and port at 351bfda5: pass (all five), server stopped
- Check: guide line, `git diff origin/claude/review -- apps/shadcn-table-docs/content/docs/guides/column-ordering-dnd.mdx` at ab729ef9: pass (only the bullet "Touch screens have no column drag." removed)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at 67cdda9d: fail, ClickToCopy "Click Copies Value" (failed on two reruns, passed with the click guard off); fixed in b84c5558 (the guard drops only a click on the dragged source)
- Check: storybook-tests base, `pnpm test storybook-tests --base base` at b84c5558: pass (652 passed)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at b84c5558: pass (652 passed)
- Check: storybook-tests aria, `pnpm test storybook-tests --base aria` at b84c5558: pass (652 passed)
- Check: typecheck, `pnpm test typecheck --base base|radix|aria` at b84c5558: pass (tsc clean x3)
- Check: lint, `pnpm test lint` at b84c5558: pass (9 warnings, all in docs examples this branch does not touch)
- Check: validate-repo, `pnpm test validate-repo` at b84c5558: pass (registry fresh)
- Check: review fix plays fail before the fix (P11), `ST_BASE=base vitest run` ColumnDragging at 3b21237b (code of b84c5558): fail as expected, 2 failed (Column Dragging Enabled: the click after a hold and lift in place is swallowed, no column menu; Touch Hold On Range Slider: a ghost is drawn), 6 passed
- Check: review fix play fails before the fix (P11), `ST_BASE=base vitest run` RowOrdering at ededd4ef (code of 4f8c8c5c): fail as expected, Touch Drag Scrolls Page (page scrollTop stays 0), 9 passed
- Check: touch and mouse plays, `ST_BASE=base vitest run` ColumnDragging at e1b75a16 and RowOrdering at c3d66433: pass (8 of 8, 10 of 10)
- Check: typecheck, `pnpm test typecheck --base base|radix|aria` at 0d7985c4: pass (tsc clean x3)
- Check: lint, `pnpm test lint` at 0d7985c4: pass (9 warnings, all in docs examples this branch does not touch)
- Check: validate-repo, `pnpm test validate-repo` at 0d7985c4: pass (registry fresh)
- Check: storybook-tests base, `pnpm test storybook-tests --base base` at 0d7985c4: pass (654 passed)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at 0d7985c4: pass (654 passed)
- Check: storybook-tests aria, `pnpm test storybook-tests --base aria` at 0d7985c4: pass (654 passed)
- Check (verifier): Local CI line of 2.2 (typecheck x3, lint, validate-repo, storybook-tests x3) recorded green at HEAD 0d7985c4 above; not rerun, CI is the second run
- Check (verifier): emulation base, Pixel 7 Chromium with CDP touch events on local Storybook dev port 5344 at 0d7985c4: pass (all five), server stopped
- Check (verifier): emulation radix, same method, port 5345, at 0d7985c4: pass (all five) on two solo reruns; the first run, concurrent with base and aria, missed "header hold reorders, no scroll" (timing of the 300 ms hold under load), server stopped
- Check (verifier): emulation aria, same method, port 5346, at 0d7985c4: pass (all five), server stopped
- Check (verifier): Acceptance of 1.2 at 0d7985c4: pass (gates green at HEAD, P11 failures recorded, emulation green on three bases; real-device check of D108 still owed to the release)

- Task 1 Touch plays first: done (d120f52c)
- Task 2 Touch path: done (343ea5b1)
- Task 3 Columns and rows: done (53882385)
- Task 4 Scrolling emulation: done (351bfda5)
- Task 5 Guide line: done (ab729ef9)
- Task 6 Cleanup: done (67cdda9d, b84c5558)
- Review fixes: done (3b21237b to 0d7985c4)

## Notes

- The check on a real phone or tablet that D108 asks for is still owed; it belongs to the release that carries spec 62.
- The touch path sends `dragenter`, `dragleave`, `dragover` and `drop` drag events (marked by `createST_TouchDragEvent` in `drag.utils.ts`) to the element under the finger, so every drop target keeps its own handlers; a target takes the drop by `preventDefault` on `dragover` without `dropEffect` `none`, as with a mouse. No separate drop target attribute was needed.
- `ST_TableBodyCell.tsx` and `ST_TableBodyRow.tsx` are unchanged: their existing drag handlers serve the touch path.
- The menu milestone can reuse `useST_TouchDrag` as is: its drop targets already accept `dragover`; the sort popover's `onDrop` receives the touch `drop`.
- The real-device check owed by D108 proves first the header hold drag on iOS Safari: WebKit honours a touchmove `preventDefault` only from a listener present before the touch began, so `useST_TouchDrag` keeps one non-passive window listener while a drag source is mounted (4f8c8c5c); only Chromium emulation has run.
- A tall table on a scrolling page: the row drag scrolls the page when the table cannot scroll (c3d66433), proved by the play `Touch Drag Scrolls Page` in Chromium with touch pointer events on all three bases, not by a CDP emulation run.

## Attention

- The touch path sends synthetic `dragenter`, `dragleave`, `dragover` and `drop` events to the element under the finger in place of the drop target marks of spec 62 1.4 and 1.6.2; `ST_TableBodyCell` and `ST_TableBodyRow` stay unchanged. Why: every drop target, an app's own included, keeps its handlers and takes a touch drop as a mouse drop. Reverting means marking each library drop target in `drag.utils.ts` and hit testing those marks, and an app's own drop target would then not take a touch drop.
