# 62: Reorder by touch, tracker

Status: running
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

- Task 1 Touch plays first: done (d120f52c)
- Task 2 Touch path: done (343ea5b1)
- Task 3 Columns and rows: done (53882385)
- Task 4 Scrolling emulation: done (351bfda5)
- Task 5 Guide line: done (ab729ef9)
- Task 6 Cleanup: done (67cdda9d, b84c5558)

## Notes

- The check on a real phone or tablet that D108 asks for is still owed; it belongs to the release that carries spec 62.
- The touch path sends `dragenter`, `dragleave`, `dragover` and `drop` drag events (marked by `createST_TouchDragEvent` in `drag.utils.ts`) to the element under the finger, so every drop target keeps its own handlers; a target takes the drop by `preventDefault` on `dragover` without `dropEffect` `none`, as with a mouse. No separate drop target attribute was needed.
- `ST_TableBodyCell.tsx` and `ST_TableBodyRow.tsx` are unchanged: their existing drag handlers serve the touch path.
- The menu milestone can reuse `useST_TouchDrag` as is: its drop targets already accept `dragover`; the sort popover's `onDrop` receives the touch `drop`.

## Attention
