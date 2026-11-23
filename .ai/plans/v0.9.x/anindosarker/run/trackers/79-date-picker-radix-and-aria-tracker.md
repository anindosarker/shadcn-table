# 79: Date picker Radix and React Aria versions, tracker

Status: running
Branch: none (a plan file on `claude/review`)
Checks:
- Check: Task 1, inventory rows, `awk '/^## 1\. Inventory/{f=1} /^## 2\. Parts/{f=0} f && /^\| [0-9]+ \|/' design-radix-aria.md | wc -l` at eb543afa: pass (22, both base columns filled)
- Check: Task 1, inventory cells, the same rows counted by cell text at eb543afa: pass (31 `identical`, 13 `differs`, 0 empty, sum 44; Radix 18 and 4, React Aria 13 and 9)
- Check: Task 1, a section with a cited source line per replacement for every `differs` cell, read at eb543afa: pass for 12 cells (Radix: 3.1 to 3.4; React Aria: 3.5 to 3.11); the cell `components/day-calendar.tsx` on React Aria points to section 4, which is Task 2
- Check: Task 1, `grep -c $'\u2014' design-radix-aria.md` at eb543afa: pass (0)
- Check: Task 1, no code body longer than a signature, `grep -c '^```' design-radix-aria.md` at eb543afa: pass (0 code fences; replacements are named in table cells)
- Check: Task 1, type claims marked "compiled", `tsc -p tsconfig.json` (TypeScript 5.8.3, `strict`, a scratch file against `react-aria-components@1.22.1` of the table repository, outside both repositories) at eb543afa: pass. As copied: `role` of `HtmlProps` on the React Aria `Group`, `disabled`, `title` and `focusableWhenDisabled` on the React Aria `Button`, `focusableWhenDisabled` on a native `button` each give TS2322. With the plan's replacements (`Omit<HtmlProps, "role">`, `isDisabled`, `render`, `ButtonContext`, the three open props on the root, `placement`, `crossOffset`, `offset`): no error
- Check: Task 2, section 4 cites the `aria-nova` calendar part's source and its dependencies as read on 2026-11-24, read at 5c6ada7b: pass (`https://ui.shadcn.com/r/styles/aria-nova/calendar.json`: `dependencies` `["cn"]`, `registryDependencies` `["button", "select"]`; the part's lines `aria-nova/calendar.tsx:6-21, 24-31, 38-41, 65-81, 97-110, 147-192, 209, 243-285, 287`; beside it the `radix-nova` and `base-nova` files with `react-day-picker@latest` and `date-fns`)
- Check: Task 2, one way with its proof, or the card id, at 5c6ada7b: no way named (section 4.3: no candidate keeps report section 3, the same look and behaviour, and nothing new against the Base UI code together); the options are staged as K1 below, the card id is the runner's to write there
- Check: Task 3, `grep -n -E "@base-ui|render=|@/components/ui/" <file>` on each of the 18 files marked `identical` on Radix, run on the approved folder (the bytes of `registry/base/components/date-picker`), plan at 5c6ada7b: 14 hits in 11 files, each explained below; no `@base-ui` and no `render=` hit in any of the 18
- Check: Task 3, the same on each of the 13 files marked `identical` on React Aria: 6 hits in 6 files, each explained below; no `@base-ui` and no `render=` hit in any of the 13
- Check: Task 3, no hit, Radix and React Aria: `date-picker.tsx`, `modes/period-picker.tsx`, `utils/labels.ts`, `utils/range.ts`, `utils/time.ts`, `utils/values.ts`, `utils/views.ts` import no part and no primitive library (their package imports are `react`, `react-day-picker`, `date-fns`, the same packages on every base)
- Check: Task 3, the whole folder, `grep -rn -E "@base-ui|render=|@/hooks/" .`: 6 hits, all in files marked `differs` on both bases (`types.ts:2`; `components/picker-popup.tsx:22, 66, 97, 119, 130`), pass
- Check: Task 3, Radix, `modes/day-picker.tsx:4` `Field, FieldLabel`: same. `Field` with `className` (`:128`) and `FieldLabel` with `htmlFor` (`:129`) are `radix-nova/field.tsx:72-86` and `:101-116`, equal to `base-nova/field.tsx` but for two import paths; the label is a `label` element that takes `htmlFor` (`radix-nova/label.tsx:7-21`)
- Check: Task 3, Radix, `modes/day-range-picker.tsx:4` `Field, FieldLabel`: same. `Field` without props (`:271`), `FieldLabel` with `htmlFor` (`:251, 272`); the parts as in the line above. The file's own selectors read `data-slot="input-group-addon"` and `"input-group-control"` (`:67`), which the Radix part sets (`radix-nova/input-group.tsx:54, 123`)
- Check: Task 3, Radix, `modes/period-range-picker.tsx:4` `Field, FieldLabel`: same. `Field` (`:175`), `FieldLabel` with `htmlFor` (`:176`); the parts as above
- Check: Task 3, Radix, `modes/time-range-picker.tsx:4` `Field, FieldGroup, FieldLabel`: same. `FieldGroup` with `role` and `div` props (`:35`) is a `div` (`radix-nova/field.tsx:41-52`); `Field` (`:37`), `FieldLabel` with `htmlFor` (`:38`) as above
- Check: Task 3, Radix, `components/day-calendar.tsx:13` `Badge`: same. `variant="secondary"` (`:163`) exists (`radix-nova/badge.tsx:12-13, 29-46`)
- Check: Task 3, Radix, `components/day-calendar.tsx:14` `Calendar, CalendarDayButton`: same. Both are exported (`radix-nova/calendar.tsx:246`); the part is the react-day-picker calendar of `base-nova` with one import path changed and one line added (`ref={ref}`, `:223`); the props used (`:223-257`) are `DayPicker` props passed on (`radix-nova/calendar.tsx:25, 134, 200, 202`)
- Check: Task 3, Radix, `components/period-views.tsx:17` `Button`: same. `variant`, `aria-pressed`, `aria-current`, `disabled`, `className`, `onClick` (`:249-263`) are native `button` props of `radix-nova/button.tsx:43-64`; the variant and size class text is equal (`radix-nova/button.tsx:10-34`, `base-nova/button.tsx:9-33`)
- Check: Task 3, Radix, `components/period-views.tsx:18` `NativeSelect, NativeSelectOption`: same. `radix-nova/native-select.tsx` is byte-equal to `base-nova/native-select.tsx` (`diff` prints nothing)
- Check: Task 3, Radix, `components/picker-box.tsx:5` `InputGroupButton`: same. `size="icon-xs"` and `aria-label` (`:38`) exist (`radix-nova/input-group.tsx:75-76, 86-103`)
- Check: Task 3, Radix, `components/picker-field.tsx:10` `InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput`: same. `InputGroup` is a `div` with `role="group"` that takes the app's `div` props (`radix-nova/input-group.tsx:11-23`, used at `:125`); `InputGroupInput` takes native input props (`radix-nova/input-group.tsx:117-131`, `radix-nova/input.tsx:4-16`, used at `:126-144`); `InputGroupAddon` with `align="inline-end"` (`radix-nova/input-group.tsx:46-66`, used at `:154`); `InputGroupButton` with `size`, `aria-label`, `className`, `onMouseDown`, `onClick` (`radix-nova/input-group.tsx:86-103`, used at `:155-167`)
- Check: Task 3, Radix, `components/picker-presets.tsx:3` `Button`: same. `variant="outline"`, `size="sm"`, `className`, `onClick` (`:21-33`); `radix-nova/button.tsx:13-14, 26, 43-64`
- Check: Task 3, Radix, `components/picker-trigger.tsx:6` `Button`: same. `ref`, `variant`, `id`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `className` (`:56-68`) and `variant`, `size="icon"`, `aria-label`, `onClick` (`:76-86`) are native `button` props; `ref` is in `React.ComponentProps<"button">` and is spread onto the element (`radix-nova/button.tsx:49, 56-62`)
- Check: Task 3, Radix, `components/picker-trigger.tsx:7` `ButtonGroup`: same. `className` and `div` props (`:46-49`); `radix-nova/button-group.tsx:24-38`
- Check: Task 3, Radix, `components/time-columns.tsx:4` `Button`: same. `ref`, `size="sm"`, `variant`, `aria-pressed`, `disabled`, `className`, `onClick` (`:41-52`) are native `button` props of `radix-nova/button.tsx:43-64`
- Check: Task 3, React Aria, `modes/day-picker.tsx:4` `Field, FieldLabel`: same. `aria-nova/field.tsx:72-86` and `:101-116`, equal to `base-nova/field.tsx` but for two import paths and one class list (`:109`); the style's label takes `htmlFor` and renders a `label` (`aria-nova/label.tsx:11-27`)
- Check: Task 3, React Aria, `modes/day-range-picker.tsx:4` `Field, FieldLabel`: same, as the line above. The file's own selectors read `data-slot="input-group-addon"` and `"input-group-control"` (`:67`), which the React Aria part sets (`aria-nova/input-group.tsx:54, 125`); `ref` and `onBlur` given to `PickerField` (`:175, 188`) reach the group's `div` (`react-aria-components@1.22.1/dist/private/Group.mjs:49-51`)
- Check: Task 3, React Aria, `modes/period-range-picker.tsx:4` `Field, FieldLabel`: same, as above
- Check: Task 3, React Aria, `modes/time-range-picker.tsx:4` `Field, FieldGroup, FieldLabel`: same. `FieldGroup` is a `div` (`aria-nova/field.tsx:41-52`); the rest as above
- Check: Task 3, React Aria, `components/picker-box.tsx:5` `InputGroupButton`: same. `size="icon-xs"` (`aria-nova/input-group.tsx:75-76, 86-105`) and `aria-label`, which the React Aria button writes on the element (`react-aria@3.53.1/dist/private/button/useButton.mjs:59-61`)
- Check: Task 3, React Aria, `components/picker-presets.tsx:3` `Button`: same. `variant="outline"`, `size="sm"`, `className` as a string (`aria-nova/button.tsx:20-21, 33, 50-69`) and `onClick`, a typed alias of `onPress` (`@react-types/shared@3.37.0/src/events.d.ts:134-139`)
- Check: Task 3, the three files that use `PopupActions` (`modes/day-picker.tsx:14, 52, 77`, `modes/period-picker.tsx:13, 47, 83`, `components/picker-box.tsx:6, 16`): identical on both bases under every option of K2 that keeps a ref with `close()`; K2 option 2 names them as differing on React Aria

- Task 1 The read, the inventory, the parts, the replacements, the behaviour at risk, the not-in-the-versions list: done (eb543afa)
- Task 2 The day calendar on React Aria: done (5c6ada7b): no way named, K1 staged
- Task 3 Self-check of every `identical` claim: done (plan at 5c6ada7b; the lines above)

## Attention

Five points the plan does not decide. The plan marks the files as waiting on K1 to K5; the runner files the queue card and writes its id after the K number here.

### K1 (card: to be filed). The React Aria style has another calendar, so the day calendar file has no stock part to stand on there.

- File waiting: `registry/aria/components/date-picker/components/day-calendar.tsx`. The other 21 files of the React Aria version can be written; its type check and its plays stay red until this file exists, because `components/period-views.tsx` and the three day modes import it.
- The `aria-nova` calendar part is the React Aria calendar, not react-day-picker (`https://ui.shadcn.com/r/styles/aria-nova/calendar.json`, read 2026-11-24: `dependencies` `["cn"]`, `registryDependencies` `["button", "select"]`; `aria-nova/calendar.tsx:6-21, 287`). The Base UI and Radix styles ship the react-day-picker calendar, which `day-calendar.tsx` is built on (`Calendar`, `CalendarDayButton`, `classNames`, `components`, `modifiers`: `B/components/day-calendar.tsx:14, 223-257`).
- The React Aria part has: month and year menus that are the style's `Select` with a popup list, not native `select` elements (`aria-nova/calendar.tsx:24-31, 243-285`; report section 3 asks for native `select`); a fixed header with no slot for our caption (arrows, Today, the From or To badge) (`:147-192`); no week number column (`:38-41, 209`); no `classNames`, `components`, `modifiers` or `fixedWeeks`; `DateValue` values, not `Date`.
- react-day-picker stays a dependency of the React Aria version in any case: `types.ts:3`, `utils/range.ts:2`, `utils/values.ts:10-11`.
- Options (plan section 4.2 has the lines):
  1. `day-calendar.tsx` on React Aria uses react-day-picker's `DayPicker` directly and carries what the stock react-day-picker part adds. Keeps the native `select`, the public `calendarProps` and, by copy, the look. Cost: about 150 lines of shadcn's calendar part inside the picker's file (class map, `Chevron`, `WeekNumber`, the day button with one ref and one effect) that the Base UI file does not have, and the day button as a native `button` with the style's button classes, because the React Aria `Button` does not put react-day-picker's `disabled` and `tabIndex` on the element. The same look is proved only by the geometry comparison.
  2. The react-day-picker calendar part becomes `components/ui/calendar.tsx` of the React Aria tree and `day-calendar.tsx` stays a byte copy. Cost: that part is not what the shadcn CLI writes for `aria-nova` and must be edited for the React Aria `Button`; the item cannot name `calendar` as a registry dependency; a user's own `components/ui/calendar.tsx` is replaced. A fix milestone of spec 78.
  3. `day-calendar.tsx` rewritten on the stock React Aria `Calendar` and `RangeCalendar`. Cost: no native `select`, another caption, no week numbers for the week picker, another `calendarProps` type; the look and the behaviour differ from Base UI.
- Recommended: option 1 (the only one that keeps the owner's rules of report section 3 and the public types; its cost is code size in one file).

### K2 (card: to be filed). Radix and React Aria have no ready way to close the popup from code after a pick.

- Files waiting: `components/picker-popup.tsx` (the two `actionsRef` lines, `B/components/picker-popup.tsx:77,141`) and `types.ts` (`PopupActions`, `B/types.ts:154`), on both bases.
- Base UI: the root takes `actionsRef` and `close()` is called on it (`@base-ui/react@1.9.0/popover/root/PopoverRoot.d.ts:41,81-84`, `dialog/root/DialogRoot.d.ts:58,82-85`). The pickers that close on a pick hold the ref (`B/modes/day-picker.tsx:52,77`, `B/modes/period-picker.tsx:47,83`). Cases D4, D5, P3, P6, P11, M10, W10.
- History: the owner had the open-state hook `hooks/use-controllable.ts` removed because Base UI already did the job (review notes, row 10 and decision 1). That row ends: "Port note: `actionsRef` is Base UI only, the radix copy needs its own way."
- Radix: the root's props are `open`, `defaultOpen`, `onOpenChange`, `modal` and nothing else (`@radix-ui/react-popover@1.3.1/dist/index.mjs:36-44`, `react-dialog@1.3.1/dist/index.mjs:30-38`). The only closing part is a button, `Popover.Close` / `Dialog.Close` (`index.mjs:329-342`).
- React Aria: the root's props are `isOpen`, `defaultOpen`, `onOpenChange`. The state, with `close()`, is in the exported `OverlayTriggerStateContext` (`react-aria-components@1.22.1/dist/types/src/Dialog.d.ts:24`, `dist/private/Dialog.mjs:64-69`), readable only by components inside the root.
- Options:
  1. An open state inside `picker-popup.tsx` on both bases: one `useState` used when the app does not control it, and `useImperativeHandle` that gives the same `close()` to the `popupActions` ref; `PopupActions` becomes `{ close: () => void }`. `day-picker.tsx`, `period-picker.tsx` and `picker-box.tsx` stay byte copies. New against the Base UI code: one state and one hook call in one file per base.
  2. React Aria only: the panels read `OverlayTriggerStateContext` and call `close()` themselves. No state of our own; but `day-picker.tsx`, `period-picker.tsx` and `picker-box.tsx` then differ too (the ref and its prop go, the panels import from `react-aria-components`), and Radix still needs option 1 or 3.
  3. A hidden `Close` button of the library, clicked from code. No state; a hidden control and a `.click()`. Review decision 7 removed a hidden Close button once.
  4. No close on a pick on these bases: D4, P3, P6, P11, M10, W10 differ from Base UI.
- Recommended: option 1 on both bases (the same behaviour, the fewest differing files, one small piece of state in the one file that owns the popup).

### K3 (card: to be filed). An arrow at the end of the list cannot stay a tab stop with the stock buttons of Radix and React Aria.

- File waiting: `components/view-nav.tsx` (`NavArrow`, `B/components/view-nav.tsx:25-26`), on both bases.
- Base UI: `disabled focusableWhenDisabled` writes `aria-disabled`, keeps the button in the tab order and swallows its keys (`@base-ui/react@1.9.0/button/Button.d.ts:21`, `utils/useFocusableWhenDisabled.mjs:20-37`). Case D11: "dimmed, does nothing, stays a tab stop", a decided difference from 7.4.
- Radix: the style's `Button` is a native `button` (`radix-nova/button.tsx:49`); `disabled` takes it out of the tab order and drops focus from an arrow that was just pressed.
- React Aria: `isDisabled` becomes native `disabled` (`react-aria@3.53.1/dist/private/button/useButton.mjs:26`). `aria-disabled` is a typed prop (`dist/types/src/button/useButton.d.ts:11`) but the press still fires. `allowFocusWhenDisabled` exists in the source marked "undocumented" (`useButton.mjs:20-21`); `isPending` keeps focus but announces a pending state (`react-aria-components@1.22.1/dist/types/src/Button.d.ts:52-56`).
- Options:
  1. `aria-disabled={disabled}` in place of `disabled`, and the click handler not passed while disabled. D11 holds on both bases; the class `aria-disabled:opacity-50` is already there (`B/components/view-nav.tsx:27`). New against the Base UI code: one condition in `NavArrow`.
  2. Plain `disabled` (`isDisabled`): the arrow is dimmed and does nothing, but leaves the tab order at the end of the list and loses focus when it gets there. D11 differs, as 7.4 did.
- Recommended: option 1.

### K4 (card: to be filed). In a Radix popover Tab goes round inside the popup; it does not close it.

- File: `components/picker-popup.tsx` on Radix. No line waits; the difference comes from the stock primitive.
- Case U2 and review decision 7: "Tab past the last control closes the popup, as in every stock shadcn popover"; no focus trap; no hidden Close button.
- Radix: the popover's focus scope is always `loop: true`, modal or not (`@radix-ui/react-popover@1.3.1/dist/index.mjs:257-261`); with it Tab on the last control focuses the first and Shift+Tab on the first focuses the last (`@radix-ui/react-focus-scope@1.3.1/dist/index.mjs:124,135-140`). No prop of `Popover.Content` turns it off. Escape and a press outside close as on Base UI (`index.mjs:274`). There is no hidden Close button.
- Second stock difference, touch only: Base UI focuses the popup itself when a popover is opened by touch, "to avoid opening the virtual keyboard" (`@base-ui/react@1.9.0/popover/popup/PopoverPopup.d.ts:38-39`); Radix always focuses the first control (`react-focus-scope index.mjs:99`), which in a range popup is the From box (WR1).
- Options:
  1. Keep the stock Radix popover and name both differences. The sentence of decision 7, "as in every stock shadcn popover", then describes Radix too: every stock Radix popover loops. A play that presses Tab past the last control is a Base UI reading and becomes a fix of spec 78's stories.
  2. A key handler of our own on the popup that closes it on Tab at either end, and an `onOpenAutoFocus` that focuses the popup after a touch. The Base UI behaviour, by two pieces of code the Base UI version does not have.
- Recommended: option 1.

### K5 (card: to be filed). The stock React Aria popover is modal: it keeps focus inside, locks page scroll and blocks the page behind it.

- Files: `components/picker-popup.tsx` (the popover branch) and `components/time-field.tsx` on React Aria. The plan's rows for both are written for the stock popover.
- Cases: U2 (no focus trap, Tab past the last control closes), WR1 (on open, focus is in the From box), C2 and R16 (the clock opens with focus on the popup). No case speaks of page scroll or of the page behind a popover; on Base UI both stay free (`@base-ui/react@1.9.0/popover/root/PopoverRoot.d.ts:43-58`, `modal` default `false`).
- React Aria, a popover opened from the style's `PopoverTrigger`: an underlay over the page (`react-aria-components@1.22.1/dist/private/Popover.mjs:219-226`), page scroll prevented and the outside made inert (`react-aria@3.53.1/dist/private/overlays/usePopover.mjs:45-47,54`), focus contained (`Popover.mjs:216`), focus moved to the popup itself on open (`Popover.mjs:133-137`). So: Tab cycles inside; a press outside closes and does nothing else; the page does not scroll while a popup is open; C2 and R16 hold without any code; WR1 differs by one Tab.
- The other mode, `isNonModal`: "Most popovers should not use this option" (`react-aria@3.53.1/dist/types/src/overlays/usePopover.d.ts:22-30`). It removes the underlay, the scroll lock and the trap, and with them the dialog role (`Popover.mjs:121-124`) and the focus on open (`Popover.mjs:137` needs the dialog role); it closes on blur, not on a press outside (`usePopover.mjs:32-33`).
- Options:
  1. Keep the stock modal popover and name the differences: U2 (Tab stays inside), the page behind is blocked and does not scroll, WR1 (focus starts on the popup). `time-field.tsx` then needs no focus code at all.
  2. `isNonModal` on the picker's popovers: no trap and no lock, but focus does not enter on open (C2, WR1 and R16 differ; R16 needs focus to enter the clock), the popup has no dialog role for its `aria-label`, and getting focus in would need code of our own.
- Recommended: option 1.

## Notes

- The part sources were read from `ui.shadcn.com/r/styles/<style>/<part>.json` on 2026-11-24 (`main` of `shadcn-date-picker` held no part yet) and saved under `/private/tmp/claude-501/dp-design-parts/`. The parts the CLI wrote on the branch `date-picker-repository` were compared with them: the same content, with the icon placeholder replaced by lucide imports.
- For spec 78, found while reading the parts, not acted on: `base-nova/calendar.tsx:222` has no `ref={ref}` on the day button, where `radix-nova/calendar.tsx:223` and the test application's own `components/ui/calendar.tsx:205` have it. Without the ref the day button's focus effect (`calendar.tsx:216-219`) does nothing, so arrow keys in the day grid may behave differently on the Base UI tree of the new repository than in the approved application.
- For spec 78, the same way: the picker's three style-sheet hook classes (`cn-dialog-close`, `cn-field`, `cn-button-group-orientation-horizontal`) get their CSS in the test application from `styles/style-*.css` (`app/globals.css:7-12`); `registry/base/index.css` on the branch `date-picker-repository` has no rule for them. The same on all three bases, so it does not change a comparison between bases, but the dialog's X is positioned by `cn-dialog-close`.
