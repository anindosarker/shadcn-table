# Audit 6: date-picker-4-6-1, fresh read

## Summary

1. Read all 23 files (3,238 lines), the `components/ui` parts they use, `hooks/use-mobile.ts`, `proposal.md` and `audit-5.md`. No code changed, no browser opened.
2. Worst bug: a date or date-time range whose `min` and `max` fall in the same month shows two empty calendars (A1, run in node).
3. A disabled range, week, month or year picker still submits its value and still blocks the form when `required` (A2).
4. Values set by a click (calendar day, clock, preset) are never checked against `min`, `max` or `step`; only typed values are. The default To time `23:59` ignores `step` (A3, A4).
5. Week, month and year ranges have arrows that are enabled but do nothing at the limits (A5). Ordinary case: a two-year limit.
6. No `any`, no casts, no `@ts-` comments, one effect, no render-time value that can differ between server and client. ISO week maths holds at year ends in three time zones (G).
7. Duplication: the trigger shell is written twice (range and period), the box-plus-calendar shell twice (date and date-time), the caption header twice with different disabled behaviour (C2, C3).
8. Port: Base UI is imported directly in two files, `modal="trap-focus"` in two, the `render` prop in six sites, one Base UI CSS variable; `popoverProps` and `dialogProps` expose Base UI prop types as public API (F).
9. Counts: A 14, B 3, C 3, D 3, E 10, F 9, G 27, H 11.
10. Everything about how a browser validates, focuses or draws is marked "reasoned, not verified" and listed in H.

Paths are relative to `test-projects/next-app/`. `dp/` = `components/date-picker-4-6-1/`. `rdp/` = `node_modules/react-day-picker/dist/esm/` (10.0.2). `bui/` = `node_modules/@base-ui/react/` (1.9.0). date-fns 4.4.0, React 19.3.1.

Confidence words: **verified** = read in source or run in node; **reasoned** = follows from source or docs, not seen running.

---

## A. Bugs, most severe first

**A1. A one-month limit empties both range calendars.**
- User does: `<DatePicker type="date" range min="2026-11-01" max="2026-11-30" />` (or `type="datetime"`), opens the popup.
- Happens: both calendars render a caption area and no month grid, no days.
- Should: the one allowed month is shown.
- Where: `dp/modes/range-mode.tsx:275-276` shifts the bounds per side (`left` ends one month early, `right` starts one month late). With `bounds.start` equal to `bounds.end` the left calendar gets `endMonth` before `startMonth` and the right one `startMonth` after `endMonth`. `dp/utils/range.utils.ts:123-125` already detects this case and returns both months unshifted, but the two props are shifted regardless.
- Stock side: `rdp/helpers/getInitialMonth.js:16-23` pulls the month to `navStart`; `rdp/helpers/getDisplayMonths.js:16-18` then breaks because that month is after `navEnd`, so zero months are displayed.
- Verified: node, `renderToStaticMarkup(<DayPicker mode="range" captionLayout="dropdown" hideNavigation …>)` with the exact props of each side: left `[0 grids, 0 day buttons]`, right `[0, 0]`, control with unshifted bounds `[1, 30]`.

**A2. A disabled range or period picker still submits and still blocks the form.**
- User does: `<DatePicker type="date" range disabled required startName="from" endName="to" />` inside a form, presses submit.
- Happens: the hidden inputs carry no `disabled`, so the values are submitted; when empty and `required` the submit is blocked and an error shows under a control the user cannot operate.
- Should: nothing submitted, no validation, as a native disabled control. MDN `disabled`, fetched: "If the `disabled` attribute is specified on a form control, the element and its form control descendants do not participate in constraint validation" and "aren't submitted with the form" (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled).
- Where: `dp/components/form-inputs.tsx:12-24` has no `disabled` parameter, `28-37` renders the inputs without it. Callers: `dp/modes/range-mode.tsx:389-395`, `dp/modes/period-mode.tsx:390-396`. The types with a native box are correct (`dp/components/picker-field.tsx:125`).
- Verified by reading; the browser rule is from the doc.

**A3. A picked value is never checked against `min`, `max` or `step`; only a typed one is.**
- User does: `type="datetime" min="2026-01-05T09:00"`, clicks 5 January in the calendar.
- Happens: `2026-01-05T00:00` is emitted (`dp/modes/datetime-mode.tsx:114-121`), nine hours under `min`. The day is not greyed because limits are compared by day (`dp/utils/date.utils.ts:63-70`). No mark and no message appear, because `read` runs only on the box's own change, key up and blur (`dp/components/picker-field.tsx:129-141`). The mark appears later if the user happens to focus and leave the box.
- Same hole: the clock lists every hour and minute; `min` and `max` are not passed to it (`dp/components/time-field.tsx:30-37`, `dp/components/clock-popover.tsx:49`, `dp/components/time-columns.tsx:129-137`). Presets (`dp/modes/date-mode.tsx:108-111`, `datetime-mode.tsx:140-143`, `range-mode.tsx:303-307`).
- Same hole, step: the minute and second lists start at 0 (`time-columns.tsx:175, 183`). MDN `step`, fetched: "The step base is `min` if specified, `value` otherwise" (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step). With `min="09:10" step={900}` the valid minutes are 10, 25, 40, 55 and the clock offers 0, 15, 30, 45. With `step` of 3600 or more the hour list is not filtered.
- Should: per proposal lines 43-44, outside values are flagged and the calendar greys what is outside; the clock is the calendar of the time part.
- Verified by reading. When the browser flags after a later blur: reasoned.

**A4. The default To time `23:59` ignores `step`.**
- User does: `type="datetime" range step={900}`, clicks two days.
- Happens: To is `…T23:59`, off the quarter hour the app asked for. With `step={1}` To is `…T23:59`, 59 seconds short of the day's end, while a typed value carries seconds.
- Where: `dp/utils/range.utils.ts:27-29`, used at `49-52`, `76-77`, `93-95`. No function there receives `step`.
- Should: the last value on the step (`23:45` for 900, `23:59:59` for 1).
- Verified by reading.

**A5. Week, month and year ranges: arrows that are enabled and do nothing.**
- User does: `type="month" range min="2025-01" max="2026-12"`. Left panel shows 2025, right 2026. Presses "next year" on the left or "previous year" on the right.
- Happens: nothing. The button is enabled because it compares with the whole list (`dp/modes/period-mode.tsx:139, 143`), then `keepMonthsApart` clamps the moved side back (`dp/utils/range.utils.ts:127-129, 134-136`).
- Same in: the year panels (`period-mode.tsx:202, 206-207`), the month panel's year select, which lists years that snap back (`153-157`), and the week range, whose two calendars get unshifted `startMonth` and `endMonth` (`98-99`) so the arrow and the year dropdown offer a month that is clamped away. With the default 1900 to 2100 it shows only at the far ends.
- Should: disabled at the real limit of that side, as the day range does with `range-mode.tsx:275-276` (subject to A1).
- Verified by tracing the month example through `shownMonths` by hand; not run.

**A6. A required empty box shows an error and a clear X after focus passes through it.**
- User does: `type="date" required`, tabs into the box and out, or clicks in and out, typing nothing.
- Happens: an empty required box is `valueMissing`, so `valid` is false and `badInput` is false. Key up (the Tab that arrives, `picker-field.tsx:140`) stores a draft `{ text: "" }`; `showClear` is `draft !== null` (`110`), so an X appears on an empty box and the iOS placeholder is dropped (`147`). On blur (`141`) the box is marked invalid with "Please fill out this field".
- Should: no X on an empty box. Whether an untouched required box is flagged on blur is the owner's call; the browser's own `:user-invalid` waits for a change or a submit.
- Where: `dp/components/picker-field.tsx:77-93, 110, 140-141, 147`.
- Reasoned from the validity rules; not run.

**A7. A half-cleared box and the value disagree.**
- User does: on a filled date, deletes the day segment, moves on.
- Happens: the box is blank and marked invalid with no text (the browser's message is dropped for `badInput`, `picker-field.tsx:87-88`); `onChange` is not called (`136`), so the app and a table filter keep the old date. A form submit sends the box's value, which is empty, so form data and `value` differ.
- Should: one of the two, consistently. Owner call; the browser's own box reports `""` here.
- Where: `dp/components/picker-field.tsx:124, 132-138`.
- Reasoned; needs a browser for the exact segment behaviour.

**A8. `presentation="auto"`: crossing 768 px while open closes date-time and day-range pickers without telling the app.**
- Happens: `PickerFrame` renders `Popover` or `Dialog` at the same position (`dp/components/picker-frame.tsx:63-80`); a change of type remounts everything under it. Date and period keep `open` in their own state (`date-mode.tsx:47`, `period-mode.tsx:380`) so they reopen as the other frame. Date-time and day range leave `open` inside Base UI (`datetime-mode.tsx:75-76`, `range-mode.tsx:404-405`), so the new frame mounts closed and `onOpenChange(false)` is never called. Also reached on a phone with `defaultOpen`: `useIsMobile` is false on the first render (`hooks/use-mobile.ts:6, 19`).
- Should: one open-state pattern in all four (`useControllable`, already in the folder).
- Reasoned from React's reconciliation; not run.

**A9. After a failed submit, focus does not reach the picker inside a `<fieldset>` or with the `form` prop.**
- Where: `dp/components/form-inputs.tsx:42`: `input.form?.querySelector(":invalid") === input`.
- MDN `:invalid`, fetched: "represents any `<form>`, `<fieldset>`, `<input>` or other form element whose contents fail to validate" (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:invalid). Inside a fieldset the first match is the fieldset. With `form="id"` the input is not a descendant of the form, so nothing matches.
- Should: first invalid control of `input.form.elements`.
- Verified by reading; the selector rule is from the doc.

**A10. Arrow buttons in the month and year grids lose keyboard focus at the limit.**
- User does: with the keyboard, presses "next year" until the last year.
- Happens: the button becomes natively `disabled` while focused (`dp/components/period-grid.tsx:128`).
- Stock: react-day-picker keeps its arrows focusable with `aria-disabled` and `tabIndex` (`rdp/components/Nav.js:24, 26`), which this folder copies for the day calendar (`dp/components/picker-calendar.tsx:98-99, 113-114`). Base UI's button has `focusableWhenDisabled` (`bui/button/Button.d.ts:18-21`).
- Reasoned; what each browser does with focus on a newly disabled button was not seen.

**A11. The screen-reader Close button is an invisible tab stop.**
- Where: `dp/components/picker-frame.tsx:124-126`, `dp/components/clock-popover.tsx:50-52`, class `sr-only`.
- Happens: with focus trapped, Tab reaches a button a sighted keyboard user cannot see; the focus ring is clipped with it. Two such stops when the clock is open inside a popover.
- The button itself is required by Base UI (`bui/popover/root/PopoverRoot.d.ts:54-55`). Should: shown while focused.
- Reasoned from the class; not seen.

**A12. Picking the value that is already set still calls `onChange`.**
- Where: the clock paths, `dp/modes/range-mode.tsx:253-257`, `dp/modes/time-range-mode.tsx:65`, `dp/modes/time-mode.tsx:19` through `dp/components/time-columns.tsx:146-149`. The calendar path guards (`range-mode.tsx:291-293`); `putEnd` returns the same array for an equal pair (`dp/utils/range.utils.ts:35-39`) and it is passed on unchecked.
- Should: no call. In a table each call is a filter update.
- Verified by reading.

**A13. Month `max` in a year under 100 lands in the 1900s.**
- Where: `dp/utils/period.utils.ts:45`, `new Date(last.getFullYear(), last.getMonth() + 1, 0)`. Line 46 already uses `setYear` for the year type.
- Verified: node, `max="0099-05"` gives `1999-05-31`.

**A14. A far typed year makes the year dropdown very long.**
- Where: `dp/utils/date.utils.ts:48-59`. A typed 9999 gives an end year of 10000: 8,101 options per calendar, two calendars in a range. A typed 0001 gives 2,101.
- The century rule is agreed (proposal line 50); the cost at the far end is not mentioned there. Verified by arithmetic.

---

## B. Pure removals

**B1. `aria-hidden` on a span that is already `invisible`.**
- `dp/modes/range-mode.tsx:228`. `visibility: hidden` already removes it from the accessibility tree; audit 5 A4 removed the same pair from the week row.

**B2. Unused `React` import.**
- `dp/modes/time-mode.tsx:3`, `dp/components/clock-popover.tsx:3`, `dp/components/picker-presets.tsx:3`. No `React.` in those files.

**B3. One-file export and an unread prop.**
- `type GridCell` in the export list at `dp/components/period-grid.tsx:144`: used only inside that file.
- `type` at `dp/modes/period-mode.tsx:287`: passed to all three panels, read by none (`77-87`, `119-129`, `181-191`).

---

## C. A stock mechanism gives the same behaviour

**C1. A second, hand-built disabled clock button.**
- `dp/modes/range-mode.tsx:139-161`: when there is no date, a look-alike button (`aria-disabled`, `tabIndex={-1}`, `pointer-events-none opacity-50`).
- Already here: `ClockPopover` takes `disabled` (`dp/components/clock-popover.tsx:21, 36`), as the single date-time uses through `TimeField` (`dp/modes/datetime-mode.tsx:131`).
- Lines that go: `range-mode.tsx:139, 147-161`, and the `Clock2Icon`, `InputGroupAddon`, `InputGroupButton` imports at `5, 12`. The "Pick a date first" title moves to the field as at `datetime-mode.tsx:132`.
- User notices: the tooltip sits on the box, not on the icon. This was audit 5 B3; it is still on disk and not on the rejected list.

**C2. The trigger shell is written twice.**
- `dp/modes/range-mode.tsx:383-395, 397-469` and `dp/modes/period-mode.tsx:381, 390-396, 398-471`: `ButtonGroup`, frame, trigger button, clear button, hidden inputs, error. Differences: the panel, the open state, one extra `aria-invalid` term (`period-mode.tsx:416-420`).
- Same pair: `dp/modes/date-mode.tsx:51-116` and `dp/modes/datetime-mode.tsx:62-148` (box, frame, trigger, calendar, presets), which differ by the time field and close-on-pick.
- Smaller repeats: preset unwrap at `dp/components/picker-presets.tsx:32` and `period-mode.tsx:498`; the `"..."` and `" - "` join at `period-mode.tsx:387-389` and `dp/utils/range.utils.ts:198-199, 223`.
- One shell each would also remove the two open-state patterns behind A8.

**C3. Two caption headers.**
- `dp/components/picker-calendar.tsx:65-126` (previous, today, next for the day calendar) and `dp/components/period-grid.tsx:93-142` (the same three for the grids), with different disabled handling (A10) and different chevrons (rdp's `Chevron` against lucide icons with `cn-rtl-flip`).
- One header component taking two click handlers serves both; user notices nothing but A10 going away.

---

## D. A stock mechanism or plainer rule changes behaviour slightly

**D1. An explicit step base in place of the kept mark.**
- `dp/components/picker-field.tsx:74-75` (comment), `80` (the `old.text !== input.value` half), `85-86` (`valid ? old?.message`): a mark is remembered because "Chromium drops a step mismatch once React syncs the value attribute".
- Cause, from the doc quoted in A3: with no `min`, the step base is the `value` attribute, and React writes every controlled value into it, so each value becomes its own base and is always on the step.
- Plainer rule: when `step` is set and `min` is not, give the box a base (`00:00` for time, the first representable date-time for `datetime-local`).
- User would notice: an off-step value stays flagged by the browser itself, including after a click-set value is later focused; today that depends on the remembered draft. Reasoned, not verified; needs Chromium and WebKit.

**D2. No auto-ordering for a time-only range.**
- `dp/modes/time-range-mode.tsx:43-45` swaps From and To when From is later. A range over midnight (22:00 to 06:00) cannot be entered.
- The browser's own time box treats that as valid: MDN, fetched, "specifying a `min` of `14:00` and a `max` of `2:00` means that the permitted time values start at 2:00 PM, run through midnight" (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time).
- User would notice: a later From is kept as typed. Then `useRangeOrder` has one caller (`range-mode.tsx:194`). Owner call: ordering is agreed for ranges in general; time is the one periodic type.

**D3. Show the browser's message for a half-typed box.**
- `dp/components/picker-field.tsx:87-88` blanks the message when `badInput`. A left, half-typed box then has `aria-invalid` with nothing describing it (`128`).
- Plainer: `message: valid ? … : input.validationMessage`.
- User would notice: text under the box ("Please enter a valid value…") where there is now only the ring.

---

## E. API and type inconsistencies

**E1. The caller's `aria-invalid`, `aria-describedby`, `aria-labelledby` land on the wrapper, not the control.**
- `dp/components/picker-field.tsx:28-32` routes only `id` and `aria-label` to the input; the rest goes to the group `div` (`113`). Same in `range-mode.tsx:356-357, 400` and `period-mode.tsx:366-367, 401`.
- A form library that marks the control (server-side error) marks a `role="group"` element; the input or trigger stays unmarked.

**E2. `id` means three things.**
- The input (`picker-field.tsx:116`), the trigger (`range-mode.tsx:419`, `period-mode.tsx:414`), or a prefix with no element carrying it (`time-range-mode.tsx:50`). `<label htmlFor={id}>` works on eleven of the twelve combinations.

**E3. Labels are joined in English word order.**
- `picker-field.tsx:159` (`Clear` + name), `range-mode.tsx:125` and `time-range-mode.tsx:56` (`Select time, From`), `range-mode.tsx:420` and `period-mode.tsx:415` (`label: value`), `dp/utils/period.utils.ts:73` (`Week 47, 2026`).
- Stock shape: react-day-picker's labels are functions that receive the value (`rdp/labels/labelPrevious.d.ts:11`, used at `picker-calendar.tsx:100, 115`).
- Fixed strings outside `labels`: `"..."`, `" - "` (`range.utils.ts:199, 223`, `period-mode.tsx:388`), and the dialog's "Close" (`components/ui/dialog.tsx:71`) while `labels.close` exists.

**E4. Time types have a popup and none of the popup props.**
- Proposal line 76 gives `popoverProps`, `open`, `defaultOpen`, `onOpenChange` to "modes with a popup". The clock popover takes none (`dp/components/clock-popover.tsx:16-30, 33, 48`); `type="time"` rejects them in the types.

**E5. `calendarProps` entries that are accepted and then ignored.**
- Week type: `showWeekNumber`, `ISOWeek`, `onDayClick` are overwritten (`period-mode.tsx:100-101, 110`, spread after `rest` at `picker-calendar.tsx:239, 251`).
- All types: `today` and `timeZone` are in the type (`picker-calendar.tsx:199`, `rdp/types/props.d.ts:294`) but the picker's own code uses `new Date()` and local dates (`picker-calendar.tsx:76`, `period-mode.tsx:133, 145, 196, 209, 263`, `range.utils.ts:145`, `date.utils.ts:80`). The Today button and the "today" cell ignore `today`; with `timeZone` the selected day can differ from the highlighted one. Reasoned for `timeZone`.

**E6. Month and year cannot be widened through `calendarProps`.**
- Proposal line 34: "an app widens it through `calendarProps`". Since 4.6.1 the type allows only `locale` and `dir` (`dp/date-picker.tsx:42-47`) and the bounds ignore `calendarProps` for these types (`period-mode.tsx:253`). Only `min`, `max` or an existing value widen the list. The two proposal lines (34 and 36) disagree; the code follows 36.

**E7. `min` and `max` are plain `string` on every type.**
- `dp/utils/date.utils.ts:26`. A wrong format half-works: `type="month" min="2026-03-01"` leaves the grid unbounded (`period.utils.ts:39` gives `undefined`) while `outsideLimits` (`52-54`) compares the strings and marks March 2026 as outside. `type="datetime" min="2026-01-05"` limits the calendar and not the box.

**E8. `step: number` admits values the clock cannot show.**
- A fraction: `"10:30:45.5"` fails the pattern at `time-columns.tsx:141`, nothing is selected and the next pick restarts from 00:00. 3600 or more: A3. Not a multiple of 60 above 60 (`step={90}`): every minute is listed (`175`).

**E9. One value and a pair share `string[]`.**
- `type Ends = string[]` (`period-mode.tsx:48`) is re-tupled at `71`, `292`, `529` and guarded with `?? ""` at `256-257`, `263-264`. The single type passes a one-item array and the shared code indexes `[1]`. Without `noUncheckedIndexedAccess` the compiler does not see it.

**E10. Default names differ.**
- Range and period triggers have a default accessible name (`range-mode.tsx:386-387`, `period-mode.tsx:383`). A single date, date-time or time box has none unless the caller passes `aria-label` or a label (`picker-field.tsx:126`); its clear button then reads "Clear value" (`159`).

---

## F. Port to three bases: every base-specific site

**F1. Direct Base UI imports.** `dp/components/picker-frame.tsx:4`, `dp/components/clock-popover.tsx:4`, for `PopoverPrimitive.Close` (`picker-frame.tsx:124-126`, `clock-popover.tsx:50-52`). The local `components/ui/popover.tsx:82-89` exports no close part.

**F2. `modal="trap-focus"`.** `picker-frame.tsx:68`, `clock-popover.tsx:33`. A Base UI value (`bui/popover/root/PopoverRoot.d.ts:46, 58`).

**F3. The `render` prop.** `picker-frame.tsx:89` (type), `145`; `date-mode.tsx:72-78`; `datetime-mode.tsx:85-91`; `range-mode.tsx:415-425`; `period-mode.tsx:410-424`; `clock-popover.tsx:37-43`.

**F4. A Base UI CSS variable.** `dp/utils/popover.utils.ts:4`, `max-h-(--available-height)` (`bui/popover/positioner/PopoverPositionerCssVars.d.ts:10`).

**F5. Public prop types taken from the base.** `picker-frame.tsx:31-32`: `popoverProps` and `dialogProps` are the props of the local `PopoverContent` and `DialogContent`, which are Base UI popup props (`components/ui/popover.tsx:22-26`, `components/ui/dialog.tsx:44`). The pass-through is agreed; the consequence is that the public type differs per base. Also `picker-frame.tsx:86-90, 105-108` and `popover.utils.ts:11, 16`.

**F6. Positioning props on the content.** `popover.utils.ts:6-10`: `align`, `alignOffset`, `sideOffset` on `PopoverContent`, which the local wrapper lifts from Base UI's positioner (`components/ui/popover.tsx:29-33`).

**F7. Behaviour assumed from the base, not stated in code.**
- The popup unmounts when closed: "views reset on each open" (`period-mode.tsx:237`), the month reset (`date-mode.tsx:48`, `datetime-mode.tsx:58`), the clock's scroll effect with empty deps (`time-columns.tsx:47-57`). Base UI default: `bui/popover/portal/PopoverPortal.d.ts:13-17`.
- Initial focus goes to the first tabbable, or the popup on touch (`bui/popover/popup/PopoverPopup.d.ts:38`, `bui/dialog/popup/DialogPopup.d.ts:15`); the clock relies on the hour button being first (`time-columns.tsx:75`).
- With trapped focus, a press outside is still allowed (`PopoverRoot.d.ts:46`); the X and the box sit outside the popup.

**F8. Slot names as selectors.** `in-data-[slot=dialog-content]` (`picker-calendar.tsx:21, 39, 43, 47, 51, 55`; `range-mode.tsx:65, 69, 83, 117, 137`), `data-[slot=calendar]` (`picker-frame.tsx:134, 141`), `input-group-addon` and `input-group-control` (`range-mode.tsx:137`), `field-label` (`range-mode.tsx:220`). These are the local shadcn files' names; each base's copy must keep them. Reasoned.

**F9. Outside the folder.** `@/hooks/use-mobile` (`picker-frame.tsx:21`), the `cn` package, `lucide-react`, the style class `cn-button-group-orientation-horizontal` (`range-mode.tsx:399`, `period-mode.tsx:400`; defined per style, `styles/style-vega.css:210-212`), `no-scrollbar` (`time-columns.tsx:60`; from `shadcn/tailwind.css`), `cn-rtl-flip` (`period-grid.tsx:132, 134`).

---

## G. Kept: examined and justified

Types and entry
- No `any`, cast, non-null assertion or `@ts-` comment in the folder (grep).
- `Single` and `Range` with `never` fields (`date-picker.tsx:33-39`): stop `name` on a range and `startName` on a single.
- `GridProps` (`42-47`): the 4.6.1 narrowing of `calendarProps` for month and year.
- `presets?: never` on time (`60-64`): time has no panel to put them in.
- Type-only import cycle between `date-picker.tsx` and the modes: erased at build.

State and hooks
- `useControllable` (`hooks/use-controllable.ts`): six callers; no installed part exports one publicly.
- `useRangeOrder` and `picking` (`hooks/use-range-order.ts`): the clock is a portal, so opening it blurs the field.
- `clear` focusing the X first (`picker-field.tsx:100-107`) and `onMouseDown` prevent (`161`): the Safari fix for audit 5 defect 1.
- `not-focus:invisible` (`160`): audit 5 C8, taken.
- `draft`, `shown`, `remount` (`50-68`): controlled box that does not send invalid text up; remount per the comment at `56-59` (see H).
- `left` in the draft (`53, 90, 109`): no mark while typing; audit 5 defect 2, fixed.
- `typing` (`range-mode.tsx:186-191`) and the `onFocus` reset (`213-217`): the year list grows on leave, proposal line 51.
- `chosen` kept unclamped, `shownMonths` at render (`range.utils.ts:148-157, 179-190`): audit 5 C3, first option, taken.
- `month` state in date and date-time: presets must move the calendar (proposal line 62).
- `triggerRef` (`range-mode.tsx:383`, `period-mode.tsx:381`): focus after clear and on invalid.
- The one effect (`time-columns.tsx:47-57`): centres the selected time; deps empty because the popup mounts per open.

Calendar
- `pickerComponents.Root` and `DayButton` (`picker-calendar.tsx:135-159`): the stock file builds them inline (`components/ui/calendar.tsx:137, 170`).
- `Week`, `BlankWeeksContext`, `CaptionTagContext`: react-day-picker components take no extra props, so context is the channel.
- `CaptionNav`, the iOS placeholder, the custom clock, stretched phone rows, From and To tags: rejected simplifications, not re-proposed.
- `limitDays` merged with the caller's `disabled` (`242`).
- `dateLibFor` (`range.utils.ts:192-195`): merges a partial locale over the default, which a bare date-fns `format` would not.
- `storableMax` and the year-10000 guard (`date.utils.ts:72-77`, `picker-field.tsx:132-135`): the value keeps a four-digit year.

Dates
- ISO weeks: `RRRR-'W'II` with the round-trip check (`period.utils.ts:16, 23-29`). Node, three zones (Asia/Dhaka, America/New_York, Pacific/Apia): 2026-12-31, 2027-01-01 and 2027-01-03 give `2026-W53`; 2027-01-04 gives `2027-W01`; `2025-W53`, `W00`, `W54`, `W5` are refused; `2026-W01` starts 2025-12-29.
- String ordering with mixed seconds (`range.utils.ts:43`): `"…T10:30" <= "…T10:30:45"` is true; a shorter value is a prefix of the same minute.
- `setYear(new Date(2000, …))` (`date.utils.ts:48-59`, `period-mode.tsx:65-67`): correct for years under 100, unlike A13's line.
- `addDays(last, 6)` for the week end (`period-mode.tsx:91`): safe over a clock change.
- Hydration: `new Date()` and `Intl` run only inside popups, which are portals and not rendered on the server; trigger text is built from the value string and the locale only.

Accessibility
- Error text: `role="alert"` (`components/ui/field.tsx:203`) with `aria-describedby` (`picker-field.tsx:128`, `range-mode.tsx:422`).
- Popover named by `aria-label` (`picker-frame.tsx:118`), dialog by its title (`139`), Done and X as exits.
- One tab stop per clock column and per grid, arrow keys inside, right-to-left handled (`period-grid.tsx:26`).
- Hidden required input and the prevented browser popup (`form-inputs.tsx:28-46`): the React Aria pattern named in the comment.

---

## H. Could not determine without a browser or a device

1. Week type in the phone dialog: the body row gives all eight cells `flex-1` (`picker-calendar.tsx:55`), the header keeps a fixed week-number cell and seven `flex-1` (`components/ui/calendar.tsx:91-100`). At 375 px that is about 47 px against 36 px for the first column, so weekday names would not sit over their days. Likely a defect; reasoned.
2. Single week uses the stock band (`period-mode.tsx:96`, `classNames` undefined), week range the custom one. The comment at `range-mode.tsx:56-59` says the stock band is off-centre in stretched cells, which is the phone dialog.
3. Safari and the clock icon: the X prevents the box's blur (`picker-field.tsx:161`), the clock trigger does not, so a click on To's clock in Safari may order the range first and open the clock on the swapped end.
4. Whether closing the popup with Escape also fires the focused box's blur, giving two `onChange` calls with the same ordered pair (`range-mode.tsx:194-200` and `406-410`).
5. Whether `input.value = ""` clears half-typed segments; if it does, `remount` reduces to a ref (audit 5 item 1, still open).
6. What a `datetime-local` box reports at zero seconds with `step={1}` (`…T10:30` or `…T10:30:00`); the clock always writes `:00` (`time-columns.tsx:148`). Two spellings of one time would defeat the equality checks at `range.utils.ts:31-33`.
7. A6, A7, A10, A11 and D1 as marked.
8. Whether a required, `hidden` text input blocks submit and fires `invalid` in Firefox and Safari as in Chromium (`form-inputs.tsx:31-32`).
9. Why date-time ranges raise the cell size below `md` (`range-mode.tsx:268`) and the dialog forces size 9 (`picker-frame.tsx:134`); audit 5 item 3, still without a comment.
10. Why `RangeEndField` needs seven reach-in utilities and `max-md:contain-inline-size` (`range-mode.tsx:137`); audit 5 item 4.
11. What `appearance-none` changes on iOS (`picker-field.tsx:143`); audit 5 item 8.
