# 79: Date picker Radix and React Aria versions, tracker

Status: running
Branch: none (a plan file on `claude/review`)
Checks:
- Check: Task 1, inventory rows, `awk '/^## 1\. Inventory/{f=1} /^## 2\. Parts/{f=0} f && /^\| [0-9]+ \|/' design-radix-aria.md | wc -l` at eb543afa: pass (22, both base columns filled)
- Check: Task 1, inventory cells, the same rows counted by cell text at eb543afa: pass (31 `identical`, 13 `differs`, 0 empty, sum 44; Radix 18 and 4, React Aria 13 and 9)
- Check: Task 1, a section with a cited source line per replacement for every `differs` cell, read at eb543afa: pass for 12 cells (Radix: 3.1 to 3.4; React Aria: 3.5 to 3.11); the cell `components/day-calendar.tsx` on React Aria points to section 4, which is Task 2
- Check: Task 1, `grep -c $'—' design-radix-aria.md` at eb543afa: pass (0)
- Check: Task 1, no code body longer than a signature, `grep -c '^```' design-radix-aria.md` at eb543afa: pass (0 code fences; replacements are named in table cells)
- Check: Task 1, type claims marked "compiled", `tsc -p tsconfig.json` (TypeScript 5.8.3, `strict`, a scratch file against `react-aria-components@1.22.1` of the table repository, outside both repositories) at eb543afa: pass. As copied: `role` of `HtmlProps` on the React Aria `Group`, `disabled`, `title` and `focusableWhenDisabled` on the React Aria `Button`, `focusableWhenDisabled` on a native `button` each give TS2322. With the plan's replacements (`Omit<HtmlProps, "role">`, `isDisabled`, `render`, `ButtonContext`, the three open props on the root, `placement`, `crossOffset`, `offset`): no error

- Task 1 The read, the inventory, the parts, the replacements, the behaviour at risk, the not-in-the-versions list: done (eb543afa)
- Task 2 The day calendar on React Aria: running
- Task 3 Self-check of every `identical` claim: planned

## Attention

Five points the plan does not decide. The plan marks the files as waiting on K1 to K5; the runner files the queue card and writes its id after the K number here.

### K1 (card: to be filed). The React Aria style has another calendar, so the day calendar file has no stock part to stand on there.

- File waiting: `registry/aria/components/date-picker/components/day-calendar.tsx`. Everything else of the React Aria version is built without it only as far as the type check allows; the plays need it.
- Facts and options: plan section 4 (Task 2 writes them there and copies the options here).

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
