# 41: Range filter editors fit and accept input, tracker

Status: running
Branch `v0.9/filter-editor-fixes`, worktree 03 (milestone Filter editor fixes: specs 41, 42, 43, 44, 45)
Checks:
- Check: P11 before the change, `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Range Editor Inputs Fit And Fill"` at 4a7d9d23: fail as required on base, radix and aria, identical line: `Max 905..1043 in editor 746..1006: expected 1043 to be less than or equal to 1007` for Time, Date and Date Time; Number passes (its fields keep `min-w-18`)
- Check: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx` (the four `RangeEditorInputsFitAndFill` cases and `ChipEditorKeepsWidth` among them) after Task 2: pass, 20 of 20 on base, radix and aria
- Check: `pnpm test typecheck --base base`, `--base radix`, `--base aria` after Task 2: pass
- Screenshots after the change, time range editor (308 px, both fields inside): `41-shots/after-base-time-range-editor.png`, `41-shots/after-radix-time-range-editor.png`, `41-shots/after-aria-time-range-editor.png`
- Check (spec 42): `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx` (`MultiSelectOpensOnClick`, `MultiSelectArrayModes` and `ChipEditorKeepsWidth` without the ArrowDown fallback) after Task 3: pass, 21 of 21 on base, radix and aria; `pnpm test typecheck --base aria`: pass
- Check (spec 43): `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx` (`EscapeClosesEditorAfterSelectPick`, `ClearFiltersClickableWithEditorOpen`, `RemoveAndClear`, `SelectClearBesideChevron` among them) after Task 4: pass, 23 of 23 on base, radix and aria; `pnpm test typecheck --base base`, `--base aria`: pass
- Check (spec 44): `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx` (`SelectChevronAtInputEnd`, `SelectClearBesideChevron` among them) after Task 5: pass, 24 of 24 on base, radix and aria; `pnpm test typecheck --base aria`: pass

## Record 1.6.3 (code before the change, chip editor from the toolbar picker, headless Chromium, locale dd/mm/yyyy and 24 h clock, real key presses)

- Width: editor 746..1006 (260 px), Min 757..895, Max 905..1043 on the three bases for time, date and datetime ranges: the Max field and its picker icon run 37 px past the editor's right edge, which clips them.
- Time range, base, radix and aria identical. Min: keys `1`,`0`,`0`,`0` show `""` each, `A` shows `10:00`; `columnFilters` stays `[]` while typing. Clicking Max (blur of Min) commits `[{"id":"when","value":["10:00",""]}]`. Max: `""` per key, `10:00` after `A`, `columnFilters` unchanged; blur commits `["10:00","10:00"]`, 1 row.
- Date range, focus on the field (first segment), base, radix and aria identical: `0`,`3`,`0`,`3` show `""`, then `2`,`0`,`2`,`5` show `0002-03-03`, `0020-03-03`, `0202-03-03`, `2025-03-03`; `columnFilters` stays `[]` until the blur commits `["2025-03-03",""]`; Max the same; blur commits both, 1 row. Same with a `date` column in `betweenInclusive` mode.
- Date range, real mouse click at the field's centre: the click puts the caret on the year segment (`dd/mm/0003` after `0`,`3`,`0`,`3`), so the digits fill only the year, no `input` event fires, the value stays `""` and the blur commits `[null,""]`. Native Chromium behaviour, not library code.
- Cause: the input works after spec 39 on the three bases (typed date-like values held until Enter or blur, no commit per key); the failure the owner saw in 0.9.3 was the per-key commit spec 39 removed, and the clipped Max field. No input code changes (1.6.3).
- Milestone 40 finding (digit typing clears the date field and commits null): not reproduced from the first segment; reproduced only by typing from the segment a click lands on (year), where Chromium keeps the value empty until every segment is filled and the blur commits null for that bound. The fix of this milestone does not change that (native segment editing); `RangeEditorInputsFitAndFillDate` and `...DateTime` cover date and datetime digit typing from the first segment.

- Task 1 play and record: done (4ebf2742)
- Task 2 width (`filterEditorClassName(column)`, 308 px for a date-like range, 260 px otherwise) and input (no change, see record): done (052deb67)
- Task 3 spec 42, React Aria multi-select opens on click, docs E2E fallback removed: done (95ec9676)
- Task 4 spec 43, Escape closes the editor after a select pick, Clear filters clickable on React Aria: done (0f0f9f54)
- Task 5 spec 44, React Aria select chevron at the input's end: done

## Attention

- Spec 42 1.6.2 names `menuTrigger="focus"`; it also opens the React Aria list when the chip editor focuses the input on open, which hides the editor's other controls and breaks `MultiSelectArrayModes`, so the fix opens the list on a click through the ComboBox state (`ComboBoxStateContext`) instead; revert to `menuTrigger="focus"` if the owner prefers the list open on editor open.
- Spec 43: the React Aria chip editor is now non-modal (`isNonModal`), so a click on a blank, non-focusable part of the page no longer closes it (React Aria closes a non-modal popover on blur to a focusable element, on scroll, on Escape or on its trigger); a click on a control, a table cell or Clear filters closes it as on Base UI and Radix.
- `stories/features/Filtering.stories.tsx:363` and `stories/fixed-bugs/MultiSelectFilter.stories.tsx:53` still carry the ArrowDown fallback for the React Aria multi-select ("opens from the keyboard, not on a click"); harmless now (the list is open after the click), outside this milestone's files.

