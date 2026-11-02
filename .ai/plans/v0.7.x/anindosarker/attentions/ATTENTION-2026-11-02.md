# Attention, 2026-11-02

## A39 The aria checkboxes sit about 5 px lower than base

- In the 10.2 judge captures (`trackers/10.2-tracker.md`, Captures) every aria row checkbox and the header checkbox sit about 5 px lower in the cell than in base; the tooltip bubble follows the control. Not checked whether 0.7.1 had the same offset; no spec of this round touches checkbox layout.
- Keep (a look difference between bases, out of scope) or a finding for the next round.

## A40 React Aria's standalone `Tooltip` needs a trigger state context

- `react-aria-components` 1.22.1: `Tooltip` with `triggerRef` and `isOpen` and no `TooltipTrigger` throws "Cannot read properties of null (reading 'isOpen')", against its documented standalone use. The aria `ST_Tooltip` standalone mode wraps the part's `Tooltip` in a `TooltipTriggerStateContext.Provider` built from `isOpen` (D61 behaviour kept, `trackers/10.2-tracker.md` Attention). No upstream report filed.
- Keep the provider as is, or file the upstream report on `adobe/react-spectrum` after the P6 search.

## A41 The aria standalone checkbox bubble opens on keyboard focus only

- D61 says the checkboxes drive `open` from `onFocus` and `onBlur`. The 10.2 review fix (`0882acc0`) opens the bubble on focus only when the control matches `:focus-visible` and closes it on press, so a mouse click on the checkbox shows no bubble, as the base and radix tooltip parts behave. The 10.2 play test and `check:aria-warnings` are green.
- Keep (same behaviour as base and radix) or revert to open on every focus (D61 as written).
