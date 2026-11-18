# Q88 defaults code audit: next-app `cc4a436`, cards 1.K, 2.Q, 3.P, 4.V, 5.D, 6.D

- Counts: 0 blockers, 20 majors (all second-checked), 9 minors (not second-checked), 0 dropped.
- Kind: code audit. No look review, no browser accessibility run, no cross-browser run.
- Paths used below:
  - `D` = `test-projects/next-app/app/date-filter-demo`
  - `UI` = `test-projects/next-app/components/ui`
  - `RDP` = `test-projects/next-app/node_modules/react-day-picker/dist/esm`
  - `LIB` = `shadcn-react-table/packages/shadcn-table`
  - `LIBUI` = `LIB/registry/base/components/ui/shadcn-table`
- Checker scratch: `/tmp/q88-audit4-check/` (`c1.mjs`, `c2.mjs`, `logic.ts`, `out-*.txt`, `4v-*.png`, `reg/`, `bundle/`). Headless Chromium 159 unless a line says otherwise. No Pick or Default checkbox was touched.
- Gates rerun, read-only: `tsc --noEmit --incremental false` gives 0 errors in the folder; `eslint app/date-filter-demo` exits 0.

## Summary for the owner

- No blocker. 20 things to fix or decide before these go into the library, plus 9 small ones. All six cards are usable after fixes.
- 4.V: the two date-time boxes are too narrow. AM and PM are hidden, so midnight and noon look the same. Firefox hides the whole time. The boxes need more room before 4.V ships.
- 2.Q, 4.V: type an end that puts the range backwards, then click a day. The click is swallowed, both calendars jump to other months, nothing is picked.
- 2.Q, 4.V: with the range backwards, a year under 1000 plus Enter can store a value you never typed, or leave the range backwards until the popover closes.
- 2.Q, 4.V, 6.D: with the range backwards, the X of the other box deletes the wrong end. Known from audit 3; it waits for your choice on when the ends swap.
- 2.Q, 4.V: in a browser set to the Persian calendar the button shows a wrong date (the stored value is right).
- All six: the language comes from four places (the box, the button text, the calendar, the picker labels) and they can disagree. Weekdays are always English. About twenty texts are fixed English.
- All six: a typed value is stored at every complete keystroke, so a table would refilter per digit. Today's library waits for Enter or leaving the box. Needs your decision.
- 1.K, 2.Q, 3.P, 4.V: the calendar size table, the popover look and the popover position only work inside the playground. They must be rebuilt for the library. The popover also never flips and covers its own box near the bottom of the screen.
- All six: the fix for the iPhone picker's Reset never runs in these boxes. Needs an iPhone check, then repair or remove.
- 3.P: the card inside the popover gets its corners and border right only by luck of how it is nested. 1.K to 4.V: the month arrows are a hand copy of what the calendar already offers.
- 4.V: "this time was chosen by the user" is remembered only while the control is open. A saved filter that is opened again gets its times reset to 00:00 and 23:59. 3.P, 4.V, 5.D, 6.D: the time picker drops seconds.
- Library fit, calendar cards: our calendar file was hand-patched and the stock Base UI one lacks that line; React Aria has a different calendar, so the four calendar cards must be built again there.
- Library fit, all six: four new shadcn parts and the day picker package (about 20 KB gzip) for every table user; today's filter box features (custom props, jump to the filter, mode button, translations) have no counterpart; several existing tests assume the old boxes.
- Not checked in this round: iPhone, Android, screen readers, a full run in Firefox and Safari.

## Per-card verdict

| Card | Verdict | Blockers | Majors in a few words |
|---|---|---|---|
| 1.K date | ready after fixes | none | cell size table, hand-built popover with playground classes, fixed placement, dead iOS fix, copied nav, locale sources, commit per keystroke, patched calendar file, three bases, new parts, filter box features, tests |
| 2.Q date range | ready after fixes | none | all of 1.K, plus: lost day click, stale settle, wrong-end X, wrong date text in Persian calendar |
| 3.P datetime | ready after fixes | none | all of 1.K, plus: card radius by inherit, time picker drops seconds |
| 4.V datetime range | ready after fixes | none | all of 2.Q, plus: boxes cut off the time, chosen-time flag not in the stored value, time picker drops seconds |
| 5.D time | ready after fixes | none | dead iOS fix, locale sources, commit per keystroke, seconds dropped, new parts, filter box features |
| 6.D time range | ready after fixes | none | all of 5.D, plus: wrong-end X, tests |

## What each default is made of

### 1.K
- Card `SingleDateFixCard`, `D/_cards/row-1-date.tsx:60-126`; props at `:174-180` (`caption="today-end"`, `phone="one-ui-xs"`).
- Tree: `Field`, `FixNativeBox type="date"` (`D/_components/fix-native-box.tsx:64-353`), hand-built Base UI popover (`:317-336`), `FixSingleCalendar` (`D/_components/fix-calendars.tsx:51-102`).
- State: `value`, `invalid`, `open`, `month`, `repair` counter (`row-1-date.tsx:66-71`).
- A pick stores the day, closes, bumps `repair`, calls `fixDropDoubleClick` (`:113-118`, `D/_lib/dom.ts:44-59`).
- Value path: box text through `fixReadBox` (`dom.ts:8-29`); calendar day through `toYmd` (`D/_lib/values.ts:8-13`); back through `setNativeValue` and `fromYmd`.

### 2.Q
- Card `DateRangeIndependentCard`, `D/_cards/row-2-date-range.tsx:367-454`; props at `:536-542`.
- Tree: `FixRangePicker` (`D/_components/fix-range-picker.tsx:21-116`: ButtonGroup, trigger, X, hand-built popover anchored to the row), `FixTwoMonths` (`fix-calendars.tsx:168-340`), two columns each a `FixNativeBox type="date"` above one `Calendar mode="range"`.
- State: `state {range, timed}`, `open`, `months {left, right}`, `repair`, half-typed flags (`:373-379`); `settle` at `:381-390`.
- Calendar click: react-day-picker computes the range, `fixRangeSelect` maps it to strings (`D/_lib/range-owner.ts:123-152`); a To-only range goes to `fixRangeClick` (`:129-131`).
- Independent months: `fixKeepApart`, `fixMonthsFor`, `fixMonthFollow` (`D/_lib/months.ts:39-95`). Trigger text: `fixRangeText` (`D/_lib/locale.ts:36-79`).

### 3.P
- Card `DateTimeFixCard`, `D/_cards/row-3-datetime.tsx:284-392`; props at `:445-451`.
- Tree: `FixNativeBox type="datetime-local"`, popover, `Card size="sm"` with `popoverCardClassName` (`D/_components/calendar-with-time.tsx:39`), `FixSingleCalendar className="p-0"`, `CardFooter` with a `FixNativeBox type="time"` and its clock popover (`fixClock`, `fix-native-box.tsx:356-373`; `FixTimePicker`, `D/_components/time-picker.tsx:191-251`).
- State: `value`, `open`, `clock`, `month`, `repair`, flags (`:290-297`).
- A day pick keeps the stored time or sets 00:00 (`fixDayWithTime`, `range-owner.ts:155-157`) and leaves the popover open (`:343-346`).
- Time box: `clearValue` is 00:00 once a date exists (`:365`), so the time cannot stay empty.

### 4.V
- Card `DateTimeRangeIndependentCard`, `D/_cards/row-4-fix.tsx:318-444`; props at `D/_cards/row-4-datetime-range.tsx:275-281`.
- As 2.Q with `withTime`: `datetime-local` boxes in `joined` mode (X and clock in one addon, `fix-native-box.tsx:301-305`), a clock popover per box, squeeze classes at `row-4-fix.tsx:401-402`.
- Default times 00:00 and 23:59 (`range-owner.ts:19-21`); a `timed` flag per end says whether the user chose the time (`:386-394`, `:407-417`).
- `settle` at `:333-342` is a copy of the 2.Q one.

### 5.D
- Card `DTimeFix`, `D/_cards/row-5-time.tsx:57-92`.
- Tree: `FixNativeBox type="time"` with `fixClock`, stock `PopoverContent` path (`fix-native-box.tsx:338-348`).
- State: `value` "HH:mm", `invalid`, `clock`, `repair` (`:58-61`). Each column click stores at once (`:81-84`).
- Hour cycle of the picker: `useFixHour12` (`locale.ts:15-29`). The time string never becomes a Date.

### 6.D
- Card `DTimeRangeFix`, `D/_cards/row-6-time-range.tsx:83-134`.
- Two `FixNativeBox type="time"` in a `FieldGroup`, each with `fixClock`.
- One state `{range, timed}` (`:85`); `settle = () => setState(fixSettle)` (`:89`), a functional update, unlike 2.Q and 4.V.
- Settle (swap when From sorts after To as text, `range-owner.ts:28-44`) runs on leaving the box group, Enter, clock close and unmount.

### Shared
- All six: `FixNativeBox`, `NativeInput` (`D/_components/native-input.tsx:15-35`), `dom.ts`, `useFixRepair`.
- 1.K to 4.V: `calendar-looks.ts` (`fixTodayLook`, `fixOneUi`, `fixOneUiXs`, `fixOneUiXsCellSize`, `fixOutsideDays`, `rangeLook`), `calendar-parts.tsx` (`fixCalendarParts`, `FixEndCaption`, `FixEndNav`, the icon Today button), `months.ts`, `values.ts`, `phone-placement.ts`.
- 3.P, 4.V, 5.D, 6.D: `fixClock`, `FixTimePicker`, `TimeColumn`.
- Effects and listeners in reach: `fix-native-box.tsx:115-124`, `:140-151`, `:154-168`; `native-input.tsx:19-33` (never starts, see findings); `time-picker.tsx:40-53`; `narrow.ts:9-13`; `dom.ts:44-59` (1.K only, four window capture listeners plus a 1 s timer); `calendar-parts.tsx:77` (one rAF). No leak and no loop found by the auditors; not second-checked.
- Types: no `any`, no non-null assertion; one cast (`time-picker.tsx:94`).

## Custom code and stock alternatives

| Custom part | Where | Cards | Stock way | What the stock way would lose |
|---|---|---|---|---|
| Popover built from Base UI Portal, Positioner, Popup | `fix-native-box.tsx:317-336`, `fix-range-picker.tsx:82-99` | 1.K, 2.Q, 3.P, 4.V | `PopoverContent` (`UI/popover.tsx:15-45`) | `anchor`, `collisionAvoidance`, `collisionPadding` (it forwards only align, alignOffset, side, sideOffset) |
| Placement helper | `phone-placement.ts:6-13` | 1.K, 2.Q, 3.P, 4.V | Base UI default (flip) | the "keep its side, shift, clear the header" rule |
| Caption nav: previous, Today icon, next | `calendar-parts.tsx:161-265` | 1.K, 2.Q, 3.P, 4.V | `navLayout="after"` plus `components.Nav` (`RDP/DayPicker.js:299-300`, `RDP/components/Nav.js`) | nothing in behaviour; Today itself has no stock part; whether the stock slot can hold it with the shadcn nav classes is not verified |
| Compact caption context | `calendar-parts.tsx:145` | 1.K, 2.Q, 3.P, 4.V | a prop or a constant | nothing (one live value) |
| Per-style cell size table | `calendar-looks.ts:133-142` | 1.K, 2.Q, 3.P, 4.V | the style's own `--cell-size`, or one class | the caption with three buttons does not fit seven stock cells |
| Square cells, proportional gaps | `calendar-looks.ts:159-168` | 1.K, 2.Q, 3.P, 4.V | stock month and week gaps | look only |
| Range band and day-button classes | `calendar-looks.ts:10-57` | 2.Q, 4.V | `classNames` is the stock hook; the content is custom | the band look (stock fills the end cell and adds a bridge strip) |
| Outside-day dimming | `calendar-looks.ts:87-94` | 2.Q, 4.V and the caption cards | stock `outside` class | outside days in a range keep the range text colour |
| Never-deselect on the single calendar | `fix-calendars.tsx:78` | 1.K, 3.P | `required` (`RDP/selection/useSingle.js:20-23`) | nothing |
| Range click mapping | `range-owner.ts:70-152` | 2.Q, 4.V | react-day-picker `onSelect` range, already used as input | kept times and the To-only range |
| Two calendars with own months | `fix-calendars.tsx:231-274`, `months.ts:30-95` | 2.Q, 4.V | `numberOfMonths={2}` | months always adjacent, one shared nav |
| Six week rows | `fix-calendars.tsx:88`, `:240` | 1.K, 2.Q, 3.P, 4.V | `fixedWeeks`: this is the stock prop | nothing |
| Stable Root, Chevron, DayButton | `calendar-parts.tsx:28-59` | 1.K, 2.Q, 3.P, 4.V | stock builds them inline per render (`UI/calendar.tsx:149-185`) | a render between mouse down and up drops the click (reason written at `:22-27`) |
| Native boxes with commit rules | `fix-native-box.tsx:64-353`, `dom.ts:8-37`, `native-input.tsx:15-35` | all six | plain native input, as the library has today | X, half-typed marker, year wait, write-back after a pick |
| Time picker columns | `time-picker.tsx:23-131`, `:191-251` | 3.P, 4.V, 5.D, 6.D | the native time box's own picker; none in shadcn | one look across browsers; native per-browser behaviour not verified |
| Clear X | `fix-native-box.tsx:176-199`, `fix-range-picker.tsx:101-113` | all six | none; the library hides its clear button for date filters (`LIBUI/components/inputs/ST_FilterTextField.tsx:418-424`) | no clear |
| Card in a popover with inherited radius | `calendar-with-time.tsx:39`, `row-3-datetime.tsx:335` | 3.P | calendar and time field straight in the popover | the docs' Calendar with Time card look |
| Double-click guards | `dom.ts:44-59`, `fix-range-picker.tsx:54-64` | 1.K; 2.Q, 4.V | none | a second click landing under the closed popover |

## Libraries

| Package | Version | License | Size | Notes |
|---|---|---|---|---|
| react-day-picker | 10.0.2 | MIT | 41,156 B of the bundle | depends on date-fns ^4.1.0 and @date-fns/tz ^1.4.1 |
| date-fns | 4.4.0 | MIT | 22,538 B | pulled by the day picker; the defaults run no direct import |
| @date-fns/tz | 1.5.0 | MIT | 4,847 B | pulled by the day picker |
| the three together | | | 68,705 B minified, 20,511 B gzip | esbuild 0.28.2, react external, rerun by the checker |
| @base-ui/react scroll-area | 1.9.0 | MIT | 20,370 B minified, 7,975 B gzip | rerun by the checker |
| lucide-react | 1.64.0 | ISC | not measured | CalendarIcon, Clock2Icon, Calendar1Icon, XIcon, chevrons |
| cn | 0.5.0 | MIT | not measured | playground package; the library uses its own `cn` |

- No license problem found.
- New shadcn parts for the core item: calendar (1.K, 2.Q, 3.P, 4.V), button-group (2.Q, 4.V), card (3.P), scroll-area (3.P, 4.V, 5.D, 6.D). None is in `LIB/registry/base/components/ui` or in the core item's `registryDependencies` today; `LIB/package.json` has no react-day-picker or date-fns.
- Base UI (base-nova): the stock calendar file has no `ref={ref}` on the day button; the playground copy has it (see findings). Stock popover forwards no `anchor` or collision props.
- Radix (radix-nova): calendar is the same react-day-picker file and has `ref={ref}`; popover exports `PopoverAnchor`. The Base UI props used by the demo (`modal="trap-focus"`, `initialFocus`, `anchor`, `collisionAvoidance`, `render`, `details.cancel()`) need Radix equivalents; not verified.
- React Aria (aria-nova): calendar is built on react-aria-components, exports only `Calendar` and `RangeCalendar`, no react-day-picker; scroll-area is a plain div with no viewport slot.
- Icons: no calendar or clock icon in `LIBUI/icons.ts`; the library ships five icon sets.

## Fit for the library

- Library today: one native input per value on all three bases (`ST_FilterTextField.tsx:590-610`); a range is two fields side by side (`ST_FilterRangeFields.tsx:19-21`, `:51-57`). A typed date applies on Enter, blur or unmount; a change with no key press applies at once (`:280-310`, `:505-538`).
- Stored forms accepted by the filter functions: `YYYY-MM-DD`, `HH:mm` or `HH:mm:ss`, `YYYY-MM-DDTHH:mm` with optional `:ss` (`LIBUI/shared/fns/filterFns.ts:24-27`).

| Card | Stored string | Commit timing in the demo | What breaks |
|---|---|---|---|
| 1.K | `YYYY-MM-DD`, same as the library; empty is `""` (library: `undefined`) | every complete typed value at once; a year under 1000 waits for blur, Enter or close; a calendar pick at once and closes | per-keystroke refilter; no pass-through props; fixed English labels; the Escape story that expects no filter before Escape |
| 2.Q | two `YYYY-MM-DD`; object `{from, to}` against the library tuple | each end as 1.K; first calendar click stores both ends on one day; ends swap on leaving a box or closing | no input in the header until the popover opens (focus-the-filter refs, tests that count inputs or look for Min and Max) |
| 3.P | `YYYY-MM-DDTHH:mm`; a day pick with no time stores `T00:00` | box at once; day pick at once, popover stays open; each time column click at once | a stored value with seconds loses minutes and seconds on a picker click |
| 4.V | two `YYYY-MM-DDTHH:mm`; default times `T00:00` and `T23:59` | as 2.Q and 3.P | as 2.Q; the chosen-time flag is not in the stored strings; seconds |
| 5.D | `HH:mm` | typed at once; each column click at once | seconds; per-keystroke refilter |
| 6.D | two `HH:mm` | typed at once; swap on leaving | a range typed overnight is reversed; boxes are stacked and labelled From and To, not Min and Max |

## To strip when extracted

- Props and types: `letter`, `description`, `title`, `caption` (always "today-end"), `phone` (always "one-ui-xs" on 1.K to 4.V), `fitPhone`, `oneUiOf`, the `Caption`, `Phone`, `OneUi` unions (`D/_lib/types.ts`), `FixCompactNavContext` (constant "xs"), the `captionParts` and `captionClassNames` switches.
- Shell: `TypedCell`, `useFixCardId`, `RowNumberContext`, `fixLines` and the printed value lines, the fixed ids `fix-5d`, `fix-6d-from`, `fix-6d-to`.
- Dead for the defaults in reached files:
  - `fix-calendars.tsx`: `FixRangeCalendar` (`:105-161`), the one-calendar phone path (`:215-230`, `:254-256`, `:275-308`), the stacked bits (`:264`, `:317`), the cell-size chain except xs (`:201-214`), the `fixRangeClick` arm (`:252`).
  - `calendar-looks.ts`: `fixCellSize`, `fixEndCellSize`, `fixEndSingleCellSize`, `fixPhoneCellSize`, `fixStackedCellSize`, `fixOneUiCellSize`, `fixOneUiIconCellSize`, `fixStackedPhone`.
  - `calendar-parts.tsx`: `FixTodayButton`, `FixNextWithToday`, `fixTodayParts`, `fixTodayCaption`, the word Today branch (`:181-193`), the non-compact arrow classes; `fixEndCaption.month_caption` and `.dropdowns` (overridden by `fixOneUiXs`).
  - `fix-native-box.tsx`: `FixBoxRow` (`:376-402`); `useRangeMonths` at `:104`, `fix-range-picker.tsx:49` and `fix-calendars.tsx:215` changes nothing when `fitAlways` is set.
  - `range-owner.ts`: `fixRangeClick` branches `:85-97` and `:106-111` (only the To-only branch is reached).
  - `time-picker.tsx`: `TimePicker` (`:133-179`) and its `_lib/time.ts` imports.
  - `locale.ts`: `endLabel` and its date-fns import. `values.ts`: `joinDateTime`, `isReversed`, `rangeOf`.
- Whole files not reached: `typed-boxes.tsx`, `typed-range-popover.tsx`, `native-boxes.tsx`, `button-pickers.tsx`, `addon-popover.tsx`, `one-value.ts`, `_lib/typed.ts`. Only one constant is used from `clear-buttons.tsx` (`:47`) and from `calendar-with-time.tsx` (`:39`).
- `DateRangeIndependentCard` and `DateTimeRangeIndependentCard` are near copies (settle, open, months).
- Naming and imports: no `ST_` prefix, relative imports, `import { cn } from "cn"`.

## Findings: calendar cards 1.K, 2.Q, 3.P, 4.V, implementation and code quality

### A1. Major. 4.V. The date-time boxes cut off the time
- Where: `D/_components/fix-calendars.tsx:316` (`w-[calc(var(--cell-size)*7)]`), `D/_components/calendar-looks.ts:141-142`, `D/_cards/row-4-fix.tsx:401-402`.
- Claim: the box is hard-wired to seven calendar cells (196 px at the 28 px cell). With the X and the clock inside, the input is 142.8 px. A 12 hour date-time does not fit. `fixOneUiXsCellSize` has no Firefox branch, unlike `fixCellSize` at `calendar-looks.ts:65-66`.
- Proof: From 2026-11-10T00:00, To 2026-12-22T23:59 stored, nova, 1280 px wide.
- Earlier audits: same class on an older card, audit-2.md "14. Major. Firefox cuts off the month in the 4.I boxes". Not reported for 4.V or for Chromium and WebKit.
- Checked: `node c2.mjs chromium en-US box4v`, then the same in Firefox and WebKit (Playwright 1.64.1). Measured in all three: group 196, input 142.8, addon 56. Screenshots read: Chromium shows `10/11/2026, 12:00` and `22/12/2026, 11:59`, no AM or PM; WebKit `11/10/2026, 12:00`; Firefox `11 / 10 / 2026 , 1` followed by Firefox's own calendar icon. The trigger reads `Nov 10 12:00 AM - Dec 22 11:59 PM`. Files `/tmp/q88-audit4-check/4v-popup-*.png`.

### A2. Major. 2.Q, 4.V. A day click right after a typed end that reverses the range is lost
- Where: `D/_cards/row-2-date-range.tsx:381-390`, `D/_cards/row-4-fix.tsx:333-342`, `D/_components/fix-native-box.tsx:246-256`.
- Claim: `settle` runs on the box's blur, which is the mouse down of the day click. When the ends swap it also rebuilds both months (`row-2-date-range.tsx:387-389`). The pressed day button is gone before mouse up, so no click fires. Nothing is picked, the calendars show other months, and focus is on `body` inside a `modal="trap-focus"` popover.
- Earlier audits: related, other trigger: audit-3.md "7. Calendar click lost after a one-digit year edit". The swap plus month rebuild path is new.
- Checked on 2.Q: From 10 Jun 2025, To 20 Aug 2025, From retyped 25 Dec 2025 with focus kept in From; months `Dec 2025 | Jan 2026`. After mouse down on Jan 15 2026: `from: "2025-08-20" | to: "2025-12-25"`, months `Aug 2025 | Dec 2025`, active element `BODY`. Events: `mousedown:2026-01-15`, `mouseup:2025-12-18`, no `click`. Control without a reversed end: the click picks the day. 4.V carries the same lines; not run there.

### A3. Major. 1.K, 2.Q, 3.P, 4.V. The cell size table depends on a playground-only class, one font and the month name
- Where: `D/_components/calendar-looks.ts:133-142`, used at `fix-calendars.tsx:93` and `:206-207`.
- Claim: `fixOneUiXsCellSize` picks the cell per style with `in-[.style-<name>]:` selectors. That class is put on `<html>` only by the playground (`test-projects/next-app/components/design-system-provider.tsx:62-64`). The numbers are caption widths measured by hand with one font and French "sept.". When the caption is wider than seven cells nothing clips: the `w-fit` root grows, the day cells stretch to fractional sizes, and the popover changes width from month to month. In 2.Q and 4.V the box above stays at seven cells.
- Earlier audits: not reported.
- Checked: `grep -rln 'style-vega\|in-\[\.style-' LIB/registry` prints nothing. Finnish locale, nova, 1.K (`node c2.mjs chromium fi-FI cell`): "marras" gives root 221.6 and day 29.4; "syys" 212 and 28; per month the root runs from 212 to 221.6. With `--cell-size` forced to 28 px (what a tree with no `.style-*` ancestor gets): sera day 32 to 34.1, maia 29.7 to 30.6, vega 28 to 28.3 (English "Dec", then Finnish). English, nova: every month 212 and 28. Other locales and fonts named by the auditor were not rerun.

### A4. Major. 1.K, 2.Q, 3.P, 4.V. Popovers are hand-built twice from the popover part's internals and take their look from playground-only classes
- Where: `D/_components/fix-native-box.tsx:317-336`, `D/_components/fix-range-picker.tsx:82-99`; also `fix-calendars.tsx:313`, `calendar-looks.ts:154`, `D/_components/clear-buttons.tsx:47`, `calendar-parts.tsx:43`, `:51`.
- Claim: both blocks rebuild Portal, Positioner and Popup and copy the class string and `data-slot` of `UI/popover.tsx:36-41`. The stated reason holds: `PopoverContent` passes no `anchor`, `collisionAvoidance` or `collisionPadding`. The copied classes `cn-popover-content cn-popover-content-logical` are hooks defined per style under `.style-<name>` (`test-projects/next-app/styles/style-nova.css:926-932`). The same holds for `cn-calendar`, `cn-calendar-caption-label`, `cn-button-group-orientation-horizontal`, `cn-rtl-flip`. The library tree has resolved classes and no `cn-*` rule. A copy of one style's popover classes in a library file would also ignore the consumer's own popover part. Coding-standards "Bases": a look beyond the part goes in one library wrapper, parts are never edited.
- Earlier audits: not reported.
- Checked: `grep -rnE "[\"' \`]cn-[a-z]" LIB/registry/base | wc -l` prints 0; `LIB/registry/base/components/ui/popover.tsx` carries `rounded-lg bg-popover p-2.5 ... shadow-md ring-1` in place of `cn-popover-content`. On the page, with the `style-nova` class removed from `<html>` and 1.K open: popup background `rgba(0, 0, 0, 0)`, box-shadow `none`, calendar root 196 wide (padding gone), against `oklch(1 0 0)` and 212 with the class.

### A5. Major. 1.K, 2.Q, 3.P, 4.V. Popover placement carries the playground header height and never flips
- Where: `D/_components/phone-placement.ts:6-13`, applied at `fix-native-box.tsx:323` and `fix-range-picker.tsx:87`.
- Claim: `collisionPadding: { top: 56, ... }` is the demo page's sticky header (48 px) plus 8. All four defaults pass `fitAlways`, so it applies at every width. With `side: "shift"` and `fallbackAxisSide: "none"` the popover never flips; near the viewport bottom it slides over its own box. The clock popovers of 3.P and 4.V take the stock `PopoverContent` path and flip, so two placement rules live in one card.
- Earlier audits: not reported.
- Checked: viewport 1280x700, box 30 px above the bottom (`node c2.mjs chromium en-US place`). 1.K: box 638 to 670, popup 417 to 692, side `bottom`, overlaps the box. 3.P: popup 330 to 692, overlaps. 2.Q: popup 355 to 692, overlaps. 3.P clock popover: side `top`, no overlap. Sticky header measured: `HEADER`, 48 px.

### A6. Major. 1.K, 2.Q, 3.P, 4.V, 5.D, 6.D. NativeInput's value-attribute observer never starts inside FixNativeBox
- Where: `D/_components/native-input.tsx:18-34`, `D/_components/fix-native-box.tsx:201-202`.
- Claim: `<InputGroupInput ref={ref} {...props} />` spreads the props after its own ref. `FixNativeBox` passes `ref`, and in React 19 `ref` is a prop of a function component, so the caller's ref replaces the internal one. `ref.current` stays null, the layout effect returns at `:21-23`, no MutationObserver is created. The documented iOS fix (the picker's Reset returns to the `value` attribute) is inactive on every default box. Either dead weight or a missing fix; which one needs an iOS check.
- Earlier audits: audit.md line 88 noted only that the observer depends on React's write order. That it never runs here is new.
- Checked: `node c1.mjs chromium en-US observer`. `a-time` (NativeInput with no parent ref): `hasAttr false`. `fix-1k` before typing: `hasAttr true, attr ""`; after typing: `attr "2025-03-10"`. `fix-5d`: `attr "09:30"`. `fix-6d-from`: `attr "09:30"`. `fix-3p`: `attr "2025-03-10T09:30"`. Same split in Firefox; in WebKit the attribute is also present before typing (keys do not fill the boxes there).

### A7. Major. 3.P. The calendar-with-time Card takes the popover radius by `inherit`; its own ring is hidden only by the popup's overflow
- Where: `D/_components/calendar-with-time.tsx:39`, `D/_cards/row-3-datetime.tsx:335`, `fix-native-box.tsx:330`.
- Claim: `rounded-[inherit]` works only while the Card is the direct child of the Popup. The Card keeps its own `ring-1`; it does not show because the Popup has `overflow-y-auto` and no padding. `CardFooter` keeps the style's own bottom radius. A Card surface is stacked on a popover surface. Effect if it breaks: corners and border only.
- Earlier audits: not reported.
- Checked: `--radius: 0.625rem`, nova, 3.P open (`node c2.mjs chromium en-US card3p`): popup radius 10px, card 10px, card box-shadow ends `oklab(0.145 0 0 / 0.1) 0px 0px 0px 1px`, footer `0px 0px 14px 14px`, popup `overflow-y: auto`, padding 0. With one wrapper div between Popup and Card the card radius computes to `0px`.

### A8. Major. 1.K, 2.Q, 3.P, 4.V. Caption navigation is a hand copy of react-day-picker's own Nav
- Where: `D/_components/calendar-parts.tsx:197-265`; `hideNavigation` at `fix-calendars.tsx:86`, `:270`.
- Claim: `FixEndNav` copies the body of `RDP/components/Nav.js` (buttons, tabIndex, aria-disabled, labels, chevrons) and calls `goToMonth` directly. react-day-picker 10.0.2 has `navLayout="after"` and a replaceable `components.Nav` that gets `previousMonth`, `nextMonth`, `onPreviousClick`, `onNextClick`. The copy drops the `<nav>` element with its label, the `style` props and the `onPrevClick` / `onNextClick` callbacks. No comment says why the stock slot was not used. Behaviour is correct today.
- Earlier audits: not reported.
- Checked: `RDP/DayPicker.js:299-300` renders `components.Nav` when `navLayout === "after"`; `:144-155` calls `onPrevClick` and `onNextClick`; `RDP/components/Nav.js` wraps the two buttons in `<nav>`. `grep -rn navLayout D` prints nothing. On the page the open 2.Q popup holds 0 `nav` elements. Whether the stock slot can hold the Today button with the shadcn nav classes: not verified.

### Minors, not second-checked
- 2.Q, 4.V. `fixRangeSelect` drops a chosen time when the old From becomes To (`D/_lib/range-owner.ts:136-145`), against its own doc at `:119`; `fixRangeClick` keeps it (`:94-97`). A To-only range differs from the stock click rule (`:80-82` against `RDP/utils/addToRange.js`). Reported by two auditors, merged. Earlier audits: not reported. The checker's own run of the real file gave the same first result: From `2025-05-10T14:30` chosen, click 5 May, To becomes `2025-05-10T23:59`.
- 1.K, 3.P. The single calendar blocks deselect by ignoring `onSelect`'s first argument (`fix-calendars.tsx:78`); react-day-picker has `required` (`RDP/selection/useSingle.js:20-23`). No reason written. Reported by two auditors, merged.
- 2.Q, 4.V. Unchecked index access in the trigger text code (`D/_lib/locale.ts:37`, `:55`, `:67`). Clean under `strict`; with `--noUncheckedIndexedAccess` four errors at `locale.ts(38,40)`, `(39,23)`, `(69,22)`, `(70,19)` (the checker reran this command and saw the four lines).
- All six. Coding-standards deviations in the reached code, section "Code". Three or more parameters take one object: `fixClock` has 6 (`fix-native-box.tsx:356-363`), `fixRangeSelect` 4, `fixPut` 4, `fixMonthFollow` 4, `fixRangeClick` 3, `fixReadBox` 3. An eslint-disable carries a reason after `--`: `fix-native-box.tsx:150` has it on the line above. No abstraction with one implementation: `FixCompactNavContext`, `captionParts`, `captionClassNames`. Comments carry card letters and history. Also: the box id goes unescaped into a selector (`fix-native-box.tsx:251`); `fixDropDoubleClick` puts four capture listeners on `window` that cancel every multi-click on the page for up to 1 s after a 1.K pick (`dom.ts:44-59`, read only, not run). Related: audit-3.md "6. Triple click on a day". Reported by two auditors, merged.

## Findings: time cards 5.D, 6.D and the value layer of all six

### B1. Major. 2.Q, 4.V. `settle` reads the render's state and overwrites a value committed in the same event
- Where: `D/_cards/row-2-date-range.tsx:381-390`, `D/_cards/row-4-fix.tsx:333-342`.
- Claim: the two independent-month cards settle with `fixSettle(state)` from the render closure; 6.D and the sibling cards use `setState(fixSettle)`. When a box commits and settles in one event (Enter, blur or close with a year under 1000 pending, which `dom.ts:23-26` holds back until then), the queued commit is overwritten by the stale object, or the range is left unsettled.
- Not a blocker: it needs a year under 1000 typed while the ends are reversed or about to be.
- Earlier audits: related, audit-3.md "5. Firefox: half-typed year gives two results by close path" and "2. Reversed range stays stored". The closure cause is new. Reported by two auditors, merged.
- Checked: `node c1.mjs chromium en-US settle`. 2.Q: To 2025-03-10, From 2025-03-20, year retyped 0500 (the box shows 0500-03-20, stored 5050-03-20 from the keys in between), Enter gives `from: "2025-03-10" | to: "5050-03-20"`; the typed 0500 is gone and stays gone after close. Same keys on 2.J (functional update): `from: "0500-03-20" | to: "2025-03-10"`. 4.V: From 2025-03-05T09:00, To typed with year 25, Enter gives `from: "2025-03-05T09:00" | to: "0025-03-10T17:00"`, trigger `Mar 5, 2025 9:00 AM - Mar 10, 0025 5:00 PM`, reversed until the popover closes. 4.O after the same Enter: already swapped.

### B2. Major. 2.Q, 4.V, 6.D. With a reversed range, the other box's X clears the wrong end
- Where: `D/_components/fix-native-box.tsx:183-191` (X), `:246-256` (leave), `D/_lib/range-owner.ts:28-44` (swap).
- Claim: with From after To and focus still in the To box, mouse down on the From box's X blurs To, `leave` settles and swaps the ends, then the click clears the From end, which now holds the other value. The value the user pointed at survives and the other one is deleted. `leave` returns early while focus moves inside the same group (`:249-253`), so a reversed range stays stored until focus leaves the group.
- Not a blocker: the result shows at once, and it follows from the open choice on swap timing.
- Earlier audits: already reported. audit-3.md "3. The other box's X or clock acts on the swapped value" and "2. Reversed range stays stored while focus rests in the box" (2.E, 2.F, 4.J, 4.K, 6.D), both waiting for the owner's pick; audit-2.md "3. Blocker". Still there on the three range defaults.
- Checked: `node c1.mjs chromium en-US swap`. 6.D typed `from: "17:00" | to: "09:00"`; after a click on the From X: `from: "" | to: "17:00"`. 2.Q typed from 2025-03-20, to 2025-03-10; after the From X: `from: "" | to: "2025-03-20"`. 4.V: `from: "" | to: "2025-03-20T10:00"`. The clock variant was not rerun.

### B3. Major. 2.Q, 4.V. The trigger shows a wrong date when the browser's default calendar is not Gregorian
- Where: `D/_lib/locale.ts:36-51`.
- Claim: `fixDateText` formats with `Intl.DateTimeFormat(undefined, ...)` and no `calendar` option, then swaps in the stored Gregorian year. Under a locale whose default calendar is Persian the month and day are Persian and the year is Gregorian, so the trigger and its aria-label name a date that is not the stored one. Digits mix too.
- Earlier audits: not reported.
- Checked: `node c2.mjs chromium fa-IR locale`. Intl reports `calendar: "persian"`. 2.Q stored `from: "2026-11-10" | to: "2026-11-20"`, trigger text and aria-label `۱۹ آبان 2026 - ۲۹ آبان 2026` (19 Aban with year 2026). Thai locale: `10 พ.ย. 2026`, correct. 4.V uses the same function; not rerun there. The auditor's Arabic and year-0005 cases were not rerun.

### B4. Major. All six. Four locale sources that can disagree inside one control
- Where: `D/_lib/locale.ts:15-29`, `:40`, `:56`; `D/_components/fix-calendars.tsx:70-95`, `:234-272`; `D/_components/time-picker.tsx:11-13`, `:214-248`; `UI/calendar.tsx:40-45`.
- Claim: (1) native boxes take segment order and hour cycle from the browser or OS. (2) Trigger text and the picker's 12 or 24 hour choice take the `Intl` default locale. (3) No Calendar gets a `locale`, so weekdays and week start are date-fns en-US while the month dropdown uses the browser locale. (4) Picker labels and about twenty other strings are fixed English ("Select date", "Clear value", "Pick a date first", "Go to today", "From", "To", "Hour", "Minute", "AM", "PM"). Nothing ties the picker's hour cycle to the box beside it. No reached component takes a locale or a first day of week. The library has its own localization object with 39 locale files.
- Earlier audits: audit.md M8 and audit-2.md line 370 cover the English strings and the 12 hour picker; the split sources and the month dropdown are new. Reported by two auditors (one as minor), merged.
- Checked: `grep -rn 'locale=' D` prints nothing. Persian locale: caption selects `آبان 2026`, `آذر 2026` on a Gregorian November grid, weekdays `Su Mo Tu We Th Fr Sa`. British locale: 5.D clock columns `Hour:24, Minute:60`, while the native time box took the keys `0230P` as 14:30, so it was 12 hour. That mismatch is shown only under Playwright locale emulation.

### B5. Major. All six. Every complete typed value is stored at once; the year guard misses a year retyped in place
- Where: `D/_lib/dom.ts:18-28`, `D/_components/fix-native-box.tsx:134-136`, `:217-225`.
- Claim: `FixNativeBox` commits from `onChange` for every complete value. The only hold-back is a year under 1000, written for one browser's one typing path. Wired to a column filter as built, the table would refilter (and a remote example refetch) on each value in between. Each time column click and the first range click commit too. The library holds a typed date until Enter, blur or unmount (`ST_FilterTextField.tsx:280-310`, `:505-538`). In range cards a value in between can reverse the range mid-typing, which feeds B1 and B2. The demo has no debounce and no apply step.
- Earlier audits: audit.md line 139 (minor, not second-checked then). Reported by two auditors, merged.
- Checked: `node c1.mjs chromium en-US year`, 1.K. Typed 2025-03-10, then 2026 typed in the year without leaving it: `0252-03-10` held, then stored `2520-03-10`, `5202-03-10`, `2026-03-10`. Day retyped 25: stored `2026-03-02`, then `2026-03-25`. Library lines read as cited.

### Minors, not second-checked
- 6.D (same rule in 2.Q, 4.V). An overnight time range cannot be stored: 22:00 to 06:00 becomes 06:00 to 22:00 on leaving (`range-owner.ts:28-31`, `row-6-time-range.tsx:89`). The library today keeps what was typed. Earlier audits: audit.md M9 notes the swap on 6.A, not the overnight meaning. Reported by two auditors, merged. The checker's run of the real `fixSettle` gave the same swap.
- 1.K, 2.Q, 3.P, 4.V. `fromYmd` rejects valid stored days in zones that skipped a day, and year 0094 through the 19xx detour (`values.ts:24-34`, `months.ts:26-28`). The stored string stays; the calendar shows no selected day. Earlier audits: audit.md line 87 (Pacific/Apia 2011-12-30); 0094-12-31 and 0000-02-29 are new.
- 2.Q, 3.P, 4.V, 5.D, 6.D. Duplicated helpers and position slicing with no single parse or format for the stored forms: `slice(0, 10)` and `slice(11)` in about fifteen places, the sorted-ends block twice (`fix-calendars.tsx:125-130`, `:196-200`), the independent `settle` twice, three clear buttons, the popover class string twice.
- 3.P, 4.V. A date typed without a time stores nothing and is flagged incomplete, while a click on the same day stores it with 00:00 (`dom.ts:18-22`, `range-owner.ts:155-157`). Earlier audits: audit.md rows 3.A and 4.A; audit-3.md "8. Typed date with no time is a dead end".
- 2.Q, 3.P, 4.V, 5.D, 6.D. Focus targets and box ownership are found by document-wide lookups: `focusTimePicker` takes the first match in the document (`time-picker.tsx:182-188`), `FixRangePicker` focuses by id (`fix-range-picker.tsx:93`, `:108`). The time column also looks up `[data-slot="scroll-area-viewport"]` and reserves a fixed scrollbar width (`time-picker.tsx:43-45`, `:66`). Earlier audits: audit.md line 85. Reported by two auditors, merged.

## Findings: deviation from shadcn source, custom parts, libraries, fit for the library

### C1. Major. 1.K, 2.Q, 3.P, 4.V. The playground's calendar part is hand-patched; the stock Base UI file lacks the day button ref
- Where: `UI/calendar.tsx:205`.
- Claim: commit `30e13ba` added `ref={ref}` to `CalendarDayButton`. The stock Base UI calendar creates the ref and calls `ref.current?.focus()` but never attaches it; the Radix file has the line. The defaults import `CalendarDayButton` from the patched file (`calendar-parts.tsx:16`, `:58`). The library gets calendar as a `registryDependency` and parts are never edited (coding-standards "Bases"), so a consumer on Base UI gets the unpatched file.
- Earlier audits: not reported.
- Checked: `git show 30e13ba -- components/ui/calendar.tsx` holds `+      ref={ref}`. Fetched `https://ui.shadcn.com/r/styles/base-nova/calendar.json` and `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/bases/base/ui/calendar.tsx`: `ref` appears only at 141 (rootRef), 216 (useRef), 218 (focus). radix-nova adds `223: ref={ref}`. `diff` of the upstream template against the installed file: icon placeholders and `222a205 > ref={ref}` only. Effect of the missing line on arrow keys in a stock install: not run.

### C2. Major. 1.K, 2.Q, 3.P, 4.V (5.D, 6.D partly). The calendar defaults are written against react-day-picker and Base UI parts that the React Aria base does not have
- Where: `D/_components/calendar-parts.tsx:8-16`, `fix-native-box.tsx:3`, `fix-range-picker.tsx:3`, `:54-63`.
- Claim: the library ships three trees and no library file may exist in one tree only. shadcn's aria-nova calendar is built on react-aria-components, exports only `Calendar` and `RangeCalendar`, takes no `classNames` or `components` and has no `CalendarDayButton`. Every custom calendar part (caption, range band, cell size, six weeks, range click mapping) has nothing to attach to there. The demo also imports `@base-ui/react/popover` directly and uses `render`, `details.cancel()`, `initialFocus` and `modal="trap-focus"`; the library's base and radix trees import no primitive package directly today. On aria the time picker's scroll to the picked value returns early (no viewport slot).
- Earlier audits: audit.md line 155 lists the React Aria calendar as not verified.
- Checked: fetched `https://ui.shadcn.com/r/styles/aria-nova/calendar.json`: dependencies `["cn"]`, registryDependencies `["button","select"]`, imports from `react-aria-components`, `export { Calendar, RangeCalendar }` at line 287. aria-nova scroll-area has only `data-slot="scroll-area"`; base-nova and radix-nova have `scroll-area-viewport`. `LIB/registry/README.md:51`: "no library file may exist in one tree only". `grep` for `@base-ui/react` or `radix-ui` imports under the base and radix `shadcn-table` folders prints nothing. Nothing was built or run on Radix or Aria.

### C3. Major. 4.V. The `timed` flag per end is not in the stored strings, so a value loaded from outside gets its times rewritten
- Where: `D/_lib/range-owner.ts:35-38`, `:136-145`; `D/_cards/row-4-fix.tsx:326`, `:333-342`.
- Claim: `fixSettle` replaces the time of any end whose `timed` flag is false with 00:00 (From) or 23:59 (To). The flag lives only in the card's React state. The library stores and restores only the two strings (state, URL, saved views; the chip editor remounts the control). A control seeded from a stored pair starts with both flags false; the next settle or a calendar click that keeps a day rewrites the user's times.
- Earlier audits: not reported.
- Checked: `bun run /tmp/q88-audit4-check/logic.ts` on the real file. `fixSettle` of `{from: "2026-11-10T09:00", to: "2026-11-12T17:00"}` with both flags false returns `from "2026-11-10T00:00"`, `to "2026-11-12T23:59"`. `fixRangeSelect` on the same state with a click on 14 Nov returns `from "2026-11-10T00:00"`, `to "2026-11-14T23:59"`. The demo itself never seeds a value, so this shows only once the card is fed from a stored filter.

### C4. Major. 3.P, 4.V, 5.D, 6.D. The time picker reads `HH:mm` only; a stored time with seconds loses minutes and seconds on one click
- Where: `D/_components/time-picker.tsx:199-206`.
- Claim: `FixTimePicker` parses with `/^(\d{2}):(\d{2})$/`. The library accepts `HH:mm:ss` and `YYYY-MM-DDTHH:mm:ss` (`LIBUI/shared/fns/filterFns.ts:25-27`, story `TimeWithSecondsOnDateColumn` with "14:15:00"). With such a value no button is pressed and a click on an hour writes `HH:00`.
- Earlier audits: audit.md M7 (seconds lost in the older picker); audit-2.md says not checked on the page; audit-3.md lists seconds under accepted limits.
- Checked: `node c1.mjs chromium en-US seconds`. 5.D box set to "10:30:15" through the value setter and an input event: stored `"10:30:15"`. Clock opened: pressed buttons `[]`. Click on hour 5: stored `"05:00"`.

### C5. Major. 1.K, 2.Q, 4.V, 6.D. Stories and docs E2E checks that would break with the defaults
- Derived from code. No integration exists to run them against.
- Where and claim:
  - `LIB/stories/features/Filtering.stories.tsx:1633-1660` `ChipEditorEscapeKeepsTypedDate` expects no filter after typing 1990 and before Escape (`:1650`); 1.K has already stored it.
  - `LIB/stories/fixed-bugs/mobile-date-pickers.stories.tsx:95-97` expects 3 `date` and 3 `datetime-local` inputs in `thead`; with 2.Q and 4.V the range boxes exist only inside an open popover. Line 101 fires a change with `0001-01-02`, which 1.K holds back as a year under 1000.
  - `LIB/stories/features/FilterChips.stories.tsx:634-639` finds range inputs by the labels `Min` and `Max`; 2.Q and 4.V show one button, and all three range defaults label their boxes From and To.
  - `shadcn-react-table/test/docs-e2e/lib/examples.mjs:523-526` requires `thead input[type="date"]` on subheader-filters, whose date columns are `date-range`, `datetime-range`, `time-range`.
- Earlier audits: audit.md line 124 judged the mobile-date-pickers counts for the earlier picks only.
- Checked: the four cited places read; they say what is claimed. Page side: before opening, the 2.Q and 4.V cards hold 0 `date` and 0 `datetime-local` inputs; the 1.K year wait is shown in B5. The breaks themselves were not run.

### C6. Major. All six. Four shadcn parts and the react-day-picker stack are outside the library's core item
- Where: `LIB/registry.json`, `LIB/package.json`.
- Claim: the defaults need calendar, button-group, card and scroll-area, plus react-day-picker with date-fns and @date-fns/tz (all MIT), for every table user whether or not a date filter is used. Three icons (calendar, clock, calendar-today) are missing from the library's icon map, which exists for five icon sets.
- Earlier audits: audit.md M10 (same four parts and two packages for the earlier picks, without this size split).
- Checked: the `registryDependencies` of `shadcn-table-base-core`, `-radix-core` and `-aria-core` hold none of the four parts; `LIB/package.json` has no react-day-picker or date-fns; `LIB/registry/base/components/ui` has no calendar, card, button-group or scroll-area file. Size rerun with esbuild 0.28.2: `rdp raw=68705 gzip=20511` (react-day-picker 41156, date-fns 22538, @date-fns/tz 4847), `scroll raw=20370 gzip=7975`. `grep -n -i "calendar\|clock" LIBUI/icons.ts` prints nothing.

### C7. Major. All six. Behaviours of today's filter input with no counterpart in the default controls
- Where: `LIBUI/components/inputs/ST_FilterTextField.tsx:136-149`, `:456-483`, `:485-526`, `:590-610`; `D/_components/fix-native-box.tsx:64-102`, `:200-228`; `D/_components/fix-range-picker.tsx:21-47`.
- Claim, facts for the integration decision:
  - `stFilterDatePickerProps`, `stFilterDateTimePickerProps`, `stFilterTimePickerProps` and `stFilterTextFieldProps` are spread onto the native input; `FixNativeBox` takes a fixed prop list with no pass-through.
  - Each input registers in `table.refs.filterInputRefs` under `<columnId>-<index>` (`:493-497`), read to focus the filter; 2.Q and 4.V expose a button, their inputs exist only while the popover is open.
  - `onKeyDown` stops propagation (`:509-510`); `FixNativeBox` has `onKeyUp` only.
  - The filter-mode button is a start addon of the same InputGroup; `FixNativeBox` has no start slot and `FixRangePicker` is a ButtonGroup.
  - `aria-label` and `title` come from localization; the demo labels are fixed English.
  - A range is two fields side by side; 6.D stacks two fields, 2.Q and 4.V are one button.
  - D96 (a click starts typing at the first part) is not in `FixNativeBox`: it has no pointer handler.
- Earlier audits: audit.md M9 covers only the two fields against one owner.
- Checked: the library lines read as cited (`:136-149` picker props, `:456` start addon, `:493-497` ref registry, `:509-510` stopPropagation, `:590-610` the three native inputs); `filterInputRefs` is read in `ST_HeaderFilterEditor.tsx:43` and `ST_TableHeadCellFilterLabel.tsx:125`. Demo side read as cited.

### Minors
- None left in this area: its four minors are merged into B4, the "never deselect" minor, the overnight minor and the document-wide lookups minor above.

## Dropped

- Count: 0. Every blocker-or-major finding of the three auditors was reproduced or read at its source.
- Merged, not dropped:
  - NativeInput observer: two auditors, one finding (A6).
  - Cell size table: two auditors (A3). Playground classes and hand-built popovers: two auditors (A4). Placement: two auditors (A5).
  - Stale `settle`: one auditor's major and another's minor (B1).
  - Commit per keystroke and "intermediate values stored": two auditors (B5).
  - Caption nav: one major and half of a minor (A8); the other half (never deselect) stays a minor.
  - Locale sources: one major and one minor (B4).
- Sub-claims left out because the checker did not rerun them: the Arabic digits and year-0005 cases of B3; the Hungarian, Russian and Vietnamese widths and the "29 of 74 locales" count of A3; the clock variant of B2.
- Nothing about day-button transitions is reported.

## Not verified

- No browser accessibility run and no cross-browser run in this round. iOS and Android not verified. No real screen reader.
- iOS Safari: what the picker's Reset does now that the value attribute stays on every default box (A6); the empty-box hint; focus events.
- WebKit typing: Playwright keys do not fill the native boxes there, so only attributes and layout were read in WebKit.
- Hour cycle mismatch between a native time box and the picker in a browser without emulation (B4). Where the native boxes take their locale on Windows and Linux.
- Effect of the missing `ref={ref}` in a stock base-nova calendar install (C1).
- All "would break" claims on stories and docs E2E (C5).
- Radix and React Aria: only registry files and the library tree were read; nothing built or run. Radix and React Aria equivalents of `anchor`, `collisionAvoidance`, `collisionPadding`, `initialFocus`, `modal="trap-focus"`, `details.cancel()`.
- Whether the shadcn CLI resolves `cn-*` hook classes for third-party registry items at install; only the library tree was checked.
- Whether react-day-picker's `Nav` slot with `navLayout="after"` can hold the Today button with the shadcn nav classes.
- Whether next-app `UI/calendar.tsx` equals what `pnpm add-part` writes, beyond the diff in C1.
- Fonts other than the playground default (IBM Plex Sans) for the caption widths; styles were simulated by swapping the `style-*` class on `<html>`.
- `fixDropDoubleClick`: read only, not exercised.
- Phone widths: the stacked two-month layout height and scrolling inside the popover. RTL rendering of the caption nav.
- Five digit years: not reachable by typing in Chromium or Firefox per the auditor; a programmatic write of 10000-01-01 would sort wrong as text. WebKit not checked.
- The library filter functions that will read these strings were read only at the patterns (`filterFns.ts:24-27`); whether an overnight time range matches rows is not checked.
- Parity of the playground `cn` package with the library's clsx plus tailwind-merge for the class overrides.
- The native time picker as a platform alternative to the custom time picker, per browser.
- Gzip numbers are for a standalone esbuild bundle with react external; a real app bundle may share or split differently.
- Headless Chromium on this machine uses day-first native boxes although the context locale is en-US; typed checks were read from the stored values.
- The minors above, the effects-and-listeners list and the "no leak, no loop" statement are the auditors' and were not second-checked.
- Earlier audits were only grepped for overlap, not studied.
