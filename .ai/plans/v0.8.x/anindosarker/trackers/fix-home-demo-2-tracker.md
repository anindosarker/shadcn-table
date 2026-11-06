# Home demo polish (F45 follow-up), tracker

Status: merged (df8791d5)
Branch `v0.8/fix-home-demo-2`, worktree 02, PR #119 (draft)
Files owned: `apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/signal-table.tsx`; `apps/shadcn-table-docs/scripts/page-checks/e.mjs` home entry
Depends on: Last fixes (F19, F28, F30, F39, F40, F41, D56, D57)
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 82ff1a2e: green
- `pnpm --filter shadcn-table-docs lint` (errors only) at 82ff1a2e: green (0 errors, 9 warnings)
- `node scripts/check-pages.mjs e --base radix --url http://localhost:5341 /` at 82ff1a2e: green (38 passed)
- `node scripts/check-pages.mjs e --base base --url http://localhost:5341 /` at 82ff1a2e: green (38 passed)
- `node scripts/check-pages.mjs e --base aria --url http://localhost:5341 /` at 82ff1a2e: green (38 passed)
- `pnpm --filter shadcn-table-docs build` at 73cc9d8d: green (exit 0, `git status --short` clean), verifier
- types:check, lint and check-pages e (radix, base, aria) at 82ff1a2e: still valid at 73cc9d8d (`git diff --name-only 82ff1a2e..HEAD` touches only the tracker and `CHANGELOG.md`), verifier
- headless Chromium watch, verifier, own dev server on 5345 (stopped), at 73cc9d8d: two full loops at 1440x900 dark and one at 1280x720 light, 100 ms DOM sampling plus 300 ms frames, a rAF burst of the Column order slide, Replay mid-Search, a table click during Editing, step jumps to Column order and Search, Replay from a jump: no tooltip, no focus ring on a toolbar button, demo height constant (650 px at 1440, 882 px at 1280), step list and status line fixed (status 32 px), table 520/520 with no inner or horizontal scroll, no page scroll, the moved Project header and body cells on top for the whole slide, Filter picker and chip in the chips row, editor 4 to 1 to 16 with no blank, loops identical within 10 ms, zero console errors; F45-5 (list below the fold at 1280x720), F45-8 (stock faint stripe) and F45-9 (chip has no direction) remain as recorded under Attention
- headless Chromium watch, own dev server on 5341 (stopped), at ddaed45c: two full loops plus Replay mid-Search, a table click during Editing, the Name column menu, a reload, a jump to Column order and Replay from the jump at 1440x900 dark; one loop at 1280x720 light: no tooltip, no focus ring on a clicked control, no layout change, no page scroll, both loops identical to 100 ms, zero console errors

- Milestone 01 fix with play: done (82ff1a2e)

## Attention

- F45-5 not fully fixed: at 1280x720 the band is the 650 px table plus the 232 px step list under it (882 px, the sticky nav takes 60 px), so the list and the table are never on screen together. Fitting both needs fewer rows per page or a step list without its code lines and hint below 1440 px, a layout call D46 does not make. The page no longer scrolls by itself (fixed with F45-1).
- F45-8 partly: the stripe is the stock `--st-stripe` default (`ST_TableLayout.tsx:25`, `--muted` 25% in dark, 70% in light, documented in the Tint Tokens guide); the demo keeps the stock tint (D46, P8) and only closes the panel sooner (700 ms after the switch flips) so the stripes show for the whole hold.
- F45-9 library: the sort chip reads "⇅ Due ⌄" with no direction (`components/ui-radix/shadcn-table/components/toolbar/ST_SortPopover.tsx:108-124`, chip variant: SwapVert icon, label, chevron); the arrow shows in the Due header only. The chip renders only while a sort exists (`:105`), so the Sorting step starts from the toolbar Sort button, and the editor (Due / Ascending) swaps in place in that popover.
- Library (D37, outside the demo): `hooks/useST_ColumnFlip.ts:312-329` slides every cell with no stacking order, so in any table the moved column passes under the cells after it in the DOM; the demo lifts its moved column with `stTableHeadCellProps` / `stTableBodyCellProps` (`z-1`). A library fix would raise the moved column during the slide in all three bases.

## Notes

- F45-1: `land()` closed popovers by re-clicking the trigger; Radix returned focus to it (tooltip on focus, keyboard ring since the replay's clicks carry no pointer). Fix: close through an outside pointerdown plus click (Radix 1.2 defers the dismiss to the click), and while the replay plays, blur non-text focus inside the table or a popover one frame after it lands, unless a visitor's pointer or key came within 300 ms or the control is an expanded select trigger (blurring that closes the select and the popover).
- F45-2: the flip animates `translate` on every cell at the same `z-0`, so the moved column slid under the later cells. Fix: `z-1` on the moved column's cells through the table's cell props.
- F45-3: the container was `max-h-[30rem]`, so six search rows shrank it 152 px. Fix: `h-[32.5rem]`, the 40 px header plus ten 48 px rows.
- F45-4: the status wrapped on purpose (`v12.css` rule) in the 240 px aside, one to three lines per feature. Fix: "Now showing:" and the feature on two fixed lines (`h-8`) in the aside, one line under the table; the wrap rule is gone.
- F45-5: the page scroll came from the trigger refocus of F45-1 (fixed); the list placement at 1280x720 is under Attention.
- F45-6: ten rows (520 px) in a 480 px container. Fixed with F45-3.
- F45-7: the step cued and opened the toolbar filter icon. Fix: the "+ Filter" pill in the chips row (falls back to the icon when no pill renders).
- F45-8: stock stripe tint; see Attention.
- F45-9: library chip design; see Attention.
- F45-10: a beat set the editor value to empty between 4 and 1. Fix: the beat is gone, 16 types over 4 (first key 640 ms after the editor opens).
- Seen in the final watch, not changed: the "+ Filter" popover moves right with its pill when the chip label grows from "Status" to "Status: In Review" (the library's chips row, as for a visitor).
