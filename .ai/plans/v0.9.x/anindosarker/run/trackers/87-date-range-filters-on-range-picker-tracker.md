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

- Check: existing plays after the change, base, FilterChips, Filtering, mobile-date-pickers: 5 failed first (FilterChips `RangeEditorInputsFitAndFillDate`, `...DateTime`; Filtering `FilteringChangeModeEnabledFaceted`, `SubheaderRangeFieldsNarrow`; `mobile-date-pickers`), reworked to the one box, then pass; Customization, ServerData, ViewSettings and the time and number range cases pass unchanged
- Check: `pnpm test storybook-tests --base base` at the Task 5 tree: pass (646 passed)
- Check: `pnpm test storybook-tests --base radix`: first run failed with an unhandled `input.select is not a function` (`ST_TableHeadCellFilterLabel.tsx:179` selects `filterInputRefs` `-0`, which then pointed at the range trigger button); `-0` now holds only an input; rerun pass (646 passed)
- Check: `pnpm test storybook-tests --base aria`: pass (646 passed)
- Check: after captures, Storybook dev per base on 5341 + Playwright, 1280 and 390 wide: 30 files under `test/.out/spec87/after/`
- Check: capture pair subheader base 1280, `test/.out/spec87/before/subheader-base-1280.png` and `after/subheader-base-1280.png`: two date boxes, the mode button in Min, become one range box "Pick a date" with the mode button, the caption below unchanged (D183); at 390 the 180 px column clips the box as it clipped the two (contain-inline-size)
- Check: capture pair subheader base 390, `test/.out/spec87/before/subheader-base-390.png` and `after/subheader-base-390.png`: two date boxes, the mode button in Min, become one range box "Pick a date" with the mode button, the caption below unchanged (D183); at 390 the 180 px column clips the box as it clipped the two (contain-inline-size)
- Check: capture pair subheader radix 1280, `test/.out/spec87/before/subheader-radix-1280.png` and `after/subheader-radix-1280.png`: two date boxes, the mode button in Min, become one range box "Pick a date" with the mode button, the caption below unchanged (D183); at 390 the 180 px column clips the box as it clipped the two (contain-inline-size)
- Check: capture pair subheader radix 390, `test/.out/spec87/before/subheader-radix-390.png` and `after/subheader-radix-390.png`: two date boxes, the mode button in Min, become one range box "Pick a date" with the mode button, the caption below unchanged (D183); at 390 the 180 px column clips the box as it clipped the two (contain-inline-size)
- Check: capture pair subheader aria 1280, `test/.out/spec87/before/subheader-aria-1280.png` and `after/subheader-aria-1280.png`: two date boxes, the mode button in Min, become one range box "Pick a date" with the mode button, the caption below unchanged (D183); at 390 the 180 px column clips the box as it clipped the two (contain-inline-size)
- Check: capture pair subheader aria 390, `test/.out/spec87/before/subheader-aria-390.png` and `after/subheader-aria-390.png`: two date boxes, the mode button in Min, become one range box "Pick a date" with the mode button, the caption below unchanged (D183); at 390 the 180 px column clips the box as it clipped the two (contain-inline-size)
- Check: capture pair chips-editor base 1280, `test/.out/spec87/before/chips-editor-base-1280.png` and `after/chips-editor-base-1280.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair chips-editor base 390, `test/.out/spec87/before/chips-editor-base-390.png` and `after/chips-editor-base-390.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair chips-editor radix 1280, `test/.out/spec87/before/chips-editor-radix-1280.png` and `after/chips-editor-radix-1280.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair chips-editor radix 390, `test/.out/spec87/before/chips-editor-radix-390.png` and `after/chips-editor-radix-390.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair chips-editor aria 1280, `test/.out/spec87/before/chips-editor-aria-1280.png` and `after/chips-editor-aria-1280.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair chips-editor aria 390, `test/.out/spec87/before/chips-editor-aria-390.png` and `after/chips-editor-aria-390.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair header-editor base 1280, `test/.out/spec87/before/header-editor-base-1280.png` and `after/header-editor-base-1280.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair header-editor base 390, `test/.out/spec87/before/header-editor-base-390.png` and `after/header-editor-base-390.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair header-editor radix 1280, `test/.out/spec87/before/header-editor-radix-1280.png` and `after/header-editor-radix-1280.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair header-editor radix 390, `test/.out/spec87/before/header-editor-radix-390.png` and `after/header-editor-radix-390.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair header-editor aria 1280, `test/.out/spec87/before/header-editor-aria-1280.png` and `after/header-editor-aria-1280.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair header-editor aria 390, `test/.out/spec87/before/header-editor-aria-390.png` and `after/header-editor-aria-390.png`: two date boxes become one range box; editor width 308 unchanged (D183)
- Check: capture pair popover base 1280, `test/.out/spec87/before/popover-base-1280.png` and `after/popover-base-1280.png`: two date boxes become one range box; the popover narrows from about 410 to 308 (the one box keeps the 288 minimum of the two) (D183)
- Check: capture pair popover base 390, `test/.out/spec87/before/popover-base-390.png` and `after/popover-base-390.png`: two date boxes become one range box; the popover narrows from about 410 to 308 (the one box keeps the 288 minimum of the two) (D183)
- Check: capture pair popover radix 1280, `test/.out/spec87/before/popover-radix-1280.png` and `after/popover-radix-1280.png`: two date boxes become one range box; the popover narrows from about 410 to 308 (the one box keeps the 288 minimum of the two) (D183)
- Check: capture pair popover radix 390, `test/.out/spec87/before/popover-radix-390.png` and `after/popover-radix-390.png`: two date boxes become one range box; the popover narrows from about 410 to 308 (the one box keeps the 288 minimum of the two) (D183)
- Check: capture pair popover aria 1280, `test/.out/spec87/before/popover-aria-1280.png` and `after/popover-aria-1280.png`: two date boxes become one range box; the popover narrows from about 410 to 308 (the one box keeps the 288 minimum of the two) (D183)
- Check: capture pair popover aria 390, `test/.out/spec87/before/popover-aria-390.png` and `after/popover-aria-390.png`: two date boxes become one range box; the popover narrows from about 410 to 308 (the one box keeps the 288 minimum of the two) (D183)
- Check: capture pair advanced-start-date base 1280, `test/.out/spec87/before/advanced-start-date-base-1280.png` and `after/advanced-start-date-base-1280.png`: the box takes `min-w-[250px]` and the calendar button now lies inside its border; before, the inner group was 250 and the button sat on the border (D184); editor width 260 unchanged
- Check: capture pair advanced-start-date base 390, `test/.out/spec87/before/advanced-start-date-base-390.png` and `after/advanced-start-date-base-390.png`: the box takes `min-w-[250px]` and the calendar button now lies inside its border; before, the inner group was 250 and the button sat on the border (D184); editor width 260 unchanged
- Check: capture pair advanced-start-date radix 1280, `test/.out/spec87/before/advanced-start-date-radix-1280.png` and `after/advanced-start-date-radix-1280.png`: the box takes `min-w-[250px]` and the calendar button now lies inside its border; before, the inner group was 250 and the button sat on the border (D184); editor width 260 unchanged
- Check: capture pair advanced-start-date radix 390, `test/.out/spec87/before/advanced-start-date-radix-390.png` and `after/advanced-start-date-radix-390.png`: the box takes `min-w-[250px]` and the calendar button now lies inside its border; before, the inner group was 250 and the button sat on the border (D184); editor width 260 unchanged
- Check: capture pair advanced-start-date aria 1280, `test/.out/spec87/before/advanced-start-date-aria-1280.png` and `after/advanced-start-date-aria-1280.png`: the box takes `min-w-[250px]` and the calendar button now lies inside its border; before, the inner group was 250 and the button sat on the border (D184); editor width 260 unchanged
- Check: capture pair advanced-start-date aria 390, `test/.out/spec87/before/advanced-start-date-aria-390.png` and `after/advanced-start-date-aria-390.png`: the box takes `min-w-[250px]` and the calendar button now lies inside its border; before, the inner group was 250 and the button sat on the border (D184); editor width 260 unchanged
- Check: a difference a user would notice that no decision covers: none found; every pair above is D183 or D184. Extra views `after/extra-*` (time range in the subheader, a filled range box, its open popup) show the ends named Min and Max.
- Check: `pnpm test validate-repo` (Task 6 tree): first run failed `tailwind-classes` (21: `[&_[data-slot=...]]:` written as `**:data-[slot=...]:`), fixed; rerun pass (bases identical, date picker matches, icon maps complete, tailwind valid, registry valid, registry fresh, story pages match, story code complete, 52 unit tests)
- Check: `pnpm test lint` (Task 6 tree): first run failed (an unused and a misplaced `react-hooks/immutability` directive in the new ref callback); the callback now writes the refs from one place under the existing directive; rerun pass (9 warnings, all in the docs app, none in a changed file)
- Check: `node lib/story-pages.mjs` (apps/shadcn-table-docs): 8 new story pages, meta.json written; each page given its description, Try it steps and Related guides
- Check: `pnpm -w registry:build`, then `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`: run clean (177 table files each, components.json, global.css, package.json and lockfile kept)
- Check: `pnpm test typecheck --base base`, `--base radix`, `--base aria` (Task 6 tree): pass (tsc clean each)
- Check: `pnpm --filter shadcn-table-docs types:check` (Task 6 tree): pass
- Check: `grep -c '^#### Spec 87' CHANGELOG.md`: prints 1
- Check: `pnpm test docs-e2e --base base` at 050c643bc: fail, docs build (a new story page's description held an apostrophe that ended its YAML string); fixed at 0ccfad16d
- Check: `pnpm test docs-e2e --base base` at 0ccfad16d: fail, `/docs/examples/subheader-filters @1440`: "date filter input" (the check looked for a date input in the head, which the range box keeps in its popup) and "subheader filters not clipped Departure Time input-group: [185, 325] in 320" (the time range's end boxes did not shrink); fixed at a85a19134: the check looks for the Hire Date range box (`test/docs-e2e/lib/examples.mjs`, not an owned file, changed only for D183), the time range's ends take `min-w-0 flex-1`
- Check: `pnpm test installation-e2e --no-diff` at 050c643bc: pass (7 passed)
- Local CI at a85a19134 (each through heavy.sh, one base at a time):
- Check: `pnpm test typecheck --base base`: pass (tsc clean)
- Check: `pnpm test typecheck --base radix`: pass (tsc clean)
- Check: `pnpm test typecheck --base aria`: pass (tsc clean)
- Check: `pnpm test lint`: pass (9 warnings, docs app, none in a changed file)
- Check: `pnpm test validate-repo`: pass (bases identical, date picker matches, icon maps complete, tailwind valid, registry valid, registry fresh, story pages match, story code complete, 52 unit tests)
- Check: `pnpm --filter shadcn-table-docs types:check`: pass
- Check: `pnpm test storybook-tests --base base`: pass (646 passed)
- Check: `pnpm test storybook-tests --base radix`: pass (646 passed)
- Check: `pnpm test storybook-tests --base aria`: pass (646 passed)
- Check: `pnpm test docs-e2e --base base`: pass (5 sections, 117 pages)
- Check: `pnpm test docs-e2e --base radix`: pass (5 sections, 117 pages)
- Check: `pnpm test docs-e2e --base aria`: pass (5 sections, 117 pages)
- Check: `pnpm test installation-e2e --no-diff`: pass (7 passed; nextjs-base, -radix, -aria built, browser pass)

Site map (task 2). Lines are base; radix the same to :529, then select :729, chips :773, caption :829; aria +37 to +50 (args :154, placeholder :229, key :355, date className :644, combobox ref :730, select :801, chips :846, caption :913):
- :95-100 `rangeFilterIndex` prop: stays; a date-like range without index stands for the pair.
- :126 args for the consumer's props functions: the pair calls them once with `rangeFilterIndex: 0`.
- :186-196 placeholder Min / Max by index: the pair takes "Filter by {column}"; the ends are named Min and Max through the picker's `labels`.
- :203 mode button on index 0 only: the pair is index-less, so it shows the button.
- :213-219 initial value of one end: the pair reads the whole pair.
- :237-243 commit of one end: the pair commits both ends, an empty end as `undefined` as today.
- :318 `filterInputRefs` key: the pair writes `-0` and `-1` from the inputs in the box; a date or date-time range has none there (its end inputs are in the popup), so both keys are empty (the trigger fallback was dropped after the radix `select()` failure below; Attention).
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
- `filterInputRefs`: a time range keeps its end inputs in the box and `-0`, `-1` point at them; a date and a date-time range keep their end inputs in the popup, so the box has no input and `-0` and `-1` are empty: an editor's initial focus falls back to its own first control (the editor's top line in the chips and header editors), the header filter button's focus is a no-op, and code that calls `select()` on `-0` keeps working. Spec 1.6.2 asks the keys to keep pointing at the end inputs: under Attention.
- Typed ends in the popup: a change while one of the picker's end inputs has focus is typed and waits for Enter or for that input to lose focus (D88 per end); a day picked in the popup applies at once.
- A time range is the picker's `TimeRangePicker`: one picker, a box per end side by side inside the filter box, each with its own clear button; the picker has no single clear control for a time range.
- `ST_HeaderFilterEditor.tsx`: the wider editor (`w-77`) stays, the one range box needs it (`min-w-72`, the width of the two boxes); its doc comment now says so.
- `test/docs-e2e/lib/examples.mjs` is not an owned file: its subheader-filters check looked for a date input in the head; it now looks for the Hire Date range box. Nothing else in it changed.
- `stories/miscellaneous/mobile-date-pickers.stories.tsx` is not an owned file: its play counted the date and date-time inputs of the two ranges in the head, which now sit in the popup; only its counts and comment changed.
- React Aria's range popover is found by `[role="dialog"][aria-label]`, not by `findByRole`: testing-library does not see it in the accessibility tree there.

- Task 1 One end only, proven in the picker: done (e4ac17c7f)
- Task 2 The site map and the before captures: done (c39a08cf1)
- Task 3 The width class on the outer box: done (5eabc84a1)
- Task 4 The range picker in the box: done (e823f404d)
- Task 5 The existing plays and the look: done (62dc3074a)
- Task 6 Docs texts, docs copies, the changelog: done (050c643bc, 0ccfad16d, a85a19134)

Review round 1 (fixer):
- Major, mode swap untested: new plays `ModeSwapsSingleAndRangeInChipsEditor`, `ModeSwapsSingleAndRangeInSubheader` open the mode menu: Less Than (single box) to Between (one range box), Between to Between Inclusive (the pair kept), back to Less Than (single box). The subheader menu drops the value between a single and a range mode (`ST_FilterOptionMenu.tsx:278-293`); the chips mode picker keeps the value on every change (`filterSummary.utils.ts:86-101` `setFilterMode`), so in chips a Between pair switched to Less Than leaves the array under `lessThan` and the table shows "No results found". That is the chips picker of 0.9.8, unchanged here (the two-box range kept the pair the same way); the chips play asserts only the swap at that step.
- Minor, blur commit untested: new play `RangeTypedEndAppliesOnBlur` (Min typed, focus moved to Max, filter applies without Enter).
- Minor, Escape in an end input: reproduced. New play `RangeEscapeAppliesOrderedEnds` (Max 11 Nov, Min 12 Dec, Escape) failed at 1d641b4b3 on base: `expected [ 'No results found' ] to deeply equal [ 'Eve' ]`: the picker's `onClose` reorder (`picker: modes/day-range-picker.tsx` `onClose={() => onChange(orderRange(value, times))}`) arrived while the Min input still had focus and was held as typed. Fix at the cause in `handleDateChange`: typing changes one end (`picker: utils/range.ts:31-33` putEnd), so a change of both ends is the picker's own and applies at once; three bases.
- Minor, weakened checks: `mobile-date-pickers` now opens the Hire Date and Arrival time range popups and expects two `date` and two `datetime-local` inputs in each; `test/docs-e2e/lib/examples.mjs` opens the Hire Date box and expects two `date` inputs in its popup.
- Minor, `undefined` in `filterInputRefs`: not changed. The single box wrote `null` before through the same cast; every reader uses `?.` or `??` (`ST_TableHeadCellFilterLabel.tsx:125-132`, the editors' `initialFocus`), so no behaviour differs.
- Minor, `grid-cols-1` through `cn` in `ST_FilterRangeFields.tsx:52-56`: not changed. tailwind-merge resolves it as written and `docs/code-of-conduct/coding-standards.md` has no rule that a conditional class be a cva variant; a variant would be a refactor with no reader (spec 1.6.2 last bullet).
- Minor, generated files: no action (tool output, checked by the reviewer).
- Majors, focus-on-open of a date range and the time range shape: real choices, under Attention.
- Tracker site map :318 and the `filterInputRefs` note corrected: both keys are empty for a date and a date-time range; focus falls to the editor's top line.
- Check: `ST_BASE=base vitest run stories/features/DateFilters.stories.tsx -t "Range Escape|Mode Swaps|Range Typed End"` at 1d641b4b3 (fix not applied): fail as meant (Range Escape Applies Ordered Ends; the other three pass)
- Check: `ST_BASE=base|radix|aria vitest run stories/features/DateFilters.stories.tsx` after the fix: pass (37 passed each)
- Check: `ST_BASE=base|radix|aria vitest run stories/miscellaneous/mobile-date-pickers.stories.tsx`: pass (1 passed each)
- Check: `node lib/story-pages.mjs`: 4 new story pages, descriptions and Try it steps filled
- Check: `pnpm -w registry:build`, `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`: clean (177 table files each)
- Check: `pnpm test typecheck --base base`, `--base radix`, `--base aria` at 5616f5c46: pass (tsc clean each)
- Check: `pnpm test lint` at 5616f5c46: pass (9 warnings, docs app, none in a changed file)
- Check: `pnpm test validate-repo` at 5616f5c46: pass
- Check: `pnpm --filter shadcn-table-docs types:check` at 5616f5c46: pass
- Check: `pnpm test storybook-tests --base base` at 5616f5c46: pass (650 passed)
- Check: `pnpm test storybook-tests --base radix` at 5616f5c46: pass (650 passed)
- Check: `pnpm test storybook-tests --base aria` at 5616f5c46: first run 1 failed (PanelCollapse "Progress And Banner Collapse", known flake P5), rerun pass (650 passed)
- Check: `pnpm test docs-e2e --base base` at 5616f5c46: first run failed on `page.goto` timeout of `/docs/examples/column-pinning` under load (not a changed page), rerun pass (5 sections, 117 pages)
- Check: `pnpm test docs-e2e --base radix` at 5616f5c46: pass (5 sections, 117 pages; the subheader-filters check now opens the Hire Date popup)
- Check: `pnpm test docs-e2e --base aria` at 5616f5c46: pass (5 sections, 117 pages)
- Review round 1: 3 majors, 6 minors, fixed at 5616f5c46 (mode swap plays, blur and Escape plays, the reorder-on-close fix, the two checks restored); 2 majors under Attention; 2 minors answered without change

D189 and D190 (lead, 2026-11-24; merged origin/claude/review 56e44b055 first, plan files only):
- Check: D190 reproduced on the branch at 4e9e737f2: `ST_BASE=base vitest run stories/features/DateFilters.stories.tsx -t "Chips Mode Change"` (chips, Between pair 10 Oct to 11 Nov, mode to Less Than): fail as meant, `expected [ 'No results found' ] to have a length of 6`
- Check: D190 reproduced on origin/claude/review 56e44b055 (its `packages/shadcn-table/registry` checked out over the branch for the run, restored after; the two-box range there): same play, same failure
- Check: D189 plays before the fix, base, `ST_BASE=base vitest run stories/features/DateFilters.stories.tsx -t "Takes Focus"` at 4e9e737f2 + plays: fail as meant (4 failed: `RangeBoxTakesFocusInChipsEditor` and `RangeBoxTakesFocusInHeaderEditor` focus the editor's top-line button, `RangeBoxTakesFocusFromFilterPicker` the popup, `RangeBoxTakesFocusFromSubheaderButton` keeps it on the header's filter button)
- D189 fix: the trigger of a date or date-time range box is kept per table in `shared/utils/utils.ts` (a WeakMap keyed by `table.refs.filterInputRefs`, written from the box's ref callback in `ST_FilterTextField.tsx`); `getFilterFocusTarget` gives `<column id>-0`, else that trigger. The readers use it: `ST_HeaderFilterEditor` (base `initialFocus`, radix `onOpenAutoFocus`, aria mount ref), `ST_FilterChips`, `ST_TableHeadCellFilterLabel` (subheader button; `select()` only on an input), `ST_ColumnActionMenu`. `filterInputRefs`, its type, every exported type, `index.ts` and the picker are unchanged; the popover filter's focus is unchanged. Single date boxes, number ranges and time ranges hold an input in `-0` and focus as before.
- D190 fix: `filterSummary.utils.ts` `setFilterMode` mirrors the header mode menu's rule (`ST_FilterOptionMenu.tsx` mode select) on a change between a range mode and a single mode: to a range mode an empty pair unless the pair is already empty, to a list mode (multi-select or arr modes) an empty list, to a single mode `''` when the value is a pair. Empty modes keep their rule. The existing `ModeSwapsSingleAndRangeInChipsEditor` now expects every row after Less Than, as the subheader case did.
- Check: `ST_BASE=base|radix|aria vitest run stories/features/DateFilters.stories.tsx` after the fix: pass (42 passed each; the five new plays and both mode-swap plays)
- Check: `pnpm -w registry:build`, `node lib/story-pages.mjs` (5 new pages, descriptions and Try it steps filled), `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`: clean (177 table files each)
- Check: `grep -c '^#### Spec 87' CHANGELOG.md`: prints 1; two lines added (D189, D190)
- Task D189 and D190: done (60f08d1b4)
- Local CI at 60f08d1b4 (each through heavy.sh, one base at a time):
- Check: `pnpm test typecheck --base base`: pass (tsc clean)
- Check: `pnpm test typecheck --base radix`: pass (tsc clean)
- Check: `pnpm test typecheck --base aria`: pass (tsc clean)
- Check: `pnpm test lint`: pass (9 warnings, docs app, none in a changed file)
- Check: `pnpm test validate-repo`: pass (bases identical, date picker matches, icon maps complete, tailwind valid, registry valid, registry fresh, story pages match, story code complete, 52 unit tests)
- Check: `pnpm --filter shadcn-table-docs types:check`: pass
- Check: `pnpm test storybook-tests --base base`: pass (655 passed)
- Check: `pnpm test storybook-tests --base radix`: pass (655 passed)
- Check: `pnpm test storybook-tests --base aria`: pass (655 passed)
- Check: `pnpm test docs-e2e --base base`: pass (5 sections, 117 pages)
- Check: `pnpm test docs-e2e --base radix`: pass (5 sections, 117 pages)
- Check: `pnpm test docs-e2e --base aria`: pass (5 sections, 117 pages)
- Check: `pnpm test installation-e2e --no-diff`: pass (7 passed; nextjs-base, -radix, -aria built, browser pass)
- Spec 87 waits on Q184 (time range look, with the owner) before the merge; nothing of the time range changed here.

Verify D189 and D190 (verifier, 2026-11-24; merged origin/claude/review 910c72b54 first, plan files only):
- Check: `git diff --name-only origin/claude/review...HEAD`: owned files, the tracker, `CHANGELOG.md`, generated files (`apps/shadcn-table-docs/components/ui-<base>/` by `pnpm --filter shadcn-table-docs lib:install <base>`, `content/docs/examples/more/*.mdx` and `meta.json` by `node lib/story-pages.mjs`, owned folder); extras each needed: `ST_TableHeadCellFilterLabel.tsx`, `ST_ColumnActionMenu.tsx`, base `ST_FilterChips.tsx` (D189 readers), `shared/utils/utils.ts` (D189 trigger lookup, not exported by `index.ts`), `filterSummary.utils.ts` (D190 names it), `mobile-date-pickers.stories.tsx` and `test/docs-e2e/lib/examples.mjs` (their date range checks counted two thead date boxes): pass
- Check: `git diff --name-only 60f08d1b4..HEAD` touches only `.ai/`: the D189, D190 and Local CI lines at 60f08d1b4 stand
- Check: `git diff --stat origin/claude/review...HEAD -- ':(glob)packages/shadcn-table/registry/*/components/date-picker/**' ':(glob)packages/shadcn-table/registry/*/components/ui/*.tsx' tools package.json pnpm-lock.yaml`: prints nothing
- Check: `git diff origin/claude/review...HEAD -- '.../types.ts' '.../index.ts' | grep '^-export'`: prints nothing; `ST_FilterOptionMenu.tsx`, `column.utils.ts`, `Customization`, `ServerData`, `ViewSettings` stories unchanged; `DATE_PICKER_TAG` stays `v0.1.1`
- Check: D190 `setFilterMode` gives the result of the header mode menu rule (`ST_FilterOptionMenu.tsx` handleSelectFilterMode) on a range and single change: read, same
- Check: `ST_BASE=base|radix|aria vitest run stories/features/DateFilters.stories.tsx` through heavy.sh at 60f08d1b4 code: pass (42 passed each; the four `RangeBoxTakesFocus*` plays, `ChipsModeChangeResetsRangeValue`, both mode-swap plays)
- Check: `grep -c '^#### Spec 87' CHANGELOG.md`: prints 1; 30 before and 34 after captures under `test/.out/spec87/`
- Check: `lsof -iTCP:5340-5360 -sTCP:LISTEN`: nothing; `git status --short`: clean before this commit

## Attention

- A time filter in a range shows two time boxes, each with its own clock popup and its own clear button, laid side by side by the table; spec 87 1.2 and 1.6.2 describe one box, one popup and one clear for both ends.
  - The picker's time range is `TimeRangePicker` (`picker: modes/time-range-picker.tsx:33-58`): a `FieldGroup` with one `TimeField` per end, no trigger and no clear-both. The table cannot give it one popup or one clear without changing the picker.
  - The table restyles it from outside (`ST_FilterTextField.tsx` `timeRangeClassName`: one row, end labels screen-reader only, a border between the ends, each end `min-w-0 flex-1`); that look is neither the picker's range demo nor a decision.
  - Captures: `test/.out/spec87/after/extra-time-range-box-in-subheader-base.png` (after); no before capture of a time range was taken (the 30 before captures are date ranges); 0.9.8 showed two single time boxes, Min and Max. Play: `TimeRangeBoxInSubheader` (clears with Clear Min, then Clear Max).
  - Options: (1, recommended) keep the picker's time range with the table's one-row look and record that look and the per-end clear as D183's time-range shape. (2) Show the picker's time range in its own look (labels Min and Max visible, ends stacked), no table restyle. (3) Ask the picker for a one-box time range (the owner's, D176, D177).
- Runner, 2026-11-24: Q184 settled by D192 (the time range as built stays: two time inputs in one row in one border, each its own popup); Q183 by D189, Q185 by D190. The lead lifted the hold (RESUME 87); the review is closed. The branch Storybook (base) is served on port 5352 from this worktree for the owner's look until the lead says stop.
