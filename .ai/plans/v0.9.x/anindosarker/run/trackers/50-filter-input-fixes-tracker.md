# 50: Filter input fixes, tracker

Status: running
Branch `v0.9/filter-input-fixes`, worktree 04
Checks:
- Check: plays before the change (P11), `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 8c34979e, base, radix, aria: `ClearEmptyReturnsDateDefaultMode` fails "Expected element to have text content: Filter Mode: Equals / Received: JoinedFilter Mode: Fuzzy" on each base; the 13 existing plays pass
- Check: play before the caret change (P11), same command with the subheader `ClickCentreOfDateRangeInputTypesFullDate` against the `ST_FilterTextField.tsx` of fd7059b6 (claude/review plus the D93 line only), base, radix, aria: fails "expect(element).toHaveValue(2025-03-03) / Received: (empty)" on each base
- Check: `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx` at fd7059b6: `ClearEmptyReturnsDateDefaultMode` passes on the three bases
- Check: `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx stories/features/Filtering.stories.tsx stories/features/FilterChips.stories.tsx` at 9bfdf247: 76 passed on base, radix, aria (includes `TypeThenEnterAppliesAtOnce`, `HalfTypedYearAppliesNothing`, `RangeEditorInputsFitAndFillDate`)
- Check: typecheck, `pnpm test typecheck --base base|radix|aria` at fd7059b6: pass
- Check: typecheck, `pnpm test typecheck --base base|radix|aria` at 7adbfce1: pass
- Check: lint, `pnpm test lint` at 7adbfce1: pass (9 warnings, none in this milestone's files)
- Check: validate-repo, `pnpm test validate-repo` at 7adbfce1: pass
- Check: storybook-tests, `pnpm test storybook-tests --base base` at 7adbfce1: pass (653)
- Check: storybook-tests, `pnpm test storybook-tests --base radix` at 7adbfce1: pass (653)
- Check: storybook-tests, `pnpm test storybook-tests --base aria` at 7adbfce1: pass (653)
- Check: P7, `git diff origin/claude/review -- packages/shadcn-table/registry/*/components/ui/shadcn-table/index.ts | grep '^-export'` at 7adbfce1: prints nothing

Browsers (1.6.3), Playwright 1.64.1, plain page, date input 140 px wide, padding 6 px, en-US; the fix measured is the shipped one (mouse press on an unfocused field outside the picker button: preventDefault, then focus()):
- Chromium: a centre click puts the caret on the year (date and time; "03032025" typed leaves the value empty); the picker button covers 6 to 28 px from the inline end. focus() starts at the first segment. Fix applied: the centre click types the full date; the picker button still opens the picker (`:open`).
- Firefox: a centre click on a 140 px field lands past the first segment (typed date empty); on a 72 px field it already lands on the first. focus() starts at the first segment. Fix applied: full date typed; the calendar button (about 14 px from the end) still opens the picker; time inputs have no picker button.
- WebKit (Safari engine): a centre click does not land on the first segment; focus() does (checked with arrow keys, since Playwright's typed digits fill WebKit date segments unreliably). A click anywhere on a date or datetime field opens WebKit's picker; it still opens with the fix. Fix applied.

- Task 1 Plays first: done (8c34979e)
- Task 2 Mode reset: done (fd7059b6)
- Task 3 First-segment caret: done (9bfdf247)
- Task 4 Cleanup: done (7adbfce1)

## Attention

- The chips mode editor focuses its Min input when it opens (`ST_FilterChips.tsx`, `focusFilterInput`), so a centre click in that Min is a click on a focused field and, as D96 says, keeps the browser's caret on the year; the fix reaches the chips editor's Max and every unfocused field, not that first Min click.
- `ClickCentreOfDateRangeInputTypesFullDate` runs in subheader mode with the column at size 95, which puts the input centre on the year on the three bases; the chips editor could not carry it because of the focused Min above.
- The fix's picker-button zone is a fixed 24 px past the inline-end padding (measured in Chromium and Firefox); a press inside it keeps the browser's behavior, including on the end of the year segment of a very narrow field.
- Real Safari was not driven; the WebKit result comes from Playwright's WebKit build. Playwright Firefox and WebKit were installed into the machine's Playwright cache for the measurement.
