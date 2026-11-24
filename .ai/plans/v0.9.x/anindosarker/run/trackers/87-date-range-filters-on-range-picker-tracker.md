# 87: Date range filters on the range picker, tracker

Status: running
Branch `v0.9/date-range-filters-on-range-picker`, worktree 06
Checks:
- Check: proof play date, base, `ST_BASE=base vitest run stories/miscellaneous/RangePickerOneEnd.stories.tsx` (Date Start Only Then End Only) at 803ad5680 + story: pass
- Check: proof play datetime, base, same run (Date Time Start Only Then End Only) at 803ad5680 + story: pass
- Check: proof play time, base, same run (Time Start Only Then End Only) at 803ad5680 + story: pass
- Check: proof play date, radix, `ST_BASE=radix vitest run stories/miscellaneous/RangePickerOneEnd.stories.tsx` at 803ad5680 + story: pass
- Check: proof play datetime, radix, same run at 803ad5680 + story: pass
- Check: proof play time, radix, same run at 803ad5680 + story: pass
- Check: proof play date, aria, `ST_BASE=aria vitest run stories/miscellaneous/RangePickerOneEnd.stories.tsx` at 803ad5680 + story: pass
- Check: proof play datetime, aria, same run at 803ad5680 + story: pass
- Check: proof play time, aria, same run at 803ad5680 + story: pass

- Check: D183 and D184 plays fail on shipped code, base, `ST_BASE=base vitest run stories/features/DateFilters.stories.tsx` at 803ad5680 + plays: fail as meant (8 failed, 25 passed: no range box "Filter by Joined"; time ends in two groups; popover shows Min; button 258..282 in box 34..274)
- Check: same, radix, `ST_BASE=radix vitest run stories/features/DateFilters.stories.tsx` at 803ad5680 + plays: fail as meant (8 failed, 25 passed, same reasons)
- Check: same, aria, `ST_BASE=aria vitest run stories/features/DateFilters.stories.tsx` at 803ad5680 + plays: fail as meant (8 failed, 25 passed, same reasons)
- Check: existing plays before any edit, base, `ST_BASE=base vitest run` FilterChips, Filtering, Customization, ServerData, ViewSettings, mobile-date-pickers at 803ad5680: pass (72 passed)
- Check: before captures, Storybook dev per base on 5341 + Playwright, 1280 and 390 wide, at 803ad5680 + plays: 30 files under `test/.out/spec87/before/` (subheader, chips-editor, header-editor, popover, advanced-start-date; base, radix, aria)
- Check: D184 play `WidthClassKeepsCalendarButtonInside`, base, `ST_BASE=base vitest run stories/features/DateFilters.stories.tsx -t "Width Class"` after the D184 change on c39a08cf1: pass (failed on shipped code: button 258..282 in box 34..274)
- Check: same, radix, `ST_BASE=radix vitest run ... -t "Width Class"`: pass (failed on shipped code, same numbers)
- Check: same, aria, `ST_BASE=aria vitest run ... -t "Width Class"`: pass (failed on shipped code, same numbers)
- Check: `pnpm test typecheck --base base` after the D184 change: pass (tsc clean)
- Check: `pnpm test typecheck --base radix` after the D184 change: pass (tsc clean; the first run failed on the proof story's types, which was then deleted as 1.6.1 says)
- Check: `pnpm test typecheck --base aria` after the D184 change: pass (tsc clean)
- Check: D183 plays (`RangeBoxInChipsEditor`, `BetweenOnDateInChipsEditor`, `RangeBoxInSubheader`, `BetweenOnDateInSubheader`, `DateTimeRangeBoxInSubheader`, `TimeRangeBoxInSubheader`, `RangeBoxInPopoverFilter`) and the reworked `RangeMinPickedMaxTyped`, base, `ST_BASE=base vitest run stories/features/DateFilters.stories.tsx` after the D183 change on 5eabc84a1: pass (33 passed; the seven failed on shipped code, lines above)
- Check: same, radix: pass (33 passed)
- Check: same, aria: pass (33 passed)
- Check: `pnpm test typecheck --base base` after the D183 change: pass (tsc clean)
- Check: `pnpm test typecheck --base radix` after the D183 change: pass (tsc clean)
- Check: `pnpm test typecheck --base aria` after the D183 change: pass (tsc clean)
- Check: `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/date-picker' 'packages/shadcn-table/registry/*/components/ui/*.tsx' tools package.json pnpm-lock.yaml`: prints the six owned `components/ui/shadcn-table/components/inputs/*` files, because a git pathspec `*` also matches `/`; with `:(glob)` (`registry/*/components/date-picker/**`, `registry/*/components/ui/*.tsx`) it prints nothing: pass (no picker file, no ui part, no tools, package or lockfile change)
- Check: `git diff origin/claude/review -- '.../types.ts' '.../index.ts' | grep '^-export'`: prints nothing: pass
- Check: `pnpm -w registry:build` after the D183 change: pass (no tracked file changed)

Site map (task 2). Lines are base; radix the same to :529, then select :729, chips :773, caption :829; aria +37 to +50 (args :154, placeholder :229, key :355, date className :644, combobox ref :730, select :801, chips :846, caption :913):
- :95-100 `rangeFilterIndex` prop: stays; a date-like range without index stands for the pair.
- :126 args for the consumer's props functions: the pair calls them once with `rangeFilterIndex: 0`.
- :186-196 placeholder Min / Max by index: the pair takes "Filter by {column}"; the ends are named Min and Max through the picker's `labels`.
- :203 mode button on index 0 only: the pair is index-less, so it shows the button.
- :213-219 initial value of one end: the pair reads the whole pair.
- :237-243 commit of one end: the pair commits both ends, an empty end as `undefined` as today.
- :318 `filterInputRefs` key: the pair writes `-0` and `-1` from the inputs in the box, `-0` falling back to the trigger button.
- :373-379 clear of one end: not reached by a date box (no clear adornment); unchanged.
- :428-431 read-back of one end: the pair reads both ends.
- :439 `columnDef.Filter` gets the index: unchanged; a custom Filter keeps the two fields (ST_FilterRangeFields).
- :529 `textFieldProps.className` on the inner input: moves to the outer box (D184).
- :594 `dateBoxProps.className` on the picker's group: moves to the outer box (D184).
- :702-703 autocomplete: `commonTextFieldProps.className` loses the consumer class with :529; `autocompleteProps.className` stays.
- :745 select trigger and :789 combobox chips `textFieldProps.className`: move to the outer box (D184).
- :845 the field's own mode caption when index-less: not for the pair, whose caption is ST_FilterRangeFields'.
- Stories driving two date boxes: DateFilters `RangeMinPickedMaxTyped` (Min picked, Max typed: reworked to the one box); FilterChips `RangeEditorInputsFitAndFillDate`, `...DateTime`, `...Time` (Min and Max inputs in the editor: reworked); Filtering `SubheaderRangeFieldsNarrow` (two date groups on one row: reworked to the one box), `FilteringChangeModeEnabledFaceted` (Birth Date range inside its cell: run, changed only if it fails); miscellaneous `mobile-date-pickers` (counts date inputs in the head: not an owned file, changed only if it fails, named here).
- Docs pages: `examples/more/features-date-filters--range-min-picked-max-typed.mdx`, `features-filter-chips--range-editor-inputs-fit-and-fill-{date,date-time,time}.mdx`, `features-filtering--subheader-range-fields-narrow.mdx` (Birth Date line), `guides/column-filtering.mdx:99-102`: reworded to the one box. Number range pages untouched.
- Docs E2E and installation E2E: no test drives a date range box (the Min and Max fills in `test/docs-e2e/lib/helpers.mjs:1055-1065` are number ranges).

Notes:
- Task 1: the picker's range mode hands one end alone to onChange for date, datetime and time on the three bases: a typed start gives `[start, '']`, a typed end with an empty start gives `['', end]` (`picker: utils/range.ts:31-33` putEnd). The proof story `stories/miscellaneous/RangePickerOneEnd.stories.tsx` is deleted before the merge (1.6.1).
- The proof story was deleted at 5eabc84a1 (its types broke the radix typecheck); its record is commit e4ac17c7f.
- The pair box: `ST_FilterRangeFields` renders one `ST_FilterTextField` without `rangeFilterIndex` for a date-like range with no `columnDef.Filter`; that field is the pair (`isDateRange`). A consumer that renders `ST_FilterTextField` with an index keeps the one-end box, so no prop or type was added (P7).
- Labels: the picker offers a label per end (`labels.from`, `labels.to`), so the ends are `localization.min` and `localization.max`; the trigger, its popup and its clear button take "Filter by {column}" (the clear button reads "Clear Filter by {column}"). The rest of the picker's range labels stay its own (placeholder "Pick a date", "Pick a date and time range").
- `filterInputRefs`: a date and a date-time range keep their end inputs in the popup, so `-0` points at the box's trigger button until the popup is open (focus on open lands on the box, as for the range slider); a time range keeps its end inputs in the box, `-0` and `-1` point at them.
- Typed ends in the popup: a change while one of the picker's end inputs has focus is typed and waits for Enter or for that input to lose focus (D88 per end); a day picked in the popup applies at once.
- A time range is the picker's `TimeRangePicker`: one picker, a box per end side by side inside the filter box, each with its own clear button; the picker has no single clear control for a time range.
- React Aria's range popover is found by `[role="dialog"][aria-label]`, not by `findByRole`: testing-library does not see it in the accessibility tree there.

- Task 1 One end only, proven in the picker: done (e4ac17c7f)
- Task 2 The site map and the before captures: done (c39a08cf1)
- Task 3 The width class on the outer box: done (5eabc84a1)
- Task 4 The range picker in the box: done (see next commit)
