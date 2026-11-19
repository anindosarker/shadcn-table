# Audit 5: date-picker-4ai, fresh read

## Summary

1. Read all 15 files (1,929 lines) plus `hooks/use-mobile.ts` and the six `components/ui` parts. No code changed.
2. Counts: A (no reason a user would notice) 9; B (stock gives the same behaviour) 6; C (stock changes behaviour slightly) 15; D (keep) 25; defects seen while reading 5; undetermined 10.
3. Most of the weight sits in four chains, each started by one custom choice: (a) rows stretched to fill the phone dialog, (b) "left month strictly before right month", (c) fields regrouped above the calendars on phones, (d) a hand-built clock instead of the native time picker.
4. The known `keepMonthsApart` flaw is chain (b): the pushed month overwrites the month the user chose, in one piece of state. It cannot be fixed inside `keepMonthsApart`; see C3.
5. Base UI already focuses the popup on touch opens; the `popupRef` in `picker-frame.tsx` repeats that and extends it to mouse and keyboard (C7).
6. react-day-picker already clamps `defaultMonth` and `goToMonth` to `startMonth`/`endMonth`; the picker clamps again in three places (B1, B2).
7. The same default bounds are applied in five layers and as five dead default parameters (A1, A2, B1).
8. "Dialog on a phone" is expressed twice: a JS flag (`fill`) and a CSS variant used 31 times (B4).
9. The clock (254 lines in two files, custom keys, roving tab stop, scroll maths, a `picking` state) is not on the keep list and has a native counterpart (C1). Owner call.
10. I ran nothing in a browser. Every claim about how something looks or how Safari, iOS or Firefox behaves is marked; the list is at the end.

Method input (fetched with `gh api`, all five files read): `DietrichGebert/ponytail` `skills/ponytail/SKILL.md` (ladder: needed at all, already in codebase, platform or stdlib, installed dependency, one line), `skills/ponytail-review/SKILL.md` and `commands/ponytail-review.toml` ("every finding needs a concrete case", "prefer fixes that delete code"); `addyosmani/agent-skills` `skills/code-simplification/SKILL.md` (Chesterton's fence, step 1) and `skills/code-review-and-quality/SKILL.md`. No fetch failed.

Paths below are relative to `test-projects/next-app/`. `dp/` = `components/date-picker-4ai/`. `rdp/` = `node_modules/react-day-picker/dist/esm/` (10.0.2). `bui/` = `node_modules/@base-ui/react/` (1.9.0).

Confidence words: **verified** = read in source or run in node; **reasoned** = follows from source or docs but not seen running.

---

## A. Exists for no reason a user would notice (pure removals)

**A1. Five dead default parameters `bounds = defaultBounds`.**
`dp/utils/range.utils.ts:108, 133, 155`, `dp/utils/date.utils.ts:43, 59`.
Fails Q5. Every caller passes bounds: `keepMonthsApart` (range-mode.tsx:266; range.utils.ts:139, 147, 159, 167, 173), `monthsForRange` (range-mode.tsx:180, 185), `followTypedEnd` (range-mode.tsx:227), `boxLimits` (picker-field.tsx:91), `monthOfValue` (date-mode.tsx:78, datetime-mode.tsx:88, range.utils.ts:157, 161). Delete the five ` = defaultBounds`. User notices: nothing. Verified.

**A2. Two names for one value.**
`dp/utils/date.utils.ts:31-33` exports `startMonth`, `endMonth` and `defaultBounds = { start: startMonth, end: endMonth }`. Only `dp/components/picker-calendar.tsx:10-14` uses the first two (renamed on import); everything else uses `defaultBounds`. Fails Q5. Keep `defaultBounds` only. User notices: nothing. Verified.

**A3. `lastStorable` year-9999 cap.**
`dp/utils/date.utils.ts:35, 51` and the second half of the JSDoc at 37-40. Fails Q1. `min([endOfMonth(bounds.end), lastStorable])` differs from `endOfMonth(bounds.end)` only when a caller passes `endMonth` after December 9999. Node run with the default bounds gives `max = 2100-12-31`. Same family as the removed year-1000 `min`. User notices: nothing unless `endMonth` is past year 9999. Verified.

**A4. `aria-hidden` on a row that is already `invisible`.**
`dp/components/picker-calendar.tsx:167`. Fails Q2. `visibility: hidden` removes the element from the accessibility tree and from focus (MDN, CSS `visibility`, "Accessibility" section and the `hidden` value: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/visibility). The comment above it (156-159) already says the row "cannot be seen, tapped or focused" because of `invisible`. User notices: nothing. Reasoned from the doc.

**A5. `cn()` around one string literal.**
`dp/components/picker-frame.tsx:115-117`. Fails Q6. `className={cn("…")}` with one argument and no condition. Plain `className="…"`; the `cn` import (line 4) then has no user in the file. User notices: nothing. Verified.

**A6. A hidden pseudo-element also given `appearance-none`.**
`dp/components/picker-field.tsx:107`: `[&::-webkit-calendar-picker-indicator]:hidden` and `[&::-webkit-calendar-picker-indicator]:appearance-none`. `display: none` already removes it. User notices: nothing. Reasoned, not seen in WebKit.

**A7. Comments that are not a still-true why (Q7).**
- `dp/modes/range-mode.tsx:52-55` and `59-62`: describe how the band is drawn, not why the stock band (`components/ui/calendar.tsx:112-120`) was replaced. The second warns about week numbers, which `DatePicker` cannot turn on (`CalendarOptions`, picker-calendar.tsx:238-241, does not carry `showWeekNumber`).
- `dp/modes/range-mode.tsx:317-320`: sits on the `RangePicker` function but explains one class on line 354.
- `dp/components/picker-frame.tsx:76-79`: says what `initialFocus={popupRef}` does; the reason it gives is already Base UI's default for touch (C7).
- `dp/hooks/use-range-order.ts:6-9`: documents a wrong result on Safari instead of a reason for the code under it (defect 1).

**A8. One prop shape written five times.**
`Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "children"> & { value; onChange; disabled? }` appears at `dp/date-picker.tsx:14-21` (as `ControlProps`), `dp/modes/date-mode.tsx:31-37`, `datetime-mode.tsx:41-47`, `time-range-mode.tsx:21-28`, `range-mode.tsx:336-346`. Fails Q5 (duplicate). `ControlProps<Value>` already exists; the four modes can import it. User notices: nothing (types only). Verified.

**A9. `DatePickerModes` builds its entries two ways.**
`dp/date-picker.tsx:29, 31, 34` use `React.ComponentProps<typeof Mode>`; lines 30 and 32 hand-compose `ControlProps<RangeValue> & CalendarOptions & RangeFrameProps`, which needs the extra alias at 23-26 and the import on line 4. Fails Q6. Same pattern as the others: `Omit<React.ComponentProps<typeof RangePicker>, "withTime">`. One difference to settle first: `RangePicker` types itself on `ButtonGroup` props (range-mode.tsx:336-338), which adds `orientation`; the component forces horizontal (line 354), so `RangePicker` should be typed on `"div"` like the rest. User notices: nothing. Verified.

---

## B. A stock mechanism gives the same behaviour

**B1. `defaultMonth` is clamped by hand; react-day-picker clamps it.**
`dp/modes/date-mode.tsx:78-81`, `dp/modes/datetime-mode.tsx:88-91`: `monthOfValue(value, { start: startMonth ?? defaultBounds.start, end: endMonth ?? defaultBounds.end })`.
Fails Q2. `rdp/helpers/getInitialMonth.js:14-24`: takes `month || defaultMonth || today`, pulls it inside `navStart`/`navEnd`, returns `startOfMonth`. Replacement: date-mode 78-81 become `defaultMonth={fromYmd(value)}` (the same call as line 77); datetime-mode 88-91 become `defaultMonth={fromYmd(date)}` (same as line 87). The `defaultBounds` and `monthOfValue` imports leave both files. User notices: nothing. Verified in source.

**B2. Today button clamps to the wrong bounds, then react-day-picker clamps again.**
`dp/components/picker-calendar.tsx:86`: `goToMonth(monthOf(undefined))` clamps today to the default 1900 to 2100, not to this calendar's `startMonth`/`endMonth`. `rdp/useCalendar.js:75-91` clamps `goToMonth` to the real ones. Replacement: `goToMonth(new Date())`. User notices: nothing. Verified.

**B3. A second, hand-built disabled clock button.**
`dp/modes/range-mode.tsx:136, 143-157`: when there is no date, a look-alike button with `aria-disabled`, `tabIndex={-1}`, `pointer-events-none opacity-50`. `ClockPopover` already has `disabled` (`dp/components/clock-popover.tsx:19, 32`), used by `TimeField`. Fails Q5 (duplicate). Replacement: one `<ClockPopover disabled={!value} … />`; the "Pick a date first" title moves to the field, as `datetime-mode.tsx:112` does. User notices: the tooltip appears over the whole box instead of only the clock; a natively disabled button instead of an `aria-disabled` one. Both paths verified in source; tooltip reasoned.

**B4. "Dialog on a phone" is tested in JS and in CSS, side by side.**
JS: `fill` (`dp/components/picker-frame.tsx:45`, read at `range-mode.tsx:189`). CSS: `in-data-[slot=dialog-content]:max-md:` 31 times (22 in picker-calendar.tsx, 9 in range-mode.tsx).
In `RangePanel`, where `fill` is in scope:
- `range-mode.tsx:251-258`: the badge is always rendered and hidden by class. Plain: `captionTag={fill ? <Badge variant="secondary">…</Badge> : undefined}`; `MonthCaption` already handles no tag (picker-calendar.tsx:180-187), so the extra wrapper `div` also stops rendering off-phone.
- `range-mode.tsx:200-201`: `orientation={fill ? "horizontal" : undefined}` on one line, the CSS form of the same test on the next.
User notices: nothing. Verified. (`useIsMobile` uses 768 px, `max-md` uses 48rem; equal only at a 16 px root font.)

**B5. `formatDate` parses the string by hand; `fromYmd` is in the same folder.**
`dp/utils/range.utils.ts:177-179` (`split`, `Date.UTC(2000, …)`, `setUTCFullYear`) and `timeZone: "UTC"` on 184. Fails Q2 (already in the codebase). `fromYmd` returns a local date and handles years 0 to 99. Node run, six dates including years 0005, 0099, 1582: output identical for both `alone` values. Year padding (186-190) must stay: `Intl` prints year 5 as "5" (run). User notices: nothing. Verified in one time zone (Asia/Dhaka).

**B6. Default bounds applied in five layers.**
`picker-calendar.tsx:246-247`, `picker-field.tsx:21-22`, `range-mode.tsx:170-171`, `date-mode.tsx:79-80`, `datetime-mode.tsx:89-90`. After B1 the last two go. The first three are each a real entry point, so they stay. Listed so the count is visible.

---

## C. A stock mechanism or plainer rule changes behaviour slightly

Sorted by how much other code each one holds up.

**C1. The clock popover. Not on the keep list.**
`dp/components/time-columns.tsx` (all 195 lines), `dp/components/clock-popover.tsx` (all 59).
Fails Q2 and Q4. It brings: custom arrow-key handling (88-127), a roving tab stop (40, 71, 75), scroll-centering maths (42-55), a 12/24-hour probe (16-20), a ref passed down three levels (`hourRef` to `initialFocusRef` to `tabStopRef`), and, outside the two files, the `picking` state in `use-range-order.ts:14, 18, 28-33` with `onOpenChange` threaded through `time-field.tsx:10, 15, 30`, `range-mode.tsx:95, 105, 141, 235` and `time-range-mode.tsx:47`. `picking` exists only because the clock is a portal: opening it blurs the field.
Native: every box here is already `<input type="time|datetime-local">`. The native picker button is hidden on purpose (`picker-field.tsx:107`), and `HTMLInputElement.showPicker()` exists (`node_modules/typescript/lib/lib.dom.d.ts:15025`; MDN lists `time` and `datetime-local`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/showPicker).
User notices: the OS time picker instead of the three columns. On desktop Firefox and Safari there may be no time picker at all, only typing. Not checked; needs browsers. Owner call.

**C2. Calendar rows stretch to fill the phone dialog. This forces the custom range band.**
Root: `flex-1` on every level so weeks share the dialog height: `picker-calendar.tsx:50, 54, 58, 62, 66` and `range-mode.tsx:65`, plus `picker-frame.tsx:116` (`*:data-[slot=card]:grow`).
Once cells are not square, the stock band (`components/ui/calendar.tsx:112-120`, which assumes the button fills the cell) no longer fits. What follows from it:
- `range-mode.tsx:56-57` `bandEnd` (two pseudo-elements), 72-81 with `last:after:hidden` and `first:after:hidden`,
- `range-mode.tsx:192, 262-263` the `oneDay` modifier and its class,
- `range-mode.tsx:68-70, 83` `range_middle` and `day_button` overrides, three `transition-none!`,
- `picker-calendar.tsx:32` the phone-only half of `today`, and line 66 (eight `*:` utilities on the week).
Fails Q4. A full-screen dialog does not need stretched rows; with calendars at their natural height the stock band applies. User notices: on a phone the two calendars keep their natural height, with free space below or a scroll. That the band override exists only because of the stretch is my reading; the comments give no reason. Reasoned; needs a phone.

**C3. "Left month strictly before right month". Root of the known flaw.**
`dp/utils/range.utils.ts:96-174` (`shiftMonth`, `keepMonthsApart`, `monthsForRange`, `followTypedEnd`), `dp/modes/range-mode.tsx:179-187, 259-260, 264-267`.
Fails Q4. The rule exists so both calendars never show the same month. To hold it, moving one side rewrites the other (`range.utils.ts:117-119, 124-126`), and the rewritten month is stored in the same `months` state as the month the user chose (`range-mode.tsx:179`). A half-typed To year (0002) pushes `left` back; when the year completes, nothing remembers where `left` was. That is the flaw, and no change inside `keepMonthsApart` can fix it.
Two plainer rules:
- Store only what the user chose (two months and which side moved last); compute the shown pair at render with the same `keepMonthsApart`. The push then undoes itself. Same UX, flaw gone.
- Or drop the rule: each calendar shows any month. Then `keepMonthsApart`, `shiftMonth`, the special branch at `range.utils.ts:161-172` and the shifted bounds at `range-mode.tsx:259-260` go, and `followTypedEnd` is one assignment. User notices: both calendars can show the same month.
Verified by reading; not run.

**C4. Fields are regrouped above the calendars on phones. This forces the caption tag.**
`range-mode.tsx:284-300` (second layout), `picker-frame.tsx:22-29, 45-46` (`fill`, `useMemo`, `usePickerFrameFill`). Because each calendar then loses the field that names it: `captionTag` (`picker-calendar.tsx:248, 254`), `CaptionTagContext` (138, 258), the tag branch in `MonthCaption` (177-187), the `Badge` (`range-mode.tsx:251-258`).
The From/To tags are on the keep list, so this stays unless the pair order is kept on phones too (field, its calendar, field, its calendar). Then all of the above goes and the label does the tag's job. User notices: on a phone, each box sits over its own calendar; no badges. Verified chain; owner call.

**C5. `Dropdown` override keeps the caption from changing width.**
`picker-calendar.tsx:192-228`. Stock: `rdp/components/Dropdown.js:10-20`; the only difference is 206-219, a grid that renders every option's label on top of each other so the label is as wide as the widest. Fails Q1. It serves both dropdowns (`rdp/components/MonthsDropdown.js`, `YearsDropdown.js`), so each calendar also renders one hidden span per year, 201 with the default bounds. Remove 192-228; nothing replaces them. User notices: the year label moves a few pixels when the month name changes width. Verified in source; the size of the shift not seen.

**C6. `ScrollArea` in the time columns adds three tab stops and forces the ref chain.**
`time-columns.tsx:58`. `bui/scroll-area/viewport/ScrollAreaViewport.js:284` gives the viewport `tabIndex: 0` when it scrolls, so each column's viewport is a tab stop ahead of its buttons. That is why the first tabbable is not the hour, hence `hourRef` (`clock-popover.tsx:27, 46, 52`), `initialFocusRef` and `tabStopRef` (`time-columns.tsx:30, 37, 71, 132, 136, 161, 170`), and the `closest('[data-slot="scroll-area-viewport"]')` lookup (45-47). With a plain `overflow-y-auto` div the hour button is the first tabbable and Base UI's default focus finds it (`bui/popover/popup/PopoverPopup.d.ts:37-39`). User notices: the native scrollbar instead of the styled one; Tab no longer stops on the scroll boxes. Verified in source; only if C1 keeps the clock.

**C7. `popupRef` repeats Base UI's touch default and extends it to mouse and keyboard.**
`picker-frame.tsx:92, 96-97, 107-108`. `bui/popover/popup/PopoverPopup.d.ts:37-39` and `bui/dialog/popup/DialogPopup.d.ts:14-16`: "By default, focus moves to the first tabbable element inside the popup, except when … opened by touch, then the popup itself is focused to avoid opening the virtual keyboard." Fails Q3: a touch fix applied to every device. Remove the ref and both `initialFocus` props. User notices: opening with mouse or keyboard puts focus on the first control (the month dropdown in date mode, the From box in range mode) instead of on the popup, so typing works at once. Touch: unchanged per the doc. Verified in types; not run.

**C8. After the X is pressed, focus is moved by DOM lookups.**
`picker-field.tsx:73-78`: `closest("[role=dialog]")`, else `closest("[data-slot=input-group]")?.querySelector("button[aria-haspopup]")`. It depends on attributes Base UI happens to render. Fails Q4. Cause: the X hides itself (`invisible`, line 124) while it has focus. Rule that removes the need: do not hide the control that has focus, for example `not-focus:invisible` in place of `invisible` (Tailwind 4.3.3 has the `not-*` variant, `node_modules/tailwindcss/dist/lib.js`). Then 73-78 go. User notices: after clearing by keyboard the X stays visible until focus leaves it. Reasoned; whether a focused element may stay visible this way on every engine needs a browser.

**C9. The iOS-only placeholder overlay.**
`picker-field.tsx:20, 37-38, 108, 111-118` and the prop at `date-mode.tsx:42`, `datetime-mode.tsx:53, 108`, `range-mode.tsx:115, 129`. Shown only when `@supports (-webkit-touch-callout: none)` matches. Fails Q3 and Q6. The cause is the platform (an empty date box is blank on iOS), not something the component does. Leaving it to the browser removes all of the above. User notices: on iPhone an empty box is blank. Needs an iPhone.

**C10. `clearValue`, one caller.**
`picker-field.tsx:18, 35, 79-80, 84, 99`; set only at `datetime-mode.tsx:110`. The same caller already turns an empty time into "00:00" (line 114). The prop's only extra effect: the X hides at 00:00, and an emptied time box refills with 00:00 while typing. Fails Q5. Without it: user notices an X at 00:00 that does nothing visible.

**C11. `size` prop and its `cva`.**
`picker-calendar.tsx:16-26, 244, 266`; passed through five files. No demo card passes it (`app/date-filter-demo/_cards/row-1-date.tsx:113-119`, `row-3-datetime.tsx:113-119`, `row-4-datetime-range.tsx:652-660`). The default variant sets `--cell-size` to `--spacing(7)` and so overrides each style's own value (`styles/style-vega.css:228` is 8, `style-mira.css:232` is 6, `style-nova.css:232` is 7). Fails Q1 and Q2: the style already sizes the calendar. A `cva` with an empty base for a two-entry lookup also fails Q6. Without it: user notices the calendar follows the active style (one step larger in vega, luma, maia, rhea, sera; smaller in mira). Verified in source.

**C12. `CaptionNav` re-implements react-day-picker's `Nav`.**
`picker-calendar.tsx:71-74, 93-136` against `rdp/components/Nav.js:23-27`: the same `tabIndex`, `aria-disabled`, `aria-label`, guarded click, chevron. It exists to put the arrows inside the caption with Today between them. Stock: `navLayout="after"` (`rdp/types/props.d.ts:160-172`, rendered at `rdp/DayPicker.js:299-301`) puts the stock `Nav` right after the caption. Today would then sit beside the arrows, not between. User notices: button order. Layout with the shadcn `nav` class (`components/ui/calendar.tsx:53-56`, absolutely positioned) is reasoned, not seen.

**C13. Enter orders the range.**
`use-range-order.ts:22-26`. The keep list says "when leaving a box". A native date box does nothing on Enter. Fails Q1 unless the owner wants it. Without it: Enter no longer swaps From and To.

**C14. From/To label width stack.**
`range-mode.tsx:204-217`: both labels rendered on top of each other so "From" and "To" are equally wide. It matters only in the horizontal phone layout (C4); in the vertical layout it does nothing. Stock: a two-column grid on the two fields with `grid-cols-subgrid`. Reasoned; goes away with C4.

**C15. Card inside the popover, then un-styled in the dialog.**
`datetime-mode.tsx:77`, `range-mode.tsx:286, 304` wrap the content in `Card`. `picker-frame.tsx:116` then removes its border, background, shadow, ring, radius and padding on phones with eleven `*:data-[slot=card…]` utilities. Fails Q4. A plain padded `div` (and `border-t` for the time footer) needs none of them. User notices: possibly small spacing differences; not seen.

---

## Defects seen while reading (not simplifications)

1. **Safari clears the other end.** `use-range-order.ts:17-21` with `picker-field.tsx:125`. Safari does not focus a clicked button (MDN, `<button>`, "Clicking and focus": https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#clicking_and_focus), so `relatedTarget` is null and the blur orders the range before the click lands. Case: From 10 Jan, To typed as 5 Jan, press To's X. Chrome: To is cleared, 10 Jan stays. Safari: the range swaps first, then index 1 is cleared, so 10 Jan is lost and 5 Jan stays. The comment at lines 6-9 describes this. Reasoned from source and the doc; needs Safari.
2. **The box is marked invalid while it is being typed.** `picker-field.tsx:95, 104`: `read` runs on every key up; a half-filled date box is `badInput`, so `aria-invalid` is set after the first segment, and `styles/style-vega.css:1398` draws the destructive ring for `has-[[data-slot][aria-invalid=true]]`. Reasoned; needs a browser. CSS has `:user-invalid` for "only after the user is done" (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid; Tailwind 4.3.3 ships `user-invalid:`), but the shadcn styles key on `aria-invalid`.
3. **`modal="trap-focus"` without a close button.** `picker-frame.tsx:50`, `clock-popover.tsx:29`. `bui/popover/root/PopoverRoot.d.ts:54-55`: "When `modal` is `'trap-focus'`, render `<Popover.Close>` inside `<Popover.Popup>` so touch screen readers can escape the popup." Neither popover renders one. Verified.
4. **Three extra tab stops in the clock** (C6). Verified in source.
5. **Garbage `value` throws.** `range.utils.ts:176-191`: a non-date string gives an invalid `Date`, and `Intl.DateTimeFormat#formatToParts` throws on it. Only reachable from a caller's own bad value. Reasoned.

---

## D. Keep: real reason (examined, stays)

Calendar
- `pickerComponents.Root` and `DayButton` (picker-calendar.tsx:146-155, 172-175): the stock `Calendar` creates both inside its render (`components/ui/calendar.tsx:137, 170`), so every render remounts the grid. Blur handlers here render between mouse down and up. Verified. Proper fix is upstream.
- `Week` override and `BlankWeeksContext` (139, 160-171, 259): the `"blank"` value, on the keep list. A `has-` selector could replace it but is harder to read.
- `CalendarProps` distributive type (231-236): forced by putting `"blank"` on the stock prop name `fixedWeeks`; a plain `Omit` would flatten the single/multiple/range union. Fails Q6, but the only way out is a different prop name.
- `String.raw` selector (46): overriding the `caption_label` slot instead would mean copying the string the stock file computes at `calendar.tsx:83-89`.
- `captionLayout="dropdown"`, `hideNavigation`, `month_caption` and `dropdowns` overrides: follow from the custom caption.
- `outside` override (35-39): two calendars show the same range in outside days.

Boxes
- `text` state and `read` (picker-field.tsx:42, 61-63): the input is controlled and invalid values are not sent up, so without it React would put the old value back while the user types.
- `shown` mirror (48-55): drops `text` when the value changes from outside. The pattern React documents for this.
- `remount` key (47, 53, 72, 88): see undetermined 1.
- `onKeyUp` read (104): a first segment typed into an empty box changes validity without an `input` event. Reasoned.
- `boxLimits` (date.utils.ts:41-53) and the `time` early return: on the keep list.
- `fromYmd` round trip (date.utils.ts:12-17): node run shows it rejects only un-padded text such as "2025-1-5", which a native box never produces; it guards a caller's own value. Small; stays.
- `samePair` (range.utils.ts:27-29): stops `onChange` firing with an equal pair (picking the same hour again), which in a table would re-run the filter.

Range
- `orderRange` with `refit` (37-50), `commitOrder`: auto-ordering, on the keep list.
- `selectRange` only-To branch (74-76): keeps a typed To time when a later day is picked; the general path would reset it to 00:00.
- `triggerRef` focus after Clear (range-mode.tsx:347, 407): the button unmounts; a ref is the plain way.
- `cn-button-group-orientation-horizontal` (354): the local `button-group.tsx:14` hardcodes `rounded-r-lg!`; the styles define this class with their own radius (`styles/style-vega.css:210-212`). Workaround for the stock file.
- Close-time `commitOrder` (359-363): see undetermined 6.

Frame
- `useIsMobile` for `auto`: popover and dialog are different trees; CSS cannot switch them.
- `FrameContext.frame`, `PickerFrameTrigger`, `PickerFrameContent`: one place that picks popover or dialog.
- Dialog title and Done button: a dialog needs a name and a way out.
- `fieldPopover` offsets (popover.utils.ts:5-7): the trigger is the icon inside the group; the stock `PopoverContent` does not expose `anchor`.
- `role` only when labelled (time-range-mode.tsx:34): `aria-label` on a plain `div` is not valid.

Other
- `mode satisfies never` (date-picker.tsx:73): exhaustiveness check, one line.
- `useRangeOrder` blur with `relatedTarget` (17-21): "leaving a box" has to ignore moves to the box's own buttons.

---

## Could not determine without a browser or an iPhone

1. Whether assigning `input.value = ""` clears half-typed segments in Chromium and WebKit. If it does, the `remount` state and key (picker-field.tsx:47, 53, 72, 88) reduce to a ref.
2. Whether `onBlur={read}` (picker-field.tsx:105) ever sees a state that `onChange` and `onKeyUp` missed (mouse wheel or spinner on a segment).
3. Why `withTime` raises the cell size below `md` (range-mode.tsx:244), and why the dialog forces size 9 (picker-frame.tsx:109) regardless of `size`.
4. Why line 134 of range-mode.tsx needs seven reach-in utilities and `max-md:contain-inline-size`; probably the width of a native `datetime-local` box on iOS.
5. Why `day_button` needs `transition-none!` three times (range-mode.tsx:83).
6. Whether closing the popover already blurs the focused box on every path (Escape, outside press, Done). If yes, `range-mode.tsx:359-363` is a fourth trigger for the same ordering.
7. Why `modal="trap-focus"` is set at all; no comment, and the stock shadcn date picker does not set it.
8. What `appearance-none` on the input (picker-field.tsx:107) changes on iOS.
9. Why a date-only range shows a two-digit day and always the year, while a date-time range shows a plain day and hides the current year (range.utils.ts:182-183). Probably trigger width.
10. Everything marked "reasoned" in C2, C7, C8, C9, C12 and defects 1 and 2.

## Self-containment note for the move

Parts used beyond the six named: `ui/card`, `ui/badge`, `ui/scroll-area`, `ui/button`, the `use-mobile` hook, the npm package `cn` (`package.json:22`), `lucide-react`, `class-variance-authority` (only for C11). `Card` goes with C15, `Badge` with C4, `ScrollArea` with C1 or C6.
