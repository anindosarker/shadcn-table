# Audit 7: components/date-picker-7-4 (version .7.4)

- Read: all 23 files of `test-projects/next-app/components/date-picker-7-4` (3,524 lines), 364 pieces, plus the stock sources named in each item. Paths below are relative to that folder; `ui/` means `components/ui`, `nm/` means `node_modules`.
- How: five file groups, two readers per group (first reader lists, second reader checks every claim and adds what was missed). 103 first-pass findings, 0 rejected, 44 corrected, 1 moved to "kept"; 30 added by the second readers; merged into the 107 items below. No browser, build or device was used: anything that needs one says "not verified".
- Counts: 1 not needed 10; 2 stock does it 10; 3 own workarounds 6; 4 machinery 12; 5 obscure 13; 6 bugs 12; 7 accessibility 3; 8 types and API 11; 9 duplicates and dead 15; 10 text and sizes 6; 11 review decisions 9; 12 kept 42.

## Why earlier audits missed these

- Audit 6 section G kept a piece when a reason could be written next to it, not when a user need could. `useRangeOrder`, the Safari X trick, `typing`, the month state, the type-only import cycle and "one tab stop per clock column, arrow keys inside" are all in G with a mechanism as the reason. Each is an item below.
- Fixes were stacked on unexplained pieces. `modal="trap-focus"` was questioned in audit 5 and never answered; audit 5 added a Close button for it, audit 6 made that button visible on focus. The same pattern: swap on blur, then `picking`, then the Safari focus trick, then a second commit on close.
- Each audit-6 fix was applied site by site (commit `9b6dfd1`): the same-value guard in nine places, limits checked by types and again at runtime, time maths once in the clock and once in the utils. Nobody read the result as a whole.
- Review decisions were applied to the file they named. Decision 2 removed the grid's arrow keys and left the same code in the clock; decisions 4 and 5 made the `typing` state pointless and left it in.

## 1. Not needed: nobody using the picker would miss it

**1.1 The clock still has the hand-written arrow-key code that decision 2 removed from the grid**
- Where: `components/time-columns.tsx:29, 55, 74, 86, 99-140, 211`
- Today: `moveTimeFocus` finds the column by `closest('[data-slot="time-picker-column"]')`, lists buttons with `querySelectorAll`, moves focus by index for Up, Down, Home, End, and jumps columns through `button[tabindex="0"]`. `tabStop` and `tabIndex` make one tab stop per column for it.
- Why it is there: no source found. In the first clock commit (`8b2535f`). Audit 5 listed it as failing, audit 6 G kept it. Decision 2 (review-notes.md:57-60) removed the identical pattern from the grid and did not name the clock.
- A user would lose: arrow, Home and End keys in the clock. Every time button becomes a tab stop (up to 24 + 60 + 60 + 2); the typed time box stays the keyboard path. It is also broken today: when the value is off the step or disabled, no button in that column has `tabindex 0`, so Tab and Left/Right skip the column (6.8).
- Plainer: delete the lines above. Hidden cost: on open Base UI focuses the first tabbable button (`nm/@base-ui/react/utils/popups/popupStoreUtils.js:44-46`); that would be the top hour, and the browser may scroll the hour column up, undoing the centring effect at 57-67 (not verified). A stock ToggleGroup is not a clean swap: no `ui/toggle-group`, and a second press empties the value (`nm/@base-ui/react/toggle-group/ToggleGroup.js:60`).
- Recommended action: remove

**1.2 A 19-line helper decides which calendar moves while an end is typed**
- Where: `utils/range.utils.ts:165-183`; `modes/range-mode.tsx:241-245`
- Today: `followTypedEnd` moves the left calendar for From, the right for To, with a special case when both ends fall in the left month. One caller.
- Why it is there: no source found (`a34096f`).
- A user would lose: while To is typed earlier than From, the typed month is not shown until the box is left; the other calendar jumps to its own end's month, as it already does after a preset.
- Plainer: `setChosen(monthsForRange(putEnd(value, index, next)))` in both branches; the year range does this in one line (`modes/period-mode.tsx:393-398`).
- Recommended action: remove

**1.3 Each end label renders both words, one invisible, so From and To get equal width on phones**
- Where: `modes/range-mode.tsx:213-216, 218-232`
- Today: a one-cell grid stacks both label texts; the Field also overrides the stock horizontal layout with `flex-wrap *:data-[slot=field-label]:flex-none`.
- Why it is there: brief.md:25 ("labels aligned"), commit `e31de31` (card 4.Z). A brief nicety. The flex-wrap exists because the box and its error are siblings (8.2).
- A user would lose: on a phone the From box starts a little left of the To box (the width difference of the two words; larger in other languages).
- Plainer: `<FieldLabel htmlFor={id}>{labels[end]}</FieldLabel>`, as `modes/period-mode.tsx:383`. Stock horizontal Field: `ui/field.tsx:53-54`.
- Recommended action: remove

**1.4 After a swap, a time equal to 00:00 or 23:59 is rewritten to the other default**
- Where: `utils/range.utils.ts:59-63`
- Today: `refit` guesses that a time equal to the default edge was never chosen and replaces it.
- Why it is there: audit-3.md:96, kept in audit-5.md:182. No owner line.
- A user would lose: after swapping two untouched ends the range reads "23:59 to 00:00" instead of "00:00 to 23:59". A 00:00 typed on purpose is no longer changed.
- Plainer: delete 59-63, return `[to, from]`. Goes entirely with 3.1 if the swap goes.
- Recommended action: owner call: keep the guess or accept swapped times as typed

**1.5 "Pick a date first" is a hover tooltip on a wrapper div**
- Where: `modes/datetime-mode.tsx:89`; `modes/range-mode.tsx:149`; `components/picker-labels.tsx:30`
- Today: `title` travels to the InputGroup div (`ui/input-group.tsx:11-16`) around a disabled time box or clock.
- Why it is there: labels commit `58ba103`; audit-3.md:83, 109. No owner request.
- A user would lose: a mouse-only hint. Touch, keyboard and screen reader users never get it today.
- Plainer: delete both lines and the label key (and its translations in `app/date-filter-demo/_lib/labels.ts:18, 66`).
- Recommended action: remove

**1.6 Week and month range panels are headed From and To, but a click in either does the same thing**
- Where: `modes/period-mode.tsx:407-411`
- Today: a `FieldTitle` above each panel; `pickRange` ignores the side.
- Why it is there: `bafa3fe`; no proposal line. The owner saw this look in .6.
- A user would lose: two words that suggest left sets From and right sets To, which is not how it works.
- Plainer: delete 407-411; the range branch renders the panel as the single branch does.
- Recommended action: owner call: drop the two titles or keep the look

**1.7 The dialog has two close buttons, and the X is a hand-made copy of the stock one**
- Where: `components/picker-frame.tsx:193, 203-211, 215-219`
- Today: stock `showCloseButton` is off; a `DialogClose` is rebuilt with `buttonVariants` and `cn-dialog-close`; the footer has Done. `dialogProps` is spread after `showCloseButton={false}` (194), so an app passing it gets two X buttons.
- Why it is there: audit-5.md:191, audit-6.md:179 (stock X says a fixed English "Close", `ui/dialog.tsx:71`). No owner line asks for both.
- A user would lose: one of two exits.
- Plainer: keep Done, delete 203-211 and the `XIcon` import. With 3.2 also applied, `labels.close` has no user left.
- Recommended action: owner call: Done only, or stock X only

**1.8 Every key release re-reads the box so the X shows a moment earlier**
- Where: `components/picker-field.tsx:87-91` (first sentence), `185`
- Today: `onKeyUp` calls `read`, which stores a new draft per key.
- Why it is there: `3136dfc`; audit-5.md:176 kept it as "reasoned".
- A user would lose: in an empty box, after only the first date part is typed, the X is missing until the date is complete or the box is left. The "no input event" claim is the comment's, not verified.
- Plainer: delete line 185.
- Recommended action: remove

**1.9 Every calendar dims other-month days more than stock, for a range-only reason**
- Where: `components/picker-calendar.tsx:70-74`
- Today: four reach-in selectors on the day button.
- Why it is there: audit-5.md:170 ("two calendars show the same range in outside days").
- A user would lose: in the range picker, an end shown as an other-month day would look fully selected in both calendars.
- Plainer: stock class (`ui/calendar.tsx:125-128`); if wanted for ranges, move it to `rangeClassNames`.
- Recommended action: remove

**1.10 Small leftovers nobody reads**
- Where: `components/picker-labels.tsx:67` (`useMemo` on merged labels, defeated by any inline `labels={{}}`); `components/picker-trigger.tsx:57` (`cn-button-group-orientation-horizontal`, a playground style-sheet class the installed `ui/button-group.tsx:14` does not use; removed once in `d09c716`, back with `e31de31`)
- Today: see above.
- Why it is there: memo, no source found; class, card 4.Z for the theme radius.
- A user would lose: memo, nothing. Class: in this playground only, the X's right corners stop following styles whose radius is not lg.
- Plainer: plain object merge; delete the class and fix the radius in `ui/button-group.tsx` if the playground needs it.
- Recommended action: remove

## 2. The browser or a library already does it

**2.1 The week calendar hand-builds the selected band and guards the click**
- Where: `modes/period-mode.tsx:143-153`
- Today: own `selected`, `range_start`, `range_end`, `range_middle` modifiers and an `onDayClick` that tests `disabled` and `hidden`.
- Why it is there: `bafa3fe`; react-day-picker has no week mode, so none was used.
- A user would lose: nothing. Side effect: the grid gets `aria-multiselectable` (`nm/react-day-picker/dist/esm/DayPicker.js:301`), also for a single week.
- Plainer: `mode="range" selected={{from, to}} onSelect={(_, day) => onPick(periodOf("week", day))}` as `modes/range-mode.tsx:266, 291`. The library sets the three modifiers (`DayPicker.js:319-325`), returns before the callback on a disabled day (`DayPicker.js:160-164`) and renders no button for a hidden one. The `onDayClick` omit at `date-picker.tsx:62` then goes.
- Recommended action: replace with react-day-picker range mode

**2.2 `selectRange` hand-handles "only To is set, user clicks a day"**
- Where: `utils/range.utils.ts:82, 88-93`; `modes/range-mode.tsx:295`
- Today: builds the pair itself and needs the extra `day` argument and the `at` helper.
- Why it is there: no source found (`0a9e681`).
- A user would lose: date range, a click on To's own day makes a one-day range. Date-time range, a typed time on a lone To is replaced by the default when a later day is clicked.
- Plainer: delete 88-93 and the `day` parameter. The lone end is already passed as `from` (`modes/range-mode.tsx:198-199`) and `nm/react-day-picker/dist/esm/utils/addToRange.js:23-45` orders it. Line 86 stays (`ordered` is read at 102).
- Recommended action: replace with react-day-picker addToRange

**2.3 A second click on the selected day is dodged by reading the second argument**
- Where: `modes/date-mode.tsx:57`; `modes/datetime-mode.tsx:69`; `components/picker-calendar.tsx:29`
- Today: `onSelect={(_, day) => ...}` because the first argument is undefined on a re-click. `required` is listed as picker-owned and never set.
- Why it is there: no source found.
- A user would lose: nothing.
- Plainer: pass `required`; `nm/react-day-picker/dist/esm/selection/useSingle.js:21-24` clears only when not required; typed as `Date` in `types/props.d.ts:492-499`.
- Recommended action: replace with the `required` prop

**2.4 The role on the time range is switched on by a test of two aria props**
- Where: `modes/time-range-mode.tsx:36-38`
- Today: `role="group"` only when the app passed a name.
- Why it is there: no source found.
- A user would lose: nothing.
- Plainer: `role="group"` always, as `ui/field.tsx:71` and `ui/input-group.tsx:15` do.
- Recommended action: replace with a fixed role

**2.5 Grid buttons set `type="button"` and a hand-made soft-disabled state**
- Where: `components/period-grid.tsx:36, 64, 75, 79-80`
- Today: `aria-disabled` plus `tabIndex -1` on an arrow at the limit; `type="button"` three times.
- Why it is there: audit 6 A10 (arrow lost focus when natively disabled).
- A user would lose: nothing for `type` (`nm/@base-ui/react/internals/use-button/useButton.js:184`). With `disabled focusableWhenDisabled` (`nm/@base-ui/react/button/Button.d.ts:17-21`) a disabled grid arrow stays a tab stop while the day calendar's arrows (`components/picker-calendar.tsx:194-195, 209-210`, plain react-day-picker buttons) do not.
- Plainer: delete the three `type` attributes; leave the arrow pattern so both headers match.
- Recommended action: remove (the `type` attributes only)

**2.6 `formatValue` parses the day and the time in two steps**
- Where: `utils/range.utils.ts:203-215`
- Today: `fromYmd` on the date part, then `parse(time, ...)`.
- Why it is there: no source found.
- A user would lose: `parseISO` is looser ("2026", "2026-W47" parse), so a malformed value prop would show as a date, not as raw text, unless the format is chosen by string length.
- Plainer: `parseISO(value)` (run in node: local midnight for a date, invalid for "2026-02-30").
- Recommended action: keep (the saving is small and the looseness is a cost)

**2.7 Two date-fns results are rebuilt by hand**
- Where: `utils/period.utils.ts:31` (`startOfISOWeek` on a date `parse` already put on Monday; run in node for four weeks); `utils/period.utils.ts:44-50` (last day of a year by `setYear(new Date(2000, 11, 31), ...)` in a nested ternary)
- Today: see above.
- Why it is there: `bafa3fe` safety; audit 6 A13.
- A user would lose: nothing.
- Plainer: `return date`; `endOfYear(last)` (`nm/date-fns/endOfYear.d.ts:29`, run in node for year 0050).
- Recommended action: replace with date-fns results

**2.8 Two library types are re-derived by hand**
- Where: `components/picker-frame.tsx:56-58` (`PopupActions` through two `NonNullable` layers); `utils/range.utils.ts:81` (`{ from?: Date; to?: Date }`)
- Today: see above.
- Why it is there: decision 1; no source found.
- A user would lose: nothing.
- Plainer: `PopoverPrimitive.Root.Actions` (`nm/@base-ui/react/popover/root/PopoverRoot.d.ts:81-84, 93`); `DateRange` (`nm/react-day-picker/dist/esm/types/shared.d.ts:171`).
- Recommended action: replace with the exported types

**2.9 Three classes on the date-time end box repeat stock ones**
- Where: `modes/range-mode.tsx:150` (`w-full min-w-0`, `*:data-[slot=input-group-control]:min-w-0`)
- Today: repeats `ui/input-group.tsx:17` and `ui/input.tsx:11`.
- Why it is there: `31dedca`.
- A user would lose: nothing.
- Plainer: delete the three; the rest of the string is 5.2.
- Recommended action: remove

**2.10 `calendarProps.buttonVariant` is accepted and does nothing**
- Where: `components/picker-calendar.tsx:43, 106-109, 193, 208`
- Today: stock Calendar uses it only for the stock arrows (`ui/calendar.tsx:58, 63`), which the picker hides. `classNames.button_previous`, `button_next`, `nav` from the app are ignored too.
- Why it is there: carried from the stock signature (`97a175f`).
- A user would lose: nothing.
- Plainer: delete the `Pick` at line 43.
- Recommended action: remove

## 3. Workarounds for our own code (the item is the cause)

**3.1 Swapping From and To on blur: one hook, a flag, two helpers, three call sites, and four other pieces that exist only to protect it**
- Where: `hooks/use-range-order.ts:1-32`; `utils/range.utils.ts:47-77`; `modes/range-mode.tsx:189-195, 257, 378-382`; `modes/period-mode.tsx:337-345, 489-493`. Dependants: the Safari X trick (3.4), the `picking` flag, the second commit on close, the `typing` reset on focus (3.5).
- Today: when focus leaves one end's field, or the clock or popup closes, a From later than To is swapped. Close and blur can both fire for one Escape (two `onChange` calls; not verified). The two modes test "did it swap" differently (`range-mode.tsx:192` by day, `period-mode.tsx:341` by array). The year range calls the hook for one blur check and re-writes the close commit with a `type === "year"` test that changes nothing. The hook wraps its one handler in `fieldProps` with a hand-written return type.
- Why it is there: brief.md:28 ("handled the way the docs' range variant does"), audit-3.md:47, audit-5.md:182, audit-6.md:158. Kept by audits, never an owner request for the mechanism. Calendar clicks are ordered by the library (`nm/react-day-picker/dist/esm/utils/addToRange.js:37-44`).
- A user would lose: a wrongly ordered typed pair is no longer silently swapped. It also has a bug today (6.5).
- Plainer: give the To box `min` = From and the From box `max` = To and let the browser flag it (`components/picker-field.tsx:150-155`). Costs: `min` is the step base, so a To on the quarter hour is flagged when From is off it; app `min`/`max` must be merged with the other end; both boxes are flagged; a reversed pair reaches `onChange`; `orderRange` stays for `selectRange` (`range.utils.ts:86, 92`).
- Recommended action: owner call: keep the swap (then one route only: order when focus leaves both fields or the popup closes, which fixes 6.5 and removes the double commit) or flag a reversed pair like any other bad typed value

**3.2 Both popovers trap focus for no recorded reason, and a hidden Close button exists only for the trap**
- Where: `components/picker-frame.tsx:4, 88-92, 139, 185-187, 225`; `components/clock-popover.tsx:3, 13, 45, 74-76`
- Today: `modal="trap-focus"`, then a `Popover.Close` with `sr-only focus-visible:not-sr-only` at the end of each popup.
- Why it is there: no source found (`f90dee4`). audit-5.md:209 asked why and got no answer; audit-5.md:156 added Close; audit 6 A11 made it visible on focus.
- A user would lose: Tab past the last control closes the popup instead of cycling (`nm/@base-ui/react/floating-ui-react/components/FloatingFocusManager.js:130, 308`); in the range and year-range popups that means tabbing out of the last box closes it. Outside press closes on click, not pointer down (`PopoverRoot.js:123`). The extra "Close" tab stop goes. Nested clock inside the date-time popup: not verified.
- Plainer: delete `modal`, both Close elements, `closeClassName` and the two primitive imports. Default is false (`nm/@base-ui/react/popover/root/PopoverRoot.d.ts:55-58`); the trap only works with a Close part (`popover/popup/PopoverPopup.js:75`).
- Recommended action: owner call: stock non-modal popover (Tab out closes) or keep the trap with its Close button

**3.3 The calendar month is held outside the popup, so it is wiped on every open and close**
- Where: `modes/date-mode.tsx:30, 41, 54-56`; `modes/datetime-mode.tsx:39, 54, 66-68`; `components/picker-box.tsx:20, 30, 42`
- Today: `defaultMonth` + `month` + `onMonthChange` (uncontrolled until first navigation), reset by `onPickerOpenChange={() => setMonth(undefined)}`. That callback is the only reason `PickerBox` carries `onPickerOpenChange`.
- Why it is there: presets must move the calendar (proposal, Presets). The need is real; the placement is the cause.
- A user would lose: nothing.
- Plainer: one small day-panel component rendered inside the popup with `useState(fromYmd(value))`; the popup content unmounts on close (`nm/@base-ui/react/popover/portal/PopoverPortal.d.ts:13-17`), so nothing is reset. It also removes duplicate 9.2.
- Recommended action: fix

**3.4 Every box runs a three-part focus trick on its X**
- Where: `components/picker-field.tsx:114-121, 205-206`
- Today: the X prevents its mouse down, `clear()` focuses the X by hand, the X stays visible while focused.
- Why it is there: `6a96c6a`, audit 5 defect 1: Safari does not focus a clicked button, so the box's blur would swap the range before the X clears. Single boxes have no swap and get the same code. Second cause: `clear()` remounts the input by key (122, 146), which drops focus to the page.
- A user would lose: Safari only, in a wrongly ordered typed range, X on one end could clear the other. Without a focus target after the remount, focus falls to the page on any clear.
- Plainer: the causes are 3.1 and the remount by key. If the swap goes or stops running on blur inside the field, 206 goes and focus can return to the box after clearing.
- Recommended action: fix (after 3.1 is decided)

**3.5 A focus handler with an `instanceof HTMLInputElement` test resets the `typing` flag**
- Where: `modes/range-mode.tsx:208-212` (copy at `modes/period-mode.tsx:376-380`, which goes with 11.1)
- Today: the blur callback skips moves inside the field, so a second handler clears the flag then.
- Why it is there: cause is `hooks/use-range-order.ts:18`.
- A user would lose: nothing.
- Plainer: one `onBlur={() => setTyping(null)}` on the box; `PickerField` spreads extra props onto the InputGroup (`components/picker-field.tsx:144`).
- Recommended action: fix

**3.6 The dialog styles the calendar from outside by slot name, and four callers switch its padding off**
- Where: `components/picker-frame.tsx:196` (last utility), `212`; `modes/date-mode.tsx:48`; `modes/datetime-mode.tsx:60`; `modes/range-mode.tsx:267`; `modes/period-mode.tsx:133`
- Today: `**:data-[slot=calendar]:bg-transparent`, `w-full`, `p-0` reach down from the dialog; each caller passes `className="p-0"`; the dialog's `p-0` can never change anything.
- Why it is there: bg-transparent from the owner's 4.AO report (`ui/calendar.tsx:34`); the rest `677ecfb`.
- A user would lose: nothing.
- Plainer: `PickerCalendar` is only rendered in a popup: set `bg-transparent p-0` once at `components/picker-calendar.tsx:252` and root width in `pickerClassNames`.
- Recommended action: fix

## 4. More machinery than the job needs

**4.1 One 150-line function draws six pickers, held together by the `Ends = [string] | RangeValue` union**
- Where: `modes/period-mode.tsx:45, 277-428` (length tests at 111, 135, 285, 339, 354, 392, 442, 490; padding at 298; three layers of `onEnds` at 71, 79, 451, 506, 531)
- Today: stacked ternaries on `type === "week"`, `range`, `type === "year" && range`; a side is left/right, from/to and 0/1 at once (346, 371-372); `dayLimits(type, props)` at 293 passes the whole rest-props object as limits.
- Why it is there: grew by version (`bafa3fe`, .6.1, 6.2, `a9840a8`).
- A user would lose: nothing.
- Plainer: after 4.2 and 11.1, split the year-range field block (375-404) into its own component, derive end and index from `rangeEnds`, pass `{ min, max }` explicitly. Splitting alone leaves the union; the single and range paths need their own value types to remove the length tests.
- Recommended action: fix

**4.2 Two view states are kept, only one is ever used for a type**
- Where: `modes/period-mode.tsx:309-310, 318-325, 333-336, 357-360, 397`
- Today: `chosen` (week) and `chosenYears` (month, year) are both created and both reset.
- Why it is there: `bafa3fe`.
- A user would lose: nothing.
- Plainer: one state initialised by one function; `shownMonths` already takes a step (`utils/range.utils.ts:185-196`).
- Recommended action: fix

**4.3 The format of `min`, `max` and `step` is guarded twice, by template-literal types and by a runtime check in the wrong file**
- Where: `date-picker.tsx:31-48, 74, 154-155`; `utils/period.utils.ts:19, 99-147`
- Today: `Day`, `Time`, `LimitText` accept "1-2-3" and reject every computed string (`min={format(d, "yyyy-MM-dd")}` does not compile without a cast; the table filter will pass plain strings). `checkedLimits`/`checkedStep` run on every render, so a wrong limit prints `console.error` on every render in dev. Line 130 types its parameter as `Parameters<typeof inFormat>[0]` though `DatePickerType` exists.
- Why it is there: `9b6dfd1`, audit 6 E7 and E8. The runtime check compensates for `dayLimits` validating (39-52) while `outsideLimits` (55-57) compares raw strings.
- A user would lose: an app developer loses editor errors on literal limits. `checkedStep` is the only guard against `step={0}` (`components/time-columns.tsx:161` would do `% 0`).
- Plainer: `min?: string; max?: string`, keep the runtime check as the one guard, move it to `utils/date.utils.ts`, inline `reject`.
- Recommended action: fix

**4.4 A four-value context connects three wrapper components always used together**
- Where: `components/picker-frame.tsx:60-65, 94-101, 127-129, 160-166, 173-174`
- Today: `PickerFrame`, `PickerFrameTrigger`, `PickerFrameContent` read `frame`, `fill`, `popoverContent`, `dialogContent` from context. Two callers of the trio, one reader of `fill`. `PickerFrameContent` accepts `align`, `alignOffset`, `sideOffset`, `className` (80-83) and drops all four in the dialog branch (192-198).
- Why it is there: presentation switch (wanted); the compound shape is the implementer's.
- A user would lose: nothing.
- Plainer: one component with a trigger slot (picker-box needs the trigger inside an addon) and a title; the split props become locals. `fill` reaches range-mode by a prop or a one-value context.
- Recommended action: fix

**4.5 A prop, a context and a branch put one From/To badge inside the calendar header on phones**
- Where: `components/picker-calendar.tsx:56, 111, 144, 147-154, 227, 244, 263`; caller `modes/range-mode.tsx:271-273`
- Today: `captionTag` through `CaptionTagContext` into the `MonthCaption` override.
- Why it is there: `747e529` (card 4.Y, owner-approved phone dialog).
- A user would lose: the badge would sit on its own line above each calendar, taking height from two calendars that share one screen.
- Plainer: render the Badge in range-mode next to its calendar.
- Recommended action: owner call: badge on its own line, or keep the context

**4.6 A distributive conditional type removes three calendar props to add two back**
- Where: `components/picker-calendar.tsx:17-22, 51-57`
- Today: `extends infer Props ? Props extends unknown ? Omit<...>`.
- Why it is there: audit-5.md:167, forced when "blank" sat on the stock `fixedWeeks`; that moved into `calendarProps` since.
- A user would lose: nothing. It still stops a mode from passing `fixedWeeks` straight in; no caller does. Not tsc-checked.
- Plainer: `React.ComponentProps<typeof Calendar> & { calendarProps?; limits; startMonth: Date; endMonth: Date }`.
- Recommended action: fix

**4.7 The time mode file only renames `onChange` and passes one label**
- Where: `modes/time-mode.tsx:1-25`
- Today: renders `TimeField` with `onValueChange={onChange}` and `fallbackLabel={labels.time}`.
- Why it is there: one file per mode.
- A user would lose: nothing.
- Plainer: `TimeField` defaults its label; `date-picker.tsx:213-216` renders it directly. Needs 8.1 first: the public type is derived from `ComponentProps<typeof TimeMode>` (`date-picker.tsx:95`).
- Recommended action: remove (with 8.1)

**4.8 The range picker invents a trigger id and threads it down as `idPrefix`**
- Where: `modes/range-mode.tsx:61, 167, 203, 365-366, 374, 386`
- Today: `triggerId = id ?? ownId`, so the trigger gets a generated id even when the app passed none.
- Why it is there: no source found.
- A user would lose: nothing.
- Plainer: pass `id` untouched; `React.useId()` inside `RangePanel`, as `modes/period-mode.tsx:286`.
- Recommended action: fix

**4.9 The clock's open handler is re-wrapped in an arrow that adds nothing**
- Where: `modes/range-mode.tsx:156` (threaded at 53, 115, 257)
- Today: `popoverProps={{ onOpenChange: (open) => onOpenChange(open) }}`.
- Why it is there: left from decision 1.
- A user would lose: nothing.
- Plainer: `popoverProps={{ onOpenChange }}` (`nm/@base-ui/react/popover/root/PopoverRoot.d.ts:29`).
- Recommended action: fix

**4.10 Three helpers wrap one line**
- Where: `modes/period-mode.tsx:110-115` (`cellState`, only because `rangeState` is typed for two ends, `utils/period.utils.ts:91`); `utils/period.utils.ts:59-62` (`monthName`, one caller at `period-mode.tsx:205`, builds a date library per month name); `utils/range.utils.ts:111-113` (`shiftMonth`, callers 137, 144)
- Today: see above.
- Why it is there: `bafa3fe`, 6.1, `a34096f`.
- A user would lose: nothing.
- Plainer: type `rangeState(range: string[], ...)` and call it at 208 and 267; `dateLibFor(locale)` once in `MonthPanel`; inline `shiftMonth`.
- Recommended action: remove

**4.11 The year list is passed to all three panels so one can grey out years the box accepts anyway**
- Where: `modes/period-mode.tsx:51-52, 222, 263-264, 351`
- Today: only `YearPanel` reads `bounds`, to disable years outside the list.
- Why it is there: `bafa3fe`, before the typed year box (decision 4).
- A user would lose: an app that caps the list with `calendarProps.endMonth` loses the grey-out of later years in the last decade; `max` still forbids them. The month grid never had it (206).
- Plainer: delete the prop and 263-264.
- Recommended action: remove

**4.12 Trigger name and empty text are two-item arrays read by position**
- Where: `modes/period-mode.tsx:89-99, 476-478`
- Today: `titles.week = ["selectWeek", "pickWeek"]`, with `range || type === "year" ? rangeTitles[type] : titles[type]` to quiet TypeScript.
- Why it is there: single year moved to a box (7.x), so the lookup needed a narrowing trick.
- A user would lose: nothing.
- Plainer: objects with `{ label, placeholder }` keys; narrow once in the single-year branch.
- Recommended action: fix

## 5. Obscure code

**5.1 "Dialog on a phone" is decided twice: a JS flag and about 25 CSS utilities keyed on shadcn's dialog slot attribute**
- Where: `components/picker-frame.tsx:62, 99-101, 114`; `components/picker-calendar.tsx:63, 67, 85, 89, 93, 97, 101`; `modes/range-mode.tsx:85, 89, 103, 128, 150, 197, 213-216, 272, 319`
- Today: `fill = dialog && isMobile` drives the range layout; the calendar repeats the test as `in-data-[slot=dialog-content]:max-md:` (line 101 alone nine times, reaching into cells with `*:`).
- Why it is there: `677ecfb` ("phone dialog by CSS"); `fill` came later (`747e529`).
- A user would lose: nothing.
- Plainer: one source. `PickerCalendar` reads `usePickerFrameFill()` and merges a second classNames object when true; the layout no longer depends on `data-slot="dialog-content"` (`ui/dialog.tsx:51`). The week range needs the hook too (`modes/period-mode.tsx:135`). `hooks/use-mobile.ts:3` (768) equals `md`.
- Recommended action: fix

**5.2 The date-time end box carries a nine-part class string whose reason was deleted**
- Where: `modes/range-mode.tsx:150`
- Today: overrides addon and control padding by `*:data-[slot=...]`, adds `overflow-hidden` and `max-md:contain-inline-size`. The padding numbers cancel this playground's theme (`styles/style-nova.css:1409-1411`) and mean something else in another theme.
- Why it is there: `31dedca`; its deleted comment: two addons would widen the box, and on iOS a long value must not widen the popover. An iOS fix applied to every phone.
- A user would lose: not verified without a device; a long iOS value may widen the popover.
- Plainer: delete the stock parts (2.9) and the theme-tuned padding; keep the two overflow classes with the comment restored.
- Recommended action: fix

**5.3 One end of a range has three names, converted back and forth**
- Where: `modes/range-mode.tsx:201-204, 274-283, 287-289`; `utils/range.utils.ts:25-28, 41-45, 102`; `modes/period-mode.tsx:371-372`
- Today: "from/to", index 0/1 and side "left/right". `putEnd` takes `index: number`, so `putEnd(range, 5, x)` compiles.
- Why it is there: grew across versions.
- A user would lose: nothing.
- Plainer: key the months by `RangeEnd`; type the index `0 | 1`. The `: MonthSide` annotation at 202 is not needed even today.
- Recommended action: fix

**5.4 The grid header draws three buttons by looping a two-item array and testing the index**
- Where: `components/period-grid.tsx:60-91`
- Today: `[previous, next].map(..., index)` with `index === 1 &&` for Today and `index === 0 ?` for the icon; `key={label}` collides if both labels are equal. The Today button (63-72) copies `TodayButton` in `components/picker-calendar.tsx:161-177`.
- Why it is there: avoids writing the arrow twice.
- A user would lose: nothing.
- Plainer: three buttons in order; export `TodayButton` with an `onClick` prop and use it in both headers.
- Recommended action: fix

**5.5 The range day buttons switch transitions off and on by state**
- Where: `modes/range-mode.tsx:102-105`
- Today: `transition-none hover:transition-all focus-visible:transition-all data-[range-*]:transition-none!`.
- Why it is there: no source found (`aac35f3`). Cause: the stock Button's `transition-all` (`ui/button.tsx:6`) animates the band's background and radius.
- A user would lose: band cells fade for a moment when the range changes, as in stock shadcn.
- Plainer: delete the transition part.
- Recommended action: owner call: accept the stock fade or keep the override with a comment

**5.6 The dropdown text is shrunk through a selector on a class react-day-picker happens to render**
- Where: `components/picker-calendar.tsx:79-83`
- Today: `text-xs` plus ``String.raw`**:[.rdp-caption\_label]:text-xs` ``.
- Why it is there: `6722962`; the row holds two dropdowns and three buttons. No owner request.
- A user would lose: dropdown labels at stock `text-sm` (`ui/calendar.tsx:83-89`); the header may get tight (not verified).
- Plainer: stock size; delete line 81 and `text-xs` on 80.
- Recommended action: owner call: stock text size or keep the small text

**5.7 The today cell's stock class is replaced in three states with no reason written**
- Where: `components/picker-calendar.tsx:66-69`
- Today: `data-[selected=true]:bg-transparent` everywhere; on a phone dialog the muted background moves from cell to button.
- Why it is there: `f9b6e54`; audit-5.md:102 lists it without a reason.
- A user would lose: stock look (`ui/calendar.tsx:121-124`): a muted square behind a selected today; a wide muted cell in stretched phone rows. Not verified.
- Plainer: stock class, or one line of reason per half.
- Recommended action: owner call: stock today look or keep with comments

**5.8 Three unexplained classes that two audits already asked about**
- Where: `components/picker-frame.tsx:212` (`max-md:-m-1 max-md:p-1`, probably for focus rings under `overflow-y-auto`); `components/picker-field.tsx:188` (`appearance-none` on every box, including the year text box; asked in audit-5.md:210 and audit-6.md:287)
- Today: see above.
- Why it is there: `677ecfb`; `f90dee4`. No comment.
- A user would lose: not verified (possibly clipped focus rings; possibly the native iOS look on an empty box).
- Plainer: delete, or keep each with a one-line reason naming the browser.
- Recommended action: remove (restore with a comment if a device check shows a need)

**5.9 `formatRange` has a parameter named `format` that hides the date-fns import**
- Where: `utils/range.utils.ts:3, 218-229`
- Today: the fourth parameter shadows the import used at 98-99. `range: string[]` is on purpose (period-mode passes `Ends`).
- Why it is there: added for period-mode's formatter.
- A user would lose: nothing.
- Plainer: rename to `formatEnd`.
- Recommended action: fix

**5.10 The next-decade arrow uses a different test from the previous arrow**
- Where: `modes/period-mode.tsx:245` (against 238)
- Today: `decade + 9 < getYear(nav.end)`; `nav.end` is always a decade start, so `+ 9` changes nothing.
- Why it is there: audit 6 A5 fix; no reason found.
- A user would lose: nothing.
- Plainer: `decade < getYear(nav.end)`.
- Recommended action: fix

**5.11 Two popups share one handler name in one file**
- Where: `modes/range-mode.tsx:53, 115, 156, 189, 257, 378`; `hooks/use-range-order.ts:12, 23`
- Today: `onPickerOpenChange` is the clock at 189 and 257 and the calendar popup at 378; `onOpenChange` in between.
- Why it is there: the hook was named when the clock was "the time picker" (`9d34c89`).
- A user would lose: nothing.
- Plainer: `onClockOpenChange` from the hook down.
- Recommended action: fix

**5.12 The same string names four different things**
- Where: `components/picker-box.tsx:18-19, 26, 37, 52, 59`; `components/picker-trigger.tsx:20`; `components/time-field.tsx:14`; `components/picker-field.tsx:31`; `components/clock-popover.tsx:17-21`
- Today: `title`, `label`, `pickerLabel`, `fallbackLabel` for "name of this control"; `onValueChange` in TimeField and PickerField, `onChange` in ClockPopover and TimeColumns.
- Why it is there: parts written at different versions.
- A user would lose: nothing. The `title` case is a real defect: 8.3.
- Plainer: `label` and `onValueChange` throughout the internal parts.
- Recommended action: fix

**5.13 Four type names for the calendar's props do not say which is which**
- Where: `components/picker-calendar.tsx:17, 39, 47, 51`; `date-picker.tsx:56`
- Today: `PickerCalendarProps` is the type of the `calendarProps` prop, `PickerCalendarOwnProps` the component's props, `CalendarProps` a helper, and `date-picker.tsx` defines a second `CalendarProps`.
- Why it is there: decision 3 applied on top of older names.
- A user would lose: nothing.
- Plainer: `PickerCalendarProps` for the component; one exported name for the pass-through, reused at `date-picker.tsx:56`.
- Recommended action: fix

## 6. Bugs

**6.1 In the date-time popup the time box cannot be cleared or half-edited: it snaps to the first time**
- Where: `modes/datetime-mode.tsx:90-98`; `components/picker-field.tsx:44-48, 79-85, 119-126, 141, 172-184`
- Today: an empty time becomes `edgeTime("first")`. Deleting one segment of 10:30 emits date + 00:00; the new value clears the draft and remounts the input, dropping focus mid-edit. The X sets 00:00, and at 00:00 does nothing while still shown. At 00:00 the guard at 95 stops the call, so only other times snap. Reasoned from code, not run.
- Why it is there: keeps the value complete; no proposal line asks for the reset.
- A user would lose: nothing.
- Plainer: ignore an empty time (the box keeps its draft and flags on leave like every box). The guard at 95-97 then has nothing to catch. `PickerField` has no prop to hide its X (200-211), so hiding it here is a new prop.
- Recommended action: fix (owner call only on hiding the X of this inner box)

**6.2 Clicking the first allowed day in a date-time picker with a `min` gives a time before the min**
- Where: `modes/datetime-mode.tsx:69-76`; `utils/date.utils.ts:101-114`
- Today: `edgeTime` returns "00:00" without a step (102-104) and only min's step phase with one. `min=2026-11-21T09:00`, click 21 Nov, value `2026-11-21T00:00`, flagged right after the click (`picker-field.tsx:107-112`). Max side: a kept time later than max's time, then a click on the max day, gives a value above max (line 73).
- Why it is there: `9b6dfd1` for audit 6 A3/A4; solves the rare case, misses the common one.
- A user would lose: nothing.
- Plainer: on the min day use `timePart(min)`, on the max day clamp to `timePart(max)`; `edgeTime` stays for other days (a step with an off-grid min still needs it).
- Recommended action: fix

**6.3 AM and PM are never greyed out, and a clock pick never checks min or max**
- Where: `components/time-columns.tsx:188-204, 260-269`
- Today: run in node on a copy of 155-204: `max="11:00"`, value 10:20, PM gives 22:20; `min="13:00"`, empty, PM gives 12:00; value 08:05, `min="09:15"`, hour 9 gives 09:05. The box then flags the value.
- Why it is there: min/max came with the audit 6 fix (`9b6dfd1`); the period column and `pick()` were missed.
- A user would lose: nothing.
- Plainer: pass `disabled` to the period column (`outside(0, 43199)`, `outside(43200, 86399)`) and clamp in `pick()`. The default `disabled = () => false` at 52 then goes.
- Recommended action: fix

**6.4 With a `min` and no time yet, the whole minute column is greyed until an hour is picked**
- Where: `components/time-columns.tsx:164-166, 170, 178`
- Today: `shownHour` falls back to `hours[0]`, filtered by step only. Node copy: `min="09:00"`, `max="17:00"`, empty: 60 of 60 minutes disabled. Reaches only the time type and time range (date-time disables the clock until a date exists).
- Why it is there: the fallback predates min/max in the clock.
- A user would lose: nothing.
- Plainer: `hours.find((h) => !hourOutside(h))`; move `hourOutside` (205-206) above 170.
- Recommended action: fix

**6.5 Moving a filled range later by typing loses the new start date**
- Where: `hooks/use-range-order.ts:17-21`; `modes/range-mode.tsx:189-195`
- Today: range 10 to 20 Nov; type 25 Nov in From, press Tab. The ends swap to 20 and 25 and focus sits in To, which now holds the 25 just typed. Typing 30 gives 20 to 30, not 25 to 30. Reasoned, not run.
- Why it is there: swap on leave was kept in audit-3.md:47; leaving one box for the other was not weighed.
- A user would lose: nothing.
- Plainer: goes with 3.1; if the swap stays, order only when focus leaves both fields or the popup closes.
- Recommended action: fix

**6.6 In a year range, typing only To and then clicking a year throws the typed To away**
- Where: `utils/period.utils.ts:81-89`
- Today: `pickRange` starts `[period, ""]` whenever From is empty. Also reached by clearing From with its X.
- Why it is there: `bafa3fe`, before the typed boxes (`a9840a8`) made `["", "2030"]` reachable.
- A user would lose: nothing. The date range keeps the typed To in the same case.
- Plainer: for `!from && to` return the ordered pair of the clicked period and `to`.
- Recommended action: fix

**6.7 With only the To year set, the year grids can open on decades that do not show it**
- Where: `modes/period-mode.tsx:304-308, 397`
- Today: `yearsFor` puts the left view on today's year and marks left as moved; the right view is pushed after it. From 2000, To 2010, clear From: grids jump to the 2020s and 2030s. Traced by hand, not run.
- Why it is there: `bafa3fe`; `monthsForRange` has this case (`utils/range.utils.ts:156-159`), the year version never got it.
- A user would lose: nothing.
- Plainer: the same To-only branch as `monthsForRange`; one function after 4.2.
- Recommended action: fix

**6.8 A clock column cannot be reached by keyboard when the current time is not one of its options**
- Where: `components/time-columns.tsx:55, 86, 132`
- Today: value 10:07 with step 900: no minute button has `tabindex 0` (node copy).
- Why it is there: side effect of the hand-written tab stop.
- A user would lose: nothing.
- Plainer: goes with 1.1.
- Recommended action: remove (with 1.1)

**6.9 The red mark and message are not refreshed when `min`, `max` or `step` change**
- Where: `components/picker-field.tsx:107-112`
- Today: the effect depends on `[value]` only. Native boxes only; the year box computes its message in render.
- Why it is there: audit 6 A3 fix.
- A user would lose: nothing.
- Plainer: add `min`, `max`, `step` to the dependency list.
- Recommended action: fix

**6.10 With only `max` before 1900, or only `min` after 2100, the calendar's first month is after its last**
- Where: `utils/date.utils.ts:58-73`
- Today: each side ignores the other limit. `max="1850-12-31"`, empty value: start January 1900, end December 1850. `monthOf` then returns the end month; what react-day-picker shows was not checked.
- Why it is there: year list rule (proposal.md:48-52).
- A user would lose: nothing.
- Plainer: feed the other limit's year into the same `Math.min` / `Math.max`.
- Recommended action: fix

**6.11 Picking a minute can store a different minute or an off-step time**
- Where: `components/time-columns.tsx:155, 188-200`
- Today: node copy: step 60, value 10:30:45, minute 31 gives 10:32; step 90, minute 3 gives 10:04 (off step). Needs a value with seconds under a whole-minute step, or a step such as 90. Line 192 falls back to minute 0 while the seconds list uses `shownMinute`.
- Why it is there: `firstOnStep` from the audit 6 fix; audit 6 E8 named step 90.
- A user would lose: nothing.
- Plainer: search from the start of the picked unit; show seconds when `step % 60 !== 0`. Rejecting odd steps would narrow the public prop (the browser accepts 90).
- Recommended action: fix

**6.12 With `presentation="auto"` an open picker closes when the window crosses phone width**
- Where: `components/picker-frame.tsx:111-114, 130-155`
- Today: `<Popover>` and `<Dialog>` swap at one position, so uncontrolled open state is lost; `useIsMobile` is false on first render (`hooks/use-mobile.ts:6, 19`). Opens twice only if `defaultOpen` is in both prop objects. Not run.
- Why it is there: listed as untested in review-notes.md:79.
- A user would lose: nothing.
- Plainer: accept and document.
- Recommended action: owner call: accept and document, or hold open in one state above both roots

## 7. Accessibility

**7.1 A box loses its name when it gets an id, its X reads "Clear value" or "Clear Select date", and five call sites add a duplicate aria-label to work around it**
- Where: `components/picker-field.tsx:139-140, 164, 204`; `components/picker-box.tsx:37, 52, 59`; workarounds at `modes/datetime-mode.tsx:82`, `modes/range-mode.tsx:126, 142`, `modes/period-mode.tsx:387`; not worked around at `modes/time-range-mode.tsx:45-56`
- Today: `boxName = ariaLabel ?? (id || ariaLabelledby ? undefined : fallbackLabel)`. With an id and no `<label for>` the input has no name. Every demo card passes an id, so the X reads "Clear value" on every card. Both time-range X buttons read "Clear value". Without an id the box and its calendar button are both "Select date" and the X is "Clear Select date". Boxes with a visible `FieldLabel` carry an `aria-label` with the same word only to feed the X's name.
- Why it is there: `9b6dfd1` heuristic "an id means a label exists"; PickerBox (7.1) uses one string for three uses.
- A user would lose: nothing.
- Plainer: `PickerField` takes one plain noun ("Date", "Time", "Year", From, To) that always names the X, separate from whether the input needs `aria-label`. The five duplicate `aria-label` lines then go.
- Recommended action: fix

**7.2 The trigger button always sets its own aria-label, so an app's visible label never names it**
- Where: `components/picker-trigger.tsx:54, 74`; `components/picker-labels.tsx:20, 26`
- Today: `aria-label="Date range: <value or none>"` on every trigger; it wins over `<label for>` (the demo's own case, `app/date-filter-demo/_cards/row-2-date-range.tsx:29`; not checked in a browser). With `aria-labelledby` the value is not read at all.
- Why it is there: `9b6dfd1`. The button's text already shows the value or placeholder.
- A user would lose: the generic prefix when the app gives no label; with a `<label for>` the value is no longer part of the name (same as shadcn's recipe).
- Plainer: set `aria-label` only when the app passes one. `pickerValue` and `none` labels go; `label` stays (popup title at 86, X name at 97).
- Recommended action: fix

**7.3 Today's month or year is shaded like the inside of a range and has no `aria-current`**
- Where: `components/period-grid.tsx:42-43`
- Today: `middle` and `today` both get `bg-muted`. The stock day calendar does the same (`ui/calendar.tsx:119-122, 214`), so the look is consistent; screen readers are told nothing.
- Why it is there: `bafa3fe`.
- A user would lose: nothing.
- Plainer: `aria-current="date"` on today's cell.
- Recommended action: fix (the attribute; the look stays as stock)

## 8. Types and public API

**8.1 The public props are ten union members built through four nested generics around internal components' props**
- Where: `date-picker.tsx:44-123`; `components/picker-calendar.tsx:47`; `components/picker-frame.tsx:49-54`
- Today: `Popup<Single | Range<type, WeekProps | GridProps<ComponentProps<typeof Mode>> & NoStep>>`. `NoStep` (74) and `presets?: never` (95, 98) exist so `TypePicker` can destructure from every member. The strictness of `PresentationProps` works only because a loose `PopupParts` copy intersected with it collapses to `never`.
- Why it is there: owner review finding 1 ("fix the types"), then grown per version. The demo never exercises the types (props are `Record<string, unknown>`, `app/date-filter-demo/_components/picker-settings.tsx:100-103`).
- A user would lose: nothing at runtime; hover types get shorter.
- Plainer: write the public shape directly: one base, one row per type for value, calendarProps, step, presets and popup props. Internal mode props stop being the public contract.
- Recommended action: fix

**8.2 The box and its error message are two sibling roots**
- Where: `components/picker-field.tsx:143, 214-219`
- Today: a fragment; `className` and HTML attributes go to the InputGroup only; the error carries `w-full contain-inline-size` to cope. In a horizontal filter row the message becomes a second flex item. Shows for single date, date-time, time and year (ranges sit in a stock Field).
- Why it is there: 6.2 draft design. proposal.md:95 promises "HTML attributes for the outer wrapper"; these types have none.
- A user would lose: nothing.
- Plainer: one root around both. Cost: `modes/range-mode.tsx:128, 150` pass classes written for the InputGroup itself and must keep landing there.
- Recommended action: fix

**8.3 `PickerBox` calls its name prop `title`, which hijacks the HTML title attribute**
- Where: `components/picker-box.tsx:18-19, 26`; spread order at `modes/date-mode.tsx:35, 43`, `modes/datetime-mode.tsx:47, 55`, `modes/period-mode.tsx:463, 470`
- Today: `<DatePicker type="date" title="x">` renames the calendar button and popup and shows no tooltip; on type time it is a tooltip.
- Why it is there: 7.1 (`0e428d5`).
- A user would lose: nothing.
- Plainer: name it `label` as `PickerTrigger` does.
- Recommended action: fix

**8.4 A type named `CalendarOptions` is also where the popup props come from, and the presentation props are typed twice**
- Where: `components/picker-calendar.tsx:47-49`; `components/picker-frame.tsx:35-54`; `modes/date-mode.tsx:16-17`; `modes/datetime-mode.tsx:24-25`; `date-picker.tsx:56, 77`
- Today: `CalendarOptions = PopupParts & { calendarProps }`; `modes/range-mode.tsx:56` and `modes/period-mode.tsx:47` already `Pick` only `calendarProps` out of it.
- Why it is there: decision 1 added the strict union; the loose copy stayed.
- A user would lose: nothing.
- Plainer: `CalendarOptions = { calendarProps }`; modes take the popup props by name.
- Recommended action: fix

**8.5 An internal helper type is exported from the public entry and imported back by every mode**
- Where: `date-picker.tsx:22-29`
- Today: `ControlProps`, a type-only cycle, public by accident. No outside user.
- Why it is there: audit 6 G kept it as "erased at build".
- A user would lose: nothing.
- Plainer: move next to `Limits` in `utils/date.utils.ts:6`.
- Recommended action: fix

**8.6 A period range outside the limits turns its trigger red; a date range outside the limits does not**
- Where: `components/picker-trigger.tsx:23, 35, 77`; `modes/period-mode.tsx:487`; `modes/range-mode.tsx:372-383`
- Today: `invalid` is a second way to say `aria-invalid`; one caller.
- Why it is there: period types in 6.2.
- A user would lose: nothing.
- Plainer: one rule for both; merge into `aria-invalid` at the caller.
- Recommended action: owner call: flag both range kinds, or neither

**8.7 The iOS placeholder is on the time box in the date-time popup and missing on the other time boxes**
- Where: `modes/datetime-mode.tsx:83` against `modes/time-mode.tsx:16-21`, `modes/time-range-mode.tsx:46-63`
- Today: only one call site passes `placeholder`. Whether iOS shows an empty time box blank: not verified.
- Why it is there: wired per call site.
- A user would lose: nothing.
- Plainer: default it in `TimeField`, or delete line 83; the device check decides.
- Recommended action: owner call: check on the iPhone, then one rule for all time boxes

**8.8 Three label keys say something other than what they hold**
- Where: `components/picker-labels.tsx:21, 33, 38`
- Today: `today` holds "Go to today"; `period` holds "AM or PM" while period means week/month/year elsewhere; `pickDateRange` holds "Pick a date". "Select date" and "Pick a week" mix verbs.
- Why it is there: `58ba103`, extended per version.
- A user would lose: nothing.
- Plainer: `goToToday`, `amPm`, "Pick a date range", one verb; rename in `app/date-filter-demo/_lib/labels.ts` in the same change.
- Recommended action: fix

**8.9 One mode file imports its calendar styling from another, and single week gets a different band from week range**
- Where: `modes/range-mode.tsx:83`; `modes/period-mode.tsx:42, 135`
- Today: `rangeClassNames` applied only with two ends. It also sets `root: w-full` and phone classes, so applying it to the single week changes more than the band. Visual difference not verified.
- Why it is there: audit 6 H2, never decided.
- A user would lose: nothing.
- Plainer: move `bandEnd` and `rangeClassNames` next to `pickerClassNames`.
- Recommended action: fix (the move; the single-week look is a later owner call)

**8.10 `PickerOwned` lists two names that are not in the type it trims**
- Where: `components/picker-calendar.tsx:27-28`
- Today: "selected" and "onSelect" omitted from `PropsBase`, which has neither (`nm/react-day-picker/dist/esm/types/props.d.ts:20-33`).
- Why it is there: no source found.
- A user would lose: nothing.
- Plainer: delete both lines.
- Recommended action: remove

**8.11 The month and year grids set their own text direction from `calendarProps.dir`**
- Where: `modes/period-mode.tsx:173, 233`; `date-picker.tsx:70`
- Today: `<div dir={calendarProps?.dir}>`. See 11.3.
- Why it is there: 6.1 right-to-left arrow keys, removed by decision 2.
- A user would lose: only an app passing `dir="rtl"` on a left-to-right page.
- Plainer: drop `dir` at both lines and from `GridProps`.
- Recommended action: owner call: drop it, or keep it as the grid's one calendar-like option

## 9. Duplicates and dead code

**9.1 "Do not call onChange with the same value" is written in nine places, done twice per path, and still missed in three**
- Where: `components/picker-field.tsx:123, 181`; `components/time-columns.tsx:201`; `modes/time-range-mode.tsx:59`; `modes/datetime-mode.tsx:95`; `modes/range-mode.tsx:253, 299`; `modes/period-mode.tsx:341, 507, 534`; mechanism `utils/range.utils.ts:37-39, 44, 95, 108`. Missing at `modes/date-mode.tsx:57-60, 64-66`, `modes/datetime-mode.tsx:103-106`, `modes/range-mode.tsx:240`.
- Today: `samePair` returns the old array so callers can test `range !== value`; a reader must know that. The guards at `time-range-mode.tsx:59` and `range-mode.tsx:253` can never be false (the clock and the box already guard). `datetime-mode.tsx:95` is live only because of 6.1.
- Why it is there: audit 6 A12, fixed site by site in `9b6dfd1`.
- A user would lose: nothing.
- Plainer: one guard where `onChange` enters, in `TypePicker` after the `range` narrowing (one for string, one for pair). `putEnd` returns `next`; the two dead wrappers go; `samePair` stays only inside `selectRange` or becomes a boolean.
- Recommended action: fix

**9.2 Date and date-time modes carry the same calendar and presets block**
- Where: `modes/datetime-mode.tsx:57-68, 101-107`; `modes/date-mode.tsx:45-56, 62-68`
- Today: eleven identical calendar props and the preset handler, twice.
- Why it is there: modes split per type in the rewrite.
- A user would lose: nothing.
- Plainer: the shared day panel of 3.3; date-time adds its time field as a child.
- Recommended action: fix

**9.3 Time maths is written twice, and a time is parsed two ways in one file**
- Where: `components/time-columns.tsx:31-38, 158, 160-163, 199-200`; `utils/date.utils.ts:90-95, 105-111`
- Today: `seconds()` splits on ":", line 158 uses a regex; `pad` and 199-200 repeat `timeText`; `firstOnStep` repeats the modulo in `edgeTime`.
- Why it is there: both from `9b6dfd1`.
- A user would lose: nothing. Cost: `timeText` writes seconds whenever non-zero, the clock only when step < 60.
- Plainer: export `timeText` and one `toSeconds` from `utils/date.utils.ts`.
- Recommended action: fix

**9.4 The range end box is written out twice, for date and for date-time**
- Where: `modes/range-mode.tsx:121-163`
- Today: two `PickerField` blocks repeating id, aria-label, value, onValueChange, min, max.
- Why it is there: shape since `aac35f3`.
- A user would lose: nothing.
- Plainer: one block with `type={withTime ? "datetime-local" : "date"}` and `{withTime && <ClockPopover />}`.
- Recommended action: fix

**9.5 "Left stops one view before the end, right starts one view after the start" is worked out in three places**
- Where: `modes/range-mode.tsx:188, 274-283`; `modes/period-mode.tsx:326-332`; `utils/range.utils.ts:126-131`
- Today: inline with `twoMonths`; `apart` and `navFor`; again inside `keepMonthsApart`.
- Why it is there: kept-apart panels (owner's 6.1 list); each mode grew a copy.
- A user would lose: nothing.
- Plainer: one helper in `utils/range.utils.ts` returning a side's bounds for a step.
- Recommended action: fix

**9.6 `clockLimit` is written twice**
- Where: `modes/datetime-mode.tsx:42-43`; `modes/range-mode.tsx:136-137`
- Today: identical closures ("a limit's time applies only on its own day").
- Why it is there: `9b6dfd1`, copied per mode.
- A user would lose: nothing.
- Plainer: one `clockLimit(limit, date)` beside `timePart` in `utils/date.utils.ts`; 6.2 needs it with the picked day anyway.
- Recommended action: fix

**9.7 The day format string is written out five times beside a helper for it**
- Where: `modes/date-mode.tsx:58`; `modes/datetime-mode.tsx:72`; `modes/range-mode.tsx:295`; `utils/range.utils.ts:98-99`; helper `utils/period.utils.ts:34-36`
- Today: `format(day, "yyyy-MM-dd")` inline.
- Why it is there: `ymd` came later with the period types.
- A user would lose: nothing.
- Plainer: move `ymd` beside `fromYmd` and call it.
- Recommended action: fix

**9.8 "A preset is a value or a function" is unwrapped in two places**
- Where: `components/picker-presets.tsx:33`; `modes/period-mode.tsx:510-516`
- Today: single period presets are re-wrapped into functions returning a one-item list.
- Why it is there: the `Ends` union (4.1); audit-6.md:138 listed it.
- A user would lose: nothing.
- Plainer: `PeriodMode` keeps `presets` as given and wraps the picked value where it arrives (`onSelect={(next) => onEnds([next])}`).
- Recommended action: fix

**9.9 The 12-hour to 24-hour sum is typed four times and the hour column twice**
- Where: `components/time-columns.tsx:213-233, 266`
- Today: `(option % 12) + (pm ? 12 : 0)` at 217, 220, 222 and another form at 266.
- Why it is there: 24-hour support added beside the 12-hour clock.
- A user would lose: nothing.
- Plainer: one local `to24`.
- Recommended action: fix

**9.10 "Build a date in year N" is written three times and min/max are parsed twice**
- Where: `utils/date.utils.ts:55-56, 62-64, 70-72, 78-79`; `modes/period-mode.tsx:106-108`
- Today: `setYear(new Date(2000, m, 1), year)` three times; `calendarBounds` and `limitDays` parse the limits with identical lines.
- Why it is there: audit-6.md:263 kept the trick; nobody merged the copies.
- A user would lose: nothing.
- Plainer: move `inYear` into `utils/date.utils.ts`; share one limit-to-day step.
- Recommended action: fix

**9.11 `dayEdges` and three default parameters are never read**
- Where: `utils/range.utils.ts:35, 50, 70, 84`
- Today: every caller passes `times` or `withTime=false`.
- Why it is there: `9b6dfd1`.
- A user would lose: nothing.
- Plainer: delete line 35 and the three defaults.
- Recommended action: remove

**9.12 Two validity conditions can never change the result**
- Where: `components/picker-field.tsx:45, 95`
- Today: at 95, when `valid` is true `typed` always equals `input.value`. At 45, `badInput` is tested though a half-typed native box already reports "" (rests on the HTML sanitization rule; not verified in a browser).
- Why it is there: left from the 6.2 draft rewrite and the year rounds.
- A user would lose: nothing.
- Plainer: `input.validity.valid ? null : {...}`; test `patternMismatch` only.
- Recommended action: remove

**9.13 `edgeTime` handles a time-only `min` and a negative base it can never receive**
- Where: `utils/date.utils.ts:105-111`
- Today: `min?.includes("T") ? timePart(min) : min` and `((base % step) + step) % step`. Both callers are date-time only.
- Why it is there: written generally.
- A user would lose: nothing.
- Plainer: `timePart(min ?? "")` and `base % step`.
- Recommended action: remove

**9.14 The clock root carries a `data-slot` nothing reads**
- Where: `components/time-columns.tsx:209`
- Today: `data-slot="time-picker"`; no selector, test or style uses it.
- Why it is there: shadcn naming habit.
- A user would lose: nothing.
- Plainer: delete (line 74's goes with 1.1).
- Recommended action: remove

**9.15 "Drop empty ends, then sort" is written three times**
- Where: `modes/period-mode.tsx:127`; `utils/period.utils.ts:92`; `modes/range-mode.tsx:198`
- Today: `ends.filter(Boolean).sort()`.
- Why it is there: `bafa3fe`.
- A user would lose: nothing.
- Plainer: no helper (it would wrap one line). The copy at 127 goes with 2.1; the others stay inline.
- Recommended action: keep

## 10. Hard-coded text and fixed sizes

**10.1 Calendar cells are forced to size 9 on phones in two places, with no reason written**
- Where: `components/picker-frame.tsx:196`; `modes/range-mode.tsx:267`; `components/picker-calendar.tsx:101` (`min-h-9`)
- Today: the dialog sets `--cell-size: --spacing(9)` on any calendar inside by slot selector; date-time ranges set it again under `max-md` in any popup.
- Why it is there: `c27be55` and `31dedca` (deleted comment: "the month is then wide enough for the date-time box"). A fixed size to make two own parts agree. Audit 5 item 3 and audit 6 H9 asked why.
- A user would lose: not verified; in a phone popover the date-time box may clip its text.
- Plainer: delete both; the style's own `--cell-size` applies (`styles/style-vega.css:228`).
- Recommended action: owner call: delete and check on the phone, or keep one copy with a reason

**10.2 Each clock column has a fixed height and width**
- Where: `components/time-columns.tsx:70`
- Today: `h-56 w-18` on every column, including AM/PM; a translated "p. m." wider than 4.5rem is cut. The popup around it also scrolls (`utils/popover.utils.ts:4`).
- Why it is there: no source found; `5cdcfb1` kept the sizes it found.
- A user would lose: with `max-h-56` a short list makes the popup shorter; without `w-18` column widths differ between 12 and 24 hour clocks. Not seen in a browser.
- Plainer: `max-h-56`, width from the buttons.
- Recommended action: fix

**10.3 Popups are lined up with the box by two pixel offsets that fit one theme**
- Where: `utils/popover.utils.ts:7-9`; users `components/clock-popover.tsx:63-65`, `components/picker-box.tsx:59`
- Today: `alignOffset: -8`, `sideOffset: 10`, because the popup is anchored to the icon inside the box. Box height and addon padding differ per style (`styles/style-maia.css:1407`, `styles/style-nova.css:1410`).
- Why it is there: `3136dfc`.
- A user would lose: with stock offsets (`ui/popover.tsx:18-20`) the popup edge sits 8px inside the box edge.
- Plainer: anchor to the box: `anchor` exists (`nm/@base-ui/react/internals/useAnchorPositioning.d.ts:74-79`) but `ui/popover.tsx:22-26` does not forward it, so that edits the shadcn part.
- Recommended action: owner call: accept stock offsets, or forward `anchor` in the popover part

**10.4 Two bracket lengths replace the stock calendar's spacing**
- Where: `components/picker-calendar.tsx:89, 101`
- Today: `gap-[calc(var(--cell-size)*0.4)]` (0.8rem against stock 1rem, `ui/calendar.tsx:52`) and `mt-[calc(var(--cell-size)*0.2)]` (0.4rem against 0.5rem, `ui/calendar.tsx:96`).
- Why it is there: `a34096f`, carried from the demo page. No owner request.
- A user would lose: the calendar grows about 0.7rem in height.
- Plainer: stock `gap-4` and `mt-2`.
- Recommended action: remove

**10.5 The iOS placeholder is placed with one theme's padding and text size**
- Where: `components/picker-field.tsx:195`
- Today: `ps-2.5 text-sm`; off in sera (px-0), luma and maia (px-3), mira (px-2, text-xs), lyra (text-xs).
- Why it is there: copied from the vega input. The overlay itself is owner-kept.
- A user would lose: nothing.
- Plainer: no verified stock route; giving the span the input's own style class is not verified.
- Recommended action: owner call: accept, or try the input's style class on the span

**10.6 The decade text uses a fixed en dash and the year is written three ways**
- Where: `modes/period-mode.tsx:193, 199, 252, 256`
- Today: padded at 193 and 252, unpadded at 199 and 256; " – " hard-coded though `labels.rangeJoin` exists (`components/picker-labels.tsx:28`).
- Why it is there: `bafa3fe` and 6.x fixes.
- A user would lose: the visible decade text changes from an en dash to the label's " - ".
- Plainer: build the decade text once with `labels.rangeJoin` and `periodOf("year", ...)`.
- Recommended action: fix

## 11. Left dead, half-removed or over-built by review decisions 1 to 5

Built the plain way, checked: decision 1 closes through Base UI `actionsRef` with no own open state; decision 2 left no key handler, ref or tab-index code in `components/period-grid.tsx`; decision 5's year box was not re-read (already read four times).

**11.1 The year range still waits for the box to be left before growing the year list, although the box no longer sends half-typed years (decisions 4 and 5)**
- Where: `modes/period-mode.tsx:287-288, 291, 338, 377-381, 391`
- Today: `typing` holds the end being typed and filters it out of the list bounds until blur. The box stores only a complete four-digit year (`components/picker-field.tsx:44-48, 161, 180-183`). It costs something: a typed far year such as 1443 leaves the grid on the 1900 decade until the box is left.
- Why it is there: `a9840a8`, for the proposal's "years 1, 14, 144" rule, obsolete since .7.1.
- A user would lose: nothing; the single year box already behaves without it.
- Plainer: delete the state, the filter, both resets, the `onFocus` block and the comment.
- Recommended action: remove

**11.2 Decision 2 removed the grid's arrow keys and left the same code in the clock**
- Where: `components/time-columns.tsx:99-140` (item 1.1)
- Today: see 1.1.
- Why it is there: the decision named `period-grid.tsx` only.
- A user would lose: see 1.1.
- Plainer: see 1.1.
- Recommended action: remove

**11.3 Decision 2 removed the `dir` read for arrow keys; the `dir` wrapper stayed**
- Where: `modes/period-mode.tsx:173, 233`; `date-picker.tsx:70` (item 8.11)
- Today: see 8.11.
- Why it is there: 6.1 right-to-left arrow keys.
- A user would lose: see 8.11.
- Plainer: see 8.11.
- Recommended action: owner call: drop it, or keep it as the grid's one calendar-like option

**11.4 Decision 1 added the strict presentation union and left the loose copy under a calendar name**
- Where: `components/picker-calendar.tsx:47-49`; `components/picker-frame.tsx:49-54` (item 8.4)
- Today: see 8.4.
- Why it is there: kept "for the picker's own parts".
- A user would lose: nothing.
- Plainer: see 8.4.
- Recommended action: fix

**11.5 Decision 1 left a pass-through and a wrapper behind**
- Where: `components/picker-box.tsx:20, 30, 42` (`onPickerOpenChange`, used only to reset the month, item 3.3); `modes/range-mode.tsx:156` (item 4.9)
- Today: see those items.
- Why it is there: open state moved into the popup props.
- A user would lose: nothing.
- Plainer: see those items.
- Recommended action: fix

**11.6 Decision 4 made two click paths reachable that were never written for typed ends**
- Where: `utils/period.utils.ts:81-89` (item 6.6); `modes/period-mode.tsx:304-308` (item 6.7)
- Today: a lone typed To is dropped on click; the grids open away from it.
- Why it is there: both functions predate the typed boxes.
- A user would lose: nothing.
- Plainer: see 6.6 and 6.7.
- Recommended action: fix

**11.7 Decision 4 reused the date range's order hook for one blur check**
- Where: `modes/period-mode.tsx:337-345, 489-493`; `hooks/use-range-order.ts:14, 23-28`
- Today: the hook runs for all six period pickers; only the year range uses its result, and only the blur half. The close commit is written again at 489-493.
- Why it is there: `a9840a8`.
- A user would lose: nothing.
- Plainer: decided with 3.1; if the swap stays, drop `type === "year" &&` at 490 and use one route.
- Recommended action: fix (after 3.1)

**11.8 Decision 4 left a narrowing trick and a year grey-out behind**
- Where: `modes/period-mode.tsx:89-99, 476-478` (item 4.12); `modes/period-mode.tsx:263-264` (item 4.11)
- Today: see those items.
- Why it is there: single year moved to a box.
- A user would lose: see 4.11.
- Plainer: see those items.
- Recommended action: fix

**11.9 Decision 3 put the types at the top but kept names that no longer say what they hold**
- Where: `components/picker-calendar.tsx:17, 39, 47, 51` (item 5.13)
- Today: see 5.13.
- Why it is there: older names kept.
- A user would lose: nothing.
- Plainer: see 5.13.
- Recommended action: fix

## 12. Examined and kept (one line each: piece, the user need it serves)

- `date-picker.tsx:135-141` labels provider: the `labels` prop, the picker's words in another language.
- `date-picker.tsx:143-153, 156-228` `TypePicker` destructuring and the two switches: one component for six types; lets TypeScript narrow `value`.
- `date-picker.tsx:49-54` `Single` and `Range`: `value` is a string or a pair by `range`.
- `date-picker.tsx:58-72` narrowed `calendarProps` for week and grids: options the picker would accept and ignore are not offered.
- `date-picker.tsx:19-20, 125-129` exported types: apps type their state.
- `modes/date-mode.tsx:29, 42, 59`, `modes/period-mode.tsx:441, 451-456` `actionsRef` close on pick: single date, week, month, year close on pick (decision 1).
- `utils/date.utils.ts:42-88` `calendarBounds`, `limitDays`, `monthOf`: year list 1900 to 2100 growing by century, limits greyed.
- `modes/date-mode.tsx:62-68` preset sets the value and moves the month: proposal, Presets.
- `modes/datetime-mode.tsx:78-80, 85-88` time field under the calendar, disabled until a date exists, with step and day-bound limits: Safari has no time picker in its date-time box.
- `modes/time-range-mode.tsx:12-15` `popoverProps` without open keys: one open flag would open both clocks.
- `modes/time-range-mode.tsx:27-33, 42, 48, 55-56` id on the first box, `-to` on the second, aria passed to both, distinct clock names: a Field wrapper's label and error reach the inputs.
- `components/time-field.tsx:17-52` box plus clock: three callers.
- `components/picker-box.tsx:25-65` shell of box, calendar button, popup: three callers (date, date-time, year).
- `components/picker-labels.tsx:12-62, 64, 66-73` 48 labels and the context: every key has a reader; about ten components read them.
- `components/picker-presets.tsx:5, 16-42` preset as value or function, generic over the value: "Last 7 days" worked out at the click; four callers.
- `components/picker-presets.tsx:24` `w-0 min-w-full`: many presets wrap and do not widen the popup.
- `modes/range-mode.tsx:80-101, 200, 285-286` band classes and the `oneDay` modifier: the band look the owner promoted (4.AC).
- `modes/range-mode.tsx:152-161` custom clock in the date-time box: native replacement rejected.
- `modes/range-mode.tsx:179-184` `typing` for the date range: a native date box does send years 1, 14, 144 while typed (unlike the year box, 11.1).
- `modes/range-mode.tsx:185-188, 274-290`, `utils/range.utils.ts:116-163, 185-196` two calendars kept apart: owner's 6.1 fix list.
- `modes/range-mode.tsx:198-199, 284` sorted days handed to the calendar: the band is right while an end is typed out of order.
- `modes/range-mode.tsx:308-349` preset row and the two layouts: box-over-calendar phone layout rejected.
- `modes/range-mode.tsx:367-370` `times` from `edgeTime`: a picked day gets a time on the app's step.
- `utils/range.utils.ts:21-33, 41-45` `RangeValue`, `rangeEnds`, `putEnd`: public value and three callers.
- `utils/range.utils.ts:94-108` `selectRange` core: a new end must not wipe the time typed on the other.
- `utils/range.utils.ts:198-201` `dateLibFor`: trigger text follows the calendar's locale (mirrors `nm/react-day-picker/dist/esm/DayPicker.js:87`).
- `components/picker-trigger.tsx:43-47, 56-59, 73-77` id and aria on the button, other attributes on the wrapper: a Field wrapper's wiring lands on the control.
- `components/picker-trigger.tsx:53, 93-105` X and focus back to the trigger: the X unmounts on clear.
- `utils/period.utils.ts:14-57, 64-78, 91-97` patterns, `periodOf`, `startOfPeriod` round trip, `dayLimits`, `outsideLimits`, `formatPeriod`, `rangeState`: browser value formats, limits, localized trigger text.
- `components/period-grid.tsx:30-52` plain buttons with `aria-pressed`: decision 2 built plainly.
- `modes/period-mode.tsx:106-108` `inYear`: `new Date(50, 0, 1)` would be 1950.
- `modes/period-mode.tsx:185-196, 217-254` year select in the month header and decade paging: jump many years without paging.
- `modes/period-mode.tsx:139-140` `showWeekNumber` and `ISOWeek`: the value is an ISO week.
- `components/picker-calendar.tsx:112-142, 235-249` `fixedWeeks "blank"` with its context, module-level `Root` and `DayButton`: agreed in proposal.md:57; the stock file remounts days by building them inline (`ui/calendar.tsx:137, 170`).
- `components/picker-calendar.tsx:143-146, 155-222` caption arrows and Today on the right: stock nav arrows rejected.
- `components/picker-calendar.tsx:224-265` merge of `calendarProps` with the mode's props: the app's disabled days and modifiers are not dropped.
- `components/picker-field.tsx:34-41, 71-104, 137-138, 157, 186` draft, remount, read on blur: half-typed text is not sent up; the browser's message shows only after leaving.
- `components/picker-field.tsx:150-155, 172-184`, `utils/date.utils.ts:4-40` step base, `storableMax`, year-10000 guard, `fromYmd`, `datePart`, `timePart`: `step` really flags; a five-digit year never reaches the value.
- `components/picker-field.tsx:187-199` hidden WebKit icon and the iOS placeholder overlay: one calendar button; dropping the overlay was rejected.
- `components/picker-frame.tsx:25-47, 67-86, 103-158, 176-184, 192-202` presentation types, root and content split, named popup, full-screen phone dialog: decision 1 and the owner-approved phone dialog.
- `components/time-columns.tsx:40-44, 46-53, 57-67, 70-93, 155-186, 247-259` 12 or 24 hours by locale, one generic column, centring effect (its arithmetic stays: `scrollIntoView` would scroll the popup and page too), hidden scrollbar, step filtering, seconds under step 60: proposal.md:89-90 and the owner's 4.AO fix.
- `components/clock-popover.tsx:39-44, 47-65` open-state split, labelled icon button, `w-auto p-0`: decision 1; stock popup is `w-72` (`ui/popover.tsx:39`).

## Biggest wins

| # | Item | What it gives |
|---|------|---------------|
| 1 | 3.1 | Owner choice on the swap: removes or halves the hook, `picking`, the close commit, 3.4, 6.5 |
| 2 | 1.1 | 42-line key handler and its tab-stop code gone from the clock; removes bug 6.8 |
| 3 | 6.1 | Time box in the date-time popup becomes editable and clearable |
| 4 | 3.2 | Focus trap, two hidden Close buttons and two primitive imports gone |
| 5 | 4.1 with 4.2 | `PeriodPanels` readable: one view state, no `Ends` length tests |
| 6 | 11.1 | Dead `typing` state gone from the year range; far years show at once |
| 7 | 8.1 | Public props written directly; lets 4.7 delete `time-mode.tsx` |
| 8 | 4.3 | One guard for limits; computed `min`/`max` strings compile |
| 9 | 9.1 | One same-value guard in place of nine; `samePair` identity trick gone |
| 10 | 3.3 with 9.2 | One day panel; month reset and the duplicate calendar block gone |
| 11 | 5.1 | One "phone dialog" test; about 25 slot-attribute utilities lose their prefix |
| 12 | 6.2, 6.3, 6.4 | Clock and day click stop producing values outside `min`/`max` |
